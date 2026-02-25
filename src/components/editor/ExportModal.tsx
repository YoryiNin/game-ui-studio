import { useState, useRef, useEffect } from "react";
import type { EditorElement } from "../../types/EditorElement";
import { FiDownload, FiX, FiImage, FiGrid, FiZoomIn, FiZoomOut } from "react-icons/fi";
import { PLATFORM_GUIDES, PLATFORM_SIZES, type PlatformKey } from "../../types/platforms";

interface Props {
  elements: EditorElement[];
  onClose: () => void;
  canvasRef: React.RefObject<any>;
}

export default function ExportModal({ elements, onClose, canvasRef }: Props) {
  const [options, setOptions] = useState({
    format: "png" as "png" | "jpg" | "webp",
    quality: 90,
    backgroundColor: "#000000" as string,
    transparent: false,
    padding: 40
  });

  const [exporting, setExporting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewSize, setPreviewSize] = useState({ width: 0, height: 0 });
  const [showGuides, setShowGuides] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformKey>("icon");
  const [previewScale, setPreviewScale] = useState(1);
  const previewRef = useRef<HTMLDivElement>(null);

  const getStage = () => canvasRef.current?.getStage?.() || canvasRef.current;
  const getBoundingBox = () => canvasRef.current?.getBoundingBox?.() || null;
  const getStageSize = () => canvasRef.current?.getStageSize?.() || { width: 800, height: 600 };

  // Generar preview
  useEffect(() => {
    const generatePreview = async () => {
      const stage = getStage();
      const bbox = getBoundingBox();
      
      if (!stage || !bbox || !elements.length) return;

      setExporting(true);
      
      const padding = options.padding;
      const captureX = bbox.minX - padding;
      const captureY = bbox.minY - padding;
      const captureWidth = bbox.width + padding * 2;
      const captureHeight = bbox.height + padding * 2;

      try {
        const dataUrl = stage.toDataURL({
          mimeType: 'image/png',
          pixelRatio: 2,
          x: captureX,
          y: captureY,
          width: captureWidth,
          height: captureHeight,
          ...(!options.transparent && { backgroundColor: options.backgroundColor })
        });
        
        setPreviewUrl(dataUrl);
        setPreviewSize({ 
          width: captureWidth, 
          height: captureHeight 
        });
        
        setPreviewScale(1);
      } catch (error) {
        console.error('Preview failed:', error);
      } finally {
        setExporting(false);
      }
    };

    generatePreview();
  }, [options.transparent, options.backgroundColor, options.padding, elements, selectedPlatform]);

  const checkSafeArea = () => {
    const bbox = getBoundingBox();
    if (!bbox) return { isSafe: true, message: "" };

    const platform = PLATFORM_GUIDES[selectedPlatform];
    const totalSize = Math.max(bbox.width + options.padding * 2, bbox.height + options.padding * 2);
    const contentRatio = Math.max(bbox.width, bbox.height) / totalSize;
    const isSafe = contentRatio <= platform.safeArea;
    
    return {
      isSafe,
      message: isSafe 
        ? "✓ Logo dentro del área segura" 
        : `⚠ Área segura: ${Math.round(platform.safeArea * 100)}%`
    };
  };

  // Función mejorada para exportar iconos
  const exportIcon = async (targetSize: number) => {
    const stage = getStage();
    const bbox = getBoundingBox();
    if (!stage || !bbox) return;

    setExporting(true);

    try {
      const platform = PLATFORM_GUIDES[selectedPlatform];
      
      // Calcular dimensiones del contenido con padding
      const contentWidth = bbox.width + options.padding * 2;
      const contentHeight = bbox.height + options.padding * 2;
      
      // Calcular escala para que quepa en targetSize respetando el área segura
      const scale = Math.min(
        (targetSize * platform.safeArea) / contentWidth,
        (targetSize * platform.safeArea) / contentHeight
      );

      // Dimensiones escaladas
      const scaledWidth = contentWidth * scale;
      const scaledHeight = contentHeight * scale;
      
      // Posición para centrar
      const offsetX = (targetSize - scaledWidth) / 2;
      const offsetY = (targetSize - scaledHeight) / 2;

      // Crear canvas temporal para redimensionamiento de alta calidad
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = targetSize;
      tempCanvas.height = targetSize;
      const ctx = tempCanvas.getContext('2d');
      
      if (!ctx) return;

      // Configurar fondo si no es transparente
      if (!options.transparent) {
        ctx.fillStyle = options.backgroundColor;
        ctx.fillRect(0, 0, targetSize, targetSize);
      } else {
        // Asegurar que el canvas sea transparente
        ctx.clearRect(0, 0, targetSize, targetSize);
      }

      // Configurar calidad de imagen
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Capturar el stage con las opciones correctas
      let dataUrl: string;
      
      if (options.transparent) {
        // Sin fondo
        dataUrl = stage.toDataURL({
          mimeType: 'image/png',
          pixelRatio: scale,
          x: bbox.minX - options.padding,
          y: bbox.minY - options.padding,
          width: contentWidth,
          height: contentHeight
        });
      } else {
        // Con fondo
        dataUrl = stage.toDataURL({
          mimeType: 'image/png',
          pixelRatio: scale,
          x: bbox.minX - options.padding,
          y: bbox.minY - options.padding,
          width: contentWidth,
          height: contentHeight,
          backgroundColor: options.backgroundColor
        });
      }

      // Crear imagen y dibujar en el canvas
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = dataUrl;
      });

      // Dibujar la imagen centrada
      ctx.drawImage(
        img,
        offsetX, offsetY, scaledWidth, scaledHeight
      );

      // Convertir al formato deseado
      let finalDataUrl: string | undefined;
      
      if (options.format === 'jpg') {
        // Para JPG, necesitamos un fondo sólido
        const jpgCanvas = document.createElement('canvas');
        jpgCanvas.width = targetSize;
        jpgCanvas.height = targetSize;
        const jpgCtx = jpgCanvas.getContext('2d');
        
        if (jpgCtx) {
          // Fondo blanco por defecto para JPG (no soporta transparencia)
          jpgCtx.fillStyle = options.transparent ? '#FFFFFF' : options.backgroundColor;
          jpgCtx.fillRect(0, 0, targetSize, targetSize);
          jpgCtx.drawImage(tempCanvas, 0, 0);
          finalDataUrl = jpgCanvas.toDataURL('image/jpeg', options.quality / 100);
        }
      } else if (options.format === 'webp') {
        finalDataUrl = tempCanvas.toDataURL('image/webp', options.quality / 100);
      } else {
        finalDataUrl = tempCanvas.toDataURL('image/png');
      }

      // Descargar si tenemos una URL válida
      if (finalDataUrl) {
        const link = document.createElement('a');
        link.download = `${selectedPlatform}-${targetSize}x${targetSize}.${options.format}`;
        link.href = finalDataUrl;
        link.click();
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  // Exportar estándar (tamaño original)
  const exportStandard = async () => {
    const stage = getStage();
    const bbox = getBoundingBox();
    if (!stage || !bbox) return;

    setExporting(true);

    try {
      const captureWidth = bbox.width + options.padding * 2;
      const captureHeight = bbox.height + options.padding * 2;

      // Determinar el mimeType según el formato
      const mimeType = options.format === 'jpg' ? 'image/jpeg' : 
                      options.format === 'webp' ? 'image/webp' : 'image/png';

      // Capturar con o sin fondo según la opción transparent
      let dataUrl: string;
      
      if (options.transparent) {
        dataUrl = stage.toDataURL({
          mimeType,
          quality: options.quality / 100,
          pixelRatio: 2,
          x: bbox.minX - options.padding,
          y: bbox.minY - options.padding,
          width: captureWidth,
          height: captureHeight
        });
      } else {
        dataUrl = stage.toDataURL({
          mimeType,
          quality: options.quality / 100,
          pixelRatio: 2,
          x: bbox.minX - options.padding,
          y: bbox.minY - options.padding,
          width: captureWidth,
          height: captureHeight,
          backgroundColor: options.backgroundColor
        });
      }

      const link = document.createElement('a');
      link.download = `logo-${Math.round(captureWidth)}x${Math.round(captureHeight)}.${options.format}`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  // Exportar todos los tamaños con delay
  const exportAllSizes = async (sizes: readonly number[]) => {
    setExporting(true);
    
    try {
      for (let i = 0; i < sizes.length; i++) {
        await exportIcon(sizes[i]);
        // Pequeña pausa entre exportaciones para no bloquear el navegador
        if (i < sizes.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
    } catch (error) {
      console.error('Export all sizes failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const safeArea = checkSafeArea();

  const getSizesForPlatform = (platform: PlatformKey): readonly number[] => {
    return PLATFORM_SIZES[platform] || PLATFORM_SIZES.all;
  };

  const getMainSize = (platform: PlatformKey): number => {
    const sizes = getSizesForPlatform(platform);
    return sizes[sizes.length - 1];
  };

  const handleZoomIn = () => {
    setPreviewScale(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setPreviewScale(prev => Math.max(prev / 1.2, 0.5));
  };

  const resetZoom = () => {
    setPreviewScale(1);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#1a1a2e] rounded-xl w-[900px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#1a1a2e] z-10">
          <h2 className="text-xl font-bold text-cyan-400">Exportar Logo</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Selector de Plataforma */}
          <div>
            <label className="text-sm text-white/50 block mb-2">Plataforma</label>
            <div className="grid grid-cols-5 gap-2">
              {(Object.entries(PLATFORM_GUIDES) as [PlatformKey, typeof PLATFORM_GUIDES[PlatformKey]][]).map(([key, guide]) => (
                <button
                  key={key}
                  onClick={() => setSelectedPlatform(key)}
                  className={`p-2 rounded-lg border text-sm transition ${
                    selectedPlatform === key
                      ? 'border-cyan-400 bg-cyan-500/20 text-cyan-400'
                      : 'border-white/10 hover:border-white/30 text-white/70'
                  }`}
                >
                  {guide.name}
                </button>
              ))}
            </div>
          </div>

          {/* Preview con zoom */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-white/50">Vista previa</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowGuides(!showGuides)}
                  className={`flex items-center space-x-2 px-3 py-1 rounded-lg border text-sm ${
                    showGuides ? 'border-cyan-400 bg-cyan-500/20 text-cyan-400' : 'border-white/10'
                  }`}
                >
                  <FiGrid className="w-4 h-4" />
                  <span>Guías</span>
                </button>
                
                <button
                  onClick={handleZoomOut}
                  className="p-2 hover:bg-white/10 rounded-lg border border-white/10"
                  disabled={previewScale <= 0.5}
                >
                  <FiZoomOut className="w-4 h-4" />
                </button>
                
                <button
                  onClick={resetZoom}
                  className="px-2 py-1 text-sm hover:bg-white/10 rounded-lg border border-white/10"
                >
                  {Math.round(previewScale * 100)}%
                </button>
                
                <button
                  onClick={handleZoomIn}
                  className="p-2 hover:bg-white/10 rounded-lg border border-white/10"
                  disabled={previewScale >= 3}
                >
                  <FiZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-[#0f0f1a] rounded-lg p-4 flex items-center justify-center min-h-[350px] border-2 border-dashed border-white/10 overflow-auto">
              {exporting && !previewUrl ? (
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400" />
              ) : previewUrl ? (
                <div 
                  ref={previewRef}
                  className="relative inline-block transition-transform duration-200"
                  style={{ 
                    transform: `scale(${previewScale})`,
                    transformOrigin: 'center'
                  }}
                >
                  <img 
                    src={previewUrl}
                    alt="Preview"
                    className="max-w-none rounded-lg shadow-2xl"
                    style={{
                      width: previewSize.width,
                      height: previewSize.height
                    }}
                  />
                  
                  {/* Overlay de guías de seguridad */}
                  {showGuides && (
                    <svg 
                      className="absolute inset-0 pointer-events-none"
                      width={previewSize.width}
                      height={previewSize.height}
                      viewBox={`0 0 ${previewSize.width} ${previewSize.height}`}
                    >
                      {/* Área segura */}
                      <rect
                        x={options.padding}
                        y={options.padding}
                        width={previewSize.width - options.padding * 2}
                        height={previewSize.height - options.padding * 2}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth={2}
                        strokeDasharray="8 4"
                        opacity={0.7}
                      />
                      
                      {/* Líneas centrales */}
                      <line
                        x1={previewSize.width / 2}
                        y1="0"
                        x2={previewSize.width / 2}
                        y2={previewSize.height}
                        stroke="#6b7280"
                        strokeWidth={1}
                        strokeDasharray="4 6"
                        opacity={0.5}
                      />
                      <line
                        x1="0"
                        y1={previewSize.height / 2}
                        x2={previewSize.width}
                        y2={previewSize.height / 2}
                        stroke="#6b7280"
                        strokeWidth={1}
                        strokeDasharray="4 6"
                        opacity={0.5}
                      />
                    </svg>
                  )}
                  
                  {/* Información del tamaño */}
                  <div className="absolute bottom-2 right-2 bg-black/70 px-3 py-1.5 rounded-lg text-sm">
                    <div className="text-white/70">
                      {Math.round(previewSize.width)} x {Math.round(previewSize.height)} px
                    </div>
                    <div className={`text-xs ${safeArea.isSafe ? 'text-green-400' : 'text-yellow-400'}`}>
                      {safeArea.message}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-white/30 flex flex-col items-center">
                  <FiImage className="w-16 h-16 mb-3" />
                  <p>Sin elementos</p>
                </div>
              )}
            </div>
          </div>

          {/* Opciones básicas */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-white/50 block mb-2">Formato</label>
              <select
                value={options.format}
                onChange={(e) => setOptions({ ...options, format: e.target.value as "png" | "jpg" | "webp" })}
                className="w-full bg-[#0f0f1a] rounded-lg px-3 py-2 border border-white/10"
              >
                <option value="png">PNG (transparencia)</option>
                <option value="jpg">JPG (sin transparencia)</option>
                <option value="webp">WebP (moderno)</option>
              </select>
            </div>

            {options.format !== 'png' && (
              <div>
                <label className="text-sm text-white/50 block mb-2">Calidad</label>
                <input
                  type="range"
                  min="60"
                  max="100"
                  value={options.quality}
                  onChange={(e) => setOptions({ ...options, quality: parseInt(e.target.value) })}
                  className="w-full accent-cyan-500"
                />
                <span className="text-xs text-white/50">{options.quality}%</span>
              </div>
            )}

            <div>
              <label className="text-sm text-white/50 block mb-2">Padding</label>
              <input
                type="range"
                min="0"
                max="100"
                value={options.padding}
                onChange={(e) => setOptions({ ...options, padding: parseInt(e.target.value) })}
                className="w-full accent-cyan-500"
              />
              <span className="text-xs text-white/50">{options.padding}px</span>
            </div>
          </div>

          {/* Opciones de fondo */}
          <div className="flex items-center space-x-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={options.transparent}
                onChange={(e) => setOptions({ ...options, transparent: e.target.checked })}
                className="rounded bg-[#0f0f1a] border-white/20"
                disabled={options.format === 'jpg'}
              />
              <span className="text-sm">Fondo transparente</span>
            </label>
            
            {!options.transparent && (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-white/50">Color:</span>
                <input
                  type="color"
                  value={options.backgroundColor}
                  onChange={(e) => setOptions({ ...options, backgroundColor: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer border-2 border-white/10"
                />
                <span className="text-sm font-mono bg-[#0f0f1a] px-2 py-1 rounded">
                  {options.backgroundColor}
                </span>
              </div>
            )}
          </div>

          {/* Botones de exportación */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
            <button
              onClick={exportStandard}
              disabled={exporting || !elements.length}
              className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition disabled:opacity-50"
            >
              <FiImage className="w-5 h-5 mx-auto mb-2" />
              <span className="text-sm font-medium">Exportar estándar</span>
              <span className="text-xs text-white/50 block mt-1">
                {previewSize.width} x {previewSize.height} px
              </span>
            </button>

            <button
              onClick={() => exportIcon(getMainSize(selectedPlatform))}
              disabled={exporting || !elements.length}
              className="p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition disabled:opacity-50"
            >
              <FiDownload className="w-5 h-5 mx-auto mb-2" />
              <span className="text-sm font-medium">Icono principal</span>
              <span className="text-xs text-white/50 block mt-1">
                {getMainSize(selectedPlatform)}px
              </span>
            </button>

            <button
              onClick={() => exportAllSizes(getSizesForPlatform(selectedPlatform))}
              disabled={exporting || !elements.length}
              className="p-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 rounded-lg border border-cyan-500/30 transition disabled:opacity-50"
            >
              <FiDownload className="w-5 h-5 mx-auto mb-2 text-cyan-400" />
              <span className="text-sm font-medium">Exportar todos</span>
              <span className="text-xs text-white/50 block mt-1">
                {getSizesForPlatform(selectedPlatform).length} tamaños
              </span>
            </button>
          </div>

          {/* Botón de cancelar */}
          <div className="flex">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}