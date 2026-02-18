// utils/color/generatePalette.ts
import chroma from "chroma-js"

export interface PaletteColor {
  value: string
  locked: boolean
  name?: string
  cssVariable?: string
}

export type PaletteMode =
  | "cyberpunk"
  | "minimal"
  | "vibrant"
  | "gamer-dark"
  | "web-modern"
  | "glassmorphism"
  | "neo-brutalism"
  | "retro-wave"
  | "nature-organic"
  | "tech-ai"
  | "sunset-gradient"
  | "dark-academia"
  | "y2k-revival"

function randomHue(): number {
  return Math.floor(Math.random() * 360)
}

function normalizeHue(h: number): number {
  return ((h % 360) + 360) % 360
}

// Función para generar variaciones de tendencias
function generateVariations(mode: string): string[] {
  const baseHue = randomHue()

  const variationMap: Record<string, () => string[]> = {
    glassmorphism: () => {
      const primary = chroma.hsl(baseHue, 0.7, 0.6)
      const bgColor = chroma.hsl(baseHue, 0.3, 0.95)

      return [
        bgColor.hex(),
        chroma.hsl(0, 0, 0.2).hex(),
        primary.hex(),
        `rgba(${primary.rgb().join(", ")}, 0.15)`,
        `rgba(255, 255, 255, 0.4)`
      ]
    },

    "neo-brutalism": () => {
      const primary = chroma.hsl(baseHue, 1, 0.5)
      const secondary = chroma.hsl(normalizeHue(baseHue + 60), 1, 0.5)
      const accent = chroma.hsl(normalizeHue(baseHue + 120), 1, 0.5)

      return [
        "#FFFFFF",
        "#000000",
        primary.hex(),
        secondary.hex(),
        accent.hex()
      ]
    },

    "retro-wave": () => {
      const primaryHue = normalizeHue(280 + (baseHue % 40)) // púrpuras 80s
      const primary = chroma.hsl(primaryHue, 1, 0.6)

      return [
        "#0B0B1F",
        "#FFFFFF",
        primary.hex(),
        chroma.hsl(normalizeHue(primaryHue + 60), 1, 0.6).hex(),
        chroma.hsl(normalizeHue(primaryHue - 60), 1, 0.6).hex()
      ]
    },

    "nature-organic": () => {
      const primary = chroma.hsl(90 + (baseHue % 30), 0.6, 0.5)

      return [
        "#F5F0E6",
        "#2C3E2F",
        primary.hex(),
        chroma.hsl(30 + (baseHue % 20), 0.5, 0.6).hex(),
        chroma.hsl(60 + (baseHue % 20), 0.4, 0.7).hex()
      ]
    },

    "tech-ai": () => {
      // Ahora limitado a azules, violetas y cyan reales
      const aiBase = normalizeHue(210 + (baseHue % 80)) // 210–290 rango tech
      const primary = chroma.hsl(aiBase, 1, 0.6)

      return [
        "#0A0A0F",
        "#E0E0E0",
        primary.hex(),
        chroma.hsl(normalizeHue(aiBase + 40), 1, 0.6).hex(),
        chroma.hsl(normalizeHue(aiBase + 80), 1, 0.6).hex()
      ]
    },

    "sunset-gradient": () => {
      const base = chroma.hsl(20 + (baseHue % 20), 0.9, 0.6)

      return [
        base.hex(),
        chroma.hsl(0, 0, 0.2).hex(),
        base.brighten(0.5).hex(),
        chroma.hsl(340 + (baseHue % 20), 0.9, 0.6).hex(),
        chroma.hsl(260 + (baseHue % 20), 0.8, 0.5).hex()
      ]
    },

    "dark-academia": () => {
      const primary = chroma.hsl(30 + (baseHue % 15), 0.4, 0.28)

      return [
        "#1C1C1C",
        "#E8DCCC",
        primary.hex(),
        chroma.hsl(20 + (baseHue % 15), 0.5, 0.35).hex(),
        chroma.hsl(40 + (baseHue % 15), 0.35, 0.45).hex()
      ]
    },

    "y2k-revival": () => {
      return [
        chroma.hsl(baseHue, 1, 0.6).hex(),
        chroma.hsl(normalizeHue(baseHue + 180), 1, 0.6).hex(),
        chroma.hsl(normalizeHue(baseHue + 60), 1, 0.6).hex(),
        chroma.hsl(normalizeHue(baseHue + 120), 1, 0.6).hex(),
        "#C0C0C0" // toque metálico
      ]
    }
  }

  return (variationMap[mode] || variationMap["glassmorphism"])()
}

export function generatePaletteByMode(mode: PaletteMode): PaletteColor[] {
  const trendModes: PaletteMode[] = [
    "glassmorphism",
    "neo-brutalism",
    "retro-wave",
    "nature-organic",
    "tech-ai",
    "sunset-gradient",
    "dark-academia",
    "y2k-revival"
  ]

  let colors: string[]

  if (trendModes.includes(mode)) {
    colors = generateVariations(mode)
  } else {
    const baseHue = randomHue()

    switch (mode) {
      case "cyberpunk": {
        const primary = chroma.hsl(baseHue, 1, 0.6)
        colors = [
          "#0a0a0f",
          "#ffffff",
          primary.hex(),
          chroma.hsl(baseHue, 0.8, 0.3).hex(),
          chroma.hsl(normalizeHue(baseHue + 180), 1, 0.6).hex()
        ]
        break
      }

      case "minimal": {
        const accent = chroma.hsl(baseHue, 0.3, 0.7)
        colors = [
          "#ffffff",
          "#1a1a1a",
          accent.hex(),
          "#f5f5f5",
          "#e0e0e0"
        ]
        break
      }

      case "vibrant": {
        const primary = chroma.hsl(baseHue, 0.9, 0.6)
        colors = [
          chroma.hsl(baseHue, 0.1, 0.98).hex(),
          chroma.hsl(baseHue, 0.8, 0.2).hex(),
          primary.hex(),
          chroma.hsl(normalizeHue(baseHue + 30), 0.9, 0.6).hex(),
          chroma.hsl(normalizeHue(baseHue - 30), 0.9, 0.6).hex()
        ]
        break
      }

      case "gamer-dark": {
        const accent = chroma.hsl(baseHue, 1, 0.6)
        colors = [
          "#0f0f1a",
          "#ffffff",
          accent.hex(),
          "#1a1a2e",
          accent.darken(0.5).hex()
        ]
        break
      }

      case "web-modern": {
        const primary = chroma.hsl(baseHue, 0.7, 0.5)
        colors = [
          "#ffffff",
          "#2d3748",
          primary.hex(),
          chroma.hsl(baseHue, 0.5, 0.95).hex(),
          primary.darken(0.3).hex()
        ]
        break
      }

      default:
        colors = ["#ffffff", "#000000", "#3b82f6", "#f3f4f6", "#10b981"]
    }
  }

  const names = [
    "Fondo principal",
    "Texto principal",
    "Color primario",
    "Color secundario",
    "Color de acento"
  ]

  return colors.map((color, index) => ({
    value: color,
    locked: false,
    name: names[index],
    cssVariable: `--color-${index}`
  }))
}
