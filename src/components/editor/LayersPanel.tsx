import type { EditorElement } from "../../types/EditorElement";
import { 
  FiEye, 
  FiEyeOff, 
  FiCopy, 
  FiTrash2,
  FiArrowUp,
  FiArrowDown
} from "react-icons/fi";

interface Props {
  elements: EditorElement[];
  selectedId: string | null;
  selectedIds?: string[];
  onSelect: (id: string) => void;
  onSelectMultiple?: (ids: string[]) => void;
  onVisibilityChange: (id: string, visible: boolean) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  bringForward: () => void;
  sendBackward: () => void;
}

export default function LayersPanel({
  elements,
  selectedId,
  selectedIds = [],
  onSelect,
  onSelectMultiple,
  onVisibilityChange,
  onDuplicate,
  onDelete,
  bringForward,
  sendBackward
}: Props) {
  
  const handleLayerClick = (id: string, e: React.MouseEvent) => {
    if (e.shiftKey && onSelectMultiple) {
      // Selección múltiple con Shift
      if (selectedIds.includes(id)) {
        onSelectMultiple(selectedIds.filter(sid => sid !== id));
      } else {
        onSelectMultiple([...selectedIds, id]);
      }
    } else if (e.ctrlKey || e.metaKey) {
      // Selección múltiple con Ctrl/Cmd
      if (selectedIds.includes(id)) {
        if (onSelectMultiple) {
          onSelectMultiple(selectedIds.filter(sid => sid !== id));
        }
      } else {
        if (onSelectMultiple) {
          onSelectMultiple([...selectedIds, id]);
        }
      }
    } else {
      // Selección simple
      onSelect(id);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-cyan-400">Layers</h3>
        <div className="flex space-x-1">
          <button
            onClick={bringForward}
            className="p-1 hover:bg-white/10 rounded"
            title="Bring Forward"
          >
            <FiArrowUp className="w-4 h-4" />
          </button>
          <button
            onClick={sendBackward}
            className="p-1 hover:bg-white/10 rounded"
            title="Send Backward"
          >
            <FiArrowDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-1">
        {elements.map((el, index) => {
          const isSelected = selectedIds.includes(el.id) || selectedId === el.id;
          
          return (
            <div
              key={el.id}
              className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${
                isSelected ? 'bg-cyan-500/20 border border-cyan-500/50' : 'hover:bg-white/5'
              }`}
              onClick={(e) => handleLayerClick(el.id, e)}
            >
              <div className="flex items-center space-x-2 flex-1">
                <span className="text-xs text-white/30 w-6">{index + 1}</span>
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: el.fill }}
                />
                <span className="text-sm truncate max-w-[120px]">{el.name || el.type}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onVisibilityChange(el.id, !el.visible);
                  }}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  {el.visible !== false ? (
                    <FiEye className="w-3 h-3" />
                  ) : (
                    <FiEyeOff className="w-3 h-3" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(el.id);
                  }}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <FiCopy className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(el.id);
                  }}
                  className="p-1 hover:bg-white/10 rounded text-red-400"
                >
                  <FiTrash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {elements.length === 0 && (
        <div className="text-center py-8 text-white/30 text-sm">
          No layers yet. Add shapes to get started.
        </div>
      )}
    </div>
  );
}