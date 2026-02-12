import { Stage, Layer, Rect } from "react-konva";
import { useRef, useEffect, useState, useCallback } from "react";
import Konva from "konva";
import type { UIElement, EditorState } from "../../types/types";
import UIElementRenderer from "./UIElements";

interface Props {
  elements: UIElement[];
  setElements: (elements: UIElement[] | ((prev: UIElement[]) => UIElement[])) => void;
  selectedIds: string[];
  setSelectedIds: (ids: string[] | ((prev: string[]) => string[])) => void;
  state: EditorState;
  setState: React.Dispatch<React.SetStateAction<EditorState>>;
  onHistorySave: (description: string) => void;
}

export default function EditorCanvas({
  elements,
  setElements,
  selectedIds,
  setSelectedIds,
  state,
  setState,
  onHistorySave,
}: Props) {
  const stageRef = useRef<any>(null);
  const [selectionRect, setSelectionRect] = useState({ x: 0, y: 0, width: 0, height: 0, visible: false });
  const [colorValue, setColorValue] = useState("#00a0e9");

  const { gridEnabled, snapToGrid, gridSize = 20, zoom = 1 } = state;

  const updateState = useCallback((partialState: Partial<EditorState>) => {
    setState(prev => ({ ...prev, ...partialState }));
  }, []);

  // Dibujar grid
  const drawGrid = useCallback(() => {
    if (!gridEnabled || !stageRef.current) return null;
    const stage = stageRef.current;
    const width = stage.width() / zoom;
    const height = stage.height() / zoom;
    const gridElements = [];

    for (let i = 0; i <= width / gridSize; i++) {
      gridElements.push(<Rect key={`v-${i}`} x={i*gridSize} y={0} width={1} height={height} fill="#2a2a3a" listening={false} />);
    }
    for (let i = 0; i <= height / gridSize; i++) {
      gridElements.push(<Rect key={`h-${i}`} x={0} y={i*gridSize} width={width} height={1} fill="#2a2a3a" listening={false} />);
    }
    return gridElements;
  }, [gridEnabled, gridSize, zoom]);

  // Selección de elementos con rectángulo
  const handleStageMouseDown = (e: any) => {
    if (e.target === stageRef.current) {
      setSelectedIds([]);
      const pos = stageRef.current.getPointerPosition();
      setSelectionRect({ x: pos.x / zoom, y: pos.y / zoom, width: 0, height: 0, visible: true });
    }
  };

  const handleMouseMove = (e: any) => {
    if (!selectionRect.visible) return;
    const pos = stageRef.current.getPointerPosition();
    setSelectionRect(prev => ({ ...prev, width: pos.x / zoom - prev.x, height: pos.y / zoom - prev.y }));
  };

  const handleMouseUp = () => {
    if (!selectionRect.visible) return;

    const rect = {
      x: selectionRect.width < 0 ? selectionRect.x + selectionRect.width : selectionRect.x,
      y: selectionRect.height < 0 ? selectionRect.y + selectionRect.height : selectionRect.y,
      width: Math.abs(selectionRect.width),
      height: Math.abs(selectionRect.height),
    };

    const selectedNodes: string[] = [];
    elements.forEach(el => {
      const nodeRect = { x: el.x, y: el.y, width: el.width, height: el.height };
      if (Konva.Util.haveIntersection(rect, nodeRect)) selectedNodes.push(el.id);
    });
    if (selectedNodes.length > 0) setSelectedIds(selectedNodes);
    setSelectionRect({ x: 0, y: 0, width: 0, height: 0, visible: false });
  };

  // Actualizar propiedades de un elemento
  const handleElementChange = (id: string, newProps: Partial<UIElement>) => {
    setElements(prev => prev.map(el => el.id === id ? { ...el, ...newProps } : el));
  };

  // Cambiar color de elementos seleccionados
  const handleColorChange = (color: string) => {
    setColorValue(color);
    setElements(prev => prev.map(el => selectedIds.includes(el.id) ? { ...el, fill: color } : el));
  };

  // Accesos rápidos: delete y duplicar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if ((e.key === "Delete" || e.key === "Backspace") && selectedIds.length > 0) {
        setElements(prev => prev.filter(el => !selectedIds.includes(el.id)));
        setSelectedIds([]);
        onHistorySave('Eliminar elementos');
      }

      if (e.key.toLowerCase() === "d" && e.ctrlKey) {
        e.preventDefault();
        const duplicated = elements
          .filter(el => selectedIds.includes(el.id))
          .map((el, i) => ({ ...el, id: `${el.id}-copy-${Date.now()}-${i}`, x: el.x + 20, y: el.y + 20, layer: el.layer + 1 }));
        if (duplicated.length > 0) setElements(prev => [...prev, ...duplicated]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIds, elements, onHistorySave]);

  // Funciones para capas
  const bringForward = () => {
    setElements(prev => {
      const maxLayer = Math.max(...prev.map(e => e.layer));
      return prev.map(el => selectedIds.includes(el.id) ? { ...el, layer: Math.min(el.layer + 1, maxLayer) } : el);
    });
    onHistorySave("Traer adelante");
  };

  const sendBackward = () => {
    setElements(prev => {
      const minLayer = Math.min(...prev.map(e => e.layer));
      return prev.map(el => selectedIds.includes(el.id) ? { ...el, layer: Math.max(el.layer - 1, minLayer) } : el);
    });
    onHistorySave("Enviar atrás");
  };

  const bringToFront = () => {
    setElements(prev => {
      const maxLayer = Math.max(...prev.map(e => e.layer));
      return prev.map(el => selectedIds.includes(el.id) ? { ...el, layer: maxLayer + 1 } : el);
    });
    onHistorySave("Traer al frente");
  };

  const sendToBack = () => {
    setElements(prev => {
      const minLayer = Math.min(...prev.map(e => e.layer));
      return prev.map(el => selectedIds.includes(el.id) ? { ...el, layer: minLayer - 1 } : el);
    });
    onHistorySave("Enviar al fondo");
  };

  // Exportar canvas
  const exportCanvas = (format: 'png' | 'jpg') => {
    if (!stageRef.current) return;
    const uri = stageRef.current.toDataURL({ pixelRatio: 2, mimeType: format === 'png' ? 'image/png' : 'image/jpeg', quality: 0.9 });
    const link = document.createElement('a');
    link.download = `ui-design-${Date.now()}.${format}`;
    link.href = uri;
    link.click();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 bg-[#0a0a12] relative">

      {/* Barra de propiedades */}
      <div className="absolute top-4 right-4 z-10 flex gap-2 bg-[#1a1a24] p-2 rounded-lg shadow-lg items-center">
        <button className="bg-cyan-500 hover:bg-cyan-400 px-3 py-1 rounded text-sm font-semibold" onClick={() => updateState({ zoom: Math.min(2, zoom + 0.1) })}>+</button>
        <span className="px-3 py-1 text-white text-sm min-w-[60px] text-center">{Math.round(zoom * 100)}%</span>
        <button className="bg-cyan-500 hover:bg-cyan-400 px-3 py-1 rounded text-sm font-semibold" onClick={() => updateState({ zoom: Math.max(0.5, zoom - 0.1) })}>-</button>
        <button className="bg-gray-600 hover:bg-gray-500 px-3 py-1 rounded text-sm font-semibold ml-2" onClick={() => updateState({ zoom: 1 })}>100%</button>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 ml-4">
            <input type="color" value={colorValue} onChange={(e) => handleColorChange(e.target.value)} className="w-10 h-10 cursor-pointer rounded border border-gray-600" />
            <span className="text-white text-sm">Color</span>
          </div>
        )}

        <button onClick={() => exportCanvas('png')} className="bg-purple-500 hover:bg-purple-400 px-3 py-1 rounded text-sm font-semibold ml-4">PNG</button>
        <button onClick={() => exportCanvas('jpg')} className="bg-green-500 hover:bg-green-400 px-3 py-1 rounded text-sm font-semibold">JPG</button>
      </div>

      {/* Stage */}
      <Stage
        width={1200}
        height={700}
        ref={stageRef}
        scaleX={zoom}
        scaleY={zoom}
        className="bg-[#161625] rounded-xl shadow-2xl border border-white/5"
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {drawGrid()}

          {elements
            .slice()
            .sort((a, b) => a.layer - b.layer)
            .map(el => (
              <UIElementRenderer
                key={el.id}
                element={el}
                isSelected={selectedIds.includes(el.id)}
                onSelect={(e, id) => {
                  e.cancelBubble = true;
                  setSelectedIds(prev => e.evt.shiftKey
                    ? prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
                    : [id]
                  );
                }}
                onChange={newProps => handleElementChange(el.id, newProps)}
                stageScale={zoom}
              />
            ))
          }

          {selectionRect.visible && (
            <Rect
              x={selectionRect.width > 0 ? selectionRect.x : selectionRect.x + selectionRect.width}
              y={selectionRect.height > 0 ? selectionRect.y : selectionRect.y + selectionRect.height}
              width={Math.abs(selectionRect.width)}
              height={Math.abs(selectionRect.height)}
              fill="rgba(0, 160, 233, 0.1)"
              stroke="#00a0e9"
              strokeWidth={2 / zoom}
              dash={[5 / zoom, 5 / zoom]}
              listening={false}
              cornerRadius={4}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}
