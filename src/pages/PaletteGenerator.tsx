import { useState } from "react"
import { generatePaletteByMode } from "../utils/color/generatePalette"
import type { PaletteMode } from "../utils/color/generatePalette"
import type { Palette } from "../types/palette"
import PaletteCard from "../components/PaletteCard"
import Navbar from "../components/Navbar";

export default function PaletteGenerator() {
  const [mode, setMode] = useState<PaletteMode>("cyberpunk")

  const [palette, setPalette] = useState<Palette>(
    generatePaletteByMode("cyberpunk")
  )

  const handleGenerate = () => {
    setPalette(generatePaletteByMode(mode))
  }

  const modes: PaletteMode[] = [
    "cyberpunk",
    "minimal",
    "vibrant",
    "gamer-dark",
    "web-modern",
  ]

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-white p-10">
      
         <Navbar activeTab="/ui-builder" />
      <h1 className="text-4xl font-bold text-cyan-400 mb-8 text-center">
        🎮 GameUI Studio
      </h1>

      {/* Selector de modo */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {modes.map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m)
              setPalette(generatePaletteByMode(m))
            }}
            className={`px-4 py-2 rounded-xl font-semibold transition-all capitalize
              ${
                mode === m
                  ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/50"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
          >
            {m.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Tarjetas */}
      <div className="flex gap-4 mb-10 flex-wrap">
        {palette.map((color, index) => (
          <PaletteCard key={index} color={color} />
        ))}
      </div>

      {/* Botón regenerar */}
      <div className="text-center">
        <button
          onClick={handleGenerate}
          className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/50"
        >
          Generar Paleta 🚀
        </button>
      </div>
    </div>
  )
}
