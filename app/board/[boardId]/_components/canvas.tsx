"use client";

import { nanoid } from "nanoid";
import jsPDF from "jspdf";
import { 
    useCallback, 
    useMemo, 
    useState, 
    useEffect,
    useRef,
} from "react";
import { LiveObject } from "@liveblocks/client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { 
    useHistory,
    useCanUndo, 
    useCanRedo,
    useMutation,
    useStorage,
    useOthersMapped,
    useSelf,
} from "@/liveblocks.config";
import { 
    colorToCss,
    connectionIdToColor,
    findIntersectingLayersWithRectangle,
    penPointsToPathLayer,
    pointerEventToCanvasPoint,
    resizeBounds, 
} from "@/lib/utils";
import {  
  Camera,
  CanvasMode, 
  CanvasState,
  Color,
  GridMode,
  Layer,
  LayerType,
  Point,
  Side,
  SpatialComment,
  XYWH,
} from "@/types/canvas";
import { useDisableScrollBounce } from "@/hooks/use-disable-scroll-bounce";
import { useDeleteLayers } from "@/hooks/use-delete-layers";

import { Info } from "./info";
import { Path } from "./path";
import { Toolbar } from "./toolbar";
import { Participants } from "./participants";
import { LayerPreview } from "./layer-preview";
import { SelectionBox } from "./selection-box";
import { SelectionTools } from "./selection-tools";
import { CursorsPresence } from "./cursors-presence";

// Feature Components
import { Minimap } from "@/components/collaboration/minimap";
import { SpatialCommentsOverlay } from "@/components/collaboration/spatial-comments";
import { ExportModal } from "@/components/productivity/export-modal";
import { GridOverlay, GridModeSelector } from "@/components/productivity/grid-modes";

const MAX_LAYERS = 200;
const MOVE_OFFSET = 5;
const EMPTY_ARRAY: string[] = [];

interface CanvasProps {
    boardId: string;
};

export const Canvas = ({
    boardId,
}: CanvasProps) => {
    const boardData = useQuery(api.board.get, {
        id: boardId as Id<"boards">,
    });
    const boardTitle = boardData?.title || "nexusboard";
    const sanitizedFileName = boardTitle.replace(/[^a-z0-9_-]/gi, "_").toLowerCase() || "nexusboard";

    const layerIds = useStorage((root) => root.layerIds) ?? EMPTY_ARRAY;
    const syncedGridMode = useStorage((root) => root.gridMode) || "dot";
    const pencilDraft = useSelf((me) => me.presence.pencilDraft);

    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.None,
    });
    const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
    const [lastUsedColor, setLastUsedColor] = useState<Color>({
        r: 59,
        g: 130,
        b: 246,
    });

    const [comments, setComments] = useState<SpatialComment[]>([]);
    const svgRef = useRef<SVGSVGElement | null>(null);

    useDisableScrollBounce();
    const history = useHistory();
    const canUndo = useCanUndo();
    const canRedo = useCanRedo();

    const setGridMode = useMutation(({ storage }, newMode: GridMode) => {
        storage.set("gridMode", newMode);
    }, []);

    const layersObject = useStorage((root) => {
        const map: Record<string, Layer> = {};
        const layers = root.layers as unknown as { get?: (id: string) => Layer } & Record<string, Layer>;
        if (layers) {
            layerIds.forEach((id) => {
                const l = typeof layers.get === "function" ? layers.get(id) : layers[id];
                if (l) map[id] = l;
            });
        }
        return map;
    });

    const insertLayer = useMutation((
        { storage, setMyPresence },
        layerType: LayerType,
        position: Point,
    ) => {
        const liveLayers = storage.get("layers");
        if (liveLayers.size >= MAX_LAYERS) {
          return;
        }

        const liveLayerIds = storage.get("layerIds");
        const layerId = nanoid();
        const layer = new LiveObject({
            type: layerType,
            x: position.x,
            y: position.y,
            height: 100,
            width: 100,
            fill: lastUsedColor,
            value: layerType === LayerType.Text ? "Text" : layerType === LayerType.Note ? "Sticky Note" : "",
        } as Layer);

        liveLayerIds.push(layerId);
        liveLayers.set(layerId, layer);

        setMyPresence({ selection: [layerId] }, { addToHistory: true });
        setCanvasState({ mode: CanvasMode.None });
    }, [lastUsedColor]);

    const insertConnector = useMutation((
        { storage, setMyPresence },
        startPoint: Point,
        endPoint: Point,
        startLayerId?: string,
        endLayerId?: string
    ) => {
        const liveLayers = storage.get("layers");
        const liveLayerIds = storage.get("layerIds");
        const id = nanoid();

        const connectorLayer = new LiveObject({
            type: LayerType.Connector,
            x: Math.min(startPoint.x, endPoint.x),
            y: Math.min(startPoint.y, endPoint.y),
            width: Math.max(10, Math.abs(endPoint.x - startPoint.x)),
            height: Math.max(10, Math.abs(endPoint.y - startPoint.y)),
            fill: lastUsedColor,
            startPoint,
            endPoint,
            startLayerId,
            endLayerId,
            arrowhead: "end",
            connectorStyle: "orthogonal",
            strokeWidth: 2,
        } as Layer);

        liveLayers.set(id, connectorLayer);
        liveLayerIds.push(id);

        setMyPresence({ selection: [id] });
        setCanvasState({ mode: CanvasMode.None });
    }, [lastUsedColor]);

    const translateSelectedLayers = useMutation((
        { storage, self },
        point: Point,
    ) => {
        if (canvasState.mode !== CanvasMode.Translating) return;

        const offset = {
            x: point.x - canvasState.current.x,
            y: point.y - canvasState.current.y,
        };

        const liveLayers = storage.get("layers");

        for (const id of self.presence.selection) {
            const layer = liveLayers.get(id);

            if (layer && !layer.get("isLocked")) {
                layer.update({
                    x: layer.get("x") + offset.x,
                    y: layer.get("y") + offset.y,
                });
            }
        }

        setCanvasState({ mode: CanvasMode.Translating, current: point });
    }, [canvasState]);

    const unselectLayers = useMutation(({ self, setMyPresence }) => {
        if (self.presence.selection.length > 0) {
            setMyPresence({ selection: [] }, { addToHistory: true });
        }
    }, []);

    const selectAllLayers = useMutation(({ storage, setMyPresence }) => {
        const liveLayerIds = storage.get("layerIds");
        setMyPresence({ selection: Array.from(liveLayerIds) });
    }, []);

    const updateSelectionNet = useMutation(
        ({ storage, setMyPresence }, current: Point, origin: Point) => {
            const layers = storage.get("layers");
            setCanvasState({ mode: CanvasMode.SelectionNet, origin, current });
            const ids = findIntersectingLayersWithRectangle(layerIds, layers, origin, current);
            setMyPresence({ selection: ids });
        },
        [layerIds]
    );

    const startMultiSelection = useCallback((current: Point, origin: Point) => {
        if (Math.abs(current.x - origin.x) + Math.abs(current.y - origin.y) > 5) {
            setCanvasState({ mode: CanvasMode.SelectionNet, origin, current });
        }
    }, []);

    const continueDrawing = useMutation((
        { self, setMyPresence },
        point: Point,
        e: React.PointerEvent,
    ) => {
        const { pencilDraft } = self.presence;
        if (canvasState.mode !== CanvasMode.Pencil || e.buttons !== 1 || pencilDraft == null) return;

        setMyPresence({
            cursor: point,
            pencilDraft: pencilDraft.length === 1 && pencilDraft[0][0] === point.x && pencilDraft[0][1] === point.y
                  ? pencilDraft
                  : [...pencilDraft, [point.x, point.y, e.pressure]],
        });
    }, [canvasState.mode]);

    const insertPath = useMutation(({ storage, self, setMyPresence }) => {
        const liveLayers = storage.get("layers");
        const { pencilDraft } = self.presence;
        if (pencilDraft == null || pencilDraft.length < 2 || liveLayers.size >= MAX_LAYERS) {
            setMyPresence({ pencilDraft: null });
            return;
        }

        const id = nanoid();
        liveLayers.set(id, new LiveObject(penPointsToPathLayer(pencilDraft, lastUsedColor)));
        const liveLayerIds = storage.get("layerIds");
        liveLayerIds.push(id);

        setMyPresence({ pencilDraft: null });
        setCanvasState({ mode: CanvasMode.Pencil });
    }, [lastUsedColor]);

    const startDrawing = useMutation(({ setMyPresence }, point: Point, pressure: number) => {
        setMyPresence({ pencilDraft: [[point.x, point.y, pressure]], penColor: lastUsedColor });
    }, [lastUsedColor]);

    const resizeSelectedLayer = useMutation((
        { storage, self },
        point: Point,
    ) => {
        if (canvasState.mode !== CanvasMode.Resizing) return;

        const bounds = resizeBounds(canvasState.initialBounds, canvasState.corner, point);
        const liveLayers = storage.get("layers");
        const layer = liveLayers.get(self.presence.selection[0]);

        if (layer && !layer.get("isLocked")) {
            layer.update(bounds);
        }
    }, [canvasState]);

    const onResizeHandlePointerDown = useCallback((corner: Side, initialBounds: XYWH) => {
        history.pause();
        setCanvasState({ mode: CanvasMode.Resizing, initialBounds, corner });
    }, [history]);

    const onWheel = useCallback((e: React.WheelEvent) => {
        setCamera((camera) => ({
          x: camera.x - e.deltaX,
          y: camera.y - e.deltaY,
        }));
    }, []);

    const onPointerMove = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
        e.preventDefault();
        const current = pointerEventToCanvasPoint(e, camera);

        if (canvasState.mode === CanvasMode.Pressing) {
            startMultiSelection(current, canvasState.origin);
        } else if (canvasState.mode === CanvasMode.SelectionNet) {
            updateSelectionNet(current, canvasState.origin);
        } else if (canvasState.mode === CanvasMode.Translating) {
            translateSelectedLayers(current);
        } else if (canvasState.mode === CanvasMode.Resizing) {
            resizeSelectedLayer(current);
        } else if (canvasState.mode === CanvasMode.Pencil) {
            continueDrawing(current, e);
        } else if (canvasState.mode === CanvasMode.Connecting && (canvasState as unknown as { startPoint?: Point }).startPoint) {
            setCanvasState({ ...canvasState, currentPoint: current } as unknown as CanvasState);
        }

        setMyPresence({ cursor: current, camera });
    }, [continueDrawing, camera, canvasState, resizeSelectedLayer, translateSelectedLayers, startMultiSelection, updateSelectionNet]);

    const onPointerLeave = useMutation(({ setMyPresence }) => {
        setMyPresence({ cursor: null });
    }, []);

    const findLayerAtPoint = useCallback((point: Point): string | undefined => {
        for (let i = layerIds.length - 1; i >= 0; i--) {
            const id = layerIds[i];
            const l = layersObject[id];
            if (l && point.x >= l.x && point.x <= l.x + l.width && point.y >= l.y && point.y <= l.y + l.height) {
                return id;
            }
        }
        return undefined;
    }, [layerIds, layersObject]);

    const onPointerDown = useCallback((e: React.PointerEvent) => {
        const point = pointerEventToCanvasPoint(e, camera);

        if (canvasState.mode === CanvasMode.Inserting) return;
        if (canvasState.mode === CanvasMode.Pencil) {
            startDrawing(point, e.pressure);
            return;
        }

        if (canvasState.mode === CanvasMode.Connecting) {
            const startLayerId = findLayerAtPoint(point);
            setCanvasState({
                mode: CanvasMode.Connecting,
                startPoint: point,
                currentPoint: point,
                startLayerId,
            } as unknown as CanvasState);
            return;
        }

        if (canvasState.mode === CanvasMode.Commenting) {
            const newComment: SpatialComment = {
                id: nanoid(),
                x: point.x,
                y: point.y,
                authorId: "user-1",
                authorName: "You",
                content: "New comment pin",
                resolved: false,
                createdAt: Date.now(),
                replies: [],
            };
            setComments((prev) => [...prev, newComment]);
            setCanvasState({ mode: CanvasMode.None });
            return;
        }

        setCanvasState({ origin: point, mode: CanvasMode.Pressing });
    }, [camera, canvasState.mode, setCanvasState, startDrawing, findLayerAtPoint]);

    const onPointerUp = useMutation(({}, e: React.PointerEvent) => {
        const point = pointerEventToCanvasPoint(e, camera);

        if (canvasState.mode === CanvasMode.Connecting && (canvasState as unknown as { startPoint?: Point }).startPoint) {
            const cs = canvasState as unknown as { startPoint: Point; startLayerId?: string };
            const endLayerId = findLayerAtPoint(point);
            insertConnector(cs.startPoint, point, cs.startLayerId, endLayerId);
        } else if (canvasState.mode === CanvasMode.None || canvasState.mode === CanvasMode.Pressing) {
            unselectLayers();
            setCanvasState({ mode: CanvasMode.None });
        } else if (canvasState.mode === CanvasMode.Pencil) {
            insertPath();
        } else if (canvasState.mode === CanvasMode.Inserting) {
            insertLayer(canvasState.layerType, point);
        } else {
            setCanvasState({ mode: CanvasMode.None });
        }

        history.resume();
    }, [setCanvasState, camera, canvasState, history, insertLayer, unselectLayers, insertPath, insertConnector, findLayerAtPoint]);

    const selections = useOthersMapped((other) => other.presence.selection);

    const onLayerPointerDown = useMutation((
        { self, setMyPresence },
        e: React.PointerEvent,
        layerId: string,
    ) => {
        if (canvasState.mode === CanvasMode.Pencil || canvasState.mode === CanvasMode.Inserting) return;

        history.pause();
        e.stopPropagation();

        const point = pointerEventToCanvasPoint(e, camera);

        if (!self.presence.selection.includes(layerId)) {
            setMyPresence({ selection: [layerId] }, { addToHistory: true });
        }
        setCanvasState({ mode: CanvasMode.Translating, current: point });
    }, [setCanvasState, history, camera, canvasState.mode]);

    const layerIdsToColorSelection = useMemo(() => {
        const layerIdsToColorSelection: Record<string, string> = {};
        for (const user of selections) {
            const [connectionId, selection] = user;
            for (const layerId of selection) {
                layerIdsToColorSelection[layerId] = connectionIdToColor(connectionId);
            }
        }
        return layerIdsToColorSelection;
    }, [selections]);

    const duplicateLayers = useMutation(({ storage, self, setMyPresence }) => {
        const liveLayers = storage.get("layers");
        const liveLayerIds = storage.get("layerIds");
        const newLayerIds: string[] = [];
        const layersIdsToCopy = self.presence.selection;

        if (liveLayerIds.length + layersIdsToCopy.length > MAX_LAYERS || layersIdsToCopy.length === 0) return;

        layersIdsToCopy.forEach((layerId) => {
            const newLayerId = nanoid();
            const layer = liveLayers.get(layerId);
            if (layer) {
                const newLayer = layer.clone();
                newLayer.set("x", newLayer.get("x") + 15);
                newLayer.set("y", newLayer.get("y") + 15);
                liveLayerIds.push(newLayerId);
                liveLayers.set(newLayerId, newLayer);
                newLayerIds.push(newLayerId);
            }
        });

        setMyPresence({ selection: [...newLayerIds] }, { addToHistory: true });
        setCanvasState({ mode: CanvasMode.None });
    }, []);

    const groupSelected = useMutation(({ storage, self }) => {
        const selection = self.presence.selection;
        if (selection.length < 2) return;
        const groupId = nanoid();
        const liveLayers = storage.get("layers");
        selection.forEach((id) => {
            liveLayers.get(id)?.set("groupId", groupId);
        });
    }, []);

    const ungroupSelected = useMutation(({ storage, self }) => {
        const selection = self.presence.selection;
        const liveLayers = storage.get("layers");
        selection.forEach((id) => {
            liveLayers.get(id)?.set("groupId", undefined);
        });
    }, []);

    const moveSelectedLayers = useMutation(({ storage, self, setMyPresence }, offset: Point) => {
        const liveLayers = storage.get("layers");
        const selection = self.presence.selection;
        if (selection.length === 0) return;

        for (const id of selection) {
            const layer = liveLayers.get(id);
            if (layer && !layer.get("isLocked")) {
                layer.update({
                    x: layer.get("x") + offset.x,
                    y: layer.get("y") + offset.y,
                });
            }
        }
        setMyPresence({ selection }, { addToHistory: true });
    }, []);

    const deleteLayers = useDeleteLayers();

    // High-Performance Exporter with Board Name File Naming & Real PDF Exporting
    const handleExport = (format: string, scale: number) => {
        if (!svgRef.current) return;
        const svgElement = svgRef.current;

        const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
        const rect = svgElement.getBoundingClientRect();
        const width = rect.width || 1920;
        const height = rect.height || 1080;

        svgClone.setAttribute("width", width.toString());
        svgClone.setAttribute("height", height.toString());
        svgClone.setAttribute("xmlns", "http://www.w3.org/2000/svg");

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgClone);

        if (format === "svg") {
            const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${sanitizedFileName}.svg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else {
            const img = new Image();
            img.crossOrigin = "anonymous";

            const encodedSvg = unescape(encodeURIComponent(svgString));
            const base64Data = btoa(encodedSvg);
            const dataUrl = `data:image/svg+xml;charset=utf-8;base64,${base64Data}`;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = width * scale;
                canvas.height = height * scale;
                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                if (format === "png" || format === "pdf") {
                    ctx.fillStyle = syncedGridMode === "dark" ? "#171717" : "#ffffff";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                try {
                    const pngUrl = canvas.toDataURL("image/png");

                    if (format === "pdf") {
                        const pdf = new jsPDF({
                            orientation: width > height ? "landscape" : "portrait",
                            unit: "px",
                            format: [canvas.width, canvas.height],
                        });
                        pdf.addImage(pngUrl, "PNG", 0, 0, canvas.width, canvas.height);
                        pdf.save(`${sanitizedFileName}.pdf`);
                    } else {
                        const fileName = format === "transparent-png" ? `${sanitizedFileName}-transparent.png` : `${sanitizedFileName}.png`;
                        const link = document.createElement("a");
                        link.href = pngUrl;
                        link.download = fileName;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }
                } catch (err) {
                    console.error("Failed to export canvas:", err);
                }
            };

            img.src = dataUrl;
        }
    };

    // Keybindings Check & Handlers
    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            const isInput =
                document.activeElement?.tagName === "INPUT" ||
                document.activeElement?.tagName === "TEXTAREA" ||
                (document.activeElement as HTMLElement)?.isContentEditable;

            if (isInput) return;

            if (e.key === "Escape") {
                unselectLayers();
                setCanvasState({ mode: CanvasMode.None });
                return;
            }

            if (e.key === "c" && !e.ctrlKey && !e.metaKey) {
                setCanvasState({ mode: CanvasMode.Commenting });
                return;
            }

            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
                e.preventDefault();
                selectAllLayers();
                return;
            }

            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
                e.preventDefault();
                duplicateLayers();
                return;
            }

            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "g") {
                e.preventDefault();
                ungroupSelected();
                return;
            }

            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "g") {
                e.preventDefault();
                groupSelected();
                return;
            }

            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
                e.preventDefault();
                if (e.shiftKey) history.redo();
                else history.undo();
                return;
            }

            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
                e.preventDefault();
                history.redo();
                return;
            }

            if (e.key === "Delete" || e.key === "Backspace") {
                e.preventDefault();
                deleteLayers();
                return;
            }

            let offset: Point = { x: 0, y: 0 };
            if (e.key === "ArrowUp") offset = { x: 0, y: -MOVE_OFFSET };
            if (e.key === "ArrowDown") offset = { x: 0, y: MOVE_OFFSET };
            if (e.key === "ArrowLeft") offset = { x: -MOVE_OFFSET, y: 0 };
            if (e.key === "ArrowRight") offset = { x: MOVE_OFFSET, y: 0 };

            if (offset.x !== 0 || offset.y !== 0) {
                e.preventDefault();
                moveSelectedLayers(offset);
            }
        }
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [deleteLayers, history, duplicateLayers, groupSelected, ungroupSelected, moveSelectedLayers, selectAllLayers, unselectLayers]);

    const activeConnecting = canvasState.mode === CanvasMode.Connecting ? (canvasState as unknown as { startPoint?: Point; currentPoint?: Point }) : null;

    return (
        <main
            className={`h-full w-full relative touch-none select-none overflow-hidden ${
                syncedGridMode === "dark" ? "bg-neutral-900" : "bg-neutral-100"
            }`}
        >
            {/* Background Grid */}
            <GridOverlay gridMode={syncedGridMode} />

            {/* Top-Left Header: Full Logo, Brand Name & Project Title */}
            <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-30 pointer-events-auto">
                <Info boardId={boardId} />
            </div>

            {/* Top-Right Header: Board Types Selector, Export Button & Participants */}
            <div className="absolute top-16 sm:top-3 right-2 sm:right-3 z-30 flex items-center gap-1.5 sm:gap-2 pointer-events-auto bg-white/90 backdrop-blur-md p-1 sm:p-1.5 rounded-xl shadow-md border border-neutral-200">
                <GridModeSelector gridMode={syncedGridMode} onChangeGridMode={setGridMode} />
                <ExportModal onExport={handleExport} />
                <Participants />
            </div>

            {/* Main Side Toolbar with Grouped Shapes flyout */}
            <Toolbar
              canvasState={canvasState}
              setCanvasState={setCanvasState}
              canRedo={canRedo}
              canUndo={canUndo}
              undo={() => { history.undo(); }}
              redo={() => { history.redo(); }}
            />

            {/* Floating Selection Tools */}
            <SelectionTools
                camera={camera}
                setLastUsedColor={setLastUsedColor}
            />

            {/* Spatial Comments Layer */}
            <SpatialCommentsOverlay
                comments={comments}
                camera={camera}
                onAddReply={(commentId, replyText) => {
                    setComments((prev) =>
                        prev.map((c) =>
                            c.id === commentId
                                ? {
                                      ...c,
                                      replies: [
                                          ...c.replies,
                                          {
                                              id: nanoid(),
                                              authorId: "user-1",
                                              authorName: "You",
                                              content: replyText,
                                              createdAt: Date.now(),
                                          },
                                      ],
                                  }
                                : c
                        )
                    );
                }}
                onToggleResolve={(commentId) => {
                    setComments((prev) =>
                        prev.map((c) => (c.id === commentId ? { ...c, resolved: true } : c))
                    );
                }}
            />

            {/* Minimap */}
            <Minimap
                camera={camera}
                setCamera={setCamera}
                layers={layersObject}
                layerIds={layerIds}
            />

            {/* Primary SVG Canvas */}
            <svg
              ref={svgRef}
              className="h-screen w-screen"
              onWheel={onWheel}
              onPointerMove={onPointerMove}
              onPointerLeave={onPointerLeave}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
            >
              <g style={{ transform: `translate(${camera.x}px, ${camera.y}px)` }}>
                {layerIds.map((layerId) => (
                  <LayerPreview
                    key={layerId}
                    id={layerId}
                    onLayerPointerDown={onLayerPointerDown}
                    selectionColor={layerIdsToColorSelection[layerId]}
                  />
                ))}
                <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown} />
                {canvasState.mode === CanvasMode.SelectionNet && canvasState.current != null && (
                    <rect
                        className="fill-blue-500/5 stroke-blue-500 stroke-1"
                        x={Math.min(canvasState.origin.x, canvasState.current.x)}
                        y={Math.min(canvasState.origin.y, canvasState.current.y)}
                        width={Math.abs(canvasState.origin.x - canvasState.current.x)}
                        height={Math.abs(canvasState.origin.y - canvasState.current.y)}
                    />
                )}

                {/* Live Preview Line during Smart Connector Drawing */}
                {activeConnecting && activeConnecting.startPoint && activeConnecting.currentPoint && (
                    <line
                        x1={activeConnecting.startPoint.x}
                        y1={activeConnecting.startPoint.y}
                        x2={activeConnecting.currentPoint.x}
                        y2={activeConnecting.currentPoint.y}
                        stroke="#3b82f6"
                        strokeWidth="2"
                        strokeDasharray="4,4"
                    />
                )}

                <CursorsPresence />
                {pencilDraft != null && pencilDraft.length > 0 && (
                    <Path
                        points={pencilDraft}
                        fill={colorToCss(lastUsedColor)}
                        x={0}
                        y={0}
                    />
                )}
              </g>
            </svg>
        </main>
    );
};
