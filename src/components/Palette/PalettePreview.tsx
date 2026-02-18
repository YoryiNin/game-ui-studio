import { useState } from "react"
import type { PaletteColor } from "../../types/palette"

interface Props {
  palette: PaletteColor[]
}

export default function PalettePreview({ palette }: Props) {
  const bgColor = palette[0]?.value || "#0f172a"
  const textPrimary = palette[1]?.value || "#f8fafc"
  const accentColor = palette[2]?.value || "#6366f1"
  const secondaryBg = palette[3]?.value || "#1e293b"
  const ctaColor = palette[4]?.value || "#8b5cf6"

  const [loading, setLoading] = useState(false)
  const [remember, setRemember] = useState(false)

  function simulateLoading() {
    setLoading(true)
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <div className="space-y-10">

      {/* ================= Palette Summary ================= */}
      <div className="flex gap-2 flex-wrap">
        {palette.map((color, i) => (
          <div key={i} className="flex-1 min-w-[60px]">
            <div
              className="h-12 rounded-t-xl"
              style={{ backgroundColor: color.value }}
            />
            <div className="bg-black/70 p-1 text-center rounded-b-xl text-xs">
              <span className="font-mono text-gray-300">{color.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODERN BUTTON SYSTEM ================= */}
      <div
        className="p-6 rounded-2xl space-y-6 backdrop-blur-md"
        style={{ backgroundColor: secondaryBg }}
      >
        <h3 className="text-sm font-semibold tracking-wide" style={{ color: textPrimary }}>
          Button System 2026
        </h3>

        <div className="grid md:grid-cols-2 gap-4">

          {/* Solid Primary */}
          <button
            className="py-3 rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] shadow-sm hover:shadow-md"
            style={{ backgroundColor: accentColor, color: bgColor }}
          >
            Solid Primary
          </button>

          {/* Outline Modern */}
          <button
            className="py-3 rounded-xl font-medium border-2 transition-all duration-300 hover:bg-white/5"
            style={{ borderColor: accentColor, color: accentColor }}
          >
            Outline
          </button>

          {/* Ghost */}
          <button
            className="py-3 rounded-xl font-medium transition-all duration-300 hover:bg-white/5"
            style={{ color: accentColor }}
          >
            Ghost Button
          </button>

          {/* Elevated Soft UI */}
          <button
            className="py-3 rounded-xl font-medium shadow-lg transition-all duration-300 hover:shadow-xl"
            style={{
              backgroundColor: secondaryBg,
              color: textPrimary,
              boxShadow: `0 4px 14px ${accentColor}40`
            }}
          >
            Soft Elevated
          </button>

          {/* Gradient */}
          <button
            className="py-3 rounded-xl font-semibold transition-all duration-300 hover:opacity-90"
            style={{
              backgroundImage: `linear-gradient(90deg, ${accentColor}, ${ctaColor})`,
              color: "#ffffff"
            }}
          >
            Gradient CTA
          </button>

          {/* Icon Button */}
          <button
            className="py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02]"
            style={{ backgroundColor: accentColor, color: bgColor }}
          >
            <span className="text-base">➜</span>
            With Icon
          </button>

          {/* Loading */}
          <button
            onClick={simulateLoading}
            disabled={loading}
            className="py-3 rounded-xl font-medium transition-all duration-300"
            style={{
              backgroundColor: accentColor,
              color: bgColor,
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Loading..." : "Loading State"}
          </button>

          {/* Toggle Modern */}
          <div className="flex items-center justify-between px-4 py-3 rounded-xl"
               style={{ backgroundColor: bgColor }}>
            <span style={{ color: textPrimary }}>Remember me</span>
            <button
              onClick={() => setRemember(!remember)}
              className="w-12 h-6 rounded-full relative transition-all duration-300"
              style={{
                backgroundColor: remember ? accentColor : "#555"
              }}
            >
              <span
                className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300"
                style={{
                  left: remember ? "26px" : "4px"
                }}
              />
            </button>
          </div>

        </div>
      </div>

      {/* ================= MODERN LOGIN CARD ================= */}
      <div
        className="p-6 rounded-2xl backdrop-blur-md"
        style={{ backgroundColor: secondaryBg }}
      >
        <h3 className="text-sm font-semibold mb-6 tracking-wide"
            style={{ color: textPrimary }}>
          Login UI 2026
        </h3>

        <div
          className="max-w-md mx-auto p-8 rounded-3xl shadow-xl space-y-6"
          style={{
            backgroundColor: bgColor,
            boxShadow: `0 10px 40px ${accentColor}25`
          }}
        >
          <div className="space-y-2 text-center">
            <h2 className="text-xl font-semibold"
                style={{ color: textPrimary }}>
              Welcome Back
            </h2>
            <p className="text-sm opacity-70"
               style={{ color: textPrimary }}>
              Sign in to continue
            </p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide opacity-70"
                   style={{ color: textPrimary }}>
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 focus:scale-[1.02]"
              style={{
                backgroundColor: secondaryBg,
                color: textPrimary,
                border: `1px solid ${accentColor}40`
              }}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wide opacity-70"
                   style={{ color: textPrimary }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl outline-none transition-all duration-300 focus:scale-[1.02]"
              style={{
                backgroundColor: secondaryBg,
                color: textPrimary,
                border: `1px solid ${accentColor}40`
              }}
            />
          </div>

          {/* Remember + Forgot */}
          <div className="flex justify-between items-center text-xs">
            <label className="flex items-center gap-2"
                   style={{ color: textPrimary }}>
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
                style={{ accentColor }}
              />
              Remember me
            </label>

            <button className="hover:underline"
                    style={{ color: accentColor }}>
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
            className="w-full py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
            style={{
              backgroundImage: `linear-gradient(90deg, ${accentColor}, ${ctaColor})`,
              color: "#ffffff"
            }}
          >
            Sign In
          </button>

          <p className="text-center text-xs opacity-70"
             style={{ color: textPrimary }}>
            Don’t have an account?
            <button className="ml-1 underline"
                    style={{ color: accentColor }}>
              Sign up
            </button>
          </p>
        </div>
      </div>

    </div>
  )
}
