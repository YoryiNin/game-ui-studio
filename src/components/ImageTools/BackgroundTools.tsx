// src/components/ImageTools/BackgroundTools.tsx
import { useRef, useEffect, useState, useCallback } from "react";
import { removeBackground } from "@imgly/background-removal";
import {
  FiTrash2,
  FiRefreshCw,
  FiZoomIn,
  FiZoomOut,
  FiMove,
  FiRotateCw,
  FiDownload,
  FiCircle,
  FiSquare,
  FiSave,
  FiCornerUpLeft,
  FiCornerUpRight,
  FiGrid,
  FiPenTool,
  FiMaximize2,
  FiEye,
  FiEyeOff,
  FiDroplet,
} from "react-icons/fi";

interface BackgroundToolsProps {
  imageUrl: string;
  onUpdate: (canvasBlob: Blob) => void;
}

type BrushMode = "erase" | "restore";
type BrushShape = "circle" | "square";

export default function BackgroundTools({
  imageUrl,
  onUpdate,
}: BackgroundToolsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();
  
  // Estados
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState<BrushMode>("erase");
  const [brushSize, setBrushSize] = useState(20);
  const [brushShape, setBrushShape] = useState<BrushShape>("circle");
  const [brushHardness, setBrushHardness] = useState(100); // Solo para borrar
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [originalImageData, setOriginalImageData] = useState<ImageData | null>(null); // CRÍTICO: Guardamos los datos originales
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showGrid, setShowGrid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isOverCanvas, setIsOverCanvas] = useState(false);
  
  // Estados para Outline
  const [showOutline, setShowOutline] = useState(false);
  const [outlineColor, setOutlineColor] = useState("#00ffff");
  const [outlineThickness, setOutlineThickness] = useState(2);
  const [outlineStyle, setOutlineStyle] = useState<"solid" | "dashed" | "dotted">("solid");

  // Cargar imagen inicial y GUARDAR DATOS ORIGINALES
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setOriginalImage(img);
      
      // GUARDAR LOS DATOS DE PÍXELES ORIGINALES (IMPORTANTÍSIMO)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setOriginalImageData(imageData);
      
      setHistory([imageData]);
      setHistoryIndex(0);
    };
  }, [imageUrl]);

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
      if (e.key === '[') setBrushSize(prev => Math.max(5, prev - 5));
      if (e.key === ']') setBrushSize(prev => Math.min(100, prev + 5));
      if (e.key === 'e') setMode('erase');
      if (e.key === 'r') setMode('restore');
      if (e.key === 'h') setShowOriginal(prev => !prev);
      if (e.key === 'g') setShowGrid(prev => !prev);
      if (e.key === 'o') setShowOutline(prev => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  // Guardar en historial
  const saveToHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory(prev => [...prev.slice(0, historyIndex + 1), imageData]);
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Deshacer
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      setHistoryIndex(prev => prev - 1);
      ctx.putImageData(history[historyIndex - 1], 0, 0);
    }
  }, [history, historyIndex]);

  // Rehacer
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      setHistoryIndex(prev => prev + 1);
      ctx.putImageData(history[historyIndex + 1], 0, 0);
    }
  }, [history, historyIndex]);

  // Zoom
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleZoomReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };
  const handleZoomFit = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    
    const scaleX = container.clientWidth / canvas.width;
    const scaleY = container.clientHeight / canvas.height;
    setZoom(Math.min(scaleX, scaleY) * 0.9);
    setPosition({ x: 0, y: 0 });
  };

  // Obtener coordenadas del canvas
  const getCanvasCoords = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    const x = (clientX - rect.left - position.x) / zoom;
    const y = (clientY - rect.top - position.y) / zoom;
    
    return {
      x: Math.max(0, Math.min(canvas.width, x)),
      y: Math.max(0, Math.min(canvas.height, y))
    };
  }, [zoom, position]);

  // Actualizar cursor
  const updateCursor = useCallback((e: React.MouseEvent) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    
    rafRef.current = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      
      const canvasRect = canvas.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      const isInsideCanvas = 
        e.clientX >= canvasRect.left && 
        e.clientX <= canvasRect.right && 
        e.clientY >= canvasRect.top && 
        e.clientY <= canvasRect.bottom;
      
      if (isInsideCanvas) {
        setCursorPos({
          x: e.clientX - containerRect.left,
          y: e.clientY - containerRect.top
        });
        setIsOverCanvas(true);
      } else {
        setIsOverCanvas(false);
      }
    });
  }, []);

  // RESTAURACIÓN PERFECTA - USA LOS DATOS ORIGINALES
  const restoreExactPixels = useCallback((
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number
  ) => {
    // SI NO HAY DATOS ORIGINALES, NO HACER NADA
    if (!originalImageData) {
      console.warn("No hay datos originales para restaurar");
      return;
    }
    
    const radius = brushSize;
    const startX = Math.max(0, Math.floor(centerX - radius));
    const startY = Math.max(0, Math.floor(centerY - radius));
    const endX = Math.min(canvasRef.current!.width, Math.ceil(centerX + radius));
    const endY = Math.min(canvasRef.current!.height, Math.ceil(centerY + radius));
    
    // Obtener el área actual que vamos a modificar
    const currentArea = ctx.getImageData(startX, startY, endX - startX, endY - startY);
    const currentData = currentArea.data;
    
    // Restaurar PÍXEL POR PÍXEL desde los datos originales
    for (let py = startY; py < endY; py++) {
      for (let px = startX; px < endX; px++) {
        const dx = px - centerX;
        const dy = py - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Solo restaurar píxeles dentro del círculo del pincel
        if (distance <= radius) {
          const idx = ((py - startY) * (endX - startX) + (px - startX)) * 4;
          const originalIdx = (py * canvasRef.current!.width + px) * 4;
          
          // COPIAR EXACTAMENTE los valores originales
          currentData[idx] = originalImageData.data[originalIdx];         // R
          currentData[idx + 1] = originalImageData.data[originalIdx + 1]; // G
          currentData[idx + 2] = originalImageData.data[originalIdx + 2]; // B
          currentData[idx + 3] = originalImageData.data[originalIdx + 3]; // A
        }
      }
    }
    
    // Escribir de vuelta al canvas
    ctx.putImageData(currentArea, startX, startY);
    
  }, [originalImageData, brushSize]);

  // BORRADO con dureza (opcional)
  const eraseWithHardness = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number
  ) => {
    const hardness = brushHardness / 100;
    const radius = brushSize;
    
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    
    if (hardness >= 0.99) {
      // Modo duro - borrado exacto
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Modo suave con gradiente
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
      gradient.addColorStop(hardness, 'rgba(0, 0, 0, 1)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }, [brushSize, brushHardness]);

  // Dibujar
  const draw = useCallback((e: React.MouseEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e.clientX, e.clientY);
    
    if (mode === "erase") {
      eraseWithHardness(ctx, x, y);
    } else if (mode === "restore") {
      // RESTAURACIÓN USANDO DATOS ORIGINALES
      restoreExactPixels(ctx, x, y);
    }
    
  }, [isDrawing, mode, getCanvasCoords, eraseWithHardness, restoreExactPixels]);

  // Eventos del mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (e.altKey) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    } else {
      setIsDrawing(true);
      draw(e);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    e.preventDefault();
    updateCursor(e);
    
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    } else if (isDrawing) {
      draw(e);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
    setIsDragging(false);
  };

  const handleMouseEnter = (e: React.MouseEvent) => updateCursor(e);
  const handleMouseLeave = () => {
    setIsOverCanvas(false);
    setIsDrawing(false);
    setIsDragging(false);
    setCursorPos({ x: -100, y: -100 });
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  // OUTLINE PROFESIONAL - VERSIÓN CORREGIDA
  const addProfessionalOutline = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    
    // Obtener datos de la imagen ACTUAL
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // PASO 1: Detectar bordes con precisión
    const edgePoints: { x: number; y: number }[] = [];
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        const alpha = data[idx + 3];
        
        // Solo considerar píxeles con algo de opacidad
        if (alpha > 10) { // Umbral bajo para capturar bordes suaves
          // Verificar si es un borde (tiene vecinos transparentes)
          let isEdge = false;
          
          // Revisar vecinos en 8 direcciones
          for (let ny = -1; ny <= 1; ny++) {
            for (let nx = -1; nx <= 1; nx++) {
              if (nx === 0 && ny === 0) continue;
              const nIdx = ((y + ny) * width + (x + nx)) * 4;
              if (data[nIdx + 3] < 10) { // Vecino transparente
                isEdge = true;
                break;
              }
            }
            if (isEdge) break;
          }
          
          if (isEdge) {
            edgePoints.push({ x, y });
          }
        }
      }
    }
    
    console.log(`Detectados ${edgePoints.length} puntos de borde`);
    
    if (edgePoints.length < 10) {
      alert("No se detectaron bordes claros en la imagen");
      return;
    }
    
    // PASO 2: Ordenar puntos para formar contornos
    const contours: { x: number; y: number }[][] = [];
    const used = new Set<string>();
    
    // Función para encontrar el punto más cercano
    const findNearest = (point: { x: number; y: number }, candidates: { x: number; y: number }[]): number => {
      let minDist = Infinity;
      let minIdx = -1;
      
      for (let i = 0; i < candidates.length; i++) {
        const p = candidates[i];
        const key = `${p.x},${p.y}`;
        if (used.has(key)) continue;
        
        const dist = Math.sqrt(Math.pow(p.x - point.x, 2) + Math.pow(p.y - point.y, 2));
        if (dist < minDist && dist < 5) { // Máximo 5 píxeles de distancia
          minDist = dist;
          minIdx = i;
        }
      }
      
      return minIdx;
    };
    
    // Construir contornos
    for (let i = 0; i < edgePoints.length; i++) {
      const start = edgePoints[i];
      const startKey = `${start.x},${start.y}`;
      if (used.has(startKey)) continue;
      
      const contour: { x: number; y: number }[] = [start];
      used.add(startKey);
      
      let current = start;
      let found = true;
      let safety = 0;
      
      while (found && safety < 1000) {
        safety++;
        found = false;
        
        const nextIdx = findNearest(current, edgePoints);
        if (nextIdx !== -1) {
          const next = edgePoints[nextIdx];
          const nextKey = `${next.x},${next.y}`;
          if (!used.has(nextKey)) {
            contour.push(next);
            used.add(nextKey);
            current = next;
            found = true;
          }
        }
      }
      
      if (contour.length > 20) {
        contours.push(contour);
      }
    }
    
    console.log(`Encontrados ${contours.length} contornos`);
    
    // PASO 3: Dibujar los contornos
    ctx.save();
    ctx.strokeStyle = outlineColor;
    ctx.lineWidth = outlineThickness;
    
    // Configurar estilo
    if (outlineStyle === "dashed") {
      ctx.setLineDash([5 * outlineThickness, 3 * outlineThickness]);
    } else if (outlineStyle === "dotted") {
      ctx.setLineDash([1, 3 * outlineThickness]);
    } else {
      ctx.setLineDash([]);
    }
    
    // Dibujar cada contorno
    contours.forEach(contour => {
      if (contour.length < 5) return;
      
      ctx.beginPath();
      ctx.moveTo(contour[0].x, contour[0].y);
      
      for (let i = 1; i < contour.length; i++) {
        ctx.lineTo(contour[i].x, contour[i].y);
      }
      
      // Cerrar el contorno si está cerca del inicio
      const first = contour[0];
      const last = contour[contour.length - 1];
      const distance = Math.sqrt(
        Math.pow(last.x - first.x, 2) + 
        Math.pow(last.y - first.y, 2)
      );
      
      if (distance < 10) {
        ctx.closePath();
      }
      
      ctx.stroke();
    });
    
    ctx.restore();
    
    // Guardar en historial
    saveToHistory();
    
  }, [outlineColor, outlineThickness, outlineStyle, saveToHistory]);

  // Mejorar bordes con IA
  const enhanceEdges = async () => {
    setIsProcessing(true);
    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), "image/png");
      });

      const resultBlob = await removeBackground(blob, {
        progress: (key, current, total) => {
          console.log(`Mejorando bordes: ${key} ${current}/${total}`);
        },
      });

      const img = new Image();
      img.src = URL.createObjectURL(resultBlob);
      
      await new Promise((resolve) => {
        img.onload = () => {
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          URL.revokeObjectURL(img.src);
          saveToHistory();
          resolve(null);
        };
      });
    } catch (error) {
      console.error("Error mejorando bordes:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Alternar vista original
  const toggleOriginalView = () => {
    const canvas = canvasRef.current;
    if (!canvas || !originalImage) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!showOriginal) {
      const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setHistory(prev => [...prev.slice(0, historyIndex + 1), currentData]);
      setHistoryIndex(prev => prev + 1);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(originalImage, 0, 0);
    } else {
      if (historyIndex >= 0) {
        ctx.putImageData(history[historyIndex], 0, 0);
      }
    }
    setShowOriginal(!showOriginal);
  };

  // Aplicar cambios
  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (blob) onUpdate(blob);
    }, "image/png");
  };

  // Limpiar RAF
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="w-full bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-3 border-b border-gray-800 bg-gray-900/50">
        {/* Modos */}
        <div className="flex rounded-lg overflow-hidden border border-gray-700">
          <button
            onClick={() => setMode("erase")}
            className={`px-3 py-1.5 flex items-center gap-1.5 text-sm font-medium transition ${
              mode === "erase" ? "bg-red-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            <FiTrash2 className="w-4 h-4" />
            <span>Borrar</span>
          </button>
          <button
            onClick={() => setMode("restore")}
            className={`px-3 py-1.5 flex items-center gap-1.5 text-sm font-medium transition ${
              mode === "restore" ? "bg-green-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>Restaurar ORIGINAL</span>
          </button>
        </div>

        {/* Separador */}
        <div className="w-px h-6 bg-gray-700" />

        {/* Tamaño */}
        <div className="flex items-center gap-2">
          <FiPenTool className="w-4 h-4 text-gray-400" />
          <input
            type="range"
            min={5}
            max={100}
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-16 accent-cyan-500"
          />
          <span className="text-xs text-gray-400 w-10">{brushSize}px</span>
        </div>

        {/* Dureza (solo para borrar) */}
        {mode === "erase" && (
          <div className="flex items-center gap-2">
            <FiDroplet className="w-4 h-4 text-gray-400" />
            <input
              type="range"
              min={0}
              max={100}
              value={brushHardness}
              onChange={(e) => setBrushHardness(Number(e.target.value))}
              className="w-16 accent-cyan-500"
            />
            <span className="text-xs text-gray-400 w-10">{brushHardness}%</span>
          </div>
        )}

        {/* Forma */}
        <div className="flex rounded-lg overflow-hidden border border-gray-700">
          <button
            onClick={() => setBrushShape("circle")}
            className={`p-1.5 transition ${
              brushShape === "circle" ? "bg-cyan-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            <FiCircle className="w-4 h-4" />
          </button>
          <button
            onClick={() => setBrushShape("square")}
            className={`p-1.5 transition ${
              brushShape === "square" ? "bg-cyan-500 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            <FiSquare className="w-4 h-4" />
          </button>
        </div>

        {/* Separador */}
        <div className="w-px h-6 bg-gray-700" />

        {/* Zoom */}
        <div className="flex items-center gap-1">
          <button onClick={handleZoomOut} className="p-1.5 hover:bg-gray-800 rounded text-gray-400">
            <FiZoomOut className="w-4 h-4" />
          </button>
          <button onClick={handleZoomReset} className="px-2 py-1.5 hover:bg-gray-800 rounded text-gray-400 text-xs">
            {Math.round(zoom * 100)}%
          </button>
          <button onClick={handleZoomIn} className="p-1.5 hover:bg-gray-800 rounded text-gray-400">
            <FiZoomIn className="w-4 h-4" />
          </button>
          <button onClick={handleZoomFit} className="p-1.5 hover:bg-gray-800 rounded text-gray-400">
            <FiMaximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Visualización */}
        <button
          onClick={toggleOriginalView}
          className={`p-1.5 rounded transition ${
            showOriginal ? "bg-yellow-500/20 text-yellow-400" : "hover:bg-gray-800 text-gray-400"
          }`}
        >
          {showOriginal ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
        </button>

        <button
          onClick={() => setShowGrid(!showGrid)}
          className={`p-1.5 rounded transition ${
            showGrid ? "bg-cyan-500/20 text-cyan-400" : "hover:bg-gray-800 text-gray-400"
          }`}
        >
          <FiGrid className="w-4 h-4" />
        </button>

        {/* Separador */}
        <div className="w-px h-6 bg-gray-700" />

        {/* Historial */}
        <button onClick={undo} disabled={historyIndex <= 0} className="p-1.5 hover:bg-gray-800 rounded text-gray-400 disabled:opacity-50">
          <FiCornerUpLeft className="w-4 h-4" />
        </button>
        <button onClick={redo} disabled={historyIndex >= history.length - 1} className="p-1.5 hover:bg-gray-800 rounded text-gray-400 disabled:opacity-50">
          <FiCornerUpRight className="w-4 h-4" />
        </button>

        {/* Botón Outline */}
        <button
          onClick={() => setShowOutline(!showOutline)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
            showOutline ? "bg-purple-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          <FiPenTool className="w-4 h-4" />
          <span>Outline [O]</span>
        </button>

        {/* Espaciador */}
        <div className="flex-1" />

        {/* Acciones */}
        <button
          onClick={enhanceEdges}
          disabled={isProcessing}
          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition flex items-center gap-1.5"
        >
          {isProcessing ? <FiRefreshCw className="w-4 h-4 animate-spin" /> : <FiRotateCw className="w-4 h-4" />}
          <span>Mejorar bordes</span>
        </button>

        <button
          onClick={handleApply}
          className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition flex items-center gap-1.5"
        >
          <FiSave className="w-4 h-4" />
          <span>Aplicar</span>
        </button>
      </div>

      {/* Panel Outline */}
      {showOutline && (
        <div className="p-3 border-b border-gray-800 bg-gray-800/50">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-white">Outline Profesional</span>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Color:</span>
              <input
                type="color"
                value={outlineColor}
                onChange={(e) => setOutlineColor(e.target.value)}
                className="w-6 h-6 rounded cursor-pointer bg-transparent border border-gray-700"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Grosor:</span>
              <input
                type="range"
                min={1}
                max={5}
                value={outlineThickness}
                onChange={(e) => setOutlineThickness(Number(e.target.value))}
                className="w-16 accent-cyan-500"
              />
              <span className="text-xs text-gray-400 w-8">{outlineThickness}px</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Estilo:</span>
              <select
                value={outlineStyle}
                onChange={(e) => setOutlineStyle(e.target.value as any)}
                className="bg-gray-700 text-white text-xs rounded px-2 py-1 border border-gray-600"
              >
                <option value="solid">Sólida</option>
                <option value="dashed">Discontinua</option>
                <option value="dotted">Punteada</option>
              </select>
            </div>

            <button
              onClick={addProfessionalOutline}
              className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium transition"
            >
              Aplicar Outline
            </button>
          </div>
        </div>
      )}

      {/* Área del canvas */}
      <div
        ref={containerRef}
        className="relative bg-[url('data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'10\' height=\'10\' fill=\'%23333\'/%3E%3Crect x=\'10\' y=\'10\' width=\'10\' height=\'10\' fill=\'%23333\'/%3E%3Crect x=\'10\' width=\'10\' height=\'10\' fill=\'%23444\'/%3E%3Crect y=\'10\' width=\'10\' height=\'10\' fill=\'%23444\'/%3E%3C/svg%3E')] flex items-center justify-center overflow-hidden"
        style={{ minHeight: "400px", height: "60vh" }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Canvas */}
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
            transition: isDragging ? "none" : "transform 0.1s ease-out",
          }}
        >
          <canvas
            ref={canvasRef}
            className="shadow-lg"
            style={{
              imageRendering: "crisp-edges",
              maxWidth: "none",
              cursor: "none",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
          />
        </div>

        {/* Cursor */}
        {isOverCanvas && !isDragging && (
          <div
            ref={cursorRef}
            className="absolute pointer-events-none z-50"
            style={{
              left: cursorPos.x,
              top: cursorPos.y,
              transform: 'translate(-50%, -50%)',
              width: brushSize * 2 * zoom,
              height: brushSize * 2 * zoom,
              borderRadius: brushShape === "circle" ? "50%" : "0",
              border: `2px solid ${mode === "erase" ? "#ef4444" : "#10b981"}`,
              backgroundColor: mode === "erase" 
                ? `rgba(239, 68, 68, ${0.2 * (brushHardness/100)})` 
                : "rgba(16, 185, 129, 0.2)",
              boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-px h-full bg-white/70" />
              <div className="absolute w-full h-px bg-white/70" />
            </div>
            <div className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-gray-700">
              {brushSize}px • {mode === "erase" ? `Borrar ${brushHardness}%` : "Restaurar ORIGINAL"}
            </div>
          </div>
        )}

        {/* Grid */}
        {showGrid && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            }}
          />
        )}
      </div>
    </div>
  );
}