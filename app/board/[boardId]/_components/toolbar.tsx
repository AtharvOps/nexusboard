import { 
    Circle, 
    MousePointer, 
    Pencil, 
    Redo2, 
    Square, 
    StickyNote, 
    TypeIcon, 
    Undo2
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

export const Toolbar = ({
  canvasState,
  setCanvasState,
  undo,
  redo,
  canUndo,
  canRedo,
}: ToolbarProps) => {
    return (
      
        <div className="absolute top-[50%] -translate-y-1/2 left-2 flex flex-col gap-y-4">
            <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
                <ToolButton 
                  label="Select (Ctrl+A)"
                  icon={MousePointer}
                  onClick={() => setCanvasState({ 
                    mode: CanvasMode.None 
                  })}
                  isActive={
                    canvasState.mode === CanvasMode.None ||
                    canvasState.mode === CanvasMode.Translating ||
                    canvasState.mode === CanvasMode.SelectionNet ||
                    canvasState.mode === CanvasMode.Pressing ||
                    canvasState.mode === CanvasMode.Resizing
                  }
                />

                <ToolButton 
                  label="Text (Ctrl+T)"
                  icon={TypeIcon}
                  onClick={() => setCanvasState({ 
                    mode: CanvasMode.Inserting,
                    layerType: LayerType.Text,
                  })}
                  isActive={
                    canvasState.mode === CanvasMode.Inserting &&
                    canvasState.layerType === LayerType.Text
                  }
                />

                <ToolButton 
                  label="Sticky Note (Ctrl+N)"
                  icon={StickyNote}
                  onClick={() => setCanvasState({ 
                    mode: CanvasMode.Inserting, 
                    layerType: LayerType.Note 
                  })}
                  isActive={
                    canvasState.mode === CanvasMode.Inserting &&
                    canvasState.layerType === LayerType.Note
                  }
                />

                <ToolButton 
                  label="Rectangle (Ctrl+R)"
                  icon={Square}
                  onClick={() => setCanvasState({ 
                    mode: CanvasMode.Inserting, 
                    layerType: LayerType.Rectangle 
                  })}
                  isActive={
                    canvasState.mode === CanvasMode.Inserting &&
                    canvasState.layerType === LayerType.Rectangle
                  }
                /> 

                <ToolButton 
                  label="Ellipse (Ctrl+E)"
                  icon={Circle}
                  onClick={() => setCanvasState({ 
                    mode: CanvasMode.Inserting, 
                    layerType: LayerType.Ellipse 
                  })}
                  isActive={
                    canvasState.mode === CanvasMode.Inserting &&
                    canvasState.layerType === LayerType.Ellipse
                  }
                />

                <ToolButton 
                  label="Pen"
                  icon={Pencil}
                  onClick={() => setCanvasState({ 
                    mode: CanvasMode.Pencil })}
                  isActive={
                    canvasState.mode === CanvasMode.Pencil
                  }
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