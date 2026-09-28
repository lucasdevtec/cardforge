import React, { useRef } from "react";
import { CardData } from "../types/design";

interface LeftPanelProps {
  isProjectActive: boolean;
  handleCreateNewProject: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveBgImage: () => void;
  handleCsvUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClearCsv: () => void;
  cardWidth: number;
  setCardWidth: (val: number) => void;
  cardHeight: number;
  setCardHeight: (val: number) => void;
  cardBgColor: string;
  setCardBgColor: (val: string) => void;
  cardBorderRadius: number;
  setCardBorderRadius: (val: number) => void;
  headers: string[];
  selectedColumn: string;
  setSelectedColumn: (val: string) => void;
  filenameColumn: string;
  setFilenameColumn: (val: string) => void;
  addElement: (type: "variable" | "static", content: string) => void;
  addImageElement: (url: string, width?: number, height?: number) => void;
  csvData: CardData[];
  previewIndex: number;
  handlePageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setPreviewIndex: React.Dispatch<React.SetStateAction<number>>;
  exportSingleCard: () => void;
  exportAllCards: () => void;
  isExporting: boolean;
  exportProgress: number;
  bgImage: string | null;
  saveProject: () => void;
  loadProject: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PRESET_SIZES = [
  { label: "Pôquer Padrão (400 × 560)", width: 400, height: 560 },
  { label: "Pôquer HD (750 × 1050)", width: 750, height: 1050 },
  { label: "Bridge (360 × 560)", width: 360, height: 560 },
  { label: "Tarot (420 × 720)", width: 420, height: 720 },
  { label: "Mini Card (280 × 430)", width: 280, height: 430 },
  { label: "Quadrado (500 × 500)", width: 500, height: 500 },
];

export default function LeftPanel({
  isProjectActive,
  handleCreateNewProject,
  isDarkMode,
  setIsDarkMode,
  handleImageUpload,
  handleRemoveBgImage,
  handleCsvUpload,
  handleClearCsv,
  cardWidth,
  setCardWidth,
  cardHeight,
  setCardHeight,
  cardBgColor,
  setCardBgColor,
  cardBorderRadius,
  setCardBorderRadius,
  headers,
  selectedColumn,
  setSelectedColumn,
  filenameColumn,
  setFilenameColumn,
  addElement,
  addImageElement,
  csvData,
  previewIndex,
  handlePageChange,
  setPreviewIndex,
  exportSingleCard,
  exportAllCards,
  isExporting,
  exportProgress,
  bgImage,
  saveProject,
  loadProject,
}: LeftPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);

  // Manipulador de upload de ícone/imagem com conversão para Base64 persistente
  const onIconFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          const img = new Image();
          img.onload = () => {
            let w = img.naturalWidth || 80;
            let h = img.naturalHeight || 80;
            const maxSize = 120;
            if (w > maxSize || h > maxSize) {
              const ratio = Math.min(maxSize / w, maxSize / h);
              w = Math.max(24, Math.round(w * ratio));
              h = Math.max(24, Math.round(h * ratio));
            }
            addImageElement(dataUrl, w, h);
          };
          img.src = dataUrl;
        }
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    }
  };

  // --- ESTADO 1: ECRÃ DE BOAS-VINDAS / ONBOARDING ---
  if (!isProjectActive) {
    return (
      <div className="flex flex-col gap-5 w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 justify-center items-center text-center transition-colors relative">
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="text-sm px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            title="Alternar Modo Escuro / Claro"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>

        <div className="mb-2">
          <div className="text-4xl mb-2">🃏</div>
          <h1 className="text-3xl font-black tracking-wider uppercase text-gray-950 dark:text-white">
            CardForge
          </h1>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest mt-1">
            Estúdio Dinâmico de Cartas & Jogos
          </p>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs leading-relaxed">
          Crie designs de cartas impressionantes, integre dados via planilhas
          CSV e exporte em lote ou individualmente.
        </p>

        <div className="flex flex-col gap-3 w-full mt-2">
          <button
            onClick={handleCreateNewProject}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow transition-colors text-sm uppercase tracking-wider"
          >
            ✨ Criar Novo Projeto
          </button>

          <label className="w-full bg-transparent text-gray-700 dark:text-gray-200 font-bold py-3 px-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:border-gray-900 dark:hover:border-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm uppercase tracking-wider text-center cursor-pointer">
            📂 Abrir Projeto (.cardforge)
            <input
              type="file"
              accept=".cardforge, application/json"
              onChange={loadProject}
              className="hidden"
            />
          </label>
        </div>
      </div>
    );
  }

  // --- ESTADO 2: MENU NORMAL DE EDIÇÃO ---
  return (
    <div className="flex flex-col gap-4 w-1/4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-y-auto relative transition-colors h-full">
      {/* Top Header & Actions */}
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xl">🃏</span>
          <span className="font-extrabold tracking-wide text-sm uppercase">
            CardForge
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            title="Alternar Tema"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      {/* Quick Project Action Bar */}
      <div className="grid grid-cols-3 gap-1.5">
        <button
          onClick={() => {
            if (
              window.confirm(
                "Deseja criar um novo projeto? Alterações não salvas serão perdidas.",
              )
            ) {
              handleCreateNewProject();
            }
          }}
          className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded py-1.5 text-xs font-semibold transition text-center"
          title="Novo Projeto em Branco"
        >
          ✨ Novo
        </button>

        <label className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded py-1.5 text-xs font-semibold transition text-center cursor-pointer">
          📂 Abrir
          <input
            type="file"
            accept=".cardforge, application/json"
            onChange={loadProject}
            className="hidden"
          />
        </label>

        <button
          onClick={saveProject}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded py-1.5 text-xs font-semibold transition text-center shadow-sm"
          title="Guardar Projeto"
        >
          💾 Salvar
        </button>
      </div>

      {/* SEÇÃO 1: FORMATO E FUNDO */}
      <div className="flex flex-col gap-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 pb-1">
          1. Formato & Fundo
        </h2>

        {/* Predefinições de Tamanho */}
        <div>
          <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Predefinição de Tamanho
          </label>
          <select
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-1 rounded text-xs"
            onChange={(e) => {
              const selected = PRESET_SIZES.find(
                (p) => p.label === e.target.value,
              );
              if (selected) {
                setCardWidth(selected.width);
                setCardHeight(selected.height);
              }
            }}
            defaultValue=""
          >
            <option value="" disabled>
              Escolha um formato...
            </option>
            {PRESET_SIZES.map((preset) => (
              <option key={preset.label} value={preset.label}>
                {preset.label}
              </option>
            ))}
          </select>
        </div>

        {/* Dimensões Manuais */}
        <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-gray-700/50 p-2 rounded border border-gray-200 dark:border-gray-700">
          <div>
            <label className="block text-[11px] text-gray-600 dark:text-gray-300 mb-0.5">
              Largura (px)
            </label>
            <input
              type="number"
              value={cardWidth}
              min="100"
              max="3000"
              onChange={(e) =>
                setCardWidth(Math.max(50, Number(e.target.value)))
              }
              className="w-full border rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-1 text-xs"
            />
          </div>
          <div>
            <label className="block text-[11px] text-gray-600 dark:text-gray-300 mb-0.5">
              Altura (px)
            </label>
            <input
              type="number"
              value={cardHeight}
              min="100"
              max="3000"
              onChange={(e) =>
                setCardHeight(Math.max(50, Number(e.target.value)))
              }
              className="w-full border rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-1 text-xs"
            />
          </div>
        </div>

        {/* Cores e Bordas do Card */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] text-gray-600 dark:text-gray-300 mb-0.5">
              Cor de Fundo
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={cardBgColor}
                onChange={(e) => setCardBgColor(e.target.value)}
                className="w-7 h-7 rounded border-0 cursor-pointer p-0"
              />
              <span className="text-[11px] font-mono uppercase">
                {cardBgColor}
              </span>
            </div>
          </div>
          <div>
            <label className="block text-[11px] text-gray-600 dark:text-gray-300 mb-0.5">
              Borda Arredondada
            </label>
            <div className="flex items-center gap-1">
              <input
                type="range"
                min="0"
                max="40"
                value={cardBorderRadius}
                onChange={(e) => setCardBorderRadius(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <span className="text-[11px] font-mono w-6 text-right">
                {cardBorderRadius}
              </span>
            </div>
          </div>
        </div>

        {/* Upload de Imagem de Fundo */}
        <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-2.5 bg-gray-50 dark:bg-gray-800/50 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
          <div className="flex justify-between items-center mb-1">
            <label className="font-bold text-xs text-gray-800 dark:text-gray-200">
              🖼️ Imagem de Fundo
            </label>
            {bgImage && (
              <button
                onClick={handleRemoveBgImage}
                className="text-[11px] text-red-500 hover:text-red-700 underline"
                title="Remover Imagem de Fundo"
              >
                Remover
              </button>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-xs text-gray-500 dark:text-gray-400
              file:cursor-pointer file:mr-2 file:py-1 file:px-2.5
              file:rounded file:border-0 file:text-[11px] file:font-semibold
              file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200
              dark:file:bg-blue-900/40 dark:file:text-blue-300 dark:hover:file:bg-blue-900/60
              transition-all"
          />
        </div>
      </div>

      {/* SEÇÃO 2: DADOS (CSV) */}
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            2. Base de Dados (CSV)
          </h2>
          {csvData.length > 0 && (
            <button
              onClick={handleClearCsv}
              className="text-[11px] text-red-500 hover:text-red-700 underline"
              title="Limpar CSV carregado"
            >
              Remover
            </button>
          )}
        </div>

        <input
          type="file"
          accept=".csv"
          onChange={handleCsvUpload}
          className="block w-full text-xs text-gray-500 dark:text-gray-400
            file:cursor-pointer file:mr-2 file:py-1 file:px-2.5
            file:rounded file:border-0 file:text-[11px] file:font-semibold
            file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200
            dark:file:bg-purple-900/40 dark:file:text-purple-300 dark:hover:file:bg-purple-900/60
            transition-all"
        />

        {csvData.length > 0 && (
          <div className="flex flex-col gap-2 bg-purple-50 dark:bg-purple-950/30 p-2.5 rounded border border-purple-200 dark:border-purple-800/60 text-xs">
            <div className="flex justify-between items-center text-purple-900 dark:text-purple-200 font-semibold">
              <span>📊 Registros:</span>
              <span className="bg-purple-200 dark:bg-purple-800 px-2 py-0.5 rounded text-[11px] font-bold">
                {csvData.length} cartas
              </span>
            </div>

            {/* Inserir Variável */}
            <div className="flex flex-col gap-1 mt-1">
              <label className="text-[11px] font-medium text-gray-700 dark:text-gray-300">
                Inserir Variável no Cartão:
              </label>
              <div className="flex gap-1.5">
                <select
                  className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-1 rounded text-xs"
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
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs font-bold transition-colors"
                >
                  + Inserir
                </button>
              </div>
            </div>

            {/* Coluna para Nome do Arquivo no ZIP */}
            <div className="flex flex-col gap-1 mt-1 pt-1 border-t border-purple-200/60 dark:border-purple-800/40">
              <label className="text-[11px] font-medium text-gray-700 dark:text-gray-300">
                Nomear arquivos exportados por:
              </label>
              <select
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-1 rounded text-xs"
                value={filenameColumn}
                onChange={(e) => setFilenameColumn(e.target.value)}
              >
                {headers.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* SEÇÃO 3: ELEMENTOS */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 pb-1">
          3. Adicionar Elementos
        </h2>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => addElement("static", "Novo Texto")}
            className="flex items-center justify-center gap-1 border border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 bg-gray-50 dark:bg-gray-700/40 text-gray-800 dark:text-gray-200 py-2 rounded text-xs font-bold transition-colors"
          >
            <span>📝</span> + Texto
          </button>

          <label className="flex items-center justify-center gap-1 border border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 bg-gray-50 dark:bg-gray-700/40 text-gray-800 dark:text-gray-200 py-2 rounded text-xs font-bold transition-colors cursor-pointer text-center">
            <span>✨</span> + Ícone/Img
            <input
              type="file"
              ref={iconInputRef}
              accept="image/*"
              onChange={onIconFileSelected}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* SEÇÃO 4: NAVEGAÇÃO DE CARTAS (SE CSV CARREGADO) */}
      {csvData.length > 0 && (
        <div className="bg-gray-100 dark:bg-gray-700/60 p-2.5 rounded-lg border border-gray-200 dark:border-gray-600 mt-auto">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Visualizar Carta
            </span>
            <span className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
              {previewIndex + 1} de {csvData.length}
            </span>
          </div>

          <div className="flex justify-between items-center gap-2">
            <button
              onClick={() => setPreviewIndex((prev) => Math.max(0, prev - 1))}
              disabled={previewIndex === 0}
              className="px-3 py-1 bg-white dark:bg-gray-600 rounded text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-500 disabled:opacity-40 text-gray-800 dark:text-white shadow-sm transition"
              title="Carta Anterior"
            >
              ◀
            </button>

            <div className="flex items-center gap-1 text-xs">
              <input
                type="number"
                min="1"
                max={csvData.length}
                value={previewIndex + 1}
                onChange={handlePageChange}
                className="w-14 text-center border rounded text-black bg-white dark:bg-gray-800 dark:text-white p-1 text-xs font-bold"
              />
              <span className="text-gray-500 dark:text-gray-400">
                / {csvData.length}
              </span>
            </div>

            <button
              onClick={() =>
                setPreviewIndex((prev) =>
                  Math.min(csvData.length - 1, prev + 1),
                )
              }
              disabled={previewIndex === csvData.length - 1}
              className="px-3 py-1 bg-white dark:bg-gray-600 rounded text-xs font-bold hover:bg-gray-200 dark:hover:bg-gray-500 disabled:opacity-40 text-gray-800 dark:text-white shadow-sm transition"
              title="Próxima Carta"
            >
              ▶
            </button>
          </div>
        </div>
      )}

      {/* SEÇÃO 5: EXPORTAÇÃO */}
      <div
        className={`flex flex-col gap-2 ${csvData.length === 0 ? "mt-auto" : "mt-2"}`}
      >
        {/* Exportar Esta Carta Individualmente */}
        <button
          onClick={exportSingleCard}
          disabled={isExporting}
          className="w-full py-2 px-3 text-xs tracking-wider uppercase font-bold rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <span>📸</span> Exportar Esta Carta (.PNG)
        </button>

        {/* Exportar Todas as Cartas em ZIP */}
        <button
          onClick={exportAllCards}
          disabled={isExporting || csvData.length === 0}
          className={`w-full py-2.5 px-3 text-xs tracking-widest uppercase font-extrabold rounded-lg transition-all shadow-md flex items-center justify-center gap-2 ${
            isExporting
              ? "bg-amber-500 text-white cursor-wait animate-pulse"
              : csvData.length === 0
                ? "bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed border border-gray-300 dark:border-gray-700"
                : "bg-green-600 hover:bg-green-700 active:bg-green-800 text-white"
          }`}
          title={
            csvData.length === 0
              ? "Carregue um CSV para exportar em lote"
              : "Exportar todas as cartas em um arquivo ZIP"
          }
        >
          <span>📦</span>
          {isExporting
            ? `Gerando ${exportProgress} / ${csvData.length}...`
            : `Baixar Todas (.ZIP)`}
        </button>
      </div>
    </div>
  );
}
