export type Color = {
  r: number;
  g: number;
  b: number;
};

export type GradientColor = {
  type: "linear" | "radial";
  colors: string[];
  stops?: number[];
  angle?: number;
};

export type Camera = {
  x: number;
  y: number;
};

export enum LayerType {
  Rectangle,
  Ellipse,
  Path,
  Text,
  Note,
  // Extended shapes
  Diamond,
  Triangle,
  Star,
  Database,
  Capsule,
  Hexagon,
  Parallelogram,
  Cloud,
  Document,
  Decision,
  // Connectors, Images, Groups
  Connector,
  Image,
  Group,
}

export type BaseLayerProps = {
  x: number;
  y: number;
  height: number;
  width: number;
  fill: Color;
  gradient?: GradientColor;
  alpha?: number;
  strokeColor?: Color | string;
  strokeWidth?: number;
  strokeDasharray?: string;
  strokeLinejoin?: "miter" | "round" | "bevel";
  strokeLinecap?: "butt" | "round" | "square";
  rotation?: number;
  isLocked?: boolean;
  groupId?: string;
  fontSize?: number;
  fontWeight?: string | number;
  fontFamily?: string;
  textAlign?: "left" | "center" | "right";
  lineHeight?: number;
  letterSpacing?: number;
  value?: string;
};

export type RectangleLayer = BaseLayerProps & {
  type: LayerType.Rectangle;
};

export type EllipseLayer = BaseLayerProps & {
  type: LayerType.Ellipse;
};

export type PathLayer = BaseLayerProps & {
  type: LayerType.Path;
  points: number[][];
};

export type TextLayer = BaseLayerProps & {
  type: LayerType.Text;
};

export type NoteLayer = BaseLayerProps & {
  type: LayerType.Note;
};

export type FlowchartShapeType =
  | LayerType.Diamond
  | LayerType.Triangle
  | LayerType.Star
  | LayerType.Database
  | LayerType.Capsule
  | LayerType.Hexagon
  | LayerType.Parallelogram
  | LayerType.Cloud
  | LayerType.Document
  | LayerType.Decision;

export type ExtendedShapeLayer = BaseLayerProps & {
  type: FlowchartShapeType;
};

export type ConnectorLayer = BaseLayerProps & {
  type: LayerType.Connector;
  startPoint: Point;
  endPoint: Point;
  startLayerId?: string;
  endLayerId?: string;
  arrowhead?: "none" | "start" | "end" | "both";
  connectorStyle?: "straight" | "curved" | "orthogonal";
  dashed?: boolean;
};

export type ImageLayer = BaseLayerProps & {
  type: LayerType.Image;
  src: string;
  aspectRatio?: number;
};

export type GroupLayer = BaseLayerProps & {
  type: LayerType.Group;
  children: string[];
};

export type Point = {
  x: number;
  y: number;
};

export type XYWH = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export enum Side {
  Top = 1,
  Bottom = 2,
  Left = 4,
  Right = 8,
}

export enum CanvasMode {
  None,
  Pressing,
  SelectionNet,
  Translating,
  Inserting,
  Resizing,
  Pencil,
  Connecting,
  Commenting,
}

export type CanvasState =
  | { mode: CanvasMode.None }
  | { mode: CanvasMode.SelectionNet; origin: Point; current?: Point }
  | { mode: CanvasMode.Translating; current: Point }
  | { mode: CanvasMode.Inserting; layerType: LayerType }
  | { mode: CanvasMode.Pencil }
  | { mode: CanvasMode.Pressing; origin: Point }
  | { mode: CanvasMode.Resizing; initialBounds: XYWH; corner: Side }
  | { mode: CanvasMode.Connecting; startPoint?: Point; startLayerId?: string }
  | { mode: CanvasMode.Commenting };

export type Layer =
  | RectangleLayer
  | EllipseLayer
  | PathLayer
  | TextLayer
  | NoteLayer
  | ExtendedShapeLayer
  | ConnectorLayer
  | ImageLayer
  | GroupLayer;

export type CommentReply = {
  id: string;
  authorId: string;
  authorName: string;
  authorPicture?: string;
  content: string;
  createdAt: number;
};

export type SpatialComment = {
  id: string;
  x: number;
  y: number;
  authorId: string;
  authorName: string;
  authorPicture?: string;
  content: string;
  resolved: boolean;
  createdAt: number;
  replies: CommentReply[];
};

export type GridMode = "blank" | "dot" | "square" | "isometric" | "dark";

export type BoardVersion = {
  id: string;
  name: string;
  timestamp: number;
  layers: Record<string, Layer>;
  layerIds: string[];
};