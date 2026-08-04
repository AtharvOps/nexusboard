"use client";

import React from "react";
import { Color } from "@/types/canvas";
import { colorToCss, hexToRgb } from "@/lib/utils";

interface BorderStyleControlsProps {
  strokeWidth?: number;
  strokeColor?: Color | string;
  strokeDasharray?: string;
  strokeLinejoin?: "miter" | "round" | "bevel";
  strokeLinecap?: "butt" | "round" | "square";
  onChange: (updates: {
    strokeWidth?: number;
    strokeColor?: Color | string;
    strokeDasharray?: string;
    strokeLinejoin?: "miter" | "round" | "bevel";
    strokeLinecap?: "butt" | "round" | "square";
  }) => void;
}

const DASH_PATTERNS = [
  { label: "Solid", value: "none" },
  { label: "Dashed", value: "6,6" },
  { label: "Dotted", value: "2,4" },
  { label: "Dash-Dot", value: "8,4,2,4" },
];

export const BorderStyleControls: React.FC<BorderStyleControlsProps> = ({
  strokeWidth = 1,
  strokeColor = "#000000",
  strokeDasharray = "none",
  onChange,
}) => {
  const currentColorHex =
    typeof strokeColor === "string" ? strokeColor : colorToCss(strokeColor);

  return (
    <div className="flex items-center gap-2 p-1.5 bg-white rounded-lg shadow-sm border border-neutral-200 text-xs">
      {/* Border Color */}
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-neutral-500 font-medium">Border</span>
        <input
          type="color"
          value={currentColorHex}
          onChange={(e) => onChange({ strokeColor: hexToRgb(e.target.value) })}
          className="w-5 h-5 rounded cursor-pointer border-none p-0 bg-transparent"
        />
      </div>

      {/* Stroke Width Slider */}
      <div className="flex items-center gap-1.5 pl-2 border-l border-neutral-200">
        <span className="text-[10px] text-neutral-500 font-mono">{strokeWidth}px</span>
        <input
          type="range"
          min={0}
          max={20}
          value={strokeWidth}
          onChange={(e) => onChange({ strokeWidth: parseInt(e.target.value) })}
          className="w-16 h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* Dash Pattern Selector */}
      <select
        value={strokeDasharray}
        onChange={(e) => onChange({ strokeDasharray: e.target.value })}
        className="h-7 px-1.5 border rounded bg-neutral-50 text-neutral-700 text-xs outline-none"
      >
        {DASH_PATTERNS.map((d) => (
          <option key={d.value} value={d.value}>
            {d.label}
          </option>
        ))}
      </select>
    </div>
  );
};
