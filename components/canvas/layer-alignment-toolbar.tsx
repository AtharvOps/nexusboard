"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  AlignHorizontalSpaceBetween,
  AlignVerticalSpaceBetween,
} from "lucide-react";

interface LayerAlignmentToolbarProps {
  onAlign: (
    type:
      | "left"
      | "center"
      | "right"
      | "top"
      | "middle"
      | "bottom"
      | "distribute_h"
      | "distribute_v"
  ) => void;
}

export const LayerAlignmentToolbar: React.FC<LayerAlignmentToolbarProps> = ({
  onAlign,
}) => {
  return (
    <div className="flex items-center gap-0.5 p-1 bg-white rounded-lg shadow-sm border border-neutral-200">
      <Hint label="Align Left">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onAlign("left")}
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </Button>
      </Hint>
      <Hint label="Align Center Horizontal">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onAlign("center")}
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </Button>
      </Hint>
      <Hint label="Align Right">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onAlign("right")}
        >
          <AlignRight className="w-3.5 h-3.5" />
        </Button>
      </Hint>

      <div className="h-4 w-[1px] bg-neutral-200 mx-0.5" />

      <Hint label="Align Top">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onAlign("top")}
        >
          <AlignStartVertical className="w-3.5 h-3.5" />
        </Button>
      </Hint>
      <Hint label="Align Middle Vertical">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onAlign("middle")}
        >
          <AlignCenterVertical className="w-3.5 h-3.5" />
        </Button>
      </Hint>
      <Hint label="Align Bottom">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onAlign("bottom")}
        >
          <AlignEndVertical className="w-3.5 h-3.5" />
        </Button>
      </Hint>

      <div className="h-4 w-[1px] bg-neutral-200 mx-0.5" />

      <Hint label="Distribute Horizontally">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onAlign("distribute_h")}
        >
          <AlignHorizontalSpaceBetween className="w-3.5 h-3.5" />
        </Button>
      </Hint>
      <Hint label="Distribute Vertically">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onAlign("distribute_v")}
        >
          <AlignVerticalSpaceBetween className="w-3.5 h-3.5" />
        </Button>
      </Hint>
    </div>
  );
};
