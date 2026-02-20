// src/pages/RemoveBg.tsx
import { useState } from "react";
import { removeBackground } from "@imgly/background-removal";
import ImageUploader from "../components/ImageTools/ImageUploader";
import ImageResult from "../components/ImageTools/ImageResult";
import BackgroundTools from "../components/ImageTools/BackgroundTools";

const RemoveBg = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTools, setShowTools] = useState(false);

  // Seleccionar imagen
  const handleImageSelect = (file: File) => {
    if (originalPreview) {
      URL.revokeObjectURL(originalPreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setSelectedImage(file);
    setOriginalPreview(previewUrl);
    setProcessedImage(null);
    setError(null);
    setShowTools(false);
  };

  // Redimensionar imagen
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

  // Procesar imagen principal
  const handleProcessImage = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setError(null);

    try {
      const resizedBlob = await resizeImage(selectedImage, 1024);

      const resultBlob = await removeBackground(resizedBlob, {
        progress: (key, current, total) => {
          console.log(`Modelo: ${key} ${current}/${total}`);
        },
      });

      const resultUrl = URL.createObjectURL(resultBlob);
      setProcessedImage(resultUrl);
      setShowTools(true); // Mostrar herramientas después de procesar

    } catch (err) {
      console.error("ERROR REAL:", err);
      setError("Error procesando la imagen. Intenta con una imagen más pequeña.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Actualizar desde el editor
  const handleEditorUpdate = (blob: Blob) => {
    if (processedImage) {
      URL.revokeObjectURL(processedImage);
    }
    
    const url = URL.createObjectURL(blob);
    setProcessedImage(url);
    // Las herramientas siguen mostrándose
  };

  // Volver a la vista de resultados
  const handleBackToResult = () => {
    setShowTools(false);
  };

  // Limpiar todo
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
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Uploader siempre arriba */}
      <ImageUploader
        onImageSelect={handleImageSelect}
        onClear={handleClear}
        selectedImage={selectedImage}
        error={error}
      />

      {selectedImage && originalPreview && (
        <div className="space-y-6">
          {/* Mostrar ImageResult solo cuando NO estamos en modo herramientas */}
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

          {/* Mostrar herramientas de edición cuando hay imagen procesada y showTools es true */}
          {processedImage && showTools && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">Herramientas de edición</h3>
                <button
                  onClick={handleBackToResult}
                  className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition"
                >
                  Volver al resultado
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
  );
};

export default RemoveBg;