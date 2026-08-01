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

export const Toolbar = () => {
    return (
        <div className="absolute top-[50%] -translate-y-1/2 left-2 flex flex-col gap-y-4">
            <div className="bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md">
                <ToolButton 
                  label="Select (Ctrl+A)"
                  icon={MousePointer}
                  onClick={() => {}}
                  isActive={false}
                />

                <ToolButton 
                  label="Text (Ctrl+T)"
                  icon={TypeIcon}
                  onClick={() => {}}
                  isActive={false}
                />

                <ToolButton 
                  label="Sticky Note (Ctrl+N)"
                  icon={StickyNote}
                  onClick={() => {}}
                  isActive={false}
                />

                <ToolButton 
                  label="Rectangle (Ctrl+R)"
                  icon={Square}
                  onClick={() => {}}
                  isActive={false}
                /> 

                <ToolButton 
                  label="Ellipse (Ctrl+E)"
                  icon={Circle}
                  onClick={() => {}}
                  isActive={false}
                />

                <ToolButton 
                  label="Pen"
                  icon={Pencil}
                  onClick={() => {}}
                  isActive={false}
                />
            </div>
            <div className="bg-white rounded-md p-1.5 flex flex-col items-center shadow-md">

                <ToolButton
                  label="Undo (Ctrl+Z)"
                  icon={Undo2}
                  onClick={() => {}}
                  isDisabled={true}
                />

                <ToolButton
                  label="Redo (Ctrl+Shift+Z)"
                  icon={Redo2}
                  onClick={() => {}}
                  isDisabled={true}
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