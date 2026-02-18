export type ShapeType =
  | "circle"
  | "rect"
  | "triangle"
  | "star"
  | "polygon"
  | "text"
  | "line"
  | "path"
  | "group";

export type GradientType = "linear" | "radial" | "none";
export type GradientDirection = "to right" | "to bottom" | "to bottom right" | "to left" | "to top" | "diagonal";

export interface GradientStop {
  offset: number;
  color: string;
}

export interface EditorElement {
  id: string;
  type: ShapeType;
  name?: string;

  x: number;
  y: number;
  width?: number;
  height?: number;
  size: number;
  rotation: number;
  fill: string;
  fillType?: GradientType;
  gradientStops?: GradientStop[];
  gradientDirection?: GradientDirection;
  opacity?: number;
  visible?: boolean;

  numPoints?: number;
  innerRadius?: number;
  cornerRadius?: number;

  // STROKE PROPERTIES
  stroke?: string;
  strokeWidth?: number;
  strokeDash?: number[];
  strokeEnabled?: boolean;

  // TEXT PROPERTIES
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number | string;
  fontStyle?: "normal" | "italic" | "oblique";
  textDecoration?: "none" | "underline" | "line-through";
  uppercase?: boolean;
  letterSpacing?: number;
  lineHeight?: number;
  align?: "left" | "center" | "right" | "justify";
  verticalAlign?: "top" | "middle" | "bottom";

  // SHADOW PROPERTIES
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowEnabled?: boolean;
  shadowOpacity?: number;

  // BLUR EFFECTS
  blurRadius?: number;
  blurEnabled?: boolean;

  // TRANSFORM
  scaleX?: number;
  scaleY?: number;
  skewX?: number;
  skewY?: number;

  // METADATA
  createdAt?: Date;
  updatedAt?: Date;
  tags?: string[];
  description?: string;
}

export interface ExportOptions {
  format: "png" | "svg" | "jpg" | "webp" | "ico" | "android" | "ios";
  scale: number;
  quality?: number;
  backgroundColor?: string;
  transparent?: boolean;
  padding?: number;
}

export interface LogoPreset {
  id: string;
  name: string;
  category: "tech" | "business" | "creative" | "minimal" | "gaming" | "social";
  thumbnail: string;
  elements: EditorElement[];
  description?: string;
  tags?: string[];
}

export interface EditorState {
  elements: EditorElement[];
  selectedId: string | null;
  selectedIds: string[]; // Para selección múltiple
  history: EditorElement[][];
  historyIndex: number;
  zoom: number;
  gridEnabled: boolean;
  snapToGrid: boolean;
  gridSize: number;
}