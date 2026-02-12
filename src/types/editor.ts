export type ShapeType = "circle" | "rect" | "triangle"

export interface EditorElement {
  id: string
  type: ShapeType
  x: number
  y: number
  size: number
  rotation: number
  fill: string
}
