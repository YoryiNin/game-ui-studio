import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PaletteGenerator from "./pages/PaletteGenerator";
import IconDesigner from "./pages/ProIconDesigner";
import UIBuilderPage from "./pages/UIBuilderPage";
import RemoveBg from './pages/RemoveBg'


function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta por defecto */}
        <Route path="/" element={<HomePage />} />

        {/* Otras páginas */}
        <Route path="/palette" element={<PaletteGenerator />} />
        <Route path="/icons" element={<IconDesigner />} />
        <Route path="/ui-builder" element={<UIBuilderPage />} />
        <Route path="/remove-bg" element={<RemoveBg />} />

        {/* Redirigir cualquier ruta desconocida a Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
