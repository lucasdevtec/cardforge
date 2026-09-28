import React, { useRef } from "react";
import Draggable from "react-draggable";
import { DesignElement, CardData } from "../types/design";
import { generateTextShadow, generateTextStroke } from "../utils/textEffects";

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
      ? currentCard[el.content] !== undefined
        ? currentCard[el.content]
        : `{${el.content}}`
      : el.content;

  const textShadow = isImage ? "none" : generateTextShadow(el);
  const textStroke = isImage ? undefined : generateTextStroke(el);

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
        className={`absolute cursor-move select-none rounded transition-shadow ${
          isSelected
            ? "outline outline-2 outline-blue-500 ring-2 ring-white/70 shadow-lg"
            : "hover:outline hover:outline-1 hover:outline-gray-400"
        }`}
        style={{
          width: `${el.width}px`,
          height: isImage ? `${el.height}px` : "auto",
          zIndex: isSelected ? 20 : 1,
          padding: isImage ? "0" : "2px 4px",
          opacity: el.opacity !== undefined ? el.opacity : 1,
        }}
      >
        <div
          style={{
            transform: `rotate(${el.rotation}deg)`,
            transformOrigin: "center center",
            width: "100%",
            height: "100%",
          }}
        >
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={el.content}
              alt="Elemento Visual"
              className="w-full h-full object-contain pointer-events-none"
              style={{
                borderRadius: el.borderRadius
                  ? `${el.borderRadius}px`
                  : undefined,
              }}
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
                WebkitTextStroke: textStroke,
                textAlign: el.textAlign,
                letterSpacing: el.letterSpacing
                  ? `${el.letterSpacing}px`
                  : undefined,
                lineHeight: el.lineHeight ? el.lineHeight : "normal",
                borderRadius: el.borderRadius
                  ? `${el.borderRadius}px`
                  : undefined,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {displayText}
            </div>
          )}
        </div>
      </div>
    </Draggable>
  );
}
