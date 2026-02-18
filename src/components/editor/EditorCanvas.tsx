import {
  Stage,
  Layer,
  Circle,
  Rect,
  RegularPolygon,
  Star,
  Transformer,
  Text,
  Line,
} from "react-konva";
import { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import type Konva from "konva";
import type { EditorElement } from "../../types/editor";

interface Props {
  elements: EditorElement[];
  setElements: React.Dispatch<React.SetStateAction<EditorElement[]>>;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  selectedIds?: string[];
  setSelectedIds?: (ids: string[]) => void;
  zoom?: number;
  gridEnabled?: boolean;
  snapToGrid?: boolean;
  gridSize?: number;
  showSafeGuides?: boolean;
  guidePlatform?: 'icon' | 'android' | 'ios' | 'web' | 'googlePlay';
}

export interface EditorCanvasRef {
  getStage: () => Konva.Stage | null;
  getBoundingBox: () => { 
    minX: number; 
    minY: number; 
    maxX: number; 
    maxY: number; 
    width: number; 
    height: number; 
    centerX: number; 
    centerY: number; 
  } | null;
  getStageSize: () => { width: number; height: number };
  getStagePosition: () => { x: number; y: number };
}

// Definir tipo para las guías de plataforma
type PlatformGuide = {
  name: string;
  safeArea: number;
  description: string;
  foregroundSize?: number;
};

// Definiciones de áreas seguras para diferentes plataformas
const PLATFORM_GUIDES: Record<string, PlatformGuide> = {
  icon: {
    name: "Icono Estándar",
    safeArea: 0.8,
    description: "Mantén el logo dentro del área segura (80%)"
  },
  android: {
    name: "Android Adaptive Icon",
    safeArea: 0.75,
    foregroundSize: 0.65,
    description: "Área segura: 75% | Foreground: 65%"
  },
  ios: {
    name: "iOS App Icon",
    safeArea: 0.7,
    description: "Área segura: 70% para evitar recortes"
  },
  web: {
    name: "Web Favicon",
    safeArea: 0.85,
    description: "Área más permisiva para web"
  },
  googlePlay: {
    name: "Google Play Store",
    safeArea: 0.9,
    description: "Icono completo, poco recorte"
  }
};

const EditorCanvas = forwardRef<EditorCanvasRef, Props>(({
  elements,
  setElements,
  selectedId,
  setSelectedId,
  selectedIds = [],
  setSelectedIds,
  zoom = 1,
  gridEnabled = true,
  snapToGrid = true,
  gridSize = 10,
  showSafeGuides = false,
  guidePlatform = 'icon',
}, ref) => {
  const stageRef = useRef<Konva.Stage>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [stageCenter, setStageCenter] = useState({ x: 0, y: 0 });

  const [selectionRect, setSelectionRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    visible: boolean;
  }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    visible: false,
  });

  const selectionStarted = useRef(false);
  const selectionStartPos = useRef({ x: 0, y: 0 });

  // Calcular el tamaño del stage basado en el contenedor
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const canvasSize = Math.min(width, height) * 0.8;
        setStageSize({
          width: canvasSize,
          height: canvasSize,
        });
        
        setStageCenter({
          x: canvasSize / 2,
          y: canvasSize / 2
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Exponer métodos al componente padre
  useImperativeHandle(ref, () => ({
    getStage: () => stageRef.current,
    getBoundingBox: () => {
      const stage = stageRef.current;
      if (!stage) return null;

      const visible = elements.filter(el => el.visible !== false);
      if (!visible.length) return null;

      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      
      visible.forEach(el => {
        // Buscar el nodo de Konva directamente para obtener su bounding box exacto
        const node = stage.findOne(`#${el.id}`);
        
        if (node) {
          // Si encontramos el nodo, usamos getClientRect() que es más preciso
          const box = node.getClientRect();
          minX = Math.min(minX, box.x);
          minY = Math.min(minY, box.y);
          maxX = Math.max(maxX, box.x + box.width);
          maxY = Math.max(maxY, box.y + box.height);
        } else {
          // Fallback al cálculo manual si no encontramos el nodo
          const scaleX = el.scaleX || 1;
          const scaleY = el.scaleY || 1;
          
          let width = el.type === 'text' 
            ? (el.text?.length || 4) * (el.fontSize || 60) * 0.6 * scaleX
            : (el.size || 100) * scaleX;
          let height = el.type === 'text'
            ? (el.fontSize || 60) * scaleY
            : (el.size || 100) * scaleY;
          
          const halfW = width / 2;
          const halfH = height / 2;
          
          const points = [
            [-halfW, -halfH],
            [halfW, -halfH],
            [halfW, halfH],
            [-halfW, halfH]
          ];
          
          points.forEach(([dx, dy]) => {
            if (el.rotation) {
              const angle = (el.rotation * Math.PI) / 180;
              const cos = Math.cos(angle);
              const sin = Math.sin(angle);
              const x = dx * cos - dy * sin;
              const y = dx * sin + dy * cos;
              minX = Math.min(minX, el.x + x);
              maxX = Math.max(maxX, el.x + x);
              minY = Math.min(minY, el.y + y);
              maxY = Math.max(maxY, el.y + y);
            } else {
              minX = Math.min(minX, el.x + dx);
              maxX = Math.max(maxX, el.x + dx);
              minY = Math.min(minY, el.y + dy);
              maxY = Math.max(maxY, el.y + dy);
            }
          });
        }
      });
      
      return { 
        minX, 
        maxX, 
        minY, 
        maxY, 
        width: maxX - minX, 
        height: maxY - minY,
        centerX: (minX + maxX) / 2,
        centerY: (minY + maxY) / 2
      };
    },
    getStageSize: () => stageSize,
    getStagePosition: () => {
      if (!stageRef.current) return { x: 0, y: 0 };
      const container = stageRef.current.container();
      const rect = container.getBoundingClientRect();
      return { x: rect.left, y: rect.top };
    }
  }));

  // Actualizar transformer para selección múltiple
  useEffect(() => {
    if (!trRef.current || !stageRef.current) return;

    const stage = stageRef.current;
    const selectedNodes: Konva.Node[] = [];

    if (selectedIds.length > 0) {
      selectedIds.forEach(id => {
        const node = stage.findOne(`#${id}`);
        if (node) selectedNodes.push(node);
      });
    } else if (selectedId) {
      const node = stage.findOne(`#${selectedId}`);
      if (node) selectedNodes.push(node);
    }

    trRef.current.nodes(selectedNodes);
    trRef.current.getLayer()?.batchDraw();
  }, [selectedId, selectedIds, elements]);

  // Manejar inicio de selección
  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = stageRef.current;
    if (!stage) return;

    if (e.target === stage) {
      if (e.evt.shiftKey) {
        const pointer = stage.getPointerPosition();
        if (pointer) {
          selectionStarted.current = true;
          selectionStartPos.current = { x: pointer.x, y: pointer.y };
          setSelectionRect({
            x: pointer.x,
            y: pointer.y,
            width: 0,
            height: 0,
            visible: true,
          });
        }
      } else {
        if (setSelectedIds) {
          setSelectedIds([]);
        }
        setSelectedId(null);
      }
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!selectionStarted.current || !stageRef.current) return;

    const stage = stageRef.current;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const start = selectionStartPos.current;
    const x = Math.min(start.x, pointer.x);
    const y = Math.min(start.y, pointer.y);
    const width = Math.abs(pointer.x - start.x);
    const height = Math.abs(pointer.y - start.y);

    setSelectionRect({
      x,
      y,
      width,
      height,
      visible: true,
    });
  };

  const handleMouseUp = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (!selectionStarted.current || !stageRef.current || !setSelectedIds) {
      selectionStarted.current = false;
      setSelectionRect(prev => ({ ...prev, visible: false }));
      return;
    }

    const stage = stageRef.current;
    const rect = selectionRect;

    const elementsInRect = elements.filter(el => {
      if (el.visible === false) return false;

      const node = stage.findOne(`#${el.id}`);
      if (!node) return false;

      const box = node.getClientRect();
      const stageBox = {
        x: rect.x / zoom,
        y: rect.y / zoom,
        width: rect.width / zoom,
        height: rect.height / zoom,
      };

      return (
        box.x >= stageBox.x &&
        box.y >= stageBox.y &&
        box.x + box.width <= stageBox.x + stageBox.width &&
        box.y + box.height <= stageBox.y + stageBox.height
      );
    });

    const newSelectedIds = elementsInRect.map(el => el.id);
    setSelectedIds(newSelectedIds);
    
    if (newSelectedIds.length > 0) {
      setSelectedId(newSelectedIds[0]);
    }

    selectionStarted.current = false;
    setSelectionRect(prev => ({ ...prev, visible: false }));
  };

  // Dibujar guías de seguridad en el canvas
  const renderSafeGuides = () => {
    if (!showSafeGuides || !stageRef.current) return null;

    const platform = PLATFORM_GUIDES[guidePlatform];
    const width = stageSize.width;
    const height = stageSize.height;
    
    const guideSize = Math.min(width, height) * 0.9;
    const safeSize = guideSize * platform.safeArea;
    const startX = (width - guideSize) / 2;
    const startY = (height - guideSize) / 2;
    const safeX = (width - safeSize) / 2;
    const safeY = (height - safeSize) / 2;

    const guides = [];

    // Marco exterior
    guides.push(
      <Rect
        key="outer-frame"
        x={startX}
        y={startY}
        width={guideSize}
        height={guideSize}
        stroke="#4b5563"
        strokeWidth={1 / zoom}
        dash={[5 / zoom, 5 / zoom]}
        listening={false}
      />
    );

    // Área segura principal
    guides.push(
      <Rect
        key="safe-area"
        x={safeX}
        y={safeY}
        width={safeSize}
        height={safeSize}
        stroke="#10b981"
        strokeWidth={2 / zoom}
        dash={[8 / zoom, 4 / zoom]}
        listening={false}
      />
    );

    // Para Android, mostrar área de foreground
    if (guidePlatform === 'android' && platform.foregroundSize) {
      const fgSize = guideSize * platform.foregroundSize;
      const fgX = (width - fgSize) / 2;
      const fgY = (height - fgSize) / 2;
      
      guides.push(
        <Rect
          key="foreground-area"
          x={fgX}
          y={fgY}
          width={fgSize}
          height={fgSize}
          stroke="#f59e0b"
          strokeWidth={1.5 / zoom}
          dash={[4 / zoom, 4 / zoom]}
          listening={false}
        />
      );
    }

    // Líneas centrales
    guides.push(
      <Line
        key="center-x"
        points={[0, height / 2, width, height / 2]}
        stroke="#6b7280"
        strokeWidth={1 / zoom}
        dash={[4 / zoom, 6 / zoom]}
        listening={false}
      />
    );

    guides.push(
      <Line
        key="center-y"
        points={[width / 2, 0, width / 2, height]}
        stroke="#6b7280"
        strokeWidth={1 / zoom}
        dash={[4 / zoom, 6 / zoom]}
        listening={false}
      />
    );

    // Texto informativo
    if (zoom > 0.5) {
      guides.push(
        <Text
          key="platform-label"
          x={20}
          y={20}
          text={platform.name}
          fontSize={14 / zoom}
          fontFamily="Arial"
          fill="#ffffff"
          shadowColor="rgba(0,0,0,0.8)"
          shadowBlur={8}
          listening={false}
        />
      );

      guides.push(
        <Text
          key="platform-desc"
          x={20}
          y={40 / zoom}
          text={platform.description}
          fontSize={12 / zoom}
          fontFamily="Arial"
          fill="#d1d5db"
          shadowColor="rgba(0,0,0,0.8)"
          shadowBlur={4}
          listening={false}
        />
      );
    }

    return guides;
  };

  // Renderizar grid más pequeño para iconos
  const renderGrid = () => {
    if (!gridEnabled) return null;

    const gridLines = [];
    const step = gridSize;
    const width = stageSize.width;
    const height = stageSize.height;

    // Líneas verticales
    for (let i = step; i < width; i += step) {
      gridLines.push(
        <Line
          key={`v-${i}`}
          points={[i, 0, i, height]}
          stroke="#2d3748"
          strokeWidth={0.3 / zoom}
          opacity={0.5}
          listening={false}
        />
      );
    }

    // Líneas horizontales
    for (let i = step; i < height; i += step) {
      gridLines.push(
        <Line
          key={`h-${i}`}
          points={[0, i, width, i]}
          stroke="#2d3748"
          strokeWidth={0.3 / zoom}
          opacity={0.5}
          listening={false}
        />
      );
    }

    // Líneas más gruesas cada 5 pasos
    const boldStep = step * 5;
    for (let i = boldStep; i < width; i += boldStep) {
      gridLines.push(
        <Line
          key={`v-bold-${i}`}
          points={[i, 0, i, height]}
          stroke="#4a5568"
          strokeWidth={0.8 / zoom}
          opacity={0.7}
          listening={false}
        />
      );
    }

    for (let i = boldStep; i < height; i += boldStep) {
      gridLines.push(
        <Line
          key={`h-bold-${i}`}
          points={[0, i, width, i]}
          stroke="#4a5568"
          strokeWidth={0.8 / zoom}
          opacity={0.7}
          listening={false}
        />
      );
    }

    return gridLines;
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full flex items-center justify-center bg-[#05050a]"
    >
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        ref={stageRef}
        scaleX={zoom}
        scaleY={zoom}
        className="bg-[#161625] rounded-xl shadow-2xl"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {/* Grid */}
          {renderGrid()}

          {/* Guías de seguridad */}
          {renderSafeGuides()}

          {/* Elementos del diseño */}
          {elements.filter(el => el.visible !== false).map((el) => {
            const common = {
              id: el.id,
              key: el.id,
              x: el.x,
              y: el.y,
              rotation: el.rotation,
              scaleX: el.scaleX || 1,
              scaleY: el.scaleY || 1,
              draggable: true,
              fill: el.fill,
              opacity: el.opacity ?? 1,
              visible: el.visible !== false,
              onClick: (e: Konva.KonvaEventObject<MouseEvent>) => {
                e.cancelBubble = true;
                
                if (e.evt.shiftKey && setSelectedIds) {
                  if (selectedIds.includes(el.id)) {
                    setSelectedIds(selectedIds.filter(id => id !== el.id));
                    if (selectedId === el.id) {
                      setSelectedId(selectedIds[0] || null);
                    }
                  } else {
                    setSelectedIds([...selectedIds, el.id]);
                  }
                } else {
                  setSelectedId(el.id);
                  if (setSelectedIds) {
                    setSelectedIds([el.id]);
                  }
                }
              },
              onDragEnd: (e: any) => {
                if (selectedIds.length > 1) {
                  const dx = e.target.x() - el.x;
                  const dy = e.target.y() - el.y;
                  
                  setElements((prev) =>
                    prev.map((item) =>
                      selectedIds.includes(item.id)
                        ? { ...item, x: item.x + dx, y: item.y + dy }
                        : item
                    )
                  );
                } else {
                  setElements((prev) =>
                    prev.map((item) =>
                      item.id === el.id
                        ? { ...item, x: e.target.x(), y: e.target.y() }
                        : item
                    )
                  );
                }
              },
              onDragMove: (e: any) => {
                if (snapToGrid && selectedIds.length === 1) {
                  const x = Math.round(e.target.x() / gridSize) * gridSize;
                  const y = Math.round(e.target.y() / gridSize) * gridSize;
                  e.target.position({ x, y });
                }
              },
            };

            switch (el.type) {
              case "circle":
                return <Circle {...common} radius={el.size / 2} />;
              case "rect":
                return <Rect {...common} width={el.size} height={el.size} cornerRadius={el.cornerRadius || 0} />;
              case "triangle":
                return <RegularPolygon {...common} sides={3} radius={el.size / 2} />;
              case "star":
                return (
                  <Star
                    {...common}
                    numPoints={el.numPoints || 5}
                    outerRadius={el.size / 2}
                    innerRadius={el.innerRadius || el.size / 4}
                  />
                );
              case "polygon":
                return <RegularPolygon {...common} sides={el.numPoints || 6} radius={el.size / 2} />;
              case "text":
                return (
                  <Text
                    {...common}
                    text={
                      el.uppercase
                        ? (el.text || "TEXT").toUpperCase()
                        : el.text || "Text"
                    }
                    fontSize={el.fontSize || 60}
                    fontFamily={el.fontFamily || "Arial"}
                    fontStyle={`${el.fontStyle === "italic" ? "italic " : ""}${el.fontWeight || 400}`}
                    letterSpacing={el.letterSpacing || 0}
                    lineHeight={el.lineHeight || 1}
                    align={el.align || "left"}
                    stroke={el.strokeEnabled ? el.stroke : undefined}
                    strokeWidth={el.strokeEnabled ? (el.strokeWidth || 0) : 0}
                    shadowColor={el.shadowEnabled ? el.shadowColor : undefined}
                    shadowBlur={el.shadowEnabled ? (el.shadowBlur || 0) : 0}
                    shadowOffsetX={el.shadowEnabled ? (el.shadowOffsetX || 0) : 0}
                    shadowOffsetY={el.shadowEnabled ? (el.shadowOffsetY || 0) : 0}
                    shadowOpacity={el.shadowEnabled ? (el.shadowOpacity || 0.5) : 0}
                    textDecoration={el.textDecoration}
                  />
                );
              default:
                return null;
            }
          })}

          {/* Rectángulo de selección */}
          {selectionRect.visible && (
            <Rect
              x={selectionRect.x}
              y={selectionRect.y}
              width={selectionRect.width}
              height={selectionRect.height}
              stroke="#06b6d4"
              strokeWidth={2 / zoom}
              dash={[10 / zoom, 5 / zoom]}
              fill="rgba(6, 182, 212, 0.1)"
            />
          )}

          {/* Transformer para elementos seleccionados */}
          {(selectedId || selectedIds.length > 0) && (
            <Transformer
              ref={trRef}
              rotateEnabled={true}
              enabledAnchors={[
                'top-left', 'top-center', 'top-right',
                'middle-right', 'middle-left',
                'bottom-left', 'bottom-center', 'bottom-right'
              ]}
              boundBoxFunc={(oldBox, newBox) => {
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox;
                }
                return newBox;
              }}
              onTransformEnd={() => {
                if (selectedIds.length > 1 && trRef.current) {
                  const nodes = trRef.current.nodes();
                  const updates: Record<string, Partial<EditorElement>> = {};
                  
                  nodes.forEach((node) => {
                    const id = node.id();
                    const element = elements.find(el => el.id === id);
                    
                    if (element) {
                      updates[id] = {
                        x: node.x(),
                        y: node.y(),
                        rotation: node.rotation(),
                        scaleX: node.scaleX(),
                        scaleY: node.scaleY(),
                      };
                      
                      if (element.type === 'rect' || element.type === 'text') {
                        updates[id].size = node.width();
                      } else if (element.type === 'circle') {
                        const circle = node as any;
                        updates[id].size = circle.radius() * 2;
                      } else if (element.type === 'star') {
                        const star = node as any;
                        updates[id].size = star.outerRadius() * 2;
                      } else if (element.type === 'polygon' || element.type === 'triangle') {
                        const polygon = node as any;
                        updates[id].size = polygon.radius() * 2;
                      }
                    }
                  });

                  setElements((prev) =>
                    prev.map((el) => {
                      const update = updates[el.id];
                      return update ? { ...el, ...update } : el;
                    })
                  );
                }
              }}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
});

EditorCanvas.displayName = 'EditorCanvas';

export default EditorCanvas;