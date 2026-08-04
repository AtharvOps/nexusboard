"use client";

import { useState } from "react";
import { 
    Circle, 
    MousePointer, 
    Pencil, 
    Redo2, 
    Square, 
    StickyNote, 
    TypeIcon, 
    Undo2,
    Diamond,
    ArrowRight,
    Star,
    Database,
    MessageSquare,
    Shapes,
    Triangle,
    Hexagon,
    Cloud,
    FileText,
    Pill,
    X
} from "lucide-react";

import { ToolButton } from "./tool-button";
import { CanvasMode, CanvasState, LayerType } from "@/types/canvas";

interface ToolbarProps {
  canvasState: CanvasState;
  setCanvasState: (newState: CanvasState) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
};

const ALL_SHAPES = [
  { label: "Rectangle", type: LayerType.Rectangle, icon: Square },
  { label: "Ellipse", type: LayerType.Ellipse, icon: Circle },
  { label: "Diamond", type: LayerType.Diamond, icon: Diamond },
  { label: "Triangle", type: LayerType.Triangle, icon: Triangle },
  { label: "Star", type: LayerType.Star, icon: Star },
  { label: "Database", type: LayerType.Database, icon: Database },
  { label: "Capsule", type: LayerType.Capsule, icon: Pill },
  { label: "Hexagon", type: LayerType.Hexagon, icon: Hexagon },
  { label: "Cloud", type: LayerType.Cloud, icon: Cloud },
  { label: "Document", type: LayerType.Document, icon: FileText },
  { label: "Decision", type: LayerType.Decision, icon: Diamond },
];

export const Toolbar = ({
  canvasState,
  setCanvasState,
  undo,
  redo,
  canUndo,
  canRedo,
}: ToolbarProps) => {
    const [showShapesMenu, setShowShapesMenu] = useState(false);

    const isShapeActive = canvasState.mode === CanvasMode.Inserting && (
      canvasState.layerType === LayerType.Rectangle ||
      canvasState.layerType === LayerType.Ellipse ||
      canvasState.layerType === LayerType.Diamond ||
      canvasState.layerType === LayerType.Triangle ||
      canvasState.layerType === LayerType.Star ||
      canvasState.layerType === LayerType.Database ||
      canvasState.layerType === LayerType.Capsule ||
      canvasState.layerType === LayerType.Hexagon ||
      canvasState.layerType === LayerType.Cloud ||
      canvasState.layerType === LayerType.Document ||
      canvasState.layerType === LayerType.Decision
    );

    return (
        <div className="absolute top-[50%] -translate-y-1/2 left-2 flex flex-col gap-y-3 sm:gap-y-4 z-30 select-none">
            <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md relative">
                {/* Select Tool */}
                <ToolButton 
                  label="Select (Ctrl+A)"
                  icon={MousePointer}
                  onClick={() => {
                    setShowShapesMenu(false);
                    setCanvasState({ mode: CanvasMode.None });
                  }}
                  isActive={
                    canvasState.mode === CanvasMode.None ||
                    canvasState.mode === CanvasMode.Translating ||
                    canvasState.mode === CanvasMode.SelectionNet ||
                    canvasState.mode === CanvasMode.Pressing ||
                    canvasState.mode === CanvasMode.Resizing
                  }
                />

                {/* Text Tool */}
                <ToolButton 
                  label="Text (Ctrl+T)"
                  icon={TypeIcon}
                  onClick={() => {
                    setShowShapesMenu(false);
                    setCanvasState({ 
                      mode: CanvasMode.Inserting,
                      layerType: LayerType.Text,
                    });
                  }}
                  isActive={
                    canvasState.mode === CanvasMode.Inserting &&
                    canvasState.layerType === LayerType.Text
                  }
                />

                {/* Sticky Note Tool */}
                <ToolButton 
                  label="Sticky Note (Ctrl+N)"
                  icon={StickyNote}
                  onClick={() => {
                    setShowShapesMenu(false);
                    setCanvasState({ 
                      mode: CanvasMode.Inserting, 
                      layerType: LayerType.Note 
                    });
                  }}
                  isActive={
                    canvasState.mode === CanvasMode.Inserting &&
                    canvasState.layerType === LayerType.Note
                  }
                />

                {/* Grouped Shapes Selector */}
                <div className="relative">
                  <ToolButton 
                    label="Shapes Library"
                    icon={Shapes}
                    onClick={() => setShowShapesMenu(!showShapesMenu)}
                    isActive={isShapeActive || showShapesMenu}
                  />

                  {/* Shapes Popover Menu - Unclipped Fixed Positioning */}
                  {showShapesMenu && (
                    <div className="fixed left-16 top-1/2 -translate-y-1/2 bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-neutral-200 p-3 grid grid-cols-3 gap-2 w-60 z-[99999] animate-in fade-in zoom-in-95 max-h-[75vh] overflow-y-auto">
                      <div className="col-span-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-1 pb-1 flex justify-between items-center">
                        <span>Select Shape</span>
                        <button 
                          onClick={() => setShowShapesMenu(false)}
                          className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md hover:bg-neutral-100 transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {ALL_SHAPES.map((item) => {
                        const Icon = item.icon;
                        const isCurrent = canvasState.mode === CanvasMode.Inserting && canvasState.layerType === item.type;
                        return (
                          <button
                            key={item.label}
                            onClick={() => {
                              setCanvasState({
                                mode: CanvasMode.Inserting,
                                layerType: item.type,
                              });
                              setShowShapesMenu(false);
                            }}
                            className={`flex flex-col items-center justify-center p-2 rounded-xl text-[11px] font-medium transition gap-1.5 ${
                              isCurrent
                                ? "bg-blue-600 text-white shadow-md font-bold"
                                : "hover:bg-neutral-100 text-neutral-700 bg-neutral-50/80 border border-neutral-100"
                            }`}
                            title={item.label}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-[9px] truncate max-w-full">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Smart Arrow Connector */}
                <ToolButton 
                  label="Smart Connector"
                  icon={ArrowRight}
                  onClick={() => {
                    setShowShapesMenu(false);
                    setCanvasState({ mode: CanvasMode.Connecting });
                  }}
                  isActive={canvasState.mode === CanvasMode.Connecting}
                />

                {/* Spatial Comment */}
                <ToolButton 
                  label="Spatial Comment (Press C)"
                  icon={MessageSquare}
                  onClick={() => {
                    setShowShapesMenu(false);
                    setCanvasState({ mode: CanvasMode.Commenting });
                  }}
                  isActive={canvasState.mode === CanvasMode.Commenting}
                />

                {/* Pen Tool */}
                <ToolButton 
                  label="Pen"
                  icon={Pencil}
                  onClick={() => {
                    setShowShapesMenu(false);
                    setCanvasState({ mode: CanvasMode.Pencil });
                  }}
                  isActive={canvasState.mode === CanvasMode.Pencil}
                />
            </div>

            <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">
                <ToolButton
                  label="Undo (Ctrl+Z)"
                  icon={Undo2}
                  onClick={undo}
                  isDisabled={!canUndo}
                />

                <ToolButton
                  label="Redo (Ctrl+Shift+Z)"
                  icon={Redo2}
                  onClick={redo}
                  isDisabled={!canRedo}
                />
            </div>
        </div>
    );
};

export const ToolbarSkeleton = () => {
  return (
    <div className="absolute top-[50%] -translate-y-1/2 left-2 flex flex-col gap-y-4 bg-white h-90 w-13 shadow-md rounded-md" />
  );
};