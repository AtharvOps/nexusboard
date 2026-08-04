"use client";

import React from "react";
import { ConnectorLayer, Layer, Point, XYWH } from "@/types/canvas";
import { colorToCss, computeOrthogonalPath, computeCurvedPath } from "@/lib/utils";

interface SmartConnectorProps {
  id: string;
  layer: ConnectorLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
  allLayers?: Record<string, Layer>;
}

export function getBorderAnchor(shape: XYWH, target: Point): Point {
  const cx = shape.x + shape.width / 2;
  const cy = shape.y + shape.height / 2;
  const dx = target.x - cx;
  const dy = target.y - cy;

  if (Math.abs(dx) > Math.abs(dy)) {
    return {
      x: dx > 0 ? shape.x + shape.width : shape.x,
      y: cy,
    };
  } else {
    return {
      x: cx,
      y: dy > 0 ? shape.y + shape.height : shape.y,
    };
  }
}

export const SmartConnector: React.FC<SmartConnectorProps> = ({
  id,
  layer,
  onPointerDown,
  selectionColor,
  allLayers = {},
}) => {
  const {
    fill,
    strokeWidth = 2,
    dashed = false,
    arrowhead = "end",
    connectorStyle = "orthogonal",
    startLayerId,
    endLayerId,
  } = layer;

  let start = layer.startPoint;
  let end = layer.endPoint;

  // Dynamic anchor detection if connected to live shapes
  if (startLayerId && allLayers[startLayerId]) {
    const startShape = allLayers[startLayerId];
    start = getBorderAnchor(startShape, end);
  }

  if (endLayerId && allLayers[endLayerId]) {
    const endShape = allLayers[endLayerId];
    end = getBorderAnchor(endShape, start);
  }

  const markerStartId = `marker-start-${id}`;
  const markerEndId = `marker-end-${id}`;
  const strokeCss = colorToCss(fill);

  const getPathData = () => {
    switch (connectorStyle) {
      case "curved":
        return computeCurvedPath(start, end);
      case "orthogonal":
        return computeOrthogonalPath(start, end);
      case "straight":
      default:
        return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
    }
  };

  const showStartArrow = arrowhead === "start" || arrowhead === "both";
  const showEndArrow = arrowhead === "end" || arrowhead === "both";

  return (
    <g
      className="cursor-pointer hover:opacity-80 transition-opacity"
      onPointerDown={(e) => onPointerDown(e, id)}
    >
      <defs>
        {showStartArrow && (
          <marker
            id={markerStartId}
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={strokeCss} />
          </marker>
        )}
        {showEndArrow && (
          <marker
            id={markerEndId}
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={strokeCss} />
          </marker>
        )}
      </defs>

      {/* Invisible wider path for easier click/hover interaction */}
      <path
        d={getPathData()}
        fill="none"
        stroke="transparent"
        strokeWidth={Math.max(12, strokeWidth * 3)}
      />

      {/* Main Visible Connector Path */}
      <path
        d={getPathData()}
        fill="none"
        stroke={selectionColor || strokeCss}
        strokeWidth={strokeWidth}
        strokeDasharray={dashed ? "6,6" : "none"}
        markerStart={showStartArrow ? `url(#${markerStartId})` : undefined}
        markerEnd={showEndArrow ? `url(#${markerEndId})` : undefined}
        className="transition-all"
      />
    </g>
  );
};
