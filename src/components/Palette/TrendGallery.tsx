// components/Palette/TrendGallery.tsx
import { useState } from "react"
import type { PaletteColor } from "../../utils/color/generatePalette"

interface Props {
  palette: PaletteColor[]
  onSelectPalette?: (palette: PaletteColor[]) => void
}

export default function TrendGallery({ palette, onSelectPalette }: Props) {
  const [selectedTrend, setSelectedTrend] = useState<string | null>(null)

  const bgPrimary = palette[0]?.value || "#ffffff"
  const textPrimary = palette[1]?.value || "#000000"
  const primary = palette[2]?.value || "#3b82f6"

  const trends = [
    {
      name: "Glassmorphism",
      description: "Efecto vidrio con transparencias y blur",
      image:
        "https://images.unsplash.com/photo-1557683316-973673baf926?w=400&auto=format&fit=crop"
    },
    {
      name: "Neo Brutalism",
      description: "Colores vibrantes, bordes definidos y sombras marcadas",
      image:
        "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&auto=format&fit=crop"
    },
    {
      name: "Retro Wave",
      description: "Neón, púrpuras y cyan, estilo años 80",
      image:
        "https://images.unsplash.com/photo-1524721696987-b9527df9e512?w=400&auto=format&fit=crop"
    },
    {
      name: "Nature Organic",
      description: "Tonos tierra, verdes suaves y texturas naturales",
      image:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&auto=format&fit=crop"
    },
    {
      name: "Tech AI",
      description: "Azules eléctricos, púrpuras y negro espacial",
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop"
    },
    {
      name: "Sunset Gradient",
      description: "Degradados cálidos de naranja a rosa",
      image:
        "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400&auto=format&fit=crop"
    },
    {
      name: "Dark Academia",
      description: "Tonos oscuros, marrones y crema, estilo vintage",
      image:
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&auto=format&fit=crop"
    },
    {
      name: "Y2K Revival",
      description: "Colores brillantes y estética principios de los 2000",
      image:
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&auto=format&fit=crop"
    }
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold" style={{ color: textPrimary }}>
        Tendencias de diseño 2024
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {trends.map((trend) => (
          <div
            key={trend.name}
            className="group cursor-pointer rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-xl"
            onClick={() => setSelectedTrend(trend.name)}
            style={{
              backgroundColor: bgPrimary,
              border: `1px solid ${primary}30`
            }}
          >
            <div className="relative h-32 overflow-hidden">
              <img
                src={trend.image}
                alt={trend.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            <div className="p-3">
              <h4
                className="font-semibold mb-1"
                style={{ color: textPrimary }}
              >
                {trend.name}
              </h4>

              <p
                className="text-xs"
                style={{ color: textPrimary, opacity: 0.7 }}
              >
                {trend.description}
              </p>

              <div className="flex gap-1 mt-3">
                {palette.slice(0, 3).map((color, i) => (
                  <div
                    key={i}
                    className="h-2 flex-1 rounded-full"
                    style={{ backgroundColor: color.value }}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedTrend && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="max-w-4xl w-full rounded-2xl overflow-hidden"
            style={{ backgroundColor: bgPrimary }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2
                  className="text-2xl font-bold"
                  style={{ color: textPrimary }}
                >
                  {selectedTrend}
                </h2>

                <button
                  onClick={() => setSelectedTrend(null)}
                  className="p-2 rounded-lg hover:bg-black/10 transition-all"
                  style={{ color: textPrimary }}
                >
                  Cerrar
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3
                    className="font-semibold"
                    style={{ color: textPrimary }}
                  >
                    UI Moderna
                  </h3>

                  <div
                    className="p-4 rounded-xl space-y-3"
                    style={{ backgroundColor: palette[3]?.value }}
                  >
                    <div
                      className="h-20 rounded-lg"
                      style={{
                        background: `linear-gradient(135deg, ${palette[2]?.value}, ${palette[4]?.value})`
                      }}
                    />
                    <div
                      className="h-4 w-3/4 rounded"
                      style={{
                        backgroundColor: palette[1]?.value,
                        opacity: 0.2
                      }}
                    />
                    <div
                      className="h-4 w-1/2 rounded"
                      style={{
                        backgroundColor: palette[1]?.value,
                        opacity: 0.2
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3
                    className="font-semibold"
                    style={{ color: textPrimary }}
                  >
                    Componentes
                  </h3>

                  <div
                    className="p-4 rounded-xl space-y-3"
                    style={{ backgroundColor: palette[0]?.value }}
                  >
                    <div className="flex gap-3 mb-3">
                      <div
                        className="w-12 h-12 rounded-full"
                        style={{ backgroundColor: palette[2]?.value }}
                      />
                      <div>
                        <div
                          className="h-4 w-24 rounded mb-2"
                          style={{
                            backgroundColor: palette[1]?.value,
                            opacity: 0.2
                          }}
                        />
                        <div
                          className="h-3 w-32 rounded"
                          style={{
                            backgroundColor: palette[1]?.value,
                            opacity: 0.2
                          }}
                        />
                      </div>
                    </div>

                    <button
                      className="w-full py-2 rounded-lg font-medium transition-all hover:opacity-80"
                      style={{
                        backgroundColor: palette[2]?.value,
                        color: "#ffffff"
                      }}
                    >
                      Ver más
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (onSelectPalette) onSelectPalette(palette)
                  setSelectedTrend(null)
                }}
                className="mt-6 w-full py-3 rounded-lg font-semibold transition-all hover:opacity-80"
                style={{
                  backgroundColor: palette[2]?.value,
                  color: "#ffffff"
                }}
              >
                Usar esta paleta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
