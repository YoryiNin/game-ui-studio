export type UIElementType = "button" | "card" | "progressBar" | "menu" | "text" | "image" | "input" | "checkbox";

export interface UIElement {
  id: string;
  type: UIElementType;
  name: string; // Nombre personalizable para identificar elementos
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  text?: string;
  layer: number;
  fontSize?: number;
  fontFamily?: string;
  fontStyle?: string;
  fontWeight?: string;
  cornerRadius?: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  scaleX?: number;
  scaleY?: number;
  visible: boolean;
  locked: boolean;
  meta?: Record<string, any>; // Metadatos adicionales
}

export interface EditorState {
  elements: UIElement[];
  selectedIds: string[]; // Soporte para múltiples selecciones
  history: HistoryState[];
  historyIndex: number;
  gridEnabled: boolean;
  snapToGrid: boolean;
  gridSize: number;
  zoom: number;
  viewportOffset: { x: number; y: number };
}

export interface HistoryState {
  elements: UIElement[];
  timestamp: number;
  description: string;
}

export type ToolType = "select" | "pan" | "rectangle" | "circle" | "text" | "image";

export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  elements: UIElement[];
  category: string;
}