import { useState } from "react";
import type { EditorElement } from "../../types/editor";
import { FiSearch, FiGrid, FiHeart, FiDownload } from "react-icons/fi";

interface Props {
  onSelectPreset: (elements: EditorElement[]) => void;
}

export default function InspirationPanel({ onSelectPreset }: Props) {
  const [category, setCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  const categories = [
    { id: "all", name: "All", icon: FiGrid },
    { id: "tech", name: "Tech", icon: FiGrid },
    { id: "business", name: "Business", icon: FiGrid },
    { id: "creative", name: "Creative", icon: FiGrid },
    { id: "gaming", name: "Gaming", icon: FiGrid },
    { id: "social", name: "Social", icon: FiGrid },
  ];

  const inspirations = [
    {
      id: 1,
      name: "Nova Tech",
      category: "tech",
      image: "NOVA",
      colors: ["#00ffff", "#ff00ff"],
      tags: ["tech", "modern", "gradient"],
      description: "Modern tech logo with gradient effect"
    },
    {
      id: 2,
      name: "Vanta Black",
      category: "minimal",
      image: "VANTA",
      colors: ["#000000", "#ffffff"],
      tags: ["minimal", "bold", "contrast"],
      description: "High contrast black & white logo"
    },
    {
      id: 3,
      name: "Cyber Pulse",
      category: "gaming",
      image: "CYBER",
      colors: ["#00ff00", "#0000ff"],
      tags: ["gaming", "neon", "glow"],
      description: "Neon gaming style with glow effects"
    },
    {
      id: 4,
      name: "Minimal Luxe",
      category: "business",
      image: "MINIMAL",
      colors: ["#ffffff", "#cccccc"],
      tags: ["clean", "luxury", "simple"],
      description: "Clean and professional branding"
    },
    {
      id: 5,
      name: "Abstract Flow",
      category: "creative",
      image: "FLOW",
      colors: ["#ff6b6b", "#4ecdc4"],
      tags: ["abstract", "artistic", "colorful"],
      description: "Creative abstract design"
    },
    {
      id: 6,
      name: "Social Spark",
      category: "social",
      image: "SPARK",
      colors: ["#fbbf24", "#f59e0b"],
      tags: ["social", "energetic", "bright"],
      description: "Energetic social media logo"
    },
    {
      id: 7,
      name: "Blockchain",
      category: "tech",
      image: "BLOCK",
      colors: ["#3b82f6", "#1e40af"],
      tags: ["blockchain", "secure", "tech"],
      description: "Blockchain technology logo"
    },
    {
      id: 8,
      name: "Eco Leaf",
      category: "business",
      image: "ECO",
      colors: ["#10b981", "#059669"],
      tags: ["eco", "green", "nature"],
      description: "Environmentally friendly brand"
    }
  ];

  const filtered = inspirations.filter(item => 
    (category === "all" || item.category === category) &&
    (search === "" || item.name.toLowerCase().includes(search.toLowerCase()))
  );

  const handleSelectPreset = (inspiration: typeof inspirations[0]) => {
    // Create mock elements based on the inspiration
    const elements: EditorElement[] = [
      {
        id: `inspire-${inspiration.id}`,
        type: "text",
        x: 400,
        y: 300,
        size: 0,
        rotation: 0,
        fill: inspiration.colors[0],
        text: inspiration.image,
        fontSize: 80,
        fontFamily: "Montserrat",
        fontWeight: 800,
        fontStyle: "normal",
        align: "center",
        letterSpacing: 2,
        fillType: inspiration.colors.length > 1 ? "linear" : "none",
        gradientStops: [
          { offset: 0, color: inspiration.colors[0] },
          { offset: 1, color: inspiration.colors[1] || inspiration.colors[0] }
        ],
        strokeEnabled: true,
        stroke: "#000000",
        strokeWidth: 2,
        shadowEnabled: inspiration.category === "gaming",
        shadowColor: inspiration.colors[0],
        shadowBlur: 20,
        shadowOpacity: 0.5,
        visible: true,
        name: inspiration.name
      }
    ];
    
    onSelectPreset(elements);
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-bold text-cyan-400 flex items-center space-x-2">
        <FiHeart className="w-5 h-5" />
        <span>Inspiration</span>
      </h3>

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/30 w-4 h-4" />
        <input
          type="text"
          placeholder="Search ideas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#1c1c2e] rounded-lg pl-9 pr-3 py-2 text-sm"
        />
      </div>

      {/* Categories */}
      <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition ${
              category === cat.id 
                ? 'bg-cyan-500 text-white' 
                : 'bg-white/5 hover:bg-white/10 text-white/70'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Inspiration Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => handleSelectPreset(item)}
            className="group bg-[#1a1a2e] rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform"
          >
            <div 
              className="h-24 flex items-center justify-center text-2xl font-black"
              style={{
                background: `linear-gradient(135deg, ${item.colors[0]}, ${item.colors[1] || item.colors[0]})`,
                color: '#fff',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}
            >
              {item.image}
            </div>
            <div className="p-3">
              <h4 className="font-semibold text-sm">{item.name}</h4>
              <p className="text-xs text-white/50 mb-2">{item.description}</p>
              <div className="flex flex-wrap gap-1">
                {item.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-white/10 rounded-full text-[10px]">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-2 flex justify-between items-center">
                <div className="flex space-x-1">
                  {item.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full border border-white/20"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition p-1 hover:bg-white/10 rounded">
                  <FiDownload className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-white/30 text-sm">
          No inspiration found
        </div>
      )}
    </div>
  );
}