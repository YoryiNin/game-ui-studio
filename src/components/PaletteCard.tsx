import { useState } from "react"
import type { PaletteColor } from "../utils/color/generatePalette"

interface Props {
  color: PaletteColor
}

export default function PaletteCard({ color }: Props) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(color.value)
      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 1200)
    } catch (error) {
      console.error("Error copying color:", error)
    }
  }

  return (
    <div
      onClick={copyToClipboard}
      className="flex-1 min-w-[150px] h-40 cursor-pointer flex items-end justify-center 
                 transition-all duration-300 hover:scale-105 relative 
                 rounded-2xl overflow-hidden shadow-lg"
      style={{ backgroundColor: color.value }}
    >
      {/* Overlay oscuro automático */}
      <div className="absolute inset-0 bg-black/10 hover:bg-black/20 transition-all duration-300" />

      {/* Texto */}
      <span className="relative z-10 bg-black/70 text-white px-3 py-1 rounded-lg mb-3 text-sm font-bold backdrop-blur-sm">
        {copied ? "Copiado!" : color.value}
      </span>
    </div>
  )
}
