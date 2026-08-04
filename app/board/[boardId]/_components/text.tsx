"use client";

import { useRef } from "react";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";

import { TextLayer } from "@/types/canvas";
import { cn, colorToCss } from "@/lib/utils";
import { useMutation } from "@/liveblocks.config";

interface TextProps {
  id: string;
  layer: TextLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
};

export const Text = ({
  layer,
  onPointerDown,
  id,
  selectionColor,
}: TextProps) => {
  const { 
    x, 
    y, 
    width, 
    height, 
    fill, 
    value, 
    fontSize = 24, 
    fontFamily = "sans-serif", 
    fontWeight = "normal", 
    textAlign = "center" 
  } = layer;
  
  const textRef = useRef<HTMLDivElement>(null);

  const updateTextAndWidth = useMutation(({ storage }, newValue: string, newWidth?: number) => {
    const liveLayers = storage.get("layers");
    const l = liveLayers.get(id);
    if (l) {
      l.set("value", newValue);
      if (newWidth && newWidth > l.get("width")) {
        l.set("width", Math.ceil(newWidth));
      }
    }
  }, [id]);

  const handleContentChange = (e: ContentEditableEvent) => {
    const newValue = e.target.value;
    let measuredWidth: number | undefined = undefined;

    if (textRef.current) {
      const currentScrollWidth = textRef.current.scrollWidth + 24;
      if (currentScrollWidth > width) {
        measuredWidth = currentScrollWidth;
      }
    }

    updateTextAndWidth(newValue, measuredWidth);
  };

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
      className="overflow-visible"
      style={{
        outline: selectionColor ? `1px solid ${selectionColor}` : "none"
      }}
    >
      <div className="w-full h-full flex items-center justify-center">
        <ContentEditable
          innerRef={textRef as unknown as React.RefObject<HTMLDivElement>}
          html={value || "Text"}
          onChange={handleContentChange}
          className={cn(
            "outline-none drop-shadow-md select-text min-w-12.5 whitespace-pre cursor-text p-1"
          )}
          style={{
            fontSize: `${fontSize}px`,
            fontFamily,
            fontWeight,
            textAlign,
            color: fill ? colorToCss(fill) : "#000",
          }}
        />
      </div>
    </foreignObject>
  );
};