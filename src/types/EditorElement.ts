// src/types/EditorElement.ts

/**
 * Tipos de formas soportadas por el editor.
 */
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

/**
 * Dirección de gradiente lineal.
 */
export type GradientDirection =
  | "to right"
  | "to bottom"
  | "to bottom right"
  | "to left"
  | "to top"
  | "diagonal";

/**
 * Tipo de relleno (sólido o gradiente).
 */
export type GradientType = "linear" | "radial" | "none";

/**
 * Parada de color para gradientes.
 */
export interface GradientStop {
  offset: number; // 0 a 1
  color: string;
}

/**
 * Propiedades base compartidas por todos los elementos.
 */
interface BaseElement {
  id: string;
  name?: string;

  // Posición y transformación
  x: number;
  y: number;
  rotation: number; // grados
  scaleX?: number;
  scaleY?: number;
  skewX?: number;
  skewY?: number;

  // Opacidad y visibilidad
  opacity?: number; // 0-1
  visible?: boolean;

  // Relleno
  fill: string;
  fillType?: GradientType;
  gradientStops?: GradientStop[];
  gradientDirection?: GradientDirection;

  // Trazo
  stroke?: string;
  strokeWidth?: number;
  strokeDash?: number[]; // ej: [5, 2] para línea discontinua
  strokeEnabled?: boolean;

  // Sombra
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowEnabled?: boolean;
  shadowOpacity?: number; // 0-1

  // Desenfoque
  blurRadius?: number;
  blurEnabled?: boolean;

  // Metadatos (opcional)
  createdAt?: Date;
  updatedAt?: Date;
  tags?: string[];
  description?: string;
}

/**
 * Elemento tipo círculo.
 */
interface CircleElement extends BaseElement {
  type: "circle";
  size: number; // diámetro
}

/**
 * Elemento tipo rectángulo (cuadrado por defecto, pero se puede
 * hacer rectangular usando scaleX/scaleY o en el futuro width/height).
 */
interface RectElement extends BaseElement {
  type: "rect";
  size: number; // lado del cuadrado (se puede escalar)
  cornerRadius?: number; // 0 por defecto
}

/**
 * Elemento tipo triángulo (polígono regular de 3 lados).
 */
interface TriangleElement extends BaseElement {
  type: "triangle";
  size: number; // altura (se puede escalar)
}

/**
 * Elemento tipo estrella.
 */
interface StarElement extends BaseElement {
  type: "star";
  size: number; // diámetro exterior (outerRadius * 2)
  numPoints?: number; // número de puntas (por defecto 5)
  innerRadius?: number; // radio interior (si no se especifica, se calcula)
}

/**
 * Elemento tipo polígono regular.
 */
interface PolygonElement extends BaseElement {
  type: "polygon";
  size: number; // diámetro (outerRadius * 2)
  numPoints?: number; // número de lados (por defecto 6)
}

/**
 * Elemento tipo texto.
 */
interface TextElement extends BaseElement {
  type: "text";
  // El texto en sí
  text?: string;
  uppercase?: boolean; // convertir a mayúsculas

  // Propiedades de fuente
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number | string; // 400, 'bold', etc.
  fontStyle?: "normal" | "italic" | "oblique";
  textDecoration?: "none" | "underline" | "line-through";
  letterSpacing?: number;
  lineHeight?: number;
  align?: "left" | "center" | "right" | "justify";
  verticalAlign?: "top" | "middle" | "bottom"; // para alineación vertical en el área del texto

  // El tamaño base (ancho aproximado) se puede derivar, pero lo mantenemos
  // para consistencia con otras formas (aunque no se usa directamente en el render)
  size?: number;

  // Nuevas propiedades para texto curvado
  curved?: boolean;               // Activar/desactivar curvatura
  curveRadius?: number;            // Radio de curvatura en píxeles
  curveStartAngle?: number;        // Ángulo inicial (grados)
  curveEndAngle?: number;          // Ángulo final (grados)
  curveDirection?: "clockwise" | "counterclockwise"; // Dirección del arco
  curveUpsideDown?: boolean;       // Invertir verticalmente (para interiores)
  curveOffset?: number;            // Desplazamiento a lo largo del path (0-100%)
}

/**
 * Elemento tipo línea.
 */
interface LineElement extends BaseElement {
  type: "line";
  points: number[]; // [x1, y1, x2, y2, ...] en coordenadas relativas al centro
  // La línea no usa 'size', pero se puede dejar opcional
  size?: never; // para evitar confusión
}

/**
 * Elemento tipo path (SVG path).
 */
interface PathElement extends BaseElement {
  type: "path";
  data: string; // string del path (ej: "M10 10 L20 20 Z")
  size?: never; // no aplica
}

/**
 * Elemento tipo grupo (contiene otros elementos).
 */
interface GroupElement extends BaseElement {
  type: "group";
  children: EditorElement[]; // elementos anidados
  size?: never; // el tamaño se deriva de los hijos
}

/**
 * Unión discriminada de todos los tipos de elementos.
 * Usa el campo 'type' para discriminar.
 */
export type EditorElement =
  | CircleElement
  | RectElement
  | TriangleElement
  | StarElement
  | PolygonElement
  | TextElement
  | LineElement
  | PathElement
  | GroupElement;

/**
 * Opciones de exportación.
 */
export interface ExportOptions {
  format: "png" | "svg" | "jpg" | "webp" | "ico" | "android" | "ios";
  scale: number; // factor de escala (1 = tamaño original)
  quality?: number; // para formatos con pérdida (0-1)
  backgroundColor?: string; // color de fondo (si no se usa transparente)
  transparent?: boolean; // fondo transparente (para PNG)
  padding?: number; // padding alrededor del contenido (en píxeles)
}

/**
 * Plantilla de logo predefinida.
 */
export interface LogoPreset {
  id: string;
  name: string;
  category:
    | "tech"
    | "business"
    | "creative"
    | "minimal"
    | "gaming"
    | "social";
  thumbnail: string; // URL o base64
  elements: EditorElement[];
  description?: string;
  tags?: string[];
}

/**
 * Estado global del editor.
 */
export interface EditorState {
  elements: EditorElement[];
  selectedId: string | null;
  selectedIds: string[]; // para selección múltiple
  history: EditorElement[][];
  historyIndex: number;
  zoom: number;
  gridEnabled: boolean;
  snapToGrid: boolean;
  gridSize: number;
}