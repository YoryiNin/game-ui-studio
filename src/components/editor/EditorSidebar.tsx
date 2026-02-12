import type { EditorElement, ShapeType } from "../../types/editor"

interface Props {
  addShape: (type: ShapeType) => void
  selected?: EditorElement
  updateElement: (id: string, updates: Partial<EditorElement>) => void
  deleteElement: (id: string) => void
}

export default function EditorSidebar({
  addShape,
  selected,
  updateElement,
  deleteElement,
}: Props) {

  return (
    <div className="w-80 p-6 bg-[#11111f] border-r border-white/10 space-y-6">

      <h2 className="text-xl font-bold text-cyan-400">
        Editor Tools
      </h2>

      <div className="space-y-2">
        <button onClick={() => addShape("circle")} className="w-full bg-cyan-500 py-2 rounded">
          Add Circle
        </button>
        <button onClick={() => addShape("rect")} className="w-full bg-purple-500 py-2 rounded">
          Add Rectangle
        </button>
        <button onClick={() => addShape("triangle")} className="w-full bg-pink-500 py-2 rounded">
          Add Triangle
        </button>
      </div>

      {selected && (
        <div className="space-y-4 border-t border-white/10 pt-4">

          <input
            type="color"
            value={selected.fill}
            onChange={(e) =>
              updateElement(selected.id, { fill: e.target.value })
            }
            className="w-full h-10"
          />

          <button
            onClick={() => deleteElement(selected.id)}
            className="w-full bg-red-500 py-2 rounded"
          >
            Delete
          </button>

        </div>
      )}

    </div>
  )
}
