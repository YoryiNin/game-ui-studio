import { useEffect, useRef } from "react";
import type { EditorElement } from "../types/EditorElement";

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

// Función para clonar profundamente un elemento
const deepCloneElement = (element: EditorElement): EditorElement => {
  return JSON.parse(JSON.stringify(element));
};

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

      // COPY - Ahora guarda copia profunda con todas las propiedades
      if (isCtrl && e.key.toLowerCase() === "c") {
        if (selectedIds.length === 0) return;
        e.preventDefault();

        clipboard.current = elements
          .filter(el => selectedIds.includes(el.id))
          .map(el => deepCloneElement(el));
        
        console.log("Copiados:", clipboard.current.length, "elementos con todas sus propiedades");
      }

      // PASTE - Ahora mantiene rotación, escala y todas las propiedades
      if (isCtrl && e.key.toLowerCase() === "v") {
        if (clipboard.current.length === 0) return;
        e.preventDefault();

        const duplicated = clipboard.current.map(el => ({
          ...deepCloneElement(el),
          id: crypto.randomUUID(),
          x: el.x + 30,
          y: el.y + 30,
          name: `${el.name || el.type}_copy`,
          // Asegurar que todas las propiedades de transformación se mantengan
          rotation: el.rotation || 0,
          scaleX: el.scaleX || 1,
          scaleY: el.scaleY || 1,
          // Mantener propiedades específicas de cada tipo
          ...(el.type === 'rect' && { cornerRadius: el.cornerRadius }),
          ...(el.type === 'star' && { 
            numPoints: el.numPoints, 
            innerRadius: el.innerRadius 
          }),
          ...(el.type === 'polygon' && { numPoints: el.numPoints }),
          ...(el.type === 'text' && {
            text: el.text,
            fontSize: el.fontSize,
            fontFamily: el.fontFamily,
            fontWeight: el.fontWeight,
            fontStyle: el.fontStyle,
            textDecoration: el.textDecoration,
            uppercase: el.uppercase,
            letterSpacing: el.letterSpacing,
            lineHeight: el.lineHeight,
            align: el.align,
            strokeEnabled: el.strokeEnabled,
            shadowEnabled: el.shadowEnabled,
            shadowColor: el.shadowColor,
            shadowBlur: el.shadowBlur,
            shadowOffsetX: el.shadowOffsetX,
            shadowOffsetY: el.shadowOffsetY,
            shadowOpacity: el.shadowOpacity,
          })
        }));

        const updated = [...elements, ...duplicated];
        setElements(updated);
        pushToHistory(updated);
        setSelectedIds(duplicated.map(d => d.id));
        setSelectedId(duplicated[0].id);
      }

      // DUPLICATE (Ctrl+D) - Ahora mantiene todas las propiedades
      if (isCtrl && e.key.toLowerCase() === "d") {
        if (selectedIds.length === 0) return;
        e.preventDefault();

        const duplicated = elements
          .filter(el => selectedIds.includes(el.id))
          .map(el => ({
            ...deepCloneElement(el),
            id: crypto.randomUUID(),
            x: el.x + 30,
            y: el.y + 30,
            name: `${el.name || el.type}_copy`,
            rotation: el.rotation || 0,
            scaleX: el.scaleX || 1,
            scaleY: el.scaleY || 1,
            // Mantener propiedades específicas de cada tipo
            ...(el.type === 'rect' && { cornerRadius: el.cornerRadius }),
            ...(el.type === 'star' && { 
              numPoints: el.numPoints, 
              innerRadius: el.innerRadius 
            }),
            ...(el.type === 'polygon' && { numPoints: el.numPoints }),
            ...(el.type === 'text' && {
              text: el.text,
              fontSize: el.fontSize,
              fontFamily: el.fontFamily,
              fontWeight: el.fontWeight,
              fontStyle: el.fontStyle,
              textDecoration: el.textDecoration,
              uppercase: el.uppercase,
              letterSpacing: el.letterSpacing,
              lineHeight: el.lineHeight,
              align: el.align,
              strokeEnabled: el.strokeEnabled,
              shadowEnabled: el.shadowEnabled,
              shadowColor: el.shadowColor,
              shadowBlur: el.shadowBlur,
              shadowOffsetX: el.shadowOffsetX,
              shadowOffsetY: el.shadowOffsetY,
              shadowOpacity: el.shadowOpacity,
            })
          }));

        const updated = [...elements, ...duplicated];
        setElements(updated);
        pushToHistory(updated);
        setSelectedIds(duplicated.map(d => d.id));
        setSelectedId(duplicated[0].id);
      }

      // CUT (Ctrl+X) - Nuevo atajo para cortar elementos
      if (isCtrl && e.key.toLowerCase() === "x") {
        if (selectedIds.length === 0) return;
        e.preventDefault();

        // Guardar en clipboard
        clipboard.current = elements
          .filter(el => selectedIds.includes(el.id))
          .map(el => deepCloneElement(el));

        // Eliminar elementos seleccionados
        const updated = elements.filter(el => !selectedIds.includes(el.id));
        setElements(updated);
        pushToHistory(updated);
        setSelectedIds([]);
        setSelectedId(null);
        
        console.log("Cortados:", clipboard.current.length, "elementos");
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

      // REDO (Ctrl+Shift+Z)
      if (isCtrl && e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        redo();
      }

      // REDO alternativo (Ctrl+Y)
      if (isCtrl && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      }

      // ESC - Deseleccionar todo
      if (e.key === "Escape") {
        setSelectedIds([]);
        setSelectedId(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [elements, selectedIds, undo, redo, pushToHistory, setElements, setSelectedIds, setSelectedId]);

  return {
    clipboard,
    hasClipboard: clipboard.current.length > 0
  };
}