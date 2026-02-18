import { useState } from "react";
import type { EditorElement, GradientStop } from "../../types/editor";
import { 
  FiType, 
  FiCircle, 
  FiSquare, 
  FiSliders,
  FiDroplet,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiBold,
  FiItalic,
  FiUnderline,
  FiLayers,
  FiArrowUp,
  FiArrowDown,
  FiRotateCw,
  FiChevronDown
} from "react-icons/fi";

interface Props {
  element: EditorElement;
  updateElement: (id: string, updates: Partial<EditorElement>) => void;
}

export default function PropertiesPanel({ element, updateElement }: Props) {
  const [activeTab, setActiveTab] = useState<"appearance" | "text" | "effects" | "transform">("appearance");

  const fontFamilies = [
    "Arial", "Helvetica", "Times New Roman", "Courier New", 
    "Verdana", "Georgia", "Palatino", "Garamond", 
    "Montserrat", "Roboto", "Open Sans", "Lato",
    "Poppins", "Oswald", "Raleway", "Ubuntu"
  ];

  const fontWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900];

  const addGradientStop = () => {
    const stops = element.gradientStops || [
      { offset: 0, color: "#ff0000" },
      { offset: 1, color: "#0000ff" }
    ];
    
    if (stops.length < 5) {
      const newStop = {
        offset: stops.length / (stops.length + 1),
        color: "#ffffff"
      };
      updateElement(element.id, { 
        gradientStops: [...stops, newStop].sort((a, b) => a.offset - b.offset)
      });
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Element Info */}
      <div className="flex items-center space-x-3 pb-3 border-b border-white/10">
        <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
          {element.type === "text" ? <FiType /> : 
           element.type === "circle" ? <FiCircle /> : 
           element.type === "rect" ? <FiSquare /> : <FiLayers />}
        </div>
        <div>
          <h3 className="font-semibold">{element.name || element.type}</h3>
          <p className="text-xs text-white/50">ID: {element.id.slice(0, 8)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("appearance")}
          className={`flex-1 px-3 py-2 text-sm rounded-md transition ${
            activeTab === "appearance" ? "bg-cyan-500 text-white" : "hover:bg-white/10"
          }`}
        >
          Appearance
        </button>
        {element.type === "text" && (
          <button
            onClick={() => setActiveTab("text")}
            className={`flex-1 px-3 py-2 text-sm rounded-md transition ${
              activeTab === "text" ? "bg-cyan-500 text-white" : "hover:bg-white/10"
            }`}
          >
            Text
          </button>
        )}
        <button
          onClick={() => setActiveTab("effects")}
          className={`flex-1 px-3 py-2 text-sm rounded-md transition ${
            activeTab === "effects" ? "bg-cyan-500 text-white" : "hover:bg-white/10"
          }`}
        >
          Effects
        </button>
        <button
          onClick={() => setActiveTab("transform")}
          className={`flex-1 px-3 py-2 text-sm rounded-md transition ${
            activeTab === "transform" ? "bg-cyan-500 text-white" : "hover:bg-white/10"
          }`}
        >
          Transform
        </button>
      </div>

      {/* Appearance Tab */}
      {activeTab === "appearance" && (
        <div className="space-y-4">
          {/* Fill Color */}
          <div className="space-y-2">
            <label className="text-xs text-white/50 block">Fill Color</label>
            <div className="flex space-x-2">
              <input
                type="color"
                value={element.fill}
                onChange={(e) => updateElement(element.id, { fill: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={element.fill}
                onChange={(e) => updateElement(element.id, { fill: e.target.value })}
                className="flex-1 bg-[#1c1c2e] rounded px-3 text-sm"
                placeholder="#RRGGBB"
              />
            </div>
          </div>

          {/* Opacity */}
          <div className="space-y-2">
            <label className="text-xs text-white/50 block">Opacity: {Math.round((element.opacity || 1) * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={element.opacity || 1}
              onChange={(e) => updateElement(element.id, { opacity: parseFloat(e.target.value) })}
              className="w-full"
            />
          </div>

          {/* Stroke */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-white/50">Stroke</label>
              <input
                type="checkbox"
                checked={element.strokeEnabled}
                onChange={(e) => updateElement(element.id, { strokeEnabled: e.target.checked })}
                className="rounded bg-[#1c1c2e]"
              />
            </div>
            {element.strokeEnabled && (
              <>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={element.stroke || "#000000"}
                    onChange={(e) => updateElement(element.id, { stroke: e.target.value })}
                    className="w-8 h-8 rounded"
                  />
                  <input
                    type="number"
                    value={element.strokeWidth || 1}
                    onChange={(e) => updateElement(element.id, { strokeWidth: parseInt(e.target.value) })}
                    className="flex-1 bg-[#1c1c2e] rounded px-3 text-sm"
                    placeholder="Width"
                    min="0"
                    max="50"
                  />
                </div>
              </>
            )}
          </div>

          {/* Shape-specific properties */}
          {element.type === "rect" && (
            <div className="space-y-2">
              <label className="text-xs text-white/50 block">Corner Radius</label>
              <input
                type="number"
                value={element.cornerRadius || 0}
                onChange={(e) => updateElement(element.id, { cornerRadius: parseInt(e.target.value) })}
                className="w-full bg-[#1c1c2e] rounded px-3 py-2 text-sm"
                min="0"
                max="100"
              />
            </div>
          )}

          {(element.type === "star" || element.type === "polygon") && (
            <>
              <div className="space-y-2">
                <label className="text-xs text-white/50 block">Number of Points</label>
                <input
                  type="number"
                  value={element.numPoints || 5}
                  onChange={(e) => updateElement(element.id, { numPoints: parseInt(e.target.value) })}
                  className="w-full bg-[#1c1c2e] rounded px-3 py-2 text-sm"
                  min="3"
                  max="20"
                />
              </div>
              {element.type === "star" && (
                <div className="space-y-2">
                  <label className="text-xs text-white/50 block">Inner Radius</label>
                  <input
                    type="number"
                    value={element.innerRadius || 50}
                    onChange={(e) => updateElement(element.id, { innerRadius: parseInt(e.target.value) })}
                    className="w-full bg-[#1c1c2e] rounded px-3 py-2 text-sm"
                    min="10"
                    max={element.size}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Text Tab */}
      {activeTab === "text" && element.type === "text" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-white/50 block">Text Content</label>
            <textarea
              value={element.text}
              onChange={(e) => updateElement(element.id, { text: e.target.value })}
              className="w-full bg-[#1c1c2e] rounded px-3 py-2 text-sm"
              rows={3}
              placeholder="Enter text..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-white/50 block">Font Family</label>
            <select
              value={element.fontFamily}
              onChange={(e) => updateElement(element.id, { fontFamily: e.target.value })}
              className="w-full bg-[#1c1c2e] rounded px-3 py-2 text-sm"
            >
              {fontFamilies.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs text-white/50 block">Font Size</label>
              <input
                type="number"
                value={element.fontSize}
                onChange={(e) => updateElement(element.id, { fontSize: parseInt(e.target.value) })}
                className="w-full bg-[#1c1c2e] rounded px-3 py-2 text-sm"
                min="8"
                max="300"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-white/50 block">Font Weight</label>
              <select
                value={element.fontWeight}
                onChange={(e) => updateElement(element.id, { fontWeight: e.target.value })}
                className="w-full bg-[#1c1c2e] rounded px-3 py-2 text-sm"
              >
                {fontWeights.map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => updateElement(element.id, { fontStyle: element.fontStyle === "italic" ? "normal" : "italic" })}
              className={`flex-1 p-2 rounded ${element.fontStyle === "italic" ? 'bg-cyan-500' : 'bg-[#1c1c2e]'}`}
            >
              <FiItalic className="mx-auto" />
            </button>
            <button
              onClick={() => updateElement(element.id, { textDecoration: element.textDecoration === "underline" ? "none" : "underline" })}
              className={`flex-1 p-2 rounded ${element.textDecoration === "underline" ? 'bg-cyan-500' : 'bg-[#1c1c2e]'}`}
            >
              <FiUnderline className="mx-auto" />
            </button>
            <button
              onClick={() => updateElement(element.id, { uppercase: !element.uppercase })}
              className={`flex-1 p-2 rounded ${element.uppercase ? 'bg-cyan-500' : 'bg-[#1c1c2e]'}`}
            >
              <span className="text-xs font-bold">Aa</span>
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-white/50 block">Alignment</label>
            <div className="flex space-x-2">
              <button
                onClick={() => updateElement(element.id, { align: "left" })}
                className={`flex-1 p-2 rounded ${element.align === "left" ? 'bg-cyan-500' : 'bg-[#1c1c2e]'}`}
              >
                <FiAlignLeft className="mx-auto" />
              </button>
              <button
                onClick={() => updateElement(element.id, { align: "center" })}
                className={`flex-1 p-2 rounded ${element.align === "center" ? 'bg-cyan-500' : 'bg-[#1c1c2e]'}`}
              >
                <FiAlignCenter className="mx-auto" />
              </button>
              <button
                onClick={() => updateElement(element.id, { align: "right" })}
                className={`flex-1 p-2 rounded ${element.align === "right" ? 'bg-cyan-500' : 'bg-[#1c1c2e]'}`}
              >
                <FiAlignRight className="mx-auto" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs text-white/50 block">Letter Spacing</label>
              <input
                type="number"
                value={element.letterSpacing || 0}
                onChange={(e) => updateElement(element.id, { letterSpacing: parseInt(e.target.value) })}
                className="w-full bg-[#1c1c2e] rounded px-3 py-2 text-sm"
                min="-10"
                max="50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs text-white/50 block">Line Height</label>
              <input
                type="number"
                value={element.lineHeight || 1}
                onChange={(e) => updateElement(element.id, { lineHeight: parseFloat(e.target.value) })}
                className="w-full bg-[#1c1c2e] rounded px-3 py-2 text-sm"
                min="0.5"
                max="3"
                step="0.1"
              />
            </div>
          </div>
        </div>
      )}

      {/* Effects Tab */}
      {activeTab === "effects" && (
        <div className="space-y-4">
          {/* Shadow */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-white/50">Drop Shadow</label>
              <input
                type="checkbox"
                checked={element.shadowEnabled}
                onChange={(e) => updateElement(element.id, { shadowEnabled: e.target.checked })}
                className="rounded bg-[#1c1c2e]"
              />
            </div>
            {element.shadowEnabled && (
              <>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={element.shadowColor || "#000000"}
                    onChange={(e) => updateElement(element.id, { shadowColor: e.target.value })}
                    className="w-8 h-8 rounded"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={element.shadowOpacity || 0.5}
                    onChange={(e) => updateElement(element.id, { shadowOpacity: parseFloat(e.target.value) })}
                    className="flex-1"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    value={element.shadowBlur || 0}
                    onChange={(e) => updateElement(element.id, { shadowBlur: parseInt(e.target.value) })}
                    className="bg-[#1c1c2e] rounded px-2 py-1 text-xs"
                    placeholder="Blur"
                  />
                  <input
                    type="number"
                    value={element.shadowOffsetX || 0}
                    onChange={(e) => updateElement(element.id, { shadowOffsetX: parseInt(e.target.value) })}
                    className="bg-[#1c1c2e] rounded px-2 py-1 text-xs"
                    placeholder="X"
                  />
                  <input
                    type="number"
                    value={element.shadowOffsetY || 0}
                    onChange={(e) => updateElement(element.id, { shadowOffsetY: parseInt(e.target.value) })}
                    className="bg-[#1c1c2e] rounded px-2 py-1 text-xs"
                    placeholder="Y"
                  />
                </div>
              </>
            )}
          </div>

          {/* Blur */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-white/50">Gaussian Blur</label>
              <input
                type="checkbox"
                checked={element.blurEnabled}
                onChange={(e) => updateElement(element.id, { blurEnabled: e.target.checked })}
                className="rounded bg-[#1c1c2e]"
              />
            </div>
            {element.blurEnabled && (
              <input
                type="range"
                min="0"
                max="20"
                value={element.blurRadius || 0}
                onChange={(e) => updateElement(element.id, { blurRadius: parseInt(e.target.value) })}
                className="w-full"
              />
            )}
          </div>
        </div>
      )}

      {/* Transform Tab */}
      {activeTab === "transform" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs text-white/50 block">X Position</label>
              <input
                type="number"
                value={Math.round(element.x)}
                onChange={(e) => updateElement(element.id, { x: parseInt(e.target.value) })}
                className="w-full bg-[#1c1c2e] rounded px-3 py-2 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-white/50 block">Y Position</label>
              <input
                type="number"
                value={Math.round(element.y)}
                onChange={(e) => updateElement(element.id, { y: parseInt(e.target.value) })}
                className="w-full bg-[#1c1c2e] rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs text-white/50 block">Width</label>
              <input
                type="number"
                value={Math.round(element.size)}
                onChange={(e) => updateElement(element.id, { size: parseInt(e.target.value) })}
                className="w-full bg-[#1c1c2e] rounded px-3 py-2 text-sm"
                min="1"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-white/50 block">Rotation</label>
              <input
                type="number"
                value={element.rotation}
                onChange={(e) => updateElement(element.id, { rotation: parseInt(e.target.value) })}
                className="w-full bg-[#1c1c2e] rounded px-3 py-2 text-sm"
                min="0"
                max="360"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs text-white/50 block">Scale X</label>
              <input
                type="number"
                value={element.scaleX || 1}
                onChange={(e) => updateElement(element.id, { scaleX: parseFloat(e.target.value) })}
                className="w-full bg-[#1c1c2e] rounded px-3 py-2 text-sm"
                min="0.1"
                max="3"
                step="0.1"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-white/50 block">Scale Y</label>
              <input
                type="number"
                value={element.scaleY || 1}
                onChange={(e) => updateElement(element.id, { scaleY: parseFloat(e.target.value) })}
                className="w-full bg-[#1c1c2e] rounded px-3 py-2 text-sm"
                min="0.1"
                max="3"
                step="0.1"
              />
            </div>
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              onClick={() => updateElement(element.id, { rotation: (element.rotation + 90) % 360 })}
              className="flex-1 p-2 bg-[#1c1c2e] rounded text-sm hover:bg-[#2c2c3e] transition flex items-center justify-center space-x-2"
            >
              <FiRotateCw className="w-4 h-4" />
              <span>Rotate 90°</span>
            </button>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => updateElement(element.id, { scaleX: -1, scaleY: 1 })}
              className="flex-1 p-2 bg-[#1c1c2e] rounded text-sm hover:bg-[#2c2c3e] transition"
            >
              Flip H
            </button>
            <button
              onClick={() => updateElement(element.id, { scaleX: 1, scaleY: -1 })}
              className="flex-1 p-2 bg-[#1c1c2e] rounded text-sm hover:bg-[#2c2c3e] transition"
            >
              Flip V
            </button>
          </div>
        </div>
      )}
    </div>
  );
}