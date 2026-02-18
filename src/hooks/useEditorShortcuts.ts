import { useEffect, useRef } from "react";
import type { EditorElement } from "../../src/types/editor";

interface Props {
  elements: EditorElement[];
  setElements: React.Dispatch<React.SetStateAction<EditorElement[]>>;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  setSelectedId: (id: string | null) => void;
  pushToHistory: (els: EditorElement[]) => void;
  undo: () => void;
  redo: () => void;
}

export function useEditorShortcuts({
  elements,
  setElements,
  selectedIds,
  setSelectedIds,
  setSelectedId,
  pushToHistory,
  undo,
  redo,
}: Props) {
  const clipboard = useRef<EditorElement[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey;

      // DELETE
      if (e.key === "Delete") {
        if (selectedIds.length === 0) return;
        e.preventDefault();

        const updated = elements.filter(el => !selectedIds.includes(el.id));
        setElements(updated);
        pushToHistory(updated);
        setSelectedIds([]);
        setSelectedId(null);
      }

      // COPY
      if (isCtrl && e.key.toLowerCase() === "c") {
        if (selectedIds.length === 0) return;
        e.preventDefault();

        clipboard.current = elements.filter(el =>
          selectedIds.includes(el.id)
        );
      }

      // PASTE
      if (isCtrl && e.key.toLowerCase() === "v") {
        if (clipboard.current.length === 0) return;
        e.preventDefault();

        const duplicated = clipboard.current.map(el => ({
          ...el,
          id: crypto.randomUUID(),
          x: el.x + 20,
          y: el.y + 20,
        }));

        const updated = [...elements, ...duplicated];
        setElements(updated);
        pushToHistory(updated);
        setSelectedIds(duplicated.map(d => d.id));
        setSelectedId(duplicated[0].id);
      }

      // DUPLICATE
      if (isCtrl && e.key.toLowerCase() === "d") {
        if (selectedIds.length === 0) return;
        e.preventDefault();

        const duplicated = elements
          .filter(el => selectedIds.includes(el.id))
          .map(el => ({
            ...el,
            id: crypto.randomUUID(),
            x: el.x + 20,
            y: el.y + 20,
          }));

        const updated = [...elements, ...duplicated];
        setElements(updated);
        pushToHistory(updated);
        setSelectedIds(duplicated.map(d => d.id));
        setSelectedId(duplicated[0].id);
      }

      // SELECT ALL
      if (isCtrl && e.key.toLowerCase() === "a") {
        e.preventDefault();
        const ids = elements.map(el => el.id);
        setSelectedIds(ids);
        setSelectedId(ids[0] || null);
      }

      // UNDO
      if (isCtrl && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // REDO
      if (isCtrl && e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [elements, selectedIds]);
}
