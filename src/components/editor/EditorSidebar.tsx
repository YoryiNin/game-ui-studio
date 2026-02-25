import { useState } from "react";
import type { EditorElement, ShapeType } from "../../types/EditorElement";
import { 
  FiCircle, 
  FiSquare, 
  FiTriangle, 
  FiStar, 
  FiHexagon, 
  FiType,
  FiCopy,
  FiTrash2,
  FiChevronDown,
  FiChevronRight
} from "react-icons/fi";

interface Props {
  addShape: (type: ShapeType) => void;
  selected?: EditorElement;
  updateElement: (id: string, updates: Partial<EditorElement>) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
}

export default function EditorSidebar({
  addShape,
  selected,
  updateElement,
  deleteElement,
  duplicateElement,
}: Props) {
  const [shapesExpanded, setShapesExpanded] = useState(true);
  const [presetsExpanded, setPresetsExpanded] = useState(true);

  const shapeButtons: { type: ShapeType; icon: any; label: string; color: string }[] = [
    { type: "circle", icon: FiCircle, label: "Circle", color: "from-cyan-500 to-blue-500" },
    { type: "rect", icon: FiSquare, label: "Rectangle", color: "from-purple-500 to-pink-500" },
    { type: "triangle", icon: FiTriangle, label: "Triangle", color: "from-yellow-500 to-orange-500" },
    { type: "star", icon: FiStar, label: "Star", color: "from-green-500 to-emerald-500" },
    { type: "polygon", icon: FiHexagon, label: "Polygon", color: "from-red-500 to-rose-500" },
    { type: "text", icon: FiType, label: "Text", color: "from-white to-gray-300 text-black" },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
        Pro Icon Designer
      </h2>

      {/* Shapes Section */}
      <div className="space-y-3">
        <button
          onClick={() => setShapesExpanded(!shapesExpanded)}
          className="flex items-center space-x-2 text-white/70 hover:text-white"
        >
          {shapesExpanded ? <FiChevronDown /> : <FiChevronRight />}
          <span className="text-sm font-medium">SHAPES</span>
        </button>

        {shapesExpanded && (
          <div className="grid grid-cols-2 gap-2">
            {shapeButtons.map(({ type, icon: Icon, label, color }) => (
              <button
                key={type}
                onClick={() => addShape(type)}
                className={`p-3 rounded-lg bg-gradient-to-br ${color} bg-opacity-20 hover:scale-105 transition transform flex flex-col items-center space-y-1 ${
                  type === 'text' ? 'bg-white text-black' : 'text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Element Controls */}
      {selected && (
        <div className="space-y-4 border-t border-white/10 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-cyan-400">SELECTED</h3>
            <div className="flex space-x-1">
              <button
                onClick={() => duplicateElement(selected.id)}
                className="p-1 hover:bg-white/10 rounded"
                title="Duplicate"
              >
                <FiCopy className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteElement(selected.id)}
                className="p-1 hover:bg-white/10 rounded text-red-400"
                title="Delete"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <input
            type="text"
            value={selected.name || ''}
            onChange={(e) => updateElement(selected.id, { name: e.target.value })}
            placeholder="Layer name"
            className="w-full bg-[#1c1c2e] rounded px-3 py-2 text-sm"
          />

          {/* Quick color presets */}
          <div className="space-y-2">
            <label className="text-xs text-white/50">Quick Colors</label>
            <div className="flex space-x-2">
              {['#06b6d4', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'].map(color => (
                <button
                  key={color}
                  onClick={() => updateElement(selected.id, { fill: color })}
                  className="w-6 h-6 rounded-full hover:scale-110 transition transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Preset Logos */}
      <div className="space-y-3 border-t border-white/10 pt-4">
        <button
          onClick={() => setPresetsExpanded(!presetsExpanded)}
          className="flex items-center space-x-2 text-white/70 hover:text-white"
        >
          {presetsExpanded ? <FiChevronDown /> : <FiChevronRight />}
          <span className="text-sm font-medium">QUICK PRESETS</span>
        </button>

        {presetsExpanded && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-lg text-center font-bold text-sm">
              TECH
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-lg text-center font-bold text-sm">
              CREATIVE
            </div>
            <div className="bg-black p-3 rounded-lg text-center font-bold text-sm border border-white/20">
              MINIMAL
            </div>
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-lg text-center font-bold text-sm text-black">
              GAMING
            </div>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="border-t border-white/10 pt-4">
        <div className="bg-cyan-500/10 p-3 rounded-lg text-xs space-y-2">
          <p className="font-semibold text-cyan-400">✨ Pro Tips</p>
          <p className="text-white/70">• Double-click text to edit</p>
          <p className="text-white/70">• Hold Shift to maintain proportions</p>
          <p className="text-white/70">• Use arrow keys for fine adjustment</p>
          <p className="text-white/70">• Export in multiple formats for web & apps</p>
        </div>
      </div>
    </div>
  );
}