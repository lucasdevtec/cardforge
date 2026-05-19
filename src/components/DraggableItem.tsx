import React, { useRef } from "react";
import Draggable from "react-draggable";
import { DesignElement, CardData } from "../types/design";
import { generateTextShadow } from "../utils/textEffects";

interface DraggableItemProps {
  el: DesignElement;
  currentCard: CardData;
  isSelected: boolean;
  zoom: number;
  onDragStop: (id: string, x: number, y: number) => void;
  onClick: () => void;
}

export default function DraggableItem({
  el,
  currentCard,
  isSelected,
  zoom,
  onDragStop,
  onClick,
}: DraggableItemProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const isImage = el.type === "image";

  const displayText =
    el.type === "variable"
      ? currentCard[el.content] || `{${el.content}}`
      : el.content;

  const textShadow = isImage ? "none" : generateTextShadow(el);

  return (
    <Draggable
      nodeRef={nodeRef}
      bounds="parent"
      position={{ x: el.x, y: el.y }}
      scale={zoom}
      onStart={onClick}
      onStop={(e, data) => onDragStop(el.id, data.x, data.y)}
    >
      <div
        ref={nodeRef}
        className={`absolute cursor-move rounded ${
          isSelected
            ? "outline outline-2 outline-blue-500 border-dashed border-2 border-white"
            : "hover:outline hover:outline-1 hover:outline-gray-400"
        }`}
        style={{
          transform: `rotate(${el.rotation}deg)`,
          width: `${el.width}px`,
          height: isImage ? `${el.height}px` : "auto", // Imagem respeita a altura definida
          zIndex: isSelected ? 10 : 1,
          padding: isImage ? "0" : "2px 4px",
        }}
      >
        {isImage ? (
          <img
            src={el.content}
            alt="Ícone Fixo"
            className="w-full h-full object-contain pointer-events-none"
            /* pointer-events-none impede que o clique na imagem quebre o arrasto do Draggable */
          />
        ) : (
          <div
            style={{
              fontSize: `${el.fontSize}px`,
              color: el.color,
              fontFamily: el.fontFamily,
              fontWeight: el.fontWeight,
              fontStyle: el.fontStyle,
              textShadow,
              textAlign: el.textAlign,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {displayText}
          </div>
        )}
      </div>
    </Draggable>
  );
}
