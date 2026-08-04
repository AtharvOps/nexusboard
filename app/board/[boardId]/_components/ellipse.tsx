import { colorToCss } from "@/lib/utils";
import { EllipseLayer } from "@/types/canvas";

interface EllipseProps {
  id: string;
  layer: EllipseLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
};

export const Ellipse = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
}: EllipseProps) => {
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
    alpha = 1,
  } = layer;

  const strokeStyle = strokeColor
    ? typeof strokeColor === "string"
      ? strokeColor
      : colorToCss(strokeColor)
    : selectionColor || "transparent";

  const fillStyle = fill ? colorToCss(fill) : "#000";
  const gradientId = `ell-grad-${id}`;

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
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
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
      <ellipse
        className="drop-shadow-md cursor-pointer transition-all"
        cx={width / 2}
        cy={height / 2}
        rx={width / 2}
        ry={height / 2}
        fill={gradient ? `url(#${gradientId})` : fillStyle}
        stroke={strokeStyle}
        strokeWidth={selectionColor ? Math.max(2, strokeWidth) : strokeWidth}
        strokeDasharray={strokeDasharray}
      />
    </g>
  );
};