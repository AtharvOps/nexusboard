"use client";

import React from "react";
import { ImageLayer } from "@/types/canvas";

interface ImageLayerProps {
  id: string;
  layer: ImageLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const CanvasImageLayer: React.FC<ImageLayerProps> = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}) => {
  const { x, y, width, height, src, rotation = 0, alpha = 1 } = layer;

  return (
    <g
      className="cursor-pointer transition-transform duration-75"
      style={{
        transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
        transformOrigin: `${width / 2}px ${height / 2}px`,
        opacity: alpha,
      }}
      onPointerDown={(e) => onPointerDown(e, id)}
    >
      <image
        href={src}
        x={0}
        y={0}
        width={width}
        height={height}
        preserveAspectRatio="none"
        className="drop-shadow-sm"
      />
      {selectionColor && (
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="none"
          stroke={selectionColor}
          strokeWidth={2}
          strokeDasharray="4,4"
        />
      )}
    </g>
  );
};
