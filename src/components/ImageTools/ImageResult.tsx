// src/components/ImageTools/ImageResult.tsx
import { useState } from "react";
import {
  FiDownload,
  FiCopy,
  FiCheck,
  FiRefreshCw,
  FiAlertCircle,
  FiEdit2,
} from "react-icons/fi";

interface ImageResultProps {
  originalImage: string;
  processedImage: string | null;
  isProcessing: boolean;
  onProcess: () => void;
  onReset: () => void;
  error?: string | null;
}

export default function ImageResult({
  originalImage,
  processedImage,
  isProcessing,
  onProcess,
  onReset,
  error,
}: ImageResultProps) {
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    if (!processedImage) return;

    const link = document.createElement("a");
    link.href = processedImage;
    link.download = `ynstudio-removed-bg-${Date.now()}.png`;
    link.click();
  };

  const handleCopy = async () => {
    if (!processedImage) return;

    try {
      const blob = await fetch(processedImage).then((r) => r.blob());

      if (!navigator.clipboard || !("ClipboardItem" in window)) {
        alert("Tu navegador no soporta copiar imágenes.");
        return;
      }

      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Original */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-400">Original</h3>
          <div className="relative rounded-xl overflow-hidden border border-gray-800 bg-[url('data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'10\' height=\'10\' fill=\'%23333\'/%3E%3Crect x=\'10\' y=\'10\' width=\'10\' height=\'10\' fill=\'%23333\'/%3E%3Crect x=\'10\' width=\'10\' height=\'10\' fill=\'%23444\'/%3E%3Crect y=\'10\' width=\'10\' height=\'10\' fill=\'%23444\'/%3E%3C/svg%3E')]">
            <img
              src={originalImage}
              alt="Original"
              className="w-full h-80 object-contain bg-transparent"
            />
          </div>
        </div>

        {/* Procesado */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-400">Sin fondo</h3>
          <div className="relative rounded-xl overflow-hidden border border-cyan-500/30 bg-[url('data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'10\' height=\'10\' fill=\'%23333\'/%3E%3Crect x=\'10\' y=\'10\' width=\'10\' height=\'10\' fill=\'%23333\'/%3E%3Crect x=\'10\' width=\'10\' height=\'10\' fill=\'%23444\'/%3E%3Crect y=\'10\' width=\'10\' height=\'10\' fill=\'%23444\'/%3E%3C/svg%3E')]">
            {isProcessing ? (
              <div className="w-full h-80 flex items-center justify-center bg-gray-900/50">
                <div className="text-center">
                  <FiRefreshCw className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-3" />
                  <p className="text-gray-400">Procesando imagen...</p>
                </div>
              </div>
            ) : processedImage ? (
              <img
                src={processedImage}
                alt="Sin fondo"
                className="w-full h-80 object-contain bg-transparent"
              />
            ) : (
              <div className="w-full h-80 flex items-center justify-center bg-gray-900/30">
                <p className="text-gray-500">
                  Haz clic en "Quitar fondo"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mostrar error si existe */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2 justify-center">
          <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Acciones */}
      <div className="flex flex-wrap gap-4 justify-center">
        {!processedImage && !isProcessing && (
          <button
            onClick={onProcess}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/30 transform hover:scale-105"
          >
            Quitar fondo
          </button>
        )}

        {processedImage && (
          <>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-green-500/30"
            >
              <FiDownload className="w-5 h-5" />
              Descargar PNG
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all border border-gray-700"
            >
              {copied ? (
                <>
                  <FiCheck className="w-5 h-5 text-green-400" />
                  ¡Copiado!
                </>
              ) : (
                <>
                  <FiCopy className="w-5 h-5" />
                  Copiar imagen
                </>
              )}
            </button>
          </>
        )}

        {(processedImage || isProcessing) && (
          <button
            onClick={onReset}
            className="px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 font-semibold rounded-xl transition-all border border-gray-700"
          >
            Nueva imagen
          </button>
        )}
      </div>
    </div>
  );
}