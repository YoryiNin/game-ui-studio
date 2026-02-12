import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
export default function HomePage() {
  const modules = [
    { name: "Palette Generator", path: "/palette", color: "bg-gradient-to-br from-cyan-500 to-blue-600", icon: "🎨" },
    { name: "Icon / Logo Creator", path: "/icons", color: "bg-gradient-to-br from-purple-500 to-pink-600", icon: "🖌️" },
    { name: "UI Builder", path: "/ui-builder", color: "bg-gradient-to-br from-green-500 to-green-600", icon: "🖥️" },
    { name: "Export / Preview", path: "/export", color: "bg-gradient-to-br from-yellow-400 to-orange-500", icon: "📤" },
  ];

  return (
    
    <div className="min-h-screen bg-[#0f0f1a] flex flex-col items-center p-10 gap-12">
           <Navbar activeTab="/ui-builder" />
      {/* Header */}
      <header className="text-center max-w-3xl">
        <h1 className="text-5xl font-extrabold text-white mb-4">
          GameUI Studio
        </h1>
        <p className="text-gray-400 text-lg sm:text-xl">
          Tu plataforma profesional para crear paletas de colores, iconos, UI layouts y exportar tus diseños con estilo.
        </p>
      </header>

      {/* Grid de módulos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
        {modules.map((mod) => (
          <Link
            key={mod.path}
            to={mod.path}
            className={`
              ${mod.color} 
              rounded-3xl p-8 flex flex-col items-center justify-center 
              shadow-xl hover:shadow-2xl hover:scale-105 
              transition-transform duration-300 transform
            `}
          >
            <span className="text-5xl mb-4">{mod.icon}</span>
            <span className="text-white font-bold text-xl text-center">{mod.name}</span>
          </Link>
        ))}
      </div>

      {/* Footer / Info */}
      <footer className="mt-12 text-gray-500 text-sm text-center max-w-3xl">
        © 2026 GameUI Studio. Todos los derechos reservados. Diseño profesional de interfaces y UI.
      </footer>
    </div>
  );
}
