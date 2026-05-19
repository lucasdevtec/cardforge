import React from "react";
import { CardData } from "../types/design";

interface LeftPanelProps {
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCsvUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  cardWidth: number;
  setCardWidth: (val: number) => void;
  cardHeight: number;
  setCardHeight: (val: number) => void;
  headers: string[];
  selectedColumn: string;
  setSelectedColumn: (val: string) => void;
  addElement: (type: "variable" | "static", content: string) => void;
  csvData: CardData[];
  previewIndex: number;
  handlePageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setPreviewIndex: React.Dispatch<React.SetStateAction<number>>;
  exportAllCards: () => void;
  isExporting: boolean;
  exportProgress: number;
  bgImage: string | null;
}

export default function LeftPanel({
  isDarkMode,
  setIsDarkMode,
  handleImageUpload,
  handleCsvUpload,
  cardWidth,
  setCardWidth,
  cardHeight,
  setCardHeight,
  headers,
  selectedColumn,
  setSelectedColumn,
  addElement,
  csvData,
  previewIndex,
  handlePageChange,
  setPreviewIndex,
  exportAllCards,
  isExporting,
  exportProgress,
  bgImage,
}: LeftPanelProps) {
  return (
    <div className="flex flex-col gap-4 w-1/4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-y-auto relative transition-colors">
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-1">
        <h2 className="text-lg font-bold">1. Arquivos Base</h2>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="text-lg px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
          {isDarkMode ? "🌙" : "☀️"}
        </button>
      </div>

      {/* --- ÁREA DE UPLOADS DESTACADA --- */}
      <div className="flex flex-col gap-3 my-2">
        {/* UPLOAD DE IMAGEM */}
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-800/50 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
          <label className="block mb-2 font-bold text-sm text-gray-800 dark:text-gray-200">
            🖼️ Background (Imagem)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-xs text-gray-500 dark:text-gray-400
              file:cursor-pointer file:mr-3 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-xs file:font-bold
              file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200
              dark:file:bg-blue-900/40 dark:file:text-blue-300 dark:hover:file:bg-blue-900/60
              transition-all"
          />
        </div>

        {/* UPLOAD DE CSV */}
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-800/50 hover:border-purple-400 dark:hover:border-purple-500 transition-colors">
          <label className="block mb-2 font-bold text-sm text-gray-800 dark:text-gray-200">
            📊 Base de Dados (CSV)
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleCsvUpload}
            className="block w-full text-xs text-gray-500 dark:text-gray-400
              file:cursor-pointer file:mr-3 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-xs file:font-bold
              file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200
              dark:file:bg-purple-900/40 dark:file:text-purple-300 dark:hover:file:bg-purple-900/60
              transition-all"
          />
        </div>
      </div>
      {/* --------------------------------- */}

      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600 text-xs">
        <p className="font-semibold mb-1">
          Tamanho de Saída: {cardWidth} x {cardHeight}px
        </p>
        <div className="flex gap-2">
          <label>Largura:</label>
          <input
            type="number"
            value={cardWidth}
            onChange={(e) => setCardWidth(Number(e.target.value))}
            className="w-16 border rounded text-black p-1 text-xs"
          />
          <label>Altura:</label>
          <input
            type="number"
            value={cardHeight}
            onChange={(e) => setCardHeight(Number(e.target.value))}
            className="w-16 border rounded text-black p-1 text-xs"
          />
        </div>
      </div>
      <h2 className="text-lg font-bold border-b border-gray-200 dark:border-gray-700 pb-1 mt-2">
        2. Elementos
      </h2>
      <button
        onClick={() => addElement("static", "Novo Texto")}
        className="w-full border border-gray-400 dark:border-gray-500 text-gray-800 dark:text-gray-200 bg-transparent px-4 py-2 rounded text-sm font-bold hover:border-gray-900 dark:hover:border-gray-100 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        + Adicionar Texto
      </button>
      {headers.length > 0 && (
        <div className="flex flex-col gap-2 bg-gray-100 dark:bg-gray-700 p-2 rounded border border-gray-200 dark:border-gray-600">
          <label className="font-semibold text-xs">Variável do CSV:</label>
          <select
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-1 rounded text-sm"
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
          >
            {headers.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          <button
            onClick={() => addElement("variable", selectedColumn)}
            className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded text-sm font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors mt-2"
          >
            + Inserir Variável
          </button>
        </div>
      )}
      {csvData.length > 0 && (
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xs font-bold mb-2">Visualizar Carta</h2>
          <div className="flex justify-between items-center gap-2 bg-gray-100 dark:bg-gray-700 p-2 rounded">
            <button
              onClick={() => setPreviewIndex((prev) => Math.max(0, prev - 1))}
              disabled={previewIndex === 0}
              className="px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded text-xs hover:bg-gray-400 dark:hover:bg-gray-500 disabled:opacity-50 text-gray-800 dark:text-white"
            >
              ◀
            </button>
            <div className="flex items-center gap-1 text-sm font-semibold">
              <input
                type="number"
                min="1"
                max={csvData.length}
                value={previewIndex + 1}
                onChange={handlePageChange}
                className="w-12 text-center border rounded text-black bg-white dark:bg-gray-800 dark:text-white p-1 text-xs"
              />
              <span>/ {csvData.length}</span>
            </div>
            <button
              onClick={() =>
                setPreviewIndex((prev) =>
                  Math.min(csvData.length - 1, prev + 1),
                )
              }
              disabled={previewIndex === csvData.length - 1}
              className="px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded text-xs hover:bg-gray-400 dark:hover:bg-gray-500 disabled:opacity-50 text-gray-800 dark:text-white"
            >
              ▶
            </button>
          </div>
        </div>
      )}

      {/* BOTÃO DE EXPORTAÇÃO */}
      <div className="mt-4">
        <button
          onClick={exportAllCards}
          disabled={isExporting || csvData.length === 0 || !bgImage}
          className={`w-full py-2 text-sm tracking-widest uppercase font-bold rounded-md transition-colors duration-200 border ${
            isExporting
              ? "bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-700 cursor-wait"
              : !bgImage || csvData.length === 0
                ? "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-700 cursor-not-allowed"
                : "bg-green-600 text-white border-green-600 hover:bg-green-700 hover:border-green-700 active:bg-green-800"
          }`}
        >
          {isExporting
            ? `Gerando ${exportProgress} / ${csvData.length}...`
            : "Baixar Cartas (.ZIP)"}
        </button>
        <a
          href="https://tree.taiga.io/project/lucasdevtec-cardforge/issues"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-center text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 underline underline-offset-2 transition-colors"
        >
          Reportar um problema ou sugerir uma funcionalidade
        </a>
      </div>
    </div>
  );
}
