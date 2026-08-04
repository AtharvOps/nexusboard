"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
} from "lucide-react";

interface TypographyToolbarProps {
  fontSize?: number;
  fontWeight?: string | number;
  fontFamily?: string;
  textAlign?: "left" | "center" | "right";
  lineHeight?: number;
  letterSpacing?: number;
  onChange: (updates: {
    fontSize?: number;
    fontWeight?: string | number;
    fontFamily?: string;
    textAlign?: "left" | "center" | "right";
    lineHeight?: number;
    letterSpacing?: number;
  }) => void;
}

const FONT_FAMILIES = [
  { label: "Sans-Serif", value: "sans-serif" },
  { label: "Serif", value: "serif" },
  { label: "Monospace", value: "monospace" },
  { label: "Handwritten", value: "cursive" },
];

export const TypographyToolbar: React.FC<TypographyToolbarProps> = ({
  fontSize = 16,
  fontWeight = "normal",
  fontFamily = "sans-serif",
  textAlign = "center",
  onChange,
}) => {
  return (
    <div className="flex items-center gap-1.5 p-1 bg-white rounded-lg shadow-sm border border-neutral-200 text-xs">
      {/* Font Family Selector */}
      <select
        value={fontFamily}
        onChange={(e) => onChange({ fontFamily: e.target.value })}
        className="h-7 px-2 border rounded bg-neutral-50 text-neutral-700 text-xs outline-none"
      >
        {FONT_FAMILIES.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>

      {/* Font Size Input */}
      <div className="flex items-center gap-1">
        <Type className="w-3.5 h-3.5 text-neutral-500" />
        <input
          type="number"
          min={8}
          max={120}
          value={fontSize}
          onChange={(e) => onChange({ fontSize: parseInt(e.target.value) || 16 })}
          className="w-12 h-7 px-1 text-center border rounded text-xs outline-none font-mono"
        />
      </div>

      {/* Bold Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          onChange({
            fontWeight: fontWeight === "bold" || fontWeight === 700 ? "normal" : "bold",
          })
        }
        className={`h-7 w-7 ${
          fontWeight === "bold" || fontWeight === 700 ? "bg-neutral-100 font-bold" : ""
        }`}
      >
        <Bold className="w-3.5 h-3.5" />
      </Button>

      {/* Text Align Buttons */}
      <div className="flex border-l pl-1 border-neutral-200 gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onChange({ textAlign: "left" })}
          className={`h-7 w-7 ${textAlign === "left" ? "bg-neutral-100" : ""}`}
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onChange({ textAlign: "center" })}
          className={`h-7 w-7 ${textAlign === "center" ? "bg-neutral-100" : ""}`}
        >
          <AlignCenter className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onChange({ textAlign: "right" })}
          className={`h-7 w-7 ${textAlign === "right" ? "bg-neutral-100" : ""}`}
        >
          <AlignRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};
