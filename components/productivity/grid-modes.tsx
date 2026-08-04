"use client";

import React from "react";
import { GridMode } from "@/types/canvas";
import { Grid } from "lucide-react";

interface GridModesProps {
  gridMode: GridMode;
  onChangeGridMode: (mode: GridMode) => void;
}

export const GridOverlay: React.FC<{ gridMode: GridMode }> = ({ gridMode }) => {
  if (gridMode === "blank") return null;

  if (gridMode === "dot") {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
        <pattern id="dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" className="fill-neutral-500" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#dot-grid)" />
      </svg>
    );
  }

  if (gridMode === "square") {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <pattern id="square-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#6b7280" strokeWidth="0.8" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#square-grid)" />
      </svg>
    );
  }

  if (gridMode === "isometric") {
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <pattern id="iso-grid" width="30" height="52" patternUnits="userSpaceOnUse">
          <path d="M 0 26 L 15 0 L 30 26 L 15 52 Z M 15 0 L 15 52" fill="none" stroke="#6b7280" strokeWidth="0.8" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#iso-grid)" />
      </svg>
    );
  }

  return null;
};

export const GridModeSelector: React.FC<GridModesProps> = ({
  gridMode,
  onChangeGridMode,
}) => {
  return (
    <div className="flex items-center gap-1 bg-white p-0.5 sm:p-1 rounded-lg border border-neutral-200 shadow-xs text-xs">
      <Grid className="w-3.5 h-3.5 text-neutral-500 ml-1 hidden sm:inline" />
      <select
        value={gridMode}
        onChange={(e) => onChangeGridMode(e.target.value as GridMode)}
        className="h-7 px-1 bg-transparent text-neutral-700 font-medium outline-none text-[11px] sm:text-xs max-w-[90px] sm:max-w-none"
      >
        <option value="blank">Blank</option>
        <option value="dot">Dot Grid</option>
        <option value="square">Square Grid</option>
        <option value="isometric">Isometric Grid</option>
        <option value="dark">Dark Mode</option>
      </select>
    </div>
  );
};
