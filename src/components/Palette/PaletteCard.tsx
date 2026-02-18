// components/PaletteCard.tsx
import { useState } from "react"
import type { PaletteColor } from "../../utils/color/generatePalette"

interface Props {
  color: PaletteColor
  index: number
  showUsage?: boolean
  onLockToggle?: (index: number) => void
}

export default function PaletteCard({ color, index, showUsage = false, onLockToggle }: Props) {
  const [copied, setCopied] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(color.value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch (error) {
      console.error("Error copying color:", error)
    }
  }

  const getUsageHint = (index: number) => {
    const hints = [
      { role: "Fondo principal", description: "Background principal de la interfaz" },
      { role: "Texto principal", description: "Color para textos y contenido" },
      { role: "Color de acento", description: "Elementos destacados, íconos" },
      { role: "Fondo secundario", description: "Cards, secciones, modales" },
      { role: "CTA / Botones", description: "Acciones principales, highlights" }
    ]
    return hints[index] || hints[0]
  }

  const getTextColor = (bgColor: string) => {
    // Determinar si el texto debe ser blanco o negro basado en el brillo del fondo
    const hex = bgColor.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000
    return brightness > 128 ? '#000000' : '#ffffff'
  }

  const hint = getUsageHint(index)
  const textColor = getTextColor(color.value)

  return (
    <div className="flex-1 min-w-[150px] max-w-[200px] group">
      {/* Tarjeta de color principal */}
      <div
        onClick={copyToClipboard}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="h-32 cursor-pointer flex items-end justify-center 
                   transition-all duration-300 hover:scale-105 hover:shadow-2xl
                   relative rounded-t-2xl overflow-hidden shadow-lg"
        style={{ backgroundColor: color.value }}
      >
        {/* Overlay gradient para mejor legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Badge de color con contraste automático */}
        <span 
          className="relative z-10 px-3 py-1.5 rounded-lg mb-3 text-sm font-bold 
                     backdrop-blur-md shadow-lg transition-all transform 
                     group-hover:scale-105 group-hover:-translate-y-1"
          style={{ 
            backgroundColor: textColor + '20',
            color: textColor,
            border: `1px solid ${textColor}40`
          }}
        >
          {copied ? (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copiado!
            </span>
          ) : (
            color.value.toUpperCase()
          )}
        </span>

        {/* Indicador de locked (preparado para futura funcionalidad) */}
        {color.locked && (
          <div className="absolute top-2 right-2">
            <svg className="w-4 h-4 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9v3c0 .5.4 1 1 1s1-.5 1-1V9c0-2.76 2.24-5 5-5s5 2.24 5 5v3c0 .5.4 1 1 1s1-.5 1-1V9c0-3.87-3.13-7-7-7z"/>
              <path d="M18 10h-1v2c0 .5-.4 1-1 1s-1-.5-1-1v-2H9v2c0 .5-.4 1-1 1s-1-.5-1-1v-2H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2z"/>
            </svg>
          </div>
        )}

        {/* Tooltip con el valor hexadecimal */}
        {showTooltip && !copied && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                        bg-gray-900 text-white text-xs py-1 px-2 rounded 
                        whitespace-nowrap z-20">
            Click para copiar
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 
                          w-2 h-2 bg-gray-900 rotate-45" />
          </div>
        )}
      </div>
      
      {/* Información de uso */}
      {showUsage && (
        <div className="bg-gray-800/90 backdrop-blur-sm p-3 rounded-b-2xl 
                      border-t border-gray-700 transition-all 
                      group-hover:bg-gray-800">
          <div className="text-center">
            <span className="text-xs font-bold text-cyan-400 block mb-1">
              {hint.role}
            </span>
            <span className="text-xs text-gray-400 block">
              {hint.description}
            </span>
          </div>
          
          {/* Mini preview de uso */}
          <div className="mt-2 flex gap-1 justify-center">
            <div 
              className="w-6 h-6 rounded flex items-center justify-center text-[10px]"
              style={{ backgroundColor: color.value, color: textColor }}
            >
              Aa
            </div>
            <div 
              className="w-6 h-6 rounded opacity-75"
              style={{ backgroundColor: color.value }}
            />
            <div 
              className="w-6 h-6 rounded opacity-50"
              style={{ backgroundColor: color.value }}
            />
          </div>

          {/* Valores de color en diferentes formatos (opcional) */}
          <div className="mt-2 text-[10px] text-gray-500 font-mono text-center">
            {color.value}
          </div>
        </div>
      )}

      {/* Versión simplificada cuando no se muestra usage */}
      {!showUsage && (
        <div className="bg-gray-800/50 p-2 rounded-b-2xl text-center text-xs text-gray-400">
          Click para copiar
        </div>
      )}
    </div>
  )
}