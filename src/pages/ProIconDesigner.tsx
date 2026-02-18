import { useState, useCallback, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import EditorCanvas, { type EditorCanvasRef } from "../components/editor/EditorCanvas";
import EditorSidebar from "../components/editor/EditorSidebar";
import InspirationPanel from "../components/editor/InspirationPanel";
import ExportModal from "../components/editor/ExportModal";
import PropertiesPanel from "../components/editor/PropertiesPanel";
import LayersPanel from "../components/editor/LayersPanel";
import type { EditorElement, ShapeType } from "../types/editor";
import Navbar from "../components/Navbar";
import { 
  FiGrid, 
  FiDownload, 
  FiLayers, 
  FiSettings,
  FiRefreshCw,
  FiZoomIn,
  FiZoomOut,
  FiSave,
  FiCopy,
  FiTrash2,
  FiMove
} from "react-icons/fi";

export default function ProIconDesigner() {
  const [elements, setElements] = useState<EditorElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [gridEnabled, setGridEnabled] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  
  const canvasRef = useRef<EditorCanvasRef>(null);

  // History management
  const [history, setHistory] = useState<EditorElement[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Save state to history
  const saveToHistory = useCallback((newElements: EditorElement[]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, newElements];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setElements(history[historyIndex - 1]);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setElements(history[historyIndex + 1]);
    }
  }, [historyIndex, history]);

  // Clipboard for copy/paste
  const clipboard = useRef<EditorElement[]>([]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey;

      // Delete
      if (e.key === "Delete") {
        if (selectedIds.length === 0) return;
        e.preventDefault();
        deleteSelectedElements();
      }

      // Copy
      if (isCtrl && e.key.toLowerCase() === "c") {
        if (selectedIds.length === 0) return;
        e.preventDefault();
        clipboard.current = elements.filter(el => selectedIds.includes(el.id));
      }

      // Paste
      if (isCtrl && e.key.toLowerCase() === "v") {
        if (clipboard.current.length === 0) return;
        e.preventDefault();
        
        const duplicated = clipboard.current.map(el => ({
          ...el,
          id: uuidv4(),
          x: el.x + 30,
          y: el.y + 30,
          name: `${el.name}_copy`
        }));
        
        const newElements = [...elements, ...duplicated];
        setElements(newElements);
        saveToHistory(newElements);
        
        const newIds = duplicated.map(d => d.id);
        setSelectedIds(newIds);
        setSelectedId(newIds[0]);
      }

      // Duplicate (Ctrl+D)
      if (isCtrl && e.key.toLowerCase() === "d") {
        if (selectedIds.length === 0) return;
        e.preventDefault();
        duplicateSelectedElements();
      }

      // Select All (Ctrl+A)
      if (isCtrl && e.key.toLowerCase() === "a") {
        e.preventDefault();
        const ids = elements.map(el => el.id);
        setSelectedIds(ids);
        setSelectedId(ids[0] || null);
      }

      // Undo (Ctrl+Z)
      if (isCtrl && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Redo (Ctrl+Shift+Z or Ctrl+Y)
      if ((isCtrl && e.shiftKey && e.key.toLowerCase() === "z") || 
          (isCtrl && e.key.toLowerCase() === "y")) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [elements, selectedIds, historyIndex, history]);

  const addShape = (type: ShapeType) => {
    const base = {
      type,
      x: 400,
      y: 300,
      size: 150,
      rotation: 0,
      fill: type === "text" ? "#ffffff" : "#06b6d4",
      opacity: 1,
      visible: true,
      stroke: "#000000",
      strokeWidth: 1,
      name: `${type}_${elements.length + 1}`,
    };

    let newElement: EditorElement = { 
      id: uuidv4(), 
      ...base,
    };

    // Shape-specific defaults
    switch(type) {
      case "star":
        newElement.numPoints = 5;
        newElement.innerRadius = 60;
        break;
      case "polygon":
        newElement.numPoints = 6;
        break;
      case "rect":
        newElement.cornerRadius = 0;
        break;
      case "text":
        newElement.text = "LOGO";
        newElement.fontSize = 70;
        newElement.fontFamily = "Montserrat";
        newElement.fontWeight = 700;
        newElement.fontStyle = "normal";
        newElement.textDecoration = "none";
        newElement.uppercase = false;
        newElement.letterSpacing = 2;
        newElement.lineHeight = 1;
        newElement.align = "center";
        newElement.stroke = "#000000";
        newElement.strokeWidth = 0;
        newElement.strokeEnabled = false;
        newElement.shadowColor = "#000000";
        newElement.shadowBlur = 0;
        newElement.shadowOffsetX = 0;
        newElement.shadowOffsetY = 0;
        newElement.shadowOpacity = 0.5;
        newElement.shadowEnabled = false;
        break;
    }

    const newElements = [...elements, newElement];
    setElements(newElements);
    saveToHistory(newElements);
    setSelectedId(newElement.id);
    setSelectedIds([newElement.id]);
  };

  const updateElement = (id: string, updates: Partial<EditorElement>) => {
    setElements(prev => {
      const newElements = prev.map((el) => 
        el.id === id ? { ...el, ...updates } : el
      );
      saveToHistory(newElements);
      return newElements;
    });
  };

  const updateMultipleElements = (ids: string[], updates: Partial<EditorElement>) => {
    setElements(prev => {
      const newElements = prev.map((el) => 
        ids.includes(el.id) ? { ...el, ...updates } : el
      );
      saveToHistory(newElements);
      return newElements;
    });
  };

  const deleteElement = (id: string) => {
    const newElements = elements.filter((el) => el.id !== id);
    setElements(newElements);
    saveToHistory(newElements);
    if (selectedId === id) {
      setSelectedId(null);
      setSelectedIds([]);
    } else {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    }
  };

  const deleteSelectedElements = () => {
    const newElements = elements.filter((el) => !selectedIds.includes(el.id));
    setElements(newElements);
    saveToHistory(newElements);
    setSelectedId(null);
    setSelectedIds([]);
  };

  const duplicateElement = (id: string) => {
    const element = elements.find(el => el.id === id);
    if (element) {
      const newElement = {
        ...element,
        id: uuidv4(),
        x: element.x + 20,
        y: element.y + 20,
        name: `${element.name}_copy`
      };
      const newElements = [...elements, newElement];
      setElements(newElements);
      saveToHistory(newElements);
      setSelectedId(newElement.id);
      setSelectedIds([newElement.id]);
    }
  };

  const duplicateSelectedElements = () => {
    const selectedElements = elements.filter(el => selectedIds.includes(el.id));
    const newElements = selectedElements.map(el => ({
      ...el,
      id: uuidv4(),
      x: el.x + 30,
      y: el.y + 30,
      name: `${el.name}_copy`
    }));
    
    const updatedElements = [...elements, ...newElements];
    setElements(updatedElements);
    saveToHistory(updatedElements);
    
    const newIds = newElements.map(el => el.id);
    setSelectedIds(newIds);
    setSelectedId(newIds[0]);
  };

  const bringForward = () => {
    if (selectedIds.length === 0) return;
    
    const newElements = [...elements];
    const indices = selectedIds
      .map(id => newElements.findIndex(el => el.id === id))
      .sort((a, b) => b - a);
    
    indices.forEach(index => {
      if (index < newElements.length - 1) {
        [newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]];
      }
    });
    
    setElements(newElements);
    saveToHistory(newElements);
  };

  const sendBackward = () => {
    if (selectedIds.length === 0) return;
    
    const newElements = [...elements];
    const indices = selectedIds
      .map(id => newElements.findIndex(el => el.id === id))
      .sort((a, b) => a - b);
    
    indices.forEach(index => {
      if (index > 0) {
        [newElements[index], newElements[index - 1]] = [newElements[index - 1], newElements[index]];
      }
    });
    
    setElements(newElements);
    saveToHistory(newElements);
  };

  const alignElements = (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (selectedIds.length < 2) return;
    
    const selectedElements = elements.filter(el => selectedIds.includes(el.id));
    
    switch(alignment) {
      case 'left':
        const minX = Math.min(...selectedElements.map(el => el.x));
        updateMultipleElements(selectedIds, { x: minX });
        break;
      case 'right':
        const maxX = Math.max(...selectedElements.map(el => el.x + (el.size || 0)));
        updateMultipleElements(selectedIds, { x: maxX - (selectedElements[0].size || 0) });
        break;
      case 'center':
        const centerX = (Math.min(...selectedElements.map(el => el.x)) + 
                        Math.max(...selectedElements.map(el => el.x + (el.size || 0)))) / 2;
        selectedElements.forEach(el => {
          updateElement(el.id, { x: centerX - (el.size || 0) / 2 });
        });
        break;
      case 'top':
        const minY = Math.min(...selectedElements.map(el => el.y));
        updateMultipleElements(selectedIds, { y: minY });
        break;
      case 'bottom':
        const maxY = Math.max(...selectedElements.map(el => el.y + (el.size || 0)));
        updateMultipleElements(selectedIds, { y: maxY - (selectedElements[0].size || 0) });
        break;
      case 'middle':
        const centerY = (Math.min(...selectedElements.map(el => el.y)) + 
                        Math.max(...selectedElements.map(el => el.y + (el.size || 0)))) / 2;
        selectedElements.forEach(el => {
          updateElement(el.id, { y: centerY - (el.size || 0) / 2 });
        });
        break;
    }
  };

  const loadPreset = (preset: EditorElement[]) => {
    const newElements = preset.map(el => ({
      ...el,
      id: uuidv4(),
    }));
    setElements(newElements);
    saveToHistory(newElements);
    setSelectedIds([]);
    setSelectedId(null);
  };

  const handleExport = () => {
    setShowExportModal(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#0a0a0f] to-[#1a1a2e] text-white">
      <Navbar />
      
      {/* Top Toolbar */}
      <div className="bg-[#111122]/90 backdrop-blur border-b border-white/10 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button 
            onClick={undo}
            className="p-2 hover:bg-white/10 rounded-lg transition"
            title="Undo (Ctrl+Z)"
          >
            <FiRefreshCw className="w-4 h-4" />
          </button>
          <button 
            onClick={redo}
            className="p-2 hover:bg-white/10 rounded-lg transition"
            title="Redo (Ctrl+Y or Ctrl+Shift+Z)"
          >
            <FiRefreshCw className="w-4 h-4 rotate-180" />
          </button>
          <div className="w-px h-6 bg-white/20 mx-2" />
          <button 
            onClick={() => setZoom(z => Math.min(z + 0.1, 3))}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <FiZoomIn className="w-4 h-4" />
          </button>
          <span className="text-sm">{Math.round(zoom * 100)}%</span>
          <button 
            onClick={() => setZoom(z => Math.max(z - 0.1, 0.1))}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <FiZoomOut className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-white/20 mx-2" />
          <button 
            onClick={() => setGridEnabled(!gridEnabled)}
            className={`p-2 rounded-lg transition ${gridEnabled ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-white/10'}`}
          >
            <FiGrid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setShowLayers(!showLayers)}
            className={`p-2 rounded-lg transition ${showLayers ? 'bg-cyan-500/20 text-cyan-400' : 'hover:bg-white/10'}`}
          >
            <FiLayers className="w-4 h-4" />
          </button>
        </div>
        
        {/* Multi-selection controls */}
        {selectedIds.length > 1 && (
          <div className="flex items-center space-x-2 bg-white/5 rounded-lg px-3 py-1">
            <span className="text-xs text-white/50">{selectedIds.length} selected</span>
            <div className="w-px h-4 bg-white/20 mx-1" />
            <button
              onClick={duplicateSelectedElements}
              className="p-1 hover:bg-white/10 rounded"
              title="Duplicate selected (Ctrl+D)"
            >
              <FiCopy className="w-4 h-4" />
            </button>
            <button
              onClick={deleteSelectedElements}
              className="p-1 hover:bg-white/10 rounded text-red-400"
              title="Delete selected (Delete)"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-white/20 mx-1" />
            <button
              onClick={() => alignElements('left')}
              className="p-1 hover:bg-white/10 rounded text-xs font-bold"
              title="Align left"
            >
              L
            </button>
            <button
              onClick={() => alignElements('center')}
              className="p-1 hover:bg-white/10 rounded text-xs font-bold"
              title="Align center"
            >
              C
            </button>
            <button
              onClick={() => alignElements('right')}
              className="p-1 hover:bg-white/10 rounded text-xs font-bold"
              title="Align right"
            >
              R
            </button>
            <button
              onClick={() => alignElements('top')}
              className="p-1 hover:bg-white/10 rounded text-xs font-bold"
              title="Align top"
            >
              T
            </button>
            <button
              onClick={() => alignElements('middle')}
              className="p-1 hover:bg-white/10 rounded text-xs font-bold"
              title="Align middle"
            >
              M
            </button>
            <button
              onClick={() => alignElements('bottom')}
              className="p-1 hover:bg-white/10 rounded text-xs font-bold"
              title="Align bottom"
            >
              B
            </button>
          </div>
        )}
        
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition flex items-center space-x-2">
            <FiSave className="w-4 h-4" />
            <span>Save</span>
          </button>
          <button 
            onClick={handleExport}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 rounded-lg text-sm font-semibold transition flex items-center space-x-2"
          >
            <FiDownload className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR - Shapes */}
        <div className="w-80 overflow-y-auto border-r border-white/10 bg-[#0f0f1a]/50 backdrop-blur">
          <EditorSidebar
            addShape={addShape}
            selected={elements.find((el) => el.id === selectedId)}
            updateElement={updateElement}
            deleteElement={deleteElement}
            duplicateElement={duplicateElement}
          />
        </div>

        {/* MAIN CANVAS */}
        <div className="flex-1 flex items-center justify-center bg-[#05050a] relative">
          <EditorCanvas
            ref={canvasRef}
            elements={elements}
            setElements={setElements}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            zoom={zoom}
            gridEnabled={gridEnabled}
            snapToGrid={snapToGrid}
            gridSize={20}
          />
        </div>

        {/* RIGHT PANELS */}
        <div className="w-80 flex flex-col border-l border-white/10 bg-[#0f0f1a]/50 backdrop-blur">
          {showLayers ? (
            <LayersPanel
              elements={elements}
              selectedId={selectedId}
              selectedIds={selectedIds}
              onSelect={(id) => {
                setSelectedId(id);
                setSelectedIds([id]);
              }}
              onSelectMultiple={(ids) => {
                setSelectedIds(ids);
                if (ids.length > 0) setSelectedId(ids[0]);
              }}
              onVisibilityChange={(id, visible) => updateElement(id, { visible })}
              onDuplicate={duplicateElement}
              onDelete={deleteElement}
              bringForward={bringForward}
              sendBackward={sendBackward}
            />
          ) : (
            <>
              {selectedId && elements.find(el => el.id === selectedId) ? (
                <PropertiesPanel
                  element={elements.find(el => el.id === selectedId)!}
                  updateElement={updateElement}
                />
              ) : selectedIds.length > 1 ? (
                <div className="p-6 text-center">
                  <FiMove className="w-12 h-12 mx-auto mb-3 text-cyan-400/50" />
                  <p className="text-sm text-white/70 mb-2">{selectedIds.length} elements selected</p>
                  <p className="text-xs text-white/50">Use the top toolbar to align or transform multiple elements</p>
                </div>
              ) : (
                <div className="p-6 text-center text-white/30">
                  <FiSettings className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Select an element to edit its properties</p>
                </div>
              )}
              
              <div className="border-t border-white/10">
                <InspirationPanel onSelectPreset={loadPreset} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          elements={elements}
          onClose={() => setShowExportModal(false)}
          canvasRef={canvasRef}
        />
      )}
    </div>
  );
}