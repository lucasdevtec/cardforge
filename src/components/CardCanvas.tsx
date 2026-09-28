import React, { useRef } from "react";
import DraggableItem from "./DraggableItem";
import { DesignElement, CardData } from "../types/design";

interface CardCanvasProps {
  zoom: number;
  setZoom: (val: number | ((prev: number) => number)) => void;
  cardWidth: number;
  cardHeight: number;
  bgImage: string | null;
  cardBgColor?: string;
  cardBorderRadius?: number;
  elements: DesignElement[];
  currentCard: CardData;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  onDragStop: (id: string, x: number, y: number) => void;
  undo?: () => void;
  redo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

export default function CardCanvas({
  zoom,
  setZoom,
  cardWidth,
  cardHeight,
  bgImage,
  cardBgColor = "#ffffff",
  cardBorderRadius = 0,
  elements,
  currentCard,
  selectedId,
  setSelectedId,
  onDragStop,
  undo,
  redo,
  canUndo = false,
  canRedo = false,
  canvasRef,
}: CardCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFitToScreen = () => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const padding = 60;
    const availableWidth = clientWidth - padding;
    const availableHeight = clientHeight - padding;

    const scaleX = availableWidth / cardWidth;
    const scaleY = availableHeight / cardHeight;
    const newZoom = Math.min(Math.max(Math.min(scaleX, scaleY), 0.2), 2);
    setZoom(Number(newZoom.toFixed(2)));
  };

  return (
    <div
      ref={containerRef}
      className="w-2/4 flex flex-col relative bg-gray-200 dark:bg-gray-950 rounded-lg shadow-inner border border-gray-300 dark:border-gray-800 transition-colors"
      onClick={(e) => {
        // Clicar fora da carta deseleciona o elemento atual
        if (
          e.target === containerRef.current ||
          (e.target as HTMLElement).id === "canvas-scroll-area"
        ) {
          setSelectedId(null);
        }
      }}
    >
      {/* Barra Superior de Controles: Desfazer / Refazer e Zoom */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur p-1.5 px-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 text-xs select-none">
        {undo && (
          <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-2 mr-0.5">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 disabled:hover:bg-gray-100 disabled:dark:hover:bg-gray-700 transition font-bold"
              title="Desfazer (Ctrl+Z)"
            >
              ↩
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="w-6 h-6 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 disabled:hover:bg-gray-100 disabled:dark:hover:bg-gray-700 transition font-bold"
              title="Refazer (Ctrl+Shift+Z ou Ctrl+Y)"
            >
              ↪
            </button>
          </div>
        )}

        <button
          onClick={() =>
            setZoom((prev: number) =>
              Math.max(0.1, Number((prev - 0.1).toFixed(1))),
            )
          }
          className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 font-bold transition-colors"
          title="Diminuir Zoom"
        >
          -
        </button>

        <input
          type="range"
          min="0.1"
          max="2"
          step="0.05"
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-24 accent-blue-600 cursor-pointer"
        />

        <button
          onClick={() =>
            setZoom((prev: number) =>
              Math.min(2, Number((prev + 0.1).toFixed(1))),
            )
          }
          className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 font-bold transition-colors"
          title="Aumentar Zoom"
        >
          +
        </button>

        <span className="w-10 font-mono text-center font-bold text-gray-700 dark:text-gray-300">
          {Math.round(zoom * 100)}%
        </span>

        <button
          onClick={() => setZoom(1)}
          className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-[11px] font-semibold transition-colors"
          title="Zoom 100%"
        >
          100%
        </button>

        <button
          onClick={handleFitToScreen}
          className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-[11px] font-semibold transition-colors"
          title="Ajustar à tela"
        >
          Ajustar
        </button>
      </div>

      {/* Área Central Rolável com a Carta */}
      <div
        id="canvas-scroll-area"
        className="w-full h-full overflow-auto flex justify-center items-center p-12"
      >
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
              if ((e.target as HTMLElement).id === "area-da-carta") {
                setSelectedId(null);
              }
            }}
            className="w-full h-full relative overflow-hidden transition-all"
            style={{
              backgroundColor: cardBgColor,
              backgroundImage: bgImage ? `url(${bgImage})` : "none",
              backgroundSize: "100% 100%",
              backgroundPosition: "center",
              borderRadius: cardBorderRadius ? `${cardBorderRadius}px` : "0px",
            }}
          >
            {elements.map((el) => (
              <DraggableItem
                key={el.id}
                el={el}
                currentCard={currentCard}
                isSelected={selectedId === el.id}
                zoom={zoom}
                onDragStop={onDragStop}
                onClick={() => setSelectedId(el.id)}
              />
            ))}

            {!bgImage && elements.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 text-sm pointer-events-none select-none p-4 text-center">
                <span className="text-3xl mb-2">🃏</span>
                <span>Área de design da carta</span>
                <span className="text-xs text-gray-400 mt-1">
                  Adicione imagens, textos ou variáveis do CSV no painel
                  esquerdo
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
