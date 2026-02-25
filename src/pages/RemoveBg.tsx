// src/pages/RemoveBg.tsx
import { useState } from "react";
import { removeBackground } from "@imgly/background-removal";
import ImageUploader from "../components/ImageTools/ImageUploader";
import ImageResult from "../components/ImageTools/ImageResult";
import BackgroundTools from "../components/ImageTools/BackgroundTools";
import Navbar from "../components/Navbar";

export default function RemoveBg() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTools, setShowTools] = useState(false);

  const handleImageSelect = (file: File) => {
    if (originalPreview) URL.revokeObjectURL(originalPreview);

    const previewUrl = URL.createObjectURL(file);

    setSelectedImage(file);
    setOriginalPreview(previewUrl);
    setProcessedImage(null);
    setError(null);
    setShowTools(false);
  };

  const resizeImage = (file: File, maxSize: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject("Error leyendo imagen");

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let width = img.width;
        let height = img.height;

        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height *= maxSize / width;
            width = maxSize;
          } else {
            width *= maxSize / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject("Error redimensionando imagen");
          },
          "image/png",
          1.0
        );
      };

      img.onerror = () => reject("Error cargando imagen");

      reader.readAsDataURL(file);
    });
  };

  const handleProcessImage = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setError(null);

    try {
      const resizedBlob = await resizeImage(selectedImage, 1024);
      const resultBlob = await removeBackground(resizedBlob);

      const resultUrl = URL.createObjectURL(resultBlob);
      setProcessedImage(resultUrl);

      // 👇 NO abrir editor automáticamente
      setShowTools(false);
    } catch (err) {
      console.error(err);
      setError("Error procesando la imagen. Intenta con una imagen más pequeña.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEditorUpdate = (blob: Blob) => {
    if (processedImage) URL.revokeObjectURL(processedImage);
    const url = URL.createObjectURL(blob);
    setProcessedImage(url);
  };

  const handleClear = () => {
    if (processedImage) URL.revokeObjectURL(processedImage);
    if (originalPreview) URL.revokeObjectURL(originalPreview);

    setSelectedImage(null);
    setOriginalPreview(null);
    setProcessedImage(null);
    setError(null);
    setShowTools(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#1a1a2e] text-white">
      <Navbar activeTab="/remove-bg" />

      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-500 text-transparent bg-clip-text mb-4">
            Remove Background
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Elimina el fondo de tus imágenes automáticamente y edítalas al instante.
          </p>
        </div>

        {/* Card principal */}
        <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-800 shadow-xl">
          
          <ImageUploader
            onImageSelect={handleImageSelect}
            onClear={handleClear}
            selectedImage={selectedImage}
            error={error}
          />

          {selectedImage && originalPreview && (
            <div className="space-y-8 mt-8">

              {/* Resultado normal */}
              {!showTools && (
                <ImageResult
                  originalImage={originalPreview}
                  processedImage={processedImage}
                  isProcessing={isProcessing}
                  onProcess={handleProcessImage}
                  onReset={handleClear}
                  error={error}
                />
              )}

              {/* Botón Editar */}
              {processedImage && !showTools && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setShowTools(true)}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:opacity-90 text-white rounded-2xl font-semibold transition shadow-xl"
                  >
                    ✏️ Editar Imagen
                  </button>
                </div>
              )}

              {/* Editor */}
              {processedImage && showTools && (
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-purple-400">
                      Editor Avanzado
                    </h3>
                    <button
                      onClick={() => setShowTools(false)}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition"
                    >
                      Cerrar Editor
                    </button>
                  </div>

                  <BackgroundTools
                    imageUrl={processedImage}
                    onUpdate={handleEditorUpdate}
                  />
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}