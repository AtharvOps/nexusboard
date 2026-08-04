"use client";

import { memo, useState } from "react";
import { 
  BringToFront, 
  SendToBack, 
  Trash2, 
  Lock, 
  Unlock, 
  Group, 
  Ungroup, 
  Copy,
  Palette,
  Type,
  Sliders
} from "lucide-react";
import { nanoid } from "nanoid";

import { Hint } from "@/components/hint";
import { Camera, Color, GradientColor, Layer } from "@/types/canvas";
import { Button } from "@/components/ui/button";
import { useMutation, useSelf, useStorage } from "@/liveblocks.config";
import { useDeleteLayers } from "@/hooks/use-delete-layers";
import { useSelectionBounds } from "@/hooks/use-selection-bounds";

import { CustomColorPicker } from "@/components/canvas/custom-color-picker";
import { TypographyToolbar } from "@/components/canvas/typography-toolbar";
import { BorderStyleControls } from "@/components/canvas/border-style-controls";
import { LayerAlignmentToolbar } from "@/components/canvas/layer-alignment-toolbar";

interface SelectionToolsProps {
  camera: Camera;
  setLastUsedColor: (color: Color) => void;
};

export const SelectionTools = memo(({
  camera,
  setLastUsedColor,
}: SelectionToolsProps) => {
  const selection = useSelf((me) => me.presence.selection);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTypography, setShowTypography] = useState(false);
  const [showBorder, setShowBorder] = useState(false);

  const selectedLayers = useStorage((root) => {
    const layers = root.layers as unknown as { get?: (id: string) => Layer } & Record<string, Layer>;
    if (!layers) return [];
    return selection.map((id) => {
      return typeof layers.get === "function" ? layers.get(id) : layers[id];
    }).filter(Boolean) as Layer[];
  });

  const activeLayer = selectedLayers[0];
  const isLocked = selectedLayers.some((l) => l.isLocked);

  const moveToFront = useMutation(({ storage }) => {
    const liveLayerIds = storage.get("layerIds");
    const indices: number[] = [];
    const arr = Array.from(liveLayerIds);

    for (let i = 0; i < arr.length; i++) {
      if (selection.includes(arr[i])) indices.push(i);
    }
    for (let i = indices.length - 1; i >= 0; i--) {
      liveLayerIds.move(indices[i], arr.length - 1 - (indices.length - 1 - i));
    }
  }, [selection]);

  const moveToBack = useMutation(({ storage }) => {
    const liveLayerIds = storage.get("layerIds");
    const indices: number[] = [];
    const arr = Array.from(liveLayerIds);

    for (let i = 0; i < arr.length; i++) {
      if (selection.includes(arr[i])) indices.push(i);
    }
    for (let i = 0; i < indices.length; i++) {
      liveLayerIds.move(indices[i], i);
    }
  }, [selection]);

  const setFillAndGradient = useMutation(
    ({ storage }, fill: Color, gradient?: GradientColor, alpha?: number) => {
      const liveLayers = storage.get("layers");
      setLastUsedColor(fill);

      selection.forEach((id) => {
        const layer = liveLayers.get(id);
        if (layer) {
          layer.set("fill", fill);
          if (gradient !== undefined) layer.set("gradient", gradient);
          if (alpha !== undefined) layer.set("alpha", alpha);
        }
      });
    },
    [selection, setLastUsedColor]
  );

  const updateTypography = useMutation(
    ({ storage }, updates: Record<string, unknown>) => {
      const liveLayers = storage.get("layers");
      selection.forEach((id) => {
        const layer = liveLayers.get(id);
        if (layer) {
          Object.entries(updates).forEach(([key, val]) => {
            if (val !== undefined) layer.set(key as unknown as never, val as never);
          });
        }
      });
    },
    [selection]
  );

  const updateBorder = useMutation(
    ({ storage }, updates: Record<string, unknown>) => {
      const liveLayers = storage.get("layers");
      selection.forEach((id) => {
        const layer = liveLayers.get(id);
        if (layer) {
          Object.entries(updates).forEach(([key, val]) => {
            if (val !== undefined) layer.set(key as unknown as never, val as never);
          });
        }
      });
    },
    [selection]
  );

  const toggleLock = useMutation(
    ({ storage }) => {
      const liveLayers = storage.get("layers");
      const nextLocked = !isLocked;
      selection.forEach((id) => {
        liveLayers.get(id)?.set("isLocked", nextLocked);
      });
    },
    [selection, isLocked]
  );

  const groupSelected = useMutation(
    ({ storage }) => {
      if (selection.length < 2) return;
      const groupId = nanoid();
      const liveLayers = storage.get("layers");
      selection.forEach((id) => {
        liveLayers.get(id)?.set("groupId", groupId);
      });
    },
    [selection]
  );

  const ungroupSelected = useMutation(
    ({ storage }) => {
      const liveLayers = storage.get("layers");
      selection.forEach((id) => {
        liveLayers.get(id)?.set("groupId", undefined);
      });
    },
    [selection]
  );

  const duplicateSelected = useMutation(
    ({ storage, setMyPresence }) => {
      const liveLayers = storage.get("layers");
      const liveLayerIds = storage.get("layerIds");
      const newIds: string[] = [];

      selection.forEach((id) => {
        const layer = liveLayers.get(id);
        if (layer) {
          const newId = nanoid();
          const clone = layer.clone();
          clone.set("x", clone.get("x") + 20);
          clone.set("y", clone.get("y") + 20);
          liveLayers.set(newId, clone);
          liveLayerIds.push(newId);
          newIds.push(newId);
        }
      });

      setMyPresence({ selection: newIds });
    },
    [selection]
  );

  const alignSelected = useMutation(
    ({ storage }, alignType: string) => {
      if (selection.length < 2) return;
      const liveLayers = storage.get("layers");
      const bounds = selectedLayers.map((l) => ({
        id: selection[selectedLayers.indexOf(l)],
        x: l.x,
        y: l.y,
        width: l.width,
        height: l.height,
      }));

      const minX = Math.min(...bounds.map((b) => b.x));
      const maxX = Math.max(...bounds.map((b) => b.x + b.width));
      const minY = Math.min(...bounds.map((b) => b.y));
      const maxY = Math.max(...bounds.map((b) => b.y + b.height));

      bounds.forEach((b) => {
        const layer = liveLayers.get(b.id);
        if (!layer) return;

        if (alignType === "left") layer.set("x", minX);
        if (alignType === "right") layer.set("x", maxX - b.width);
        if (alignType === "center") layer.set("x", minX + (maxX - minX) / 2 - b.width / 2);
        if (alignType === "top") layer.set("y", minY);
        if (alignType === "bottom") layer.set("y", maxY - b.height);
        if (alignType === "middle") layer.set("y", minY + (maxY - minY) / 2 - b.height / 2);
      });
    },
    [selection, selectedLayers]
  );

  const deleteLayers = useDeleteLayers();
  const selectionBounds = useSelectionBounds();

  if (!selectionBounds) return null;

  const x = selectionBounds.width / 2 + selectionBounds.x + camera.x;
  const y = selectionBounds.y + camera.y;

  return (
    <div
      className="absolute select-none z-30 flex flex-col items-center pointer-events-auto"
      style={{
        transform: `translate(calc(${x}px - 50%), calc(${y - 16}px - 100%))`,
      }}
    >
      {/* Primary Tool Section Bar (Always 100% Visible & Unclipped) */}
      <div className="p-1.5 sm:p-2 rounded-xl bg-white shadow-xl border border-neutral-200 flex items-center gap-0.5 sm:gap-1 flex-nowrap max-w-[92vw] overflow-x-auto no-scrollbar">
        {/* Color Picker Toggle */}
        <Hint label="Color & Gradient">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowColorPicker(!showColorPicker);
              setShowTypography(false);
              setShowBorder(false);
            }}
            className={`h-7 w-7 sm:h-8 sm:w-8 ${showColorPicker ? "bg-neutral-100 text-blue-600 font-bold" : "text-neutral-700"}`}
          >
            <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
        </Hint>

        {/* Typography Toggle */}
        <Hint label="Typography">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowTypography(!showTypography);
              setShowColorPicker(false);
              setShowBorder(false);
            }}
            className={`h-7 w-7 sm:h-8 sm:w-8 ${showTypography ? "bg-neutral-100 text-blue-600 font-bold" : "text-neutral-700"}`}
          >
            <Type className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
        </Hint>

        {/* Border Style Toggle */}
        <Hint label="Border Styles">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowBorder(!showBorder);
              setShowColorPicker(false);
              setShowTypography(false);
            }}
            className={`h-7 w-7 sm:h-8 sm:w-8 ${showBorder ? "bg-neutral-100 text-blue-600 font-bold" : "text-neutral-700"}`}
          >
            <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
        </Hint>

        <div className="h-4 w-[1px] bg-neutral-200 mx-0.5" />

        {/* Duplicate */}
        <Hint label="Duplicate (Ctrl+D)">
          <Button variant="ghost" size="icon" onClick={duplicateSelected} className="h-7 w-7 sm:h-8 sm:w-8">
            <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-700" />
          </Button>
        </Hint>

        {/* Lock/Unlock */}
        <Hint label={isLocked ? "Unlock Layer" : "Lock Layer"}>
          <Button variant="ghost" size="icon" onClick={toggleLock} className="h-7 w-7 sm:h-8 sm:w-8">
            {isLocked ? <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" /> : <Unlock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-700" />}
          </Button>
        </Hint>

        {/* Group / Ungroup */}
        <Hint label="Group (Ctrl+G)">
          <Button variant="ghost" size="icon" onClick={groupSelected} className="h-7 w-7 sm:h-8 sm:w-8">
            <Group className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-700" />
          </Button>
        </Hint>
        <Hint label="Ungroup (Ctrl+Shift+G)">
          <Button variant="ghost" size="icon" onClick={ungroupSelected} className="h-7 w-7 sm:h-8 sm:w-8">
            <Ungroup className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-700" />
          </Button>
        </Hint>

        <div className="h-4 w-[1px] bg-neutral-200 mx-0.5" />

        {/* Layer Depth */}
        <Hint label="Bring to front">
          <Button onClick={moveToFront} variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
            <BringToFront className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-700" />
          </Button>
        </Hint>
        <Hint label="Send to back">
          <Button onClick={moveToBack} variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
            <SendToBack className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-700" />
          </Button>
        </Hint>

        <div className="h-4 w-[1px] bg-neutral-200 mx-0.5" />

        {/* Delete */}
        <Hint label="Delete">
          <Button variant="ghost" size="icon" onClick={deleteLayers} className="h-7 w-7 sm:h-8 sm:w-8 text-red-500 hover:text-red-700">
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
        </Hint>

        {/* Alignment Bar if multiple objects selected */}
        {selection.length >= 2 && (
          <div className="pl-1 border-l border-neutral-200">
            <LayerAlignmentToolbar onAlign={alignSelected} />
          </div>
        )}
      </div>

      {/* Popovers Pane rendered cleanly BELOW the tool section */}
      {showColorPicker && (
        <div className="mt-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <CustomColorPicker 
            color={activeLayer?.fill}
            gradient={activeLayer?.gradient}
            alpha={activeLayer?.alpha}
            onChange={setFillAndGradient} 
          />
        </div>
      )}

      {showTypography && (
        <div className="mt-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <TypographyToolbar
            fontSize={activeLayer?.fontSize ?? 16}
            fontWeight={activeLayer?.fontWeight ?? "normal"}
            fontFamily={activeLayer?.fontFamily ?? "sans-serif"}
            textAlign={activeLayer?.textAlign ?? "center"}
            onChange={updateTypography}
          />
        </div>
      )}

      {showBorder && (
        <div className="mt-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <BorderStyleControls
            strokeWidth={activeLayer?.strokeWidth ?? 1}
            strokeColor={activeLayer?.strokeColor ?? "#000000"}
            strokeDasharray={activeLayer?.strokeDasharray ?? "none"}
            onChange={updateBorder}
          />
        </div>
      )}
    </div>
  );
});

SelectionTools.displayName = "SelectionTools";