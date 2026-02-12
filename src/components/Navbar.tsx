// components/Navbar.tsx
import { Link } from "react-router-dom";

interface NavbarProps {
  activeTab?: string;
}

export default function Navbar({ activeTab }: NavbarProps) {
  const tabs = [
    { name: "Home", path: "/" },
  ];

  return (
    <header className="w-full bg-[#11111f] shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
        <h1 className="text-2xl font-bold text-cyan-400">GameUI Studio</h1>

        <nav className="flex gap-4">
          {tabs.map(tab => (
            <Link
              key={tab.path}
              to={tab.path}
              className={`
                px-4 py-2 rounded-lg font-semibold transition 
                ${activeTab === tab.path ? "bg-cyan-500 text-black" : "hover:bg-gray-700/40 text-white"}
              `}
            >
              {tab.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
