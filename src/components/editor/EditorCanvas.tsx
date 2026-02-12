import {
  Stage,
  Layer,
  Circle,
  Rect,
  RegularPolygon,
  Transformer,
} from "react-konva"
import { useRef, useEffect, useState } from "react"
import type Konva from "konva"
import type { EditorElement } from "../../types/editor"

interface Props {
  elements: EditorElement[]
  setElements: (elements: EditorElement[]) => void
  selectedId: string | null
  setSelectedId: (id: string | null) => void
}

export default function EditorCanvas({
  elements,
  setElements,
  selectedId,
  setSelectedId,
}: Props) {
  const stageRef = useRef<Konva.Stage>(null)
  const trRef = useRef<Konva.Transformer>(null)

  const [isExporting, setIsExporting] = useState(false)

  // 🔥 Manejo del Transformer
  useEffect(() => {
    if (!selectedId || isExporting) {
      trRef.current?.nodes([])
      return
    }

    const stage = stageRef.current
    const selectedNode = stage?.findOne(`#${selectedId}`)

    if (selectedNode && trRef.current) {
      trRef.current.nodes([selectedNode])
      trRef.current.getLayer()?.batchDraw()
    }
  }, [selectedId, isExporting])

  // 🔥 EXPORT PNG LIMPIO
  const exportPNG = () => {
    if (!stageRef.current) return

    const previousSelection = selectedId

    // Ocultamos transformer
    setIsExporting(true)
    setSelectedId(null)

    setTimeout(() => {
      const uri = stageRef.current!.toDataURL({
        pixelRatio: 2,
      })

      const link = document.createElement("a")
      link.download = "design.png"
      link.href = uri
      link.click()

      // Restaurar selección
      setSelectedId(previousSelection)
      setIsExporting(false)
    }, 0)
  }

  // 🔥 EXPORT JSON
  const exportJSON = () => {
    const json = JSON.stringify(elements, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = "design.json"
    link.click()
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <Stage
        width={800}
        height={600}
        ref={stageRef}
        className="bg-[#161625] rounded-xl"
        onMouseDown={(e) => {
          // 🔥 Si clickea vacío → deselecciona
          if (e.target === e.target.getStage()) {
            setSelectedId(null)
          }
        }}
      >
        <Layer>
          {elements.map((el) => {
            const commonProps = {
              id: el.id,
              key: el.id,
              x: el.x,
              y: el.y,
              rotation: el.rotation,
              draggable: true,
              fill: el.fill,
              onClick: () => setSelectedId(el.id),
              onTap: () => setSelectedId(el.id),

              onDragEnd: (e: any) => {
                const updated = elements.map((item) =>
                  item.id === el.id
                    ? { ...item, x: e.target.x(), y: e.target.y() }
                    : item
                )
                setElements(updated)
              },

              onTransformEnd: (e: any) => {
                const node = e.target
                const scaleX = node.scaleX()
                const scaleY = node.scaleY()

                const newSize = el.size * scaleX

                const updated = elements.map((item) =>
                  item.id === el.id
                    ? {
                        ...item,
                        x: node.x(),
                        y: node.y(),
                        rotation: node.rotation(),
                        size: newSize,
                      }
                    : item
                )

                node.scaleX(1)
                node.scaleY(1)

                setElements(updated)
              },
            }

            if (el.type === "circle") {
              return <Circle {...commonProps} radius={el.size / 2} />
            }

            if (el.type === "rect") {
              return <Rect {...commonProps} width={el.size} height={el.size} />
            }

            if (el.type === "triangle") {
              return (
                <RegularPolygon
                  {...commonProps}
                  sides={3}
                  radius={el.size / 2}
                />
              )
            }

            return null
          })}

          {/* 🔥 Transformer SOLO si hay selección y no estamos exportando */}
          {selectedId && !isExporting && (
            <Transformer
              ref={trRef}
              rotateEnabled={true}
              enabledAnchors={[
                "top-left",
                "top-right",
                "bottom-left",
                "bottom-right",
              ]}
            />
          )}
        </Layer>
      </Stage>

      {/* 🔥 BOTONES */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={exportPNG}
          className="bg-cyan-500 hover:bg-cyan-400 px-4 py-2 rounded-lg font-semibold transition"
        >
          Export PNG
        </button>

        <button
          onClick={exportJSON}
          className="bg-purple-500 hover:bg-purple-400 px-4 py-2 rounded-lg font-semibold transition"
        >
          Save JSON
        </button>
      </div>
    </div>
  )
}
