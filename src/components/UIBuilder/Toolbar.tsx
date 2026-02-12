import { useState, useEffect } from "react";
import type { UIElementType, UIElement } from "../../types/types";

interface Props {
  addElement: (type: UIElementType) => void;
  selectedElements?: UIElement[];
  updateSelected?: (props: Partial<UIElement>) => void;
  bringForward?: () => void;
  sendBackward?: () => void;
  bringToFront?: () => void;
  sendToBack?: () => void;
  duplicate?: () => void;
  deleteSelected?: () => void;
  groupElements?: () => void;
  ungroupElements?: () => void;
  lockElements?: () => void;
  unlockElements?: () => void;
  alignElements?: (align: 'left' | 'right' | 'center' | 'top' | 'bottom' | 'middle') => void;
  distributeElements?: (distribute: 'horizontal' | 'vertical') => void;
}

export default function Toolbar({
  addElement,
  selectedElements = [],
  updateSelected,
  bringForward,
  sendBackward,
  bringToFront,
  sendToBack,
  duplicate,
  deleteSelected,
  lockElements,
  unlockElements,
  alignElements,
  distributeElements,
}: Props) {
  const [textInput, setTextInput] = useState("");
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fillColor, setFillColor] = useState("#00ffff");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(0);
  const [cornerRadius, setCornerRadius] = useState(8);
  const [opacity, setOpacity] = useState(1);
  const [shadowEnabled, setShadowEnabled] = useState(false);
  const [elementName, setElementName] = useState("");

  useEffect(() => {
    if (selectedElements.length === 1) {
      const el = selectedElements[0];
      setTextInput(el.text || "");
      setFontSize(el.fontSize || 16);
      setFontFamily(el.fontFamily || "Arial");
      setFillColor(el.fill || "#00ffff");
      setStrokeColor(el.stroke || "#000000");
      setStrokeWidth(el.strokeWidth || 0);
      setCornerRadius(el.cornerRadius || 8);
      setOpacity(el.opacity || 1);
      setShadowEnabled(!!el.shadowColor);
      setElementName(el.name || "");
    }
  }, [selectedElements]);

  const handleUpdate = () => {
    if (!updateSelected || selectedElements.length === 0) return;
    
    const props: Partial<UIElement> = {
      text: textInput,
      fontSize,
      fontFamily,
      fill: fillColor,
      stroke: strokeColor,
      strokeWidth,
      cornerRadius,
      opacity,
      name: elementName,
    };

    if (shadowEnabled) {
      props.shadowColor = 'rgba(0,0,0,0.3)';
      props.shadowBlur = 5;
      props.shadowOffsetX = 2;
      props.shadowOffsetY = 2;
    } else {
      props.shadowColor = undefined;
      props.shadowBlur = undefined;
      props.shadowOffsetX = undefined;
      props.shadowOffsetY = undefined;
    }

    updateSelected(props);
  };

  const handleChange = () => handleUpdate();

  const elementTypes = [
    { type: 'button', label: 'Button', color: 'bg-cyan-500', icon: '🔲' },
    { type: 'card', label: 'Card', color: 'bg-purple-500', icon: '📇' },
    { type: 'progressBar', label: 'Progress', color: 'bg-green-500', icon: '📊' },
    { type: 'menu', label: 'Menu', color: 'bg-yellow-500', icon: '☰' },
    { type: 'text', label: 'Text', color: 'bg-gray-500', icon: '📝' },
    { type: 'input', label: 'Input', color: 'bg-blue-500', icon: '📋' },
    { type: 'checkbox', label: 'Checkbox', color: 'bg-indigo-500', icon: '✅' },
    { type: 'image', label: 'Image', color: 'bg-pink-500', icon: '🖼️' },
  ];

  return (
    <div className="w-80 p-4 bg-[#0f0f17] flex flex-col gap-4 border-r border-white/10 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg" />
        <h2 className="text-white font-bold text-lg">UI Builder Pro</h2>
      </div>

      {/* Elementos */}
      <div>
        <h3 className="text-cyan-400 font-semibold text-sm mb-2 flex items-center gap-2">
          <span className="w-1 h-4 bg-cyan-400 rounded-full" />
          Add Elements
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {elementTypes.map(({ type, label, color, icon }) => (
            <button
              key={type}
              onClick={() => addElement(type as UIElementType)}
              className={`${color} hover:brightness-110 py-2 px-3 rounded-lg text-white font-medium flex items-center gap-2 transition-all`}
            >
              <span className="text-lg">{icon}</span>
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Propiedades del elemento seleccionado */}
      {selectedElements.length === 1 && (
        <>
          <hr className="border-white/10" />
          <div>
            {/* Nombre */}
            <div className="mb-3">
              <label className="text-gray-400 text-xs block mb-1">Element Name</label>
              <input
                type="text"
                value={elementName}
                onChange={(e) => setElementName(e.target.value)}
                onBlur={handleChange}
                className="w-full p-2 rounded bg-gray-800 text-white text-sm border border-gray-700 focus:border-cyan-500 outline-none"
                placeholder="My Element"
              />
            </div>

            {/* Texto */}
            {selectedElements[0]?.type !== 'progressBar' && (
              <div className="mb-3">
                <label className="text-gray-400 text-xs block mb-1">Text</label>
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onBlur={handleChange}
                  className="w-full p-2 rounded bg-gray-800 text-white text-sm border border-gray-700"
                  placeholder="Enter text..."
                />
              </div>
            )}

            {/* Tipografía */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="text-gray-400 text-xs block mb-1">Font Size</label>
                <input
                  type="number"
                  value={fontSize}
                  min={8}
                  max={120}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  onBlur={handleChange}
                  className="w-full p-2 rounded bg-gray-800 text-white text-sm border border-gray-700"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs block mb-1">Font Family</label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  onBlur={handleChange}
                  className="w-full p-2 rounded bg-gray-800 text-white text-sm border border-gray-700"
                >
                  <option value="Arial">Arial</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Times New Roman">Times</option>
                  <option value="Courier">Courier</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Georgia">Georgia</option>
                </select>
              </div>
            </div>

            {/* Colores */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="flex flex-col">
                <label className="text-gray-400 text-xs block mb-1">Fill Color</label>
                <input
                  type="color"
                  value={fillColor}
                  onChange={(e) => { setFillColor(e.target.value); setTimeout(handleChange, 10); }}
                  className="w-full h-8 rounded border border-gray-700 cursor-pointer"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-400 text-xs block mb-1">Stroke</label>
                <input
                  type="color"
                  value={strokeColor}
                  onChange={(e) => { setStrokeColor(e.target.value); setTimeout(handleChange, 10); }}
                  className="w-full h-8 rounded border border-gray-700 cursor-pointer"
                />
                <input
                  type="number"
                  value={strokeWidth}
                  min={0}
                  max={20}
                  onChange={(e) => setStrokeWidth(Number(e.target.value))}
                  onBlur={handleChange}
                  className="w-full p-2 rounded bg-gray-800 text-white text-sm border border-gray-700 mt-1"
                />
              </div>
            </div>

            {/* Estilos */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="text-gray-400 text-xs block mb-1">Corner Radius</label>
                <input
                  type="number"
                  value={cornerRadius}
                  min={0}
                  max={50}
                  onChange={(e) => setCornerRadius(Number(e.target.value))}
                  onBlur={handleChange}
                  className="w-full p-2 rounded bg-gray-800 text-white text-sm border border-gray-700"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs block mb-1">Opacity</label>
                <input
                  type="range"
                  value={opacity}
                  min={0}
                  max={1}
                  step={0.05}
                  onChange={(e) => { setOpacity(Number(e.target.value)); setTimeout(handleChange, 10); }}
                  className="w-full"
                />
              </div>
            </div>

            {/* Sombra */}
            <div className="mb-3">
              <label className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                <input
                  type="checkbox"
                  checked={shadowEnabled}
                  onChange={(e) => { setShadowEnabled(e.target.checked); setTimeout(handleChange, 10); }}
                  className="cursor-pointer"
                />
                Drop Shadow
              </label>
            </div>

            {/* Capas */}
            <div className="mb-3">
              <h3 className="text-cyan-400 font-semibold text-sm mb-2">Layers</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={bringForward}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-sm"
                >↑ Forward</button>
                <button
                  onClick={sendBackward}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-sm"
                >↓ Back</button>
                <button
                  onClick={bringToFront}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-sm"
                >⇧ Front</button>
                <button
                  onClick={sendToBack}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-sm"
                >⇩ Back</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
