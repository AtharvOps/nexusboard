import { colorToCss } from "@/lib/utils";
import { RectangleLayer } from "@/types/canvas";

interface RectangleProps {
  id: string;
  layer: RectangleLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
};

export const Rectangle = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: RectangleProps) => {
  const { 
    x, 
    y, 
    width, 
    height, 
    fill, 
    strokeWidth = 1,
    strokeColor,
    strokeDasharray,
    gradient,
    alpha = 1
  } = layer;

  const strokeStyle = strokeColor
    ? typeof strokeColor === "string"
      ? strokeColor
      : colorToCss(strokeColor)
    : selectionColor || "transparent";

  const fillStyle = fill ? colorToCss(fill) : "#000";
  const gradientId = `rect-grad-${id}`;

  return (
    <g
      style={{
        transform: `translate(${x}px, ${y}px)`,
        opacity: alpha,
      }}
      onPointerDown={(e) => onPointerDown(e, id)}
    >
      {gradient && (
        <defs>
          <linearGradient
            id={gradientId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            {gradient.colors.map((c, idx) => (
              <stop
                key={idx}
                offset={`${gradient.stops?.[idx] ?? (idx / (gradient.colors.length - 1)) * 100}%`}
                stopColor={c}
              />
            ))}
          </linearGradient>
        </defs>
      )}
      <rect
        className="drop-shadow-md cursor-pointer transition-all"
        x={0}
        y={0}
        width={width}
        height={height}
        strokeWidth={selectionColor ? Math.max(2, strokeWidth) : strokeWidth}
        stroke={strokeStyle}
        strokeDasharray={strokeDasharray}
        fill={gradient ? `url(#${gradientId})` : fillStyle}
      />
    </g>
  );
};