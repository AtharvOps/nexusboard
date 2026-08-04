"use client";

import React, { useState, useEffect, useRef } from "react";
import { Color, GradientColor } from "@/types/canvas";
import { colorToCss, hexToRgb, colorToRgba } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Palette, Layers, Plus, Trash2 } from "lucide-react";

interface CustomColorPickerProps {
  color?: Color;
  gradient?: GradientColor;
  alpha?: number;
  onChange: (color: Color, gradient?: GradientColor, alpha?: number) => void;
}

const DEFAULT_PALETTE: Color[] = [
  { r: 240, g: 82, b: 82 },
  { r: 251, g: 146, b: 60 },
  { r: 250, g: 204, b: 21 },
  { r: 74, g: 222, b: 128 },
  { r: 56, g: 189, b: 248 },
  { r: 99, g: 102, b: 241 },
  { r: 168, g: 85, b: 247 },
  { r: 236, g: 72, b: 153 },
  { r: 255, g: 255, b: 255 },
  { r: 0, g: 0, b: 0 },
];

export const CustomColorPicker: React.FC<CustomColorPickerProps> = ({
  color = { r: 225, g: 225, b: 225 },
  gradient,
  alpha = 1,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState<"solid" | "gradient">("solid");
  const [hexInput, setHexInput] = useState(colorToCss(color));
  const [r, setR] = useState(color.r);
  const [g, setG] = useState(color.g);
  const [b, setB] = useState(color.b);
  const [a, setA] = useState(alpha);

  // Sync color prop changes to state without effect setState cascading renders
  const [prevColor, setPrevColor] = useState(color);
  if (
    color.r !== prevColor.r ||
    color.g !== prevColor.g ||
    color.b !== prevColor.b
  ) {
    setPrevColor(color);
    setR(color.r);
    setG(color.g);
    setB(color.b);
    setHexInput(colorToCss(color));
  }

  // Gradient state
  const [gradType, setGradType] = useState<"linear" | "radial">(
    gradient?.type || "linear"
  );
  const [gradAngle, setGradAngle] = useState(gradient?.angle ?? 90);
  const [gradColors, setGradColors] = useState<string[]>(
    gradient?.colors || ["#3B82F6", "#9333EA"]
  );
  const [gradStops, setGradStops] = useState<number[]>(
    gradient?.stops || [0, 100]
  );

  // Saved Palette with lazy state initializer
  const [savedPalette, setSavedPalette] = useState<Color[]>(() => {
    if (typeof window === "undefined") return DEFAULT_PALETTE;
    try {
      const storedPalette = localStorage.getItem("nexusboard_saved_palette");
      return storedPalette ? JSON.parse(storedPalette) : DEFAULT_PALETTE;
    } catch {
      return DEFAULT_PALETTE;
    }
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleSolidChange = (newColor: Color, newAlpha = a) => {
    setR(newColor.r);
    setG(newColor.g);
    setB(newColor.b);
    setHexInput(colorToCss(newColor));
    onChange(newColor, undefined, newAlpha);
  };

  const handleHexSubmit = (val: string) => {
    setHexInput(val);
    if (/^#?[0-9A-Fa-f]{6}$/.test(val)) {
      const rgb = hexToRgb(val);
      handleSolidChange(rgb);
    }
  };

  const handleGradientUpdate = (
    type = gradType,
    angle = gradAngle,
    colors = gradColors,
    stops = gradStops
  ) => {
    setGradType(type);
    setGradAngle(angle);
    setGradColors(colors);
    setGradStops(stops);

    const gradObj: GradientColor = { type, angle, colors, stops };
    const baseColor = hexToRgb(colors[0] || "#3B82F6");
    onChange(baseColor, gradObj, a);
  };

  // Draw Color Wheel Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const radius = width / 2;

    ctx.clearRect(0, 0, width, height);

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const dx = x - radius;
        const dy = y - radius;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= radius) {
          let angle = Math.atan2(dy, dx) * (180 / Math.PI);
          if (angle < 0) angle += 360;

          const sat = dist / radius;
          ctx.fillStyle = `hsl(${angle}, ${sat * 100}%, 50%)`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
  }, [activeTab]);

  const handleWheelClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const p = ctx.getImageData(x, y, 1, 1).data;
    handleSolidChange({ r: p[0], g: p[1], b: p[2] });
  };

  const addToPalette = () => {
    const newPal = [...savedPalette, { r, g, b }];
    setSavedPalette(newPal);
    try {
      localStorage.setItem("nexusboard_saved_palette", JSON.stringify(newPal));
    } catch {}
  };

  return (
    <div className="w-64 sm:w-68 bg-white rounded-2xl shadow-2xl border border-neutral-200 p-2.5 select-none text-xs flex flex-col gap-2.5">
      {/* Mode Selector Tabs */}
      <div className="flex bg-neutral-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab("solid")}
          className={`flex-1 py-1 rounded-lg font-bold text-[11px] transition flex items-center justify-center gap-1 ${
            activeTab === "solid"
              ? "bg-white text-blue-600 shadow-xs"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <Palette className="w-3.5 h-3.5" /> Solid
        </button>
        <button
          onClick={() => {
            setActiveTab("gradient");
            handleGradientUpdate();
          }}
          className={`flex-1 py-1 rounded-lg font-bold text-[11px] transition flex items-center justify-center gap-1 ${
            activeTab === "gradient"
              ? "bg-white text-blue-600 shadow-xs"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> Gradient
        </button>
      </div>

      {activeTab === "solid" ? (
        <>
          {/* Color Preview & Hex */}
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg border border-neutral-300 shadow-inner"
              style={{ backgroundColor: colorToRgba({ r, g, b }, a) }}
            />
            <div className="flex-1 flex items-center gap-1">
              <span className="text-[10px] text-neutral-400 font-bold">HEX</span>
              <Input
                value={hexInput}
                onChange={(e) => handleHexSubmit(e.target.value)}
                className="h-6 text-xs font-mono px-1.5"
              />
            </div>
          </div>

          {/* Color Wheel */}
          <div className="flex justify-center my-0.5">
            <canvas
              ref={canvasRef}
              width={110}
              height={110}
              onClick={handleWheelClick}
              className="rounded-full cursor-crosshair border border-neutral-200 shadow-xs"
            />
          </div>

          {/* RGB Sliders */}
          <div className="space-y-1 bg-neutral-50 p-1.5 rounded-xl border border-neutral-100">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 font-bold text-red-500 text-[10px]">R</span>
              <input
                type="range"
                min={0}
                max={255}
                value={r}
                onChange={(e) =>
                  handleSolidChange({ r: parseInt(e.target.value), g, b })
                }
                className="flex-1 h-1.5 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              <span className="w-6 text-right font-mono text-neutral-600 text-[10px]">
                {r}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 font-bold text-green-500 text-[10px]">G</span>
              <input
                type="range"
                min={0}
                max={255}
                value={g}
                onChange={(e) =>
                  handleSolidChange({ r, g: parseInt(e.target.value), b })
                }
                className="flex-1 h-1.5 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
              <span className="w-6 text-right font-mono text-neutral-600 text-[10px]">
                {g}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 font-bold text-blue-500 text-[10px]">B</span>
              <input
                type="range"
                min={0}
                max={255}
                value={b}
                onChange={(e) =>
                  handleSolidChange({ r, g, b: parseInt(e.target.value) })
                }
                className="flex-1 h-1.5 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <span className="w-6 text-right font-mono text-neutral-600 text-[10px]">
                {b}
              </span>
            </div>
            {/* Alpha */}
            <div className="flex items-center gap-1.5 pt-1 border-t border-neutral-200">
              <span className="w-2.5 font-bold text-neutral-500 text-[10px]">A</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={a}
                onChange={(e) => {
                  const newA = parseFloat(e.target.value);
                  setA(newA);
                  handleSolidChange({ r, g, b }, newA);
                }}
                className="flex-1 h-1.5 bg-neutral-300 rounded-lg appearance-none cursor-pointer accent-neutral-700"
              />
              <span className="w-6 text-right font-mono text-neutral-600 text-[10px]">
                {Math.round(a * 100)}%
              </span>
            </div>
          </div>

          {/* Palette */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider">
                Palette
              </span>
              <button
                onClick={addToPalette}
                className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-0.5 text-[10px]"
              >
                <Plus className="w-3 h-3" /> Add
              </button>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {savedPalette.slice(0, 10).map((c, i) => (
                <button
                  key={i}
                  onClick={() => handleSolidChange(c)}
                  className="w-full h-5 rounded-md border border-neutral-300 transition hover:scale-105"
                  style={{ backgroundColor: colorToCss(c) }}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Gradient Controls */
        <div className="space-y-2.5">
          {/* Gradient Preview */}
          <div
            className="w-full h-9 rounded-xl border border-neutral-300 shadow-inner"
            style={{
              background:
                gradType === "linear"
                  ? `linear-gradient(${gradAngle}deg, ${gradColors.join(", ")})`
                  : `radial-gradient(circle, ${gradColors.join(", ")})`,
            }}
          />

          {/* Type Toggle */}
          <div className="flex gap-1.5">
            <button
              onClick={() => handleGradientUpdate("linear")}
              className={`flex-1 py-1 rounded-lg border text-xs font-bold ${
                gradType === "linear"
                  ? "bg-blue-50 border-blue-500 text-blue-600"
                  : "border-neutral-200 text-neutral-600"
              }`}
            >
              Linear
            </button>
            <button
              onClick={() => handleGradientUpdate("radial")}
              className={`flex-1 py-1 rounded-lg border text-xs font-bold ${
                gradType === "radial"
                  ? "bg-blue-50 border-blue-500 text-blue-600"
                  : "border-neutral-200 text-neutral-600"
              }`}
            >
              Radial
            </button>
          </div>

          {/* Angle Slider if Linear */}
          {gradType === "linear" && (
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-neutral-600 font-bold">
                <span>Angle</span>
                <span>{gradAngle}°</span>
              </div>
              <input
                type="range"
                min={0}
                max={360}
                value={gradAngle}
                onChange={(e) =>
                  handleGradientUpdate(
                    gradType,
                    parseInt(e.target.value),
                    gradColors,
                    gradStops
                  )
                }
                className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          )}

          {/* Stops */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider">
              Color Stops
            </span>
            {gradColors.map((col, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={col}
                  onChange={(e) => {
                    const next = [...gradColors];
                    next[idx] = e.target.value;
                    handleGradientUpdate(gradType, gradAngle, next, gradStops);
                  }}
                  className="w-6 h-6 rounded-md border border-neutral-300 cursor-pointer p-0 bg-transparent"
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={gradStops[idx] ?? idx * 100}
                  onChange={(e) => {
                    const nextStops = [...gradStops];
                    nextStops[idx] = parseInt(e.target.value);
                    handleGradientUpdate(
                      gradType,
                      gradAngle,
                      gradColors,
                      nextStops
                    );
                  }}
                  className="flex-1 h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="w-6 text-right text-[10px] font-mono text-neutral-500">
                  {gradStops[idx] ?? idx * 100}%
                </span>
                {gradColors.length > 2 && (
                  <button
                    onClick={() => {
                      const nextCols = gradColors.filter((_, i) => i !== idx);
                      const nextStops = gradStops.filter((_, i) => i !== idx);
                      handleGradientUpdate(
                        gradType,
                        gradAngle,
                        nextCols,
                        nextStops
                      );
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
            {gradColors.length < 4 && (
              <button
                onClick={() => {
                  const nextCols = [...gradColors, "#10B981"];
                  const nextStops = [...gradStops, 50];
                  handleGradientUpdate(
                    gradType,
                    gradAngle,
                    nextCols,
                    nextStops
                  );
                }}
                className="w-full py-1 text-center border border-dashed border-neutral-300 rounded-lg text-neutral-600 font-bold hover:border-blue-500 hover:text-blue-600 transition text-[10px]"
              >
                + Add Stop
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
