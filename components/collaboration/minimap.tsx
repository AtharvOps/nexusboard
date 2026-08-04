"use client";

import React, { useRef } from "react";
import { Camera, Layer } from "@/types/canvas";
import { colorToCss } from "@/lib/utils";

interface MinimapProps {
  camera: Camera;
  setCamera: React.Dispatch<React.SetStateAction<Camera>>;
  layers: Record<string, Layer>;
  layerIds: readonly string[] | string[];
}

export const Minimap: React.FC<MinimapProps> = ({
  camera,
  setCamera,
  layers,
  layerIds,
}) => {
  const minimapRef = useRef<HTMLDivElement | null>(null);

  const MAP_SIZE = 140;
  const SCALE = 0.04;

  const handleMinimapClick = (e: React.MouseEvent) => {
    if (!minimapRef.current) return;
    const rect = minimapRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const targetCanvasX = (clickX - MAP_SIZE / 2) / SCALE;
    const targetCanvasY = (clickY - MAP_SIZE / 2) / SCALE;

    setCamera({
      x: -targetCanvasX,
      y: -targetCanvasY,
    });
  };

  const viewportWidth = (typeof window !== "undefined" ? window.innerWidth : 1000) * SCALE;
  const viewportHeight = (typeof window !== "undefined" ? window.innerHeight : 800) * SCALE;
  const viewportX = -camera.x * SCALE + MAP_SIZE / 2 - viewportWidth / 2;
  const viewportY = -camera.y * SCALE + MAP_SIZE / 2 - viewportHeight / 2;

  return (
    <div
      ref={minimapRef}
      onClick={handleMinimapClick}
      className="hidden sm:block absolute bottom-4 right-4 w-36 h-36 bg-white/90 backdrop-blur-md rounded-xl border border-neutral-300 shadow-lg overflow-hidden cursor-crosshair z-30 select-none transition-all hover:scale-105"
    >
      <div className="relative w-full h-full">
        {/* Layer Mini Shapes */}
        {layerIds.map((id) => {
          const l = layers[id];
          if (!l) return null;
          const mx = l.x * SCALE + MAP_SIZE / 2;
          const my = l.y * SCALE + MAP_SIZE / 2;
          const mw = Math.max(2, l.width * SCALE);
          const mh = Math.max(2, l.height * SCALE);

          return (
            <div
              key={id}
              className="absolute rounded-[1px] opacity-70"
              style={{
                left: `${mx}px`,
                top: `${my}px`,
                width: `${mw}px`,
                height: `${mh}px`,
                backgroundColor: colorToCss(l.fill),
              }}
            />
          );
        })}

        {/* Viewport Indicator */}
        <div
          className="absolute border-2 border-blue-500 bg-blue-500/10 rounded transition-all pointer-events-none"
          style={{
            left: `${viewportX}px`,
            top: `${viewportY}px`,
            width: `${viewportWidth}px`,
            height: `${viewportHeight}px`,
          }}
        />

        <div className="absolute bottom-1 left-1 px-1 bg-neutral-900/60 text-white text-[9px] rounded font-mono">
          Minimap
        </div>
      </div>
    </div>
  );
};
