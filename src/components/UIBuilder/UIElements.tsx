import { Rect, Text, Group, Transformer } from "react-konva";
import { useState, useRef, useEffect } from "react";
import type { UIElement } from "../../types/types";

interface Props {
  element: UIElement;
  isSelected: boolean;
  onSelect: (e: any, id: string) => void;
  onChange: (newProps: Partial<UIElement>) => void;
  onDelete?: (id: string) => void;
  stageScale?: number;
}

export default function UIElementRenderer({
  element,
  isSelected,
  onSelect,
  onChange,
  onDelete,
  stageScale = 1,
}: Props) {
  const {
    id,
    x,
    y,
    width,
    height,
    fill = "#1f2937",
    stroke,
    strokeWidth = 1,
    opacity = 1,
    text = "",
    rotation = 0,
    fontSize = 16,
    fontFamily = "Arial",
    fontStyle = "normal",
    fontWeight = "normal",
    cornerRadius = 8,
    shadowColor,
    shadowBlur,
    shadowOffsetX,
    shadowOffsetY,
    visible = true,
    locked = false,
    type,
  } = element;

  const [textValue, setTextValue] = useState(text);
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const shapeRef = useRef<any>(null);
  const textRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const groupRef = useRef<any>(null);

  useEffect(() => {
    setTextValue(text || "");
  }, [text]);

  // Attach Transformer
  useEffect(() => {
    if (isSelected && !locked) {
      const timer = setTimeout(() => {
        try {
          const node = type === "text" ? textRef.current : groupRef.current || shapeRef.current;
          if (node && trRef.current) {
            trRef.current.nodes([node]);
            trRef.current.getLayer()?.batchDraw();
          }
        } catch (error) {
          console.error("Error attaching transformer:", error);
        }
      }, 30);
      return () => clearTimeout(timer);
    } else if (trRef.current) {
      trRef.current.nodes([]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, locked, type]);

  // Drag
  const handleDragEnd = (e: any) => {
    if (locked) return;
    onChange({ x: e.target.x(), y: e.target.y() });
  };

  // Transform (resize/rotate)
  const handleTransform = () => {
    if (locked) return;
    const node = type === "text" ? textRef.current : groupRef.current || shapeRef.current;
    if (!node) return;

    const scaleX = node.scaleX();
    const scaleY = node.scaleY();
    const rotation = node.rotation();
    const nodeX = node.x();
    const nodeY = node.y();

    node.scaleX(1);
    node.scaleY(1);

    if (type === "text") {
      onChange({ x: nodeX, y: nodeY, fontSize: Math.max(8, Math.round(fontSize * scaleX)), rotation });
    } else {
      onChange({
        x: nodeX,
        y: nodeY,
        width: Math.max(20, Math.round(width * scaleX)),
        height: Math.max(20, Math.round(height * scaleY)),
        rotation,
      });
    }
  };

  const handleTransformEnd = () => handleTransform();

  // Edit text on double click
  const handleDoubleClick = (e: any) => {
    e.cancelBubble = true;
    if (!["text", "button", "card", "menu", "input"].includes(type) && !text) return;

    setIsEditing(true);

    setTimeout(() => {
      if (textRef.current?.startEdit) {
        try {
          textRef.current.startEdit();
          textRef.current.off("textChange");
          textRef.current.on("textChange", () => {
            const newText = textRef.current.text();
            setTextValue(newText);
            onChange({ text: newText });
          });
        } catch (error) {
          console.error("Error editing text:", error);
          setIsEditing(false);
        }
      }
    }, 50);
  };

  const handleClick = (e: any) => {
    e.cancelBubble = true;
    if (!isEditing) onSelect(e, id);
  };

  if (!visible) return null;

  // Render solo texto
  if (type === "text") {
    return (
      <>
        <Text
          ref={textRef}
          x={x}
          y={y}
          text={textValue}
          fontSize={fontSize}
          fontFamily={fontFamily}
          fontStyle={fontStyle}
          fontWeight={fontWeight}
          fill={fill}
          opacity={opacity}
          rotation={rotation}
          draggable={!locked}
          onClick={handleClick}
          onTap={handleClick}
          onDragEnd={handleDragEnd}
          onDblClick={handleDoubleClick}
          onDblTap={handleDoubleClick}
          perfectDrawEnabled={false}
        />
        {isSelected && !locked && (
          <Transformer
            ref={trRef}
            rotateEnabled
            enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
            anchorSize={8}
            borderStroke="#0ea5e9"
            anchorStroke="#0ea5e9"
            anchorFill="white"
            anchorCornerRadius={4}
            boundBoxFunc={(oldBox, newBox) => (newBox.width < 20 || newBox.height < 20 ? oldBox : newBox)}
            onTransform={handleTransform}
            onTransformEnd={handleTransformEnd}
          />
        )}
      </>
    );
  }

  // Render elementos con fondo + texto centrado
  return (
    <>
      <Group
        ref={groupRef}
        x={x}
        y={y}
        width={width}
        height={height}
        rotation={rotation}
        draggable={!locked}
        onClick={handleClick}
        onTap={handleClick}
        onDragEnd={handleDragEnd}
        onDblClick={handleDoubleClick}
        onDblTap={handleDoubleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Fondo */}
        <Rect
          ref={shapeRef}
          width={width}
          height={height}
          fill={fill}
          cornerRadius={cornerRadius}
          stroke={stroke}
          strokeWidth={strokeWidth}
          opacity={opacity}
          shadowColor={shadowColor}
          shadowBlur={shadowBlur}
          shadowOffsetX={shadowOffsetX}
          shadowOffsetY={shadowOffsetY}
          perfectDrawEnabled={false}
        />

        {/* Texto centrado */}
        {textValue && (
          <Text
            ref={textRef}
            x={width / 2}
            y={height / 2}
            text={textValue}
            fontSize={fontSize}
            fontFamily={fontFamily}
            fontStyle={fontStyle}
            fontWeight={fontWeight}
            fill={type === "input" ? "#111827" : "#ffffff"}
            align="center"
            verticalAlign="middle"
            offsetX={width / 2}
            offsetY={height / 2}
            perfectDrawEnabled={false}
            listening={!locked}
            draggable={!locked}
            onDblClick={handleDoubleClick}
            onDblTap={handleDoubleClick}
          />
        )}

        {/* Hover */}
        {isHovered && !locked && !isSelected && (
          <Rect
            width={width}
            height={height}
            stroke="#0ea5e9"
            strokeWidth={2}
            dash={[5, 5]}
            listening={false}
          />
        )}

        {/* Locked */}
        {locked && (
          <Rect
            width={width}
            height={height}
            stroke="#ef4444"
            strokeWidth={2}
            dash={[5, 5]}
            listening={false}
          />
        )}
      </Group>

      {/* Transformer para todos los elementos */}
      {isSelected && !locked && (
        <Transformer
          ref={trRef}
          rotateEnabled
          enabledAnchors={[
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right",
            "middle-left",
            "middle-right",
            "top-center",
            "bottom-center",
          ]}
          anchorSize={8}
          borderStroke="#0ea5e9"
          anchorStroke="#0ea5e9"
          anchorFill="white"
          anchorCornerRadius={4}
          boundBoxFunc={(oldBox, newBox) => (newBox.width < 20 || newBox.height < 20 ? oldBox : newBox)}
          onTransform={handleTransform}
          onTransformEnd={handleTransformEnd}
        />
      )}
    </>
  );
}
