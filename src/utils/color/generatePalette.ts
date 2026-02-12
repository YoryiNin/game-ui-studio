import chroma from "chroma-js"
import type { PaletteColor } from "../../types/palette"

export type PaletteMode =
  | "cyberpunk"
  | "minimal"
  | "vibrant"
  | "gamer-dark"
  | "web-modern"

function randomHue(): number {
  return Math.floor(Math.random() * 360)
}

function buildPalette(colors: string[]): PaletteColor[] {
  return colors.map((color) => ({
    value: color,
    locked: false,
  }))
}

export function generatePaletteByMode(mode: PaletteMode): PaletteColor[] {
  let colors: string[]

  switch (mode) {
    case "cyberpunk": {
      const base = chroma.hsl(randomHue(), 1, 0.5)
      colors = chroma
        .scale([base.brighten(1.5), base.darken(2)])
        .mode("lch")
        .colors(5)
      break
    }

    case "minimal": {
      colors = chroma
        .scale(["#f5f5f5", "#2a2a2a"])
        .mode("lab")
        .colors(5)
      break
    }

    case "vibrant": {
      const base = chroma.random()
      colors = chroma
        .scale([
          base,
          base.set("hsl.h", "+120"),
          base.set("hsl.h", "+240"),
        ])
        .mode("lch")
        .colors(5)
      break
    }

    case "gamer-dark": {
      const base = chroma("#0f0f1a")
      const accent = chroma.hsl(randomHue(), 1, 0.6)
      colors = chroma
        .scale([base, accent])
        .mode("lab")
        .colors(5)
      break
    }

    case "web-modern": {
      const base = chroma.hsl(randomHue(), 0.7, 0.6)
      colors = chroma
        .scale([
          base.brighten(1),
          base,
          base.darken(1.5),
        ])
        .mode("lch")
        .colors(5)
      break
    }

    default:
      colors = chroma
        .scale([chroma.random(), chroma.random()])
        .colors(5)
  }

  return buildPalette(colors)
}
export type { PaletteColor }

