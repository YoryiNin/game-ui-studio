import { useState, useCallback, useMemo, useEffect } from "react";
import Toolbar from "../components/UIBuilder/Toolbar";
import EditorCanvas from "../components/UIBuilder/EditorCanvas";
import type { UIElement, UIElementType, EditorState } from "../types/types";
import Navbar from "../components/Navbar";


const initialElements: UIElement[] = [
  {
    id: "welcome-text",
    type: "text",
    name: "Welcome Message",
    x: 100,
    y: 100,
    width: 300,
    height: 50,
    rotation: 0,
    fill: "#ffffff",
    text: "Bienvenido al UI Builder",
    layer: 0,
    fontSize: 24,
    fontFamily: "Arial",
    fontWeight: "bold",
    visible: true,
    locked: false,
  },
  {
    id: "get-started-btn",
    type: "button",
    name: "Get Started Button",
    x: 100,
    y: 180,
    width: 150,
    height: 50,
    rotation: 0,
    fill: "#00ffff",
    stroke: "#0088cc",
    strokeWidth: 2,
    text: "Comenzar",
    layer: 1,
    fontSize: 16,
    fontFamily: "Arial",
    fontWeight: "bold",
    cornerRadius: 8,
    visible: true,
    locked: false,
  },
  {
    id: "example-card",
    type: "card",
    name: "Example Card",
    x: 400,
    y: 100,
    width: 250,
    height: 180,
    rotation: 0,
    fill: "#9333ea",
    stroke: "#6b21a8",
    strokeWidth: 2,
    text: "Tarjeta de Ejemplo",
    layer: 2,
    fontSize: 18,
    fontFamily: "Arial",
    cornerRadius: 12,
    visible: true,
    locked: false,
  },
  {
    id: "example-progress",
    type: "progressBar",
    name: "Progress Bar",
    x: 100,
    y: 280,
    width: 200,
    height: 30,
    rotation: 0,
    fill: "#22c55e",
    stroke: "#15803d",
    strokeWidth: 1,
    text: "Cargando...",
    layer: 3,
    fontSize: 14,
    fontFamily: "Arial",
    cornerRadius: 15,
    visible: true,
    locked: false,
  },
  {
    id: "example-menu",
    type: "menu",
    name: "Menu",
    x: 700,
    y: 100,
    width: 200,
    height: 150,
    rotation: 0,
    fill: "#eab308",
    stroke: "#a16207",
    strokeWidth: 1,
    text: "Menú Principal",
    layer: 4,
    fontSize: 16,
    fontFamily: "Arial",
    fontWeight: "bold",
    cornerRadius: 8,
    visible: true,
    locked: false,
  },
  {
    id: "example-input",
    type: "input",
    name: "Input Field",
    x: 700,
    y: 280,
    width: 200,
    height: 40,
    rotation: 0,
    fill: "#ffffff",
    stroke: "#666666",
    strokeWidth: 1,
    text: "Escribe aquí...",
    layer: 5,
    fontSize: 14,
    fontFamily: "Arial",
    cornerRadius: 4,
    visible: true,
    locked: false,
  },
  {
    id: "example-checkbox",
    type: "checkbox",
    name: "Checkbox",
    x: 700,
    y: 350,
    width: 24,
    height: 24,
    rotation: 0,
    fill: "#ffffff",
    stroke: "#666666",
    strokeWidth: 1,
    text: "Aceptar términos",
    layer: 6,
    fontSize: 14,
    fontFamily: "Arial",
    visible: true,
    locked: false,
  },
];

const initialEditorState: EditorState = {
  elements: initialElements.map(el => ({ ...el })),
  selectedIds: [],
  history: [{
    elements: initialElements.map(el => ({ ...el })),
    timestamp: Date.now(),
    description: 'Estado inicial'
  }],
  historyIndex: 0,
  gridEnabled: true,
  snapToGrid: true,
  gridSize: 20,
  zoom: 1,
  viewportOffset: { x: 0, y: 0 },
};

export default function UIBuilderPage() {
  const [state, setState] = useState<EditorState>(initialEditorState);

  const elements = state.elements;
  const selectedIds = state.selectedIds;

  // 🔹 Función auxiliar para actualizar estado
  const updateState = useCallback((partialState: Partial<EditorState>) => {
    setState(prev => ({
      ...prev,
      ...partialState,
      elements: partialState.elements ?? prev.elements,
      selectedIds: partialState.selectedIds ?? prev.selectedIds,
      history: partialState.history ?? prev.history,
    }));
  }, []);

  // 🔹 Guardar en historial
  const saveToHistory = useCallback((description: string) => {
    setState(prev => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push({
        elements: prev.elements.map(el => ({ ...el })),
        timestamp: Date.now(),
        description,
      });
      return {
        ...prev,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  // 🔹 Undo / Redo
  const undo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex > 0) {
        const newIndex = prev.historyIndex - 1;
        return {
          ...prev,
          elements: prev.history[newIndex].elements.map(el => ({ ...el })),
          historyIndex: newIndex,
          selectedIds: [],
        };
      }
      return prev;
    });
  }, []);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.historyIndex < prev.history.length - 1) {
        const newIndex = prev.historyIndex + 1;
        return {
          ...prev,
          elements: prev.history[newIndex].elements.map(el => ({ ...el })),
          historyIndex: newIndex,
          selectedIds: [],
        };
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    const handleUndo = () => undo();
    const handleRedo = () => redo();
    window.addEventListener('undo', handleUndo);
    window.addEventListener('redo', handleRedo);
    return () => {
      window.removeEventListener('undo', handleUndo);
      window.removeEventListener('redo', handleRedo);
    };
  }, [undo, redo]);

  // 🔹 Añadir elemento
  const addElement = useCallback((type: UIElementType) => {
    const defaultConfig = {
      button: { width: 150, height: 50, fill: "#00ffff", text: "Botón", fontSize: 16 },
      card: { width: 250, height: 180, fill: "#9333ea", text: "Tarjeta", fontSize: 18 },
      progressBar: { width: 200, height: 30, fill: "#22c55e", text: "Progreso", fontSize: 14 },
      menu: { width: 200, height: 150, fill: "#eab308", text: "Menú", fontSize: 16 },
      text: { width: 200, height: 40, fill: "#ffffff", text: "Texto editable", fontSize: 20 },
      input: { width: 200, height: 40, fill: "#ffffff", text: "Campo de texto", fontSize: 14 },
      checkbox: { width: 24, height: 24, fill: "#ffffff", text: "Opción", fontSize: 14 },
      image: { width: 200, height: 200, fill: "#ec4899", text: "Imagen", fontSize: 16 },
    };

    const config = defaultConfig[type] || defaultConfig.button;

    const newEl: UIElement = {
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${elements.length + 1}`,
      x: 150 + (elements.length * 30) % 300,
      y: 150 + (elements.length * 30) % 200,
      width: config.width,
      height: config.height,
      rotation: 0,
      fill: config.fill,
      stroke: type === 'button' || type === 'card' || type === 'progressBar' ? '#0088cc' : undefined,
      strokeWidth: type === 'button' || type === 'card' ? 2 : type === 'progressBar' ? 1 : 0,
      text: config.text,
      layer: elements.length,
      fontSize: config.fontSize,
      fontFamily: "Arial",
      fontWeight: type === 'button' ? 'bold' : 'normal',
      cornerRadius: type === 'button' ? 8 : type === 'card' ? 12 : type === 'progressBar' ? 15 : 4,
      opacity: 1,
      visible: true,
      locked: false,
    };

    setState(prev => ({
      ...prev,
      elements: [...prev.elements, newEl],
      selectedIds: [newEl.id],
    }));

    saveToHistory(`Añadir ${type}`);
  }, [elements.length, saveToHistory]);

  const setElements = useCallback((newElements: UIElement[] | ((prev: UIElement[]) => UIElement[])) => {
    setState(prev => ({
      ...prev,
      elements: typeof newElements === 'function' ? newElements(prev.elements) : newElements,
    }));
  }, []);

  const setSelectedIds = useCallback((ids: string[] | ((prev: string[]) => string[])) => {
    setState(prev => ({
      ...prev,
      selectedIds: typeof ids === 'function' ? ids(prev.selectedIds) : ids,
    }));
  }, []);

  const updateSelected = useCallback((props: Partial<UIElement>) => {
    setState(prev => ({
      ...prev,
      elements: prev.elements.map(el =>
        prev.selectedIds.includes(el.id) ? { ...el, ...props } : el
      ),
    }));
  }, []);

  const duplicateSelected = useCallback(() => {
    const elementsToDuplicate = elements.filter(el => selectedIds.includes(el.id));
    if (elementsToDuplicate.length === 0) return;
    const maxLayer = Math.max(...elements.map(e => e.layer), 0);
    const duplicated = elementsToDuplicate.map((el, index) => ({
      ...el,
      id: `${el.id}-copy-${Date.now()}-${index}`,
      name: `${el.name} Copia`,
      x: el.x + 30,
      y: el.y + 30,
      layer: maxLayer + index + 1,
    }));
    setState(prev => ({
      ...prev,
      elements: [...prev.elements, ...duplicated],
      selectedIds: duplicated.map(el => el.id),
    }));
    saveToHistory(`Duplicar ${elementsToDuplicate.length} elemento(s)`);
  }, [elements, selectedIds, saveToHistory]);

  const deleteSelected = useCallback(() => {
    if (selectedIds.length === 0) return;
    setState(prev => ({
      ...prev,
      elements: prev.elements.filter(el => !prev.selectedIds.includes(el.id)),
      selectedIds: [],
    }));
    saveToHistory(`Eliminar ${selectedIds.length} elemento(s)`);
  }, [selectedIds, saveToHistory]);

  // 🔹 CAPAS: Traer/Atrás/Frente/Fondo
  const bringForward = useCallback(() => {
    setState(prev => {
      const maxLayer = Math.max(...prev.elements.map(el => el.layer), 0);
      return {
        ...prev,
        elements: prev.elements.map(el => 
          prev.selectedIds.includes(el.id) && el.layer < maxLayer
            ? { ...el, layer: el.layer + 1 }
            : el
        ),
      };
    });
    saveToHistory('Traer adelante');
  }, [saveToHistory]);

  const sendBackward = useCallback(() => {
    setState(prev => {
      const minLayer = Math.min(...prev.elements.map(el => el.layer), 0);
      return {
        ...prev,
        elements: prev.elements.map(el => 
          prev.selectedIds.includes(el.id) && el.layer > minLayer
            ? { ...el, layer: el.layer - 1 }
            : el
        ),
      };
    });
    saveToHistory('Enviar atrás');
  }, [saveToHistory]);

  const bringToFront = useCallback(() => {
    setState(prev => {
      const maxLayer = Math.max(...prev.elements.map(el => el.layer), 0);
      return {
        ...prev,
        elements: prev.elements.map(el => 
          prev.selectedIds.includes(el.id)
            ? { ...el, layer: maxLayer + 1 }
            : el
        ),
      };
    });
    saveToHistory('Traer al frente');
  }, [saveToHistory]);

  const sendToBack = useCallback(() => {
    setState(prev => {
      const minLayer = Math.min(...prev.elements.map(el => el.layer), 0);
      return {
        ...prev,
        elements: prev.elements.map(el => 
          prev.selectedIds.includes(el.id)
            ? { ...el, layer: minLayer - 1 }
            : el
        ),
      };
    });
    saveToHistory('Enviar al fondo');
  }, [saveToHistory]);

  const lockElements = useCallback(() => { updateSelected({ locked: true }); saveToHistory('Bloquear elementos'); }, [updateSelected, saveToHistory]);
  const unlockElements = useCallback(() => { updateSelected({ locked: false }); saveToHistory('Desbloquear elementos'); }, [updateSelected, saveToHistory]);

  // Alinear y distribuir
  const alignElements = useCallback((align: 'left'|'right'|'center'|'top'|'bottom'|'middle') => {
    if (selectedIds.length < 2) return;
    const selected = elements.filter(el => selectedIds.includes(el.id));
    setState(prev => {
      let newElements = [...prev.elements];
      switch (align) {
        case 'left': {
          const minX = Math.min(...selected.map(el => el.x));
          newElements = prev.elements.map(el => prev.selectedIds.includes(el.id) ? { ...el, x: minX } : el); break;
        }
        case 'right': {
          const maxX = Math.max(...selected.map(el => el.x + el.width));
          newElements = prev.elements.map(el => prev.selectedIds.includes(el.id) ? { ...el, x: maxX - el.width } : el); break;
        }
        case 'center': {
          const centerX = (Math.min(...selected.map(el=>el.x)) + Math.max(...selected.map(el=>el.x+el.width))) / 2;
          newElements = prev.elements.map(el => prev.selectedIds.includes(el.id) ? { ...el, x: centerX - el.width/2 } : el); break;
        }
        case 'top': {
          const minY = Math.min(...selected.map(el=>el.y));
          newElements = prev.elements.map(el => prev.selectedIds.includes(el.id) ? { ...el, y: minY } : el); break;
        }
        case 'bottom': {
          const maxY = Math.max(...selected.map(el=>el.y + el.height));
          newElements = prev.elements.map(el => prev.selectedIds.includes(el.id) ? { ...el, y: maxY - el.height } : el); break;
        }
        case 'middle': {
          const centerY = (Math.min(...selected.map(el=>el.y)) + Math.max(...selected.map(el=>el.y+el.height)))/2;
          newElements = prev.elements.map(el => prev.selectedIds.includes(el.id) ? { ...el, y: centerY - el.height/2 } : el); break;
        }
      }
      return { ...prev, elements: newElements };
    });
    saveToHistory(`Alinear ${align}`);
  }, [elements, selectedIds, saveToHistory]);

  const distributeElements = useCallback((distribute: 'horizontal'|'vertical') => {
    if (selectedIds.length < 3) return;
    const selected = elements.filter(el => selectedIds.includes(el.id));
    setState(prev => {
      let newElements = [...prev.elements];
      if (distribute === 'horizontal') {
        const sorted = [...selected].sort((a,b)=>a.x-b.x);
        const start = sorted[0].x;
        const end = sorted[sorted.length-1].x;
        const gap = (end-start)/(sorted.length-1);
        newElements = prev.elements.map(el => {
          if (!prev.selectedIds.includes(el.id)) return el;
          const index = sorted.findIndex(s=>s.id===el.id);
          if(index===0||index===sorted.length-1) return el;
          return { ...el, x: start + gap*index };
        });
      } else {
        const sorted = [...selected].sort((a,b)=>a.y-b.y);
        const start = sorted[0].y;
        const end = sorted[sorted.length-1].y;
        const gap = (end-start)/(sorted.length-1);
        newElements = prev.elements.map(el => {
          if (!prev.selectedIds.includes(el.id)) return el;
          const index = sorted.findIndex(s=>s.id===el.id);
          if(index===0||index===sorted.length-1) return el;
          return { ...el, y: start + gap*index };
        });
      }
      return { ...prev, elements: newElements };
    });
    saveToHistory(`Distribuir ${distribute}`);
  }, [elements, selectedIds, saveToHistory]);

  const selectedElements = useMemo(() => elements.filter(el => selectedIds.includes(el.id)), [elements, selectedIds]);

return (
  <div className="flex flex-col h-screen bg-[#0a0a12]">
    {/* 🔹 Navbar arriba */}
    <Navbar />

    {/* 🔹 Contenido principal: Toolbar + Canvas */}
    <div className="flex flex-1 overflow-hidden">
      {/* Toolbar a la izquierda */}
      <div className="w-80 flex-shrink-0 overflow-y-auto">
        <Toolbar
          addElement={addElement}
          selectedElements={selectedElements}
          updateSelected={updateSelected}
          bringForward={bringForward}
          sendBackward={sendBackward}
          bringToFront={bringToFront}
          sendToBack={sendToBack}
          duplicate={duplicateSelected}
          deleteSelected={deleteSelected}
          lockElements={lockElements}
          unlockElements={unlockElements}
          alignElements={alignElements}
          distributeElements={distributeElements}
        />
      </div>

      {/* EditorCanvas ocupa el resto */}
      <div className="flex-1 relative overflow-auto">
        <EditorCanvas
          elements={elements}
          setElements={setElements}
          selectedIds={selectedIds}
          setSelectedIds={setSelectedIds}
          state={state}
          setState={setState}
          onHistorySave={saveToHistory}
        />
      </div>
    </div>

    {/* 🔹 Barra inferior fija */}
    <div className="fixed bottom-0 left-80 right-0 bg-[#0f0f17] border-t border-white/10 p-2 flex justify-between items-center text-xs text-gray-400">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          <span>Elementos: {elements.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
          <span>Seleccionados: {selectedIds.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
          <span>Grid: {state.gridSize}px {state.snapToGrid ? '(Snap)' : ''}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
          <span>Zoom: {Math.round(state.zoom * 100)}%</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={undo} className="px-3 py-1 hover:bg-gray-800 rounded transition flex items-center gap-1">
          <span>↩</span> Undo
        </button>
        <button onClick={redo} className="px-3 py-1 hover:bg-gray-800 rounded transition flex items-center gap-1">
          <span>↪</span> Redo
        </button>
        <span className="text-gray-600 mx-2">|</span>
        <span className="text-gray-500">{state.historyIndex + 1}/{state.history.length}</span>
      </div>
    </div>
  </div>
);

}
