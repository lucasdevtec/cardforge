import React from "react";
import DraggableItem from "./DraggableItem";
import { DesignElement, CardData } from "../types/design";

interface CardCanvasProps {
  zoom: number;
  setZoom: (val: number) => void;
  cardWidth: number;
  cardHeight: number;
  bgImage: string | null;
  elements: DesignElement[];
  currentCard: CardData;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

export default function CardCanvas({
  zoom,
  setZoom,
  cardWidth,
  cardHeight,
  bgImage,
  elements,
  currentCard,
  selectedId,
  setSelectedId,
  updateElement,
  canvasRef,
}: CardCanvasProps) {
  return (
    <div className="w-2/4 flex flex-col relative bg-gray-200 dark:bg-gray-950 rounded-lg shadow-inner border border-gray-300 dark:border-gray-800 transition-colors">
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded shadow-md border border-gray-200 dark:border-gray-700 text-xs">
        <span className="font-bold">Zoom:</span>
        <input
          type="range"
          min="0.1"
          max="2"
          step="0.1"
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-24 accent-blue-600"
        />
        <span className="w-10 font-mono text-right">
          {Math.round(zoom * 100)}%
        </span>
      </div>

      <div className="w-full h-full overflow-auto flex justify-center items-center p-8">
        <div
          style={{
            width: cardWidth,
            height: cardHeight,
            transform: `scale(${zoom})`,
            transformOrigin: "center center",
            transition: "transform 0.1s ease-out",
          }}
          className="relative shadow-2xl flex-shrink-0"
        >
          <div
            ref={canvasRef}
            id="area-da-carta"
            onClick={(e) => {
              if ((e.target as HTMLElement).id === "area-da-carta")
                setSelectedId(null);
            }}
            className="w-full h-full relative bg-white overflow-hidden"
            style={{
              backgroundImage: bgImage ? `url(${bgImage})` : "none",
              backgroundSize: "100% 100%",
              backgroundPosition: "center",
            }}
          >
            {elements.map((el) => (
              <DraggableItem
                key={el.id}
                el={el}
                currentCard={currentCard}
                isSelected={selectedId === el.id}
                zoom={zoom}
                onDragStop={(id, x, y) => updateElement(id, { x, y })}
                onClick={() => setSelectedId(el.id)}
              />
            ))}
            {!bgImage && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm pointer-events-none">
                Suba um background
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
