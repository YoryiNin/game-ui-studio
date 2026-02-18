// components/Palette/FullUIPreview.tsx
import chroma from "chroma-js"
import type { PaletteColor } from "../../utils/color/generatePalette"
import { useState } from "react"

interface Props {
  palette: PaletteColor[]
}

interface User {
  id: number
  name: string
  role: string
}

export default function FullUIPreview({ palette }: Props) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Ana López", role: "Admin" },
    { id: 2, name: "Carlos Ruiz", role: "Editor" }
  ])
  const [newUser, setNewUser] = useState("")
  const [darkToggle, setDarkToggle] = useState(false)

  const bgBase = palette[0]?.value || "#ffffff"
  const textBase = palette[1]?.value || "#1a1a1a"
  const primary = palette[2]?.value || "#3b82f6"
  const bgOffset = palette[3]?.value || "#f5f5f5"
  const accent = palette[4]?.value || "#10b981"

  const isDark = chroma(bgBase).luminance() < 0.5 || darkToggle
  const textMuted = chroma(textBase).alpha(0.6).css()
  const borderSubtle = chroma(textBase).alpha(0.08).css()
  const surfaceGlass = chroma(bgBase).alpha(isDark ? 0.6 : 0.8).css()

  const getContrastColor = (bg: string) =>
    chroma.contrast(bg, "#ffffff") > 4.5 ? "#ffffff" : "#111111"

  const addUser = () => {
    if (!newUser) return
    setUsers([...users, { id: Date.now(), name: newUser, role: "Viewer" }])
    setNewUser("")
  }

  const deleteUser = (id: number) => {
    setUsers(users.filter(u => u.id !== id))
  }

  return (
    <div
      className="space-y-10 font-sans transition-all"
      style={{ backgroundColor: bgOffset, color: textBase }}
    >
      <div
        className="rounded-3xl overflow-hidden border backdrop-blur-xl"
        style={{
          borderColor: borderSubtle,
          backgroundColor: surfaceGlass
        }}
      >
        <div className="flex min-h-[900px]">

          {/* SIDEBAR */}
          <aside
            className={`transition-all duration-300 ${
              sidebarCollapsed ? "w-20" : "w-72"
            }`}
            style={{
              borderRight: `1px solid ${borderSubtle}`,
              backgroundColor: surfaceGlass
            }}
          >
            <div className="p-6 flex flex-col h-full">

              <div className="flex items-center justify-between mb-10">
                {!sidebarCollapsed && (
                  <span className="text-base font-semibold">
                    Studio
                  </span>
                )}
                <button
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2 rounded-lg"
                >
                  ☰
                </button>
              </div>

              <nav className="space-y-2 text-sm">
                {["Dashboard", "Usuarios", "Componentes", "Ajustes"].map(
                  (item, i) => (
                    <button
                      key={item}
                      className="w-full text-left px-4 py-2 rounded-xl transition-all"
                      style={{
                        backgroundColor:
                          i === 0
                            ? chroma(primary).alpha(0.12).css()
                            : "transparent",
                        color: i === 0 ? primary : textBase
                      }}
                    >
                      {!sidebarCollapsed && item}
                    </button>
                  )
                )}
              </nav>

              {!sidebarCollapsed && (
                <div className="mt-auto pt-6 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span>Modo oscuro</span>
                    <button
                      onClick={() => setDarkToggle(!darkToggle)}
                      className="px-3 py-1 rounded-full text-xs"
                      style={{
                        backgroundColor: darkToggle ? primary : borderSubtle,
                        color: getContrastColor(primary)
                      }}
                    >
                      {darkToggle ? "ON" : "OFF"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* MAIN */}
          <main className="flex-1 overflow-y-auto">

            {/* HEADER */}
            <header
              className="px-8 py-6 flex justify-between items-center border-b"
              style={{ borderColor: borderSubtle }}
            >
              <h1 className="text-2xl font-semibold">
                UI Preview Completa
              </h1>

              <button
                onClick={() => setModalOpen(true)}
                className="px-5 py-2 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: primary,
                  color: getContrastColor(primary)
                }}
              >
                Abrir Modal
              </button>
            </header>

            <div className="px-8 py-10 space-y-16">

              {/* BOTONES */}
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">Botones</h2>
                <div className="flex gap-4 flex-wrap">
                  <button
                    className="px-6 py-2 rounded-full"
                    style={{
                      backgroundColor: primary,
                      color: getContrastColor(primary)
                    }}
                  >
                    Primary
                  </button>

                  <button
                    className="px-6 py-2 rounded-full border"
                    style={{ borderColor: primary, color: primary }}
                  >
                    Outline
                  </button>

                  <button
                    className="px-6 py-2 rounded-full"
                    style={{
                      backgroundColor: accent,
                      color: getContrastColor(accent)
                    }}
                  >
                    Accent
                  </button>
                </div>
              </section>

              {/* CARDS */}
              <section>
                <h2 className="text-xl font-semibold mb-6">Cards</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className="p-6 rounded-2xl border"
                      style={{
                        borderColor: borderSubtle,
                        backgroundColor: surfaceGlass
                      }}
                    >
                      <h3 className="font-semibold mb-2">Card {i}</h3>
                      <p className="text-sm" style={{ color: textMuted }}>
                        Ejemplo de contenido adaptable.
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* CRUD */}
              <section>
                <h2 className="text-xl font-semibold mb-6">CRUD Usuarios</h2>

                <div className="flex gap-4 mb-6">
                  <input
                    value={newUser}
                    onChange={e => setNewUser(e.target.value)}
                    placeholder="Nuevo usuario"
                    className="px-4 py-2 rounded-xl border text-sm"
                    style={{
                      borderColor: borderSubtle,
                      backgroundColor: "transparent",
                      color: textBase
                    }}
                  />
                  <button
                    onClick={addUser}
                    className="px-5 py-2 rounded-full text-sm"
                    style={{
                      backgroundColor: primary,
                      color: getContrastColor(primary)
                    }}
                  >
                    Agregar
                  </button>
                </div>

                <div className="rounded-2xl border overflow-hidden"
                  style={{ borderColor: borderSubtle }}>
                  {users.map(user => (
                    <div
                      key={user.id}
                      className="flex justify-between items-center px-6 py-4 border-b"
                      style={{ borderColor: borderSubtle }}
                    >
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs" style={{ color: textMuted }}>
                          {user.role}
                        </p>
                      </div>

                      <button
                        onClick={() => deleteUser(user.id)}
                        className="text-xs px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: chroma(primary).alpha(0.1).css(),
                          color: primary
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* ALERTAS */}
              <section className="space-y-4">
                <h2 className="text-xl font-semibold">Alertas</h2>

                <div
                  className="p-4 rounded-xl"
                  style={{
                    backgroundColor: chroma(accent).alpha(0.15).css(),
                    color: accent
                  }}
                >
                  Operación exitosa
                </div>

                <div
                  className="p-4 rounded-xl"
                  style={{
                    backgroundColor: chroma(primary).alpha(0.15).css(),
                    color: primary
                  }}
                >
                  Información importante
                </div>
              </section>

            </div>
          </main>
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center backdrop-blur-md"
          style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl p-8 border"
            style={{
              borderColor: borderSubtle,
              backgroundColor: surfaceGlass
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-6">
              Modal dinámico
            </h3>

            <button
              onClick={() => setModalOpen(false)}
              className="px-5 py-2 rounded-full text-sm"
              style={{
                backgroundColor: primary,
                color: getContrastColor(primary)
              }}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <footer
        className="text-center text-xs pt-6 pb-4"
        style={{ color: textMuted }}
      >
        Vista previa completa adaptable a cualquier paleta
      </footer>
    </div>
  )
}
