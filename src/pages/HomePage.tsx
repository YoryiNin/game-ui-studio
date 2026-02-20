import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion, type Variants } from "framer-motion";
import { FiDroplet, FiPenTool, FiLayout, FiArrowRight, FiImage } from "react-icons/fi";


export default function HomePage() {
  const modules = [
    { 
      name: "Palette Generator", 
      path: "/palette", 
      color: "from-cyan-500 to-blue-600", 
      icon: <FiDroplet className="w-12 h-12" />,
      description: "Crea paletas de colores profesionales para tus interfaces",
      features: ["RGB/HSL/HEX", "Contrast ratios", "Export a código"]
    },
    { 
      name: "Icon / Logo Creator", 
      path: "/icons", 
      color: "from-purple-500 to-pink-600", 
      icon: <FiPenTool className="w-12 h-12" />,
      description: "Diseña iconos y logos vectoriales para todas las plataformas",
      features: ["Formas vectoriales", "Texto personalizable", "Múltiples formatos"]
    },
    { 
      name: "UI Builder", 
      path: "/ui-builder", 
      color: "from-green-500 to-emerald-600", 
      icon: <FiLayout className="w-12 h-12" />,
      description: "Construye interfaces completas con componentes drag & drop",
      features: ["Componentes predefinidos", "Grid system", "Responsive design"]
    },
     { // Nuevo módulo
    name: "Remove Background", 
    path: "/remove-bg", 
    color: "from-orange-500 to-red-600", 
    icon: <FiImage className="w-12 h-12" />,
    description: "Elimina el fondo de imágenes automáticamente con IA",
    features: ["Detección automática", "Fondo transparente", "Export PNG"]
  },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { 
      y: 20, 
      opacity: 0 
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#0f0f1a] to-[#1a1a2e]">
      <Navbar activeTab="/ui-builder" />
      
      {/* Hero Section con animación */}
      <section className="relative overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1 
              className="text-6xl sm:text-7xl font-extrabold mb-6"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                YN
              </span>
              <span className="text-white">Studios</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              La plataforma definitiva para creadores de interfaces. 
              Diseña, crea y da vida a tus ideas con herramientas profesionales.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <Link
                to="/icons"
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white overflow-hidden hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Comenzar ahora
                  <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              
              <a
                href="#modules"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-xl font-semibold text-white hover:bg-white/20 transition-all duration-300 border border-white/10"
              >
                Explorar módulos
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

   


      {/* Módulos Section */}
      <section id="modules" className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Herramientas profesionales
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Todo lo que necesitas para crear interfaces impresionantes en un solo lugar
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {modules.map((mod) => (
            <motion.div
              key={mod.path}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Link
                to={mod.path}
                className="block h-full"
              >
                <div className="relative h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300">
                  {/* Fondo gradiente animado */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${mod.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  {/* Icono con gradiente */}
                  <div className={`relative mb-6 inline-block p-4 bg-gradient-to-br ${mod.color} rounded-2xl text-white shadow-xl`}>
                    {mod.icon}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">
                    {mod.name}
                  </h3>
                  
                  <p className="text-gray-400 mb-6">
                    {mod.description}
                  </p>
                  
                  {/* Features list */}
                  <ul className="space-y-2 mb-6">
                    {mod.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-sm text-gray-300">
                        <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${mod.color} mr-2`}></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Botón de acción */}
                  <div className="flex items-center text-white font-medium group-hover:text-cyan-400 transition-colors">
                    <span>Explorar</span>
                    <FiArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-90"></div>
          
          <div className="relative p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              ¿Listo para crear algo increíble?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Únete a miles de diseñadores que ya están usando GameUI Studio para dar vida a sus ideas.
            </p>
            <Link
              to="/icons"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-white hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
            >
              Comenzar a diseñar
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-auto">
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © 2026 YNStudios. Todos los derechos reservados.
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Términos</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacidad</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contacto</a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}