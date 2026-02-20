import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload, FiImage, FiX, FiAlertCircle } from "react-icons/fi";

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  onClear: () => void;
  selectedImage: File | null;
  error?: string | null;
}

export default function ImageUploader({
  onImageSelect,
  onClear,
  selectedImage,
  error,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // 🔥 Generar preview cuando cambia selectedImage
  useEffect(() => {
    if (!selectedImage) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedImage]);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        const dropError = rejectedFiles[0].errors[0];

        if (dropError.code === "file-too-large") {
          setFileError("El archivo es demasiado grande. Máximo 10MB.");
        } else if (dropError.code === "file-invalid-type") {
          setFileError("Formato no válido. Usa PNG, JPG o WEBP.");
        } else {
          setFileError("Error al cargar el archivo.");
        }
        return;
      }

      setFileError(null);

      if (acceptedFiles.length > 0) {
        onImageSelect(acceptedFiles[0]);
      }
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
  });

  const handleClear = () => {
    setFileError(null);
    onClear();
  };

  const displayError = fileError || error;

  // 🔥 Si hay imagen seleccionada mostrar preview
  if (preview && selectedImage) {
    return (
      <div className="relative">
        <div className="relative rounded-xl overflow-hidden border-2 border-cyan-500/30">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-contain bg-gray-900"
          />

          <button
            onClick={handleClear}
            className="absolute top-2 right-2 p-2 bg-red-500/90 hover:bg-red-600 rounded-lg text-white transition-colors z-10"
            title="Eliminar imagen"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-400 mt-2 text-center">
          {selectedImage.name} (
          {(selectedImage.size / 1024).toFixed(2)} KB)
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
          ${displayError ? "border-red-500/50 bg-red-500/5" : ""}
          ${
            isDragActive
              ? "border-cyan-500 bg-cyan-500/10"
              : "border-gray-700 hover:border-cyan-500/50 hover:bg-gray-800/50"
          }`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-4">
          <div
            className={`p-4 rounded-full ${
              isDragActive
                ? "bg-cyan-500/20"
                : displayError
                ? "bg-red-500/20"
                : "bg-gray-800"
            }`}
          >
            {isDragActive ? (
              <FiImage className="w-12 h-12 text-cyan-400" />
            ) : displayError ? (
              <FiAlertCircle className="w-12 h-12 text-red-400" />
            ) : (
              <FiUpload className="w-12 h-12 text-gray-400" />
            )}
          </div>

          <div>
            <p className="text-lg font-semibold text-white mb-1">
              {isDragActive
                ? "Suelta la imagen aquí"
                : displayError
                ? "Error al cargar la imagen"
                : "Arrastra una imagen"}
            </p>

            <p className="text-sm text-gray-400">
              {displayError ||
                "o haz clic para seleccionar (PNG, JPG, WEBP)"}
            </p>
          </div>

          <div className="flex gap-2 text-xs text-gray-500">
            <span>Máx 10MB</span>
            <span>•</span>
            <span>Fondo transparente</span>
          </div>
        </div>
      </div>

      {displayError && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
          <FiAlertCircle className="w-4 h-4 flex-shrink-0" />
          <p>{displayError}</p>
        </div>
      )}
    </div>
  );
}
