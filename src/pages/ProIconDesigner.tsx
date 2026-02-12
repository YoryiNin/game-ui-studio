import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import EditorCanvas from "../components/editor/EditorCanvas"
import EditorSidebar from "../components/editor/EditorSidebar"
import type { EditorElement, ShapeType } from "../types/editor"
import Navbar from "../components/Navbar";

export default function ProIconDesigner() {
  const [elements, setElements] = useState<EditorElement[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const addShape = (type: ShapeType) => {
    const newElement: EditorElement = {
      id: uuidv4(),
      type,
      x: 200,
      y: 200,
      size: 100,
      rotation: 0,
      fill: "#00ffff",
    }

    setElements([...elements, newElement])
  }

  const updateElement = (id: string, updates: Partial<EditorElement>) => {
    setElements(elements.map(el =>
      el.id === id ? { ...el, ...updates } : el
    ))
  }

  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id))
    setSelectedId(null)
  }

  return (
    <div className="flex flex-col h-screen bg-[#0f0f1a] text-white">
      
      {/* 🔹 Navbar arriba */}
      <Navbar />

      {/* 🔹 Contenido principal: Sidebar + Canvas */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar a la izquierda */}
        <div className="w-80 flex-shrink-0 overflow-y-auto">
          <EditorSidebar
            addShape={addShape}
            selected={elements.find(el => el.id === selectedId)}
            updateElement={updateElement}
            deleteElement={deleteElement}
          />
        </div>

        {/* Canvas ocupa el resto */}
        <div className="flex-1 relative overflow-auto">
          <EditorCanvas
            elements={elements}
            setElements={setElements}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        </div>
      </div>
    </div>
  )
}
