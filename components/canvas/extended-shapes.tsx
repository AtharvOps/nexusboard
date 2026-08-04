"use client";

import React, { useState } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { ExtendedShapeLayer, LayerType } from "@/types/canvas";
import { colorToCss, getContrastingTextColor } from "@/lib/utils";
import { useMutation } from "@/liveblocks.config";

interface ExtendedShapeProps {
  id: string;
  layer: ExtendedShapeLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
}

export const ExtendedShape: React.FC<ExtendedShapeProps> = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}) => {
  const {
    x,
    y,
    width,
    height,
    fill,
    gradient,
    alpha = 1,
    strokeColor,
    strokeWidth = 1,
    strokeDasharray,
    rotation = 0,
    value,
    fontSize = 16,
    fontFamily = "sans-serif",
    fontWeight = "normal",
    textAlign = "center",
    type,
  } = layer;

  const [text, setText] = useState(value || "");
  const [prevValue, setPrevValue] = useState(value);

  if (value !== prevValue) {
    setPrevValue(value);
    setText(value || "");
  }

  const updateValue = useMutation(
    ({ storage }, newValue: string) => {
      const liveLayers = storage.get("layers");
      liveLayers.get(id)?.set("value", newValue);
    },
    [id]
  );

  const handleContentChange = (e: ContentEditableEvent) => {
    setText(e.target.value);
    updateValue(e.target.value);
  };

  const fillStyle = colorToCss(fill);
  const strokeStyle = strokeColor
    ? typeof strokeColor === "string"
      ? strokeColor
      : colorToCss(strokeColor)
    : selectionColor || "transparent";

  const gradientId = `grad-${id}`;

  const renderShapePath = () => {
    const w = width;
    const h = height;

    switch (type) {
      case LayerType.Diamond:
      case LayerType.Decision:
        return `M ${w / 2} 0 L ${w} ${h / 2} L ${w / 2} ${h} L 0 ${h / 2} Z`;

      case LayerType.Triangle:
        return `M ${w / 2} 0 L ${w} ${h} L 0 ${h} Z`;

      case LayerType.Star: {
        const cx = w / 2;
        const cy = h / 2;
        const outerR = Math.min(w, h) / 2;
        const innerR = outerR / 2.5;
        let p = "";
        for (let i = 0; i < 10; i++) {
          const r = i % 2 === 0 ? outerR : innerR;
          const a = (i * Math.PI) / 5 - Math.PI / 2;
          const px = cx + r * Math.cos(a);
          const py = cy + r * Math.sin(a);
          p += (i === 0 ? "M " : "L ") + `${px} ${py} `;
        }
        return p + "Z";
      }

      case LayerType.Database:
        return `M 0 ${h * 0.2} 
                C 0 0, ${w} 0, ${w} ${h * 0.2} 
                L ${w} ${h * 0.8} 
                C ${w} ${h}, 0 ${h}, 0 ${h * 0.8} Z`;

      case LayerType.Capsule: {
        const r = Math.min(w, h) / 2;
        return `M ${r} 0 L ${w - r} 0 A ${r} ${r} 0 0 1 ${w - r} ${h} L ${r} ${h} A ${r} ${r} 0 0 1 ${r} 0 Z`;
      }

      case LayerType.Hexagon:
        return `M ${w * 0.25} 0 L ${w * 0.75} 0 L ${w} ${h * 0.5} L ${
          w * 0.75
        } ${h} L ${w * 0.25} ${h} L 0 ${h * 0.5} Z`;

      case LayerType.Parallelogram:
        return `M ${w * 0.2} 0 L ${w} 0 L ${w * 0.8} ${h} L 0 ${h} Z`;

      case LayerType.Cloud:
        return `M ${w * 0.2} ${h * 0.7} 
                C ${w * 0.05} ${h * 0.7}, 0 ${h * 0.5}, ${w * 0.15} ${h * 0.3} 
                C ${w * 0.1} ${h * 0.1}, ${w * 0.35} 0, ${w * 0.5} ${h * 0.15} 
                C ${w * 0.65} 0, ${w * 0.9} ${h * 0.1}, ${w * 0.85} ${h * 0.3} 
                C ${w} ${h * 0.4}, ${w} ${h * 0.7}, ${w * 0.8} ${h * 0.7} Z`;

      case LayerType.Document:
        return `M 0 0 L ${w * 0.8} 0 L ${w} ${h * 0.2} L ${w} ${h} L 0 ${h} Z M ${
          w * 0.8
        } 0 L ${w * 0.8} ${h * 0.2} L ${w} ${h * 0.2}`;

      default:
        return `M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z`;
    }
  };

  const fillValue = gradient ? `url(#${gradientId})` : fillStyle;

  return (
    <g
      className="drop-shadow-md cursor-pointer transition-transform duration-75"
      style={{
        transform: `translate(${x}px, ${y}px) rotate(${rotation}deg)`,
        transformOrigin: `${width / 2}px ${height / 2}px`,
        opacity: alpha,
      }}
      onPointerDown={(e) => onPointerDown(e, id)}
    >
      {/* Optional Defs for Gradient */}
      {gradient && (
        <defs>
          {gradient.type === "linear" ? (
            <linearGradient
              id={gradientId}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
              gradientTransform={`rotate(${gradient.angle || 0})`}
            >
              {gradient.colors.map((c, idx) => (
                <stop
                  key={idx}
                  offset={`${gradient.stops?.[idx] ?? (idx / (gradient.colors.length - 1)) * 100}%`}
                  stopColor={c}
                />
              ))}
            </linearGradient>
          ) : (
            <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
              {gradient.colors.map((c, idx) => (
                <stop
                  key={idx}
                  offset={`${gradient.stops?.[idx] ?? (idx / (gradient.colors.length - 1)) * 100}%`}
                  stopColor={c}
                />
              ))}
            </radialGradient>
          )}
        </defs>
      )}

      {/* Vector Path rendering */}
      <path
        d={renderShapePath()}
        fill={fillValue}
        stroke={strokeStyle}
        strokeWidth={selectionColor ? Math.max(2, strokeWidth) : strokeWidth}
        strokeDasharray={strokeDasharray}
        className="transition-all"
      />

      {/* Editable Text overlay inside shape bounds */}
      <foreignObject
        x={width * 0.15}
        y={height * 0.15}
        width={width * 0.7}
        height={height * 0.7}
        className="overflow-hidden"
      >
        <div className="w-full h-full flex items-center justify-center">
          <ContentEditable
            html={text}
            onChange={handleContentChange}
            className="w-full outline-none text-center select-text"
            style={{
              fontSize: `${fontSize}px`,
              fontFamily,
              fontWeight,
              textAlign,
              color: getContrastingTextColor(fill),
            }}
          />
        </div>
      </foreignObject>
    </g>
  );
};
