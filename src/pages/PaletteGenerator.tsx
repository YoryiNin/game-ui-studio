// pages/PaletteGenerator.tsx
import { useState } from "react"
import { generatePaletteByMode } from "../utils/color/generatePalette"
import type { PaletteMode, PaletteColor } from "../utils/color/generatePalette"
import PaletteCard from "../components/Palette/PaletteCard"
import PalettePreview from "../components/Palette/PalettePreview"
import FullUIPreview from "../components/Palette/FullUIPreview"
import TrendGallery from "../components/Palette/TrendGallery"
import Navbar from "../components/Navbar"

export default function PaletteGenerator() {
  const [mode, setMode] = useState<PaletteMode>("cyberpunk")
  const [palette, setPalette] = useState<PaletteColor[]>(
    generatePaletteByMode("cyberpunk")
  )
  const [activeView, setActiveView] = useState<"basic" | "full" | "trends">("basic")

  const handleGenerate = () => {
    setPalette(generatePaletteByMode(mode))
  }

  const modes: PaletteMode[] = [
    "cyberpunk",
    "minimal",
    "vibrant",
    "gamer-dark",
    "web-modern",
    "glassmorphism",
    "neo-brutalism",
    "retro-wave",
    "nature-organic",
    "tech-ai",
    "sunset-gradient",
    "dark-academia",
    "y2k-revival"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] to-[#1a1a2e] text-white">
      <Navbar activeTab="/ui-builder" />

      <div className="max-w-7xl mx-auto p-10">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-4 text-center">
          YN Studios
        </h1>

        <p className="text-center text-gray-400 mb-8">
          Explora tendencias actuales y genera paletas profesionales para tu próximo proyecto
        </p>

        {/* Selector de modo */}
        <div className="overflow-x-auto pb-4 mb-8">
          <div className="flex gap-2 min-w-max">
            {modes.map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m)
                  setPalette(generatePaletteByMode(m))
                }}
                className={`px-4 py-2 rounded-xl font-semibold transition-all capitalize whitespace-nowrap
                  ${
                    mode === m
                      ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-purple-500/30"
                      : "bg-gray-800/50 hover:bg-gray-700/50 backdrop-blur-sm border border-gray-700"
                  }`}
              >
                {m.replace(/-/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Selector de vista */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setActiveView("basic")}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeView === "basic"
                ? "bg-cyan-500 text-white"
                : "bg-gray-800/50 text-gray-400"
            }`}
          >
            Vista Básica
          </button>

          <button
            onClick={() => setActiveView("full")}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeView === "full"
                ? "bg-cyan-500 text-white"
                : "bg-gray-800/50 text-gray-400"
            }`}
          >
            UI Completa
          </button>

          <button
            onClick={() => setActiveView("trends")}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeView === "trends"
                ? "bg-cyan-500 text-white"
                : "bg-gray-800/50 text-gray-400"
            }`}
          >
            Tendencias 2024
          </button>
        </div>

        {/* Tarjetas de colores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {palette.map((color, index) => (
            <PaletteCard
              key={index}
              color={color}
              index={index}
              showUsage={true}
            />
          ))}
        </div>

        {/* Vista activa */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-cyan-400">
            {activeView === "basic" && "Vista previa básica"}
            {activeView === "full" && "UI Completa"}
            {activeView === "trends" && "Inspiración y tendencias"}
          </h2>

          <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-800">
            {activeView === "basic" && <PalettePreview palette={palette} />}
            {activeView === "full" && <FullUIPreview palette={palette} />}
            {activeView === "trends" && (
              <TrendGallery
                palette={palette}
                onSelectPalette={(newPalette) => setPalette(newPalette)}
              />
            )}
          </div>
        </div>

        {/* Botón regenerar */}
        <div className="text-center">
          <button
            onClick={handleGenerate}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/30 transform hover:scale-105"
          >
            Generar nueva paleta
          </button>
        </div>
      </div>
    </div>
  )
}
