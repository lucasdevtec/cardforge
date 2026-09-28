import React, { useRef, useState } from "react";
import { DesignElement } from "../types/design";

interface PropertiesPanelProps {
  elements: DesignElement[];
  selectedElement?: DesignElement;
  setSelectedId: (id: string | null) => void;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
  removeElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  moveLayerUp: (id: string) => void;
  moveLayerDown: (id: string) => void;
  centerElementX: (id: string) => void;
  centerElementY: (id: string) => void;
}

const FONT_OPTIONS = [
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "Times New Roman", value: "'Times New Roman', Times, serif" },
  { label: "Courier New (Mono)", value: "'Courier New', Courier, monospace" },
  { label: "Impact", value: "Impact, 'Arial Black', sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { label: "Garamond", value: "Garamond, serif" },
  { label: "Comic Sans MS", value: "'Comic Sans MS', cursive, sans-serif" },
];

export default function PropertiesPanel({
  elements,
  selectedElement,
  setSelectedId,
  updateElement,
  removeElement,
  duplicateElement,
  bringToFront,
  sendToBack,
  moveLayerUp,
  moveLayerDown,
  centerElementX,
  centerElementY,
}: PropertiesPanelProps) {
  const replaceImageRef = useRef<HTMLInputElement>(null);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);

  // --- VISÃO 1: NENHUM ELEMENTO SELECIONADO (LISTAGEM DE ELEMENTOS E CAMADAS) ---
  if (!selectedElement) {
    return (
      <div className="w-1/4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-y-auto transition-colors h-full flex flex-col">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
            Camadas & Elementos
          </h2>
          <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full font-bold">
            {elements.length}
          </span>
        </div>

        {elements.length === 0 ? (
          <div className="flex flex-col items-center justify-center my-auto p-4 text-center">
            <span className="text-3xl mb-2">📋</span>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Nenhum elemento adicionado
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Use o painel esquerdo para adicionar textos, ícones ou variáveis
              da planilha.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto pr-1">
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1">
              Clique em um elemento para editar ou use os controles de camada:
            </p>
            {/* Exibe da camada mais alta para a mais baixa */}
            {[...elements].reverse().map((el, revIdx) => {
              const actualIdx = elements.length - 1 - revIdx;
              const isImage = el.type === "image";
              const isVar = el.type === "variable";

              return (
                <div
                  key={el.id}
                  onClick={() => setSelectedId(el.id)}
                  className="flex items-center justify-between p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30 hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                    <span className="text-base select-none">
                      {isImage ? "🖼️" : isVar ? "📊" : "📝"}
                    </span>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs font-semibold truncate text-gray-900 dark:text-gray-100">
                        {isImage ? "Imagem / Ícone" : el.content}
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">
                        Camada {actualIdx + 1}
                      </span>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-1 opacity-80 group-hover:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => moveLayerUp(el.id)}
                      disabled={actualIdx === elements.length - 1}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 text-xs"
                      title="Subir Camada"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveLayerDown(el.id)}
                      disabled={actualIdx === 0}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-30 text-xs"
                      title="Descer Camada"
                    >
                      ▼
                    </button>
                    <button
                      onClick={() => duplicateElement(el.id)}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 text-xs"
                      title="Duplicar Elemento"
                    >
                      📑
                    </button>
                    <button
                      onClick={() => removeElement(el.id)}
                      className="p-1 rounded text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 text-xs font-bold"
                      title="Excluir"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // --- VISÃO 2: ELEMENTO SELECIONADO (PROPRIEDADES INDIVIDUAIS) ---
  const isImage = selectedElement.type === "image";

  const handleReplaceImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          updateElement(selectedElement.id, { content: dataUrl });
        }
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    }
  };

  return (
    <div className="w-1/4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-y-auto transition-colors h-full flex flex-col">
      {/* Header com Voltar */}
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="text-base">{isImage ? "🖼️" : "📝"}</span>
          <h2 className="text-sm font-bold">Propriedades</h2>
        </div>
        <button
          onClick={() => setSelectedId(null)}
          className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-300 font-semibold transition"
        >
          ← Camadas
        </button>
      </div>

      <div className="flex flex-col gap-3 text-xs flex-1 overflow-y-auto pr-1">
        {/* BARRA DE AÇÕES RÁPIDAS: ALINHAMENTO E CAMADAS */}
        <div className="bg-gray-50 dark:bg-gray-700/40 p-2 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Posição & Camadas
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => centerElementX(selectedElement.id)}
              className="py-1 px-1.5 bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 rounded border border-gray-200 dark:border-gray-500 text-[11px] font-semibold text-center transition"
              title="Alinhar ao centro horizontal da carta"
            >
              ↔ Centralizar X
            </button>
            <button
              onClick={() => centerElementY(selectedElement.id)}
              className="py-1 px-1.5 bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 rounded border border-gray-200 dark:border-gray-500 text-[11px] font-semibold text-center transition"
              title="Alinhar ao centro vertical da carta"
            >
              ↕ Centralizar Y
            </button>
          </div>

          <div className="grid grid-cols-4 gap-1 mt-0.5">
            <button
              onClick={() => bringToFront(selectedElement.id)}
              className="py-1 px-1 bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 rounded border border-gray-200 dark:border-gray-500 text-[10px] text-center"
              title="Trazer para o topo absoluto"
            >
              ⤒ Topo
            </button>
            <button
              onClick={() => moveLayerUp(selectedElement.id)}
              className="py-1 px-1 bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 rounded border border-gray-200 dark:border-gray-500 text-[10px] text-center"
              title="Subir uma camada"
            >
              ▲ Subir
            </button>
            <button
              onClick={() => moveLayerDown(selectedElement.id)}
              className="py-1 px-1 bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 rounded border border-gray-200 dark:border-gray-500 text-[10px] text-center"
              title="Descer uma camada"
            >
              ▼ Descer
            </button>
            <button
              onClick={() => sendToBack(selectedElement.id)}
              className="py-1 px-1 bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 rounded border border-gray-200 dark:border-gray-500 text-[10px] text-center"
              title="Enviar para o fundo"
            >
              ⤓ Fundo
            </button>
          </div>
        </div>

        {/* PROPRIEDADES ESPECÍFICAS DE IMAGEM */}
        {isImage ? (
          <>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  Dimensões da Imagem
                </span>
                <button
                  onClick={() => setLockAspectRatio(!lockAspectRatio)}
                  className={`text-[10px] px-1.5 py-0.5 rounded border ${
                    lockAspectRatio
                      ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-500 border-gray-300 dark:border-gray-600"
                  }`}
                  title={
                    lockAspectRatio ? "Proporção bloqueada" : "Proporção livre"
                  }
                >
                  {lockAspectRatio ? "🔒 Proporção Fixa" : "🔓 Livre"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] mb-0.5 text-gray-600 dark:text-gray-400">
                    Largura (px)
                  </label>
                  <input
                    type="number"
                    value={selectedElement.width}
                    onChange={(e) => {
                      const newW = Number(e.target.value);
                      if (lockAspectRatio && selectedElement.width > 0) {
                        const ratio =
                          selectedElement.height / selectedElement.width;
                        updateElement(selectedElement.id, {
                          width: newW,
                          height: Math.round(newW * ratio),
                        });
                      } else {
                        updateElement(selectedElement.id, { width: newW });
                      }
                    }}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-1 rounded"
                  />
                </div>
                <div>
                  <label className="block text-[11px] mb-0.5 text-gray-600 dark:text-gray-400">
                    Altura (px)
                  </label>
                  <input
                    type="number"
                    value={selectedElement.height}
                    onChange={(e) => {
                      const newH = Number(e.target.value);
                      if (lockAspectRatio && selectedElement.height > 0) {
                        const ratio =
                          selectedElement.width / selectedElement.height;
                        updateElement(selectedElement.id, {
                          height: newH,
                          width: Math.round(newH * ratio),
                        });
                      } else {
                        updateElement(selectedElement.id, { height: newH });
                      }
                    }}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-1 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Arredondamento da imagem */}
            <div>
              <label className="flex justify-between text-[11px] mb-1 text-gray-700 dark:text-gray-300">
                <span>Arredondamento</span>
                <span>{selectedElement.borderRadius || 0}px</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={selectedElement.borderRadius || 0}
                onChange={(e) =>
                  updateElement(selectedElement.id, {
                    borderRadius: Number(e.target.value),
                  })
                }
                className="w-full accent-blue-600"
              />
            </div>

            {/* Trocar Imagem */}
            <div>
              <input
                type="file"
                ref={replaceImageRef}
                accept="image/*"
                onChange={handleReplaceImage}
                className="hidden"
              />
              <button
                onClick={() => replaceImageRef.current?.click()}
                className="w-full py-1.5 px-3 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded font-semibold transition"
              >
                🔄 Trocar Imagem
              </button>
            </div>
          </>
        ) : (
          /* PROPRIEDADES ESPECÍFICAS DE TEXTO */
          <>
            {selectedElement.type === "static" ? (
              <div>
                <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  Conteúdo do Texto
                </label>
                <textarea
                  rows={2}
                  value={selectedElement.content}
                  onChange={(e) =>
                    updateElement(selectedElement.id, {
                      content: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-1.5 rounded resize-y"
                />
              </div>
            ) : (
              <div className="bg-purple-50 dark:bg-purple-950/40 p-2 rounded-lg border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-200">
                Variável CSV: <strong>{selectedElement.content}</strong>
              </div>
            )}

            {/* Fonte e Tamanho */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block font-semibold mb-1 text-[11px] text-gray-700 dark:text-gray-300">
                  Tipografia
                </label>
                <select
                  value={selectedElement.fontFamily}
                  onChange={(e) =>
                    updateElement(selectedElement.id, {
                      fontFamily: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-1 rounded text-xs"
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.label} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[11px] text-gray-700 dark:text-gray-300">
                  Tamanho
                </label>
                <input
                  type="number"
                  min="6"
                  max="160"
                  value={selectedElement.fontSize}
                  onChange={(e) =>
                    updateElement(selectedElement.id, {
                      fontSize: Number(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-1 rounded text-xs text-center"
                />
              </div>
            </div>

            {/* Largura da Caixa & Alinhamento */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block font-semibold mb-1 text-[11px] text-gray-700 dark:text-gray-300">
                  Largura (px)
                </label>
                <input
                  type="number"
                  value={selectedElement.width}
                  onChange={(e) =>
                    updateElement(selectedElement.id, {
                      width: Number(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-1 rounded text-xs"
                />
              </div>

              <div className="flex-[2]">
                <label className="block font-semibold mb-1 text-[11px] text-gray-700 dark:text-gray-300">
                  Alinhamento
                </label>
                <div className="flex bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded p-0.5">
                  {(["left", "center", "right", "justify"] as const).map(
                    (align) => (
                      <button
                        key={align}
                        onClick={() =>
                          updateElement(selectedElement.id, {
                            textAlign: align,
                          })
                        }
                        className={`flex-1 py-1 flex justify-center items-center rounded transition-colors ${
                          selectedElement.textAlign === align
                            ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400 font-bold"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
                        }`}
                        title={`Alinhar ${align}`}
                      >
                        {align === "left" && "⫷"}
                        {align === "center" && "☰"}
                        {align === "right" && "⫸"}
                        {align === "justify" && "▤"}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* Negrito e Itálico */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() =>
                  updateElement(selectedElement.id, {
                    fontWeight:
                      selectedElement.fontWeight === "bold" ? "normal" : "bold",
                  })
                }
                className={`py-1 rounded font-bold border transition-colors ${
                  selectedElement.fontWeight === "bold"
                    ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 border-gray-800 dark:border-gray-200 shadow-sm"
                    : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                }`}
              >
                Negrito (B)
              </button>
              <button
                onClick={() =>
                  updateElement(selectedElement.id, {
                    fontStyle:
                      selectedElement.fontStyle === "italic"
                        ? "normal"
                        : "italic",
                  })
                }
                className={`py-1 rounded italic border transition-colors ${
                  selectedElement.fontStyle === "italic"
                    ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 border-gray-800 dark:border-gray-200 shadow-sm"
                    : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                }`}
              >
                Itálico (I)
              </button>
            </div>

            {/* Cor do Texto */}
            <div>
              <label className="block font-semibold mb-1 text-[11px] text-gray-700 dark:text-gray-300">
                Cor do Texto
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={selectedElement.color}
                  onChange={(e) =>
                    updateElement(selectedElement.id, { color: e.target.value })
                  }
                  className="w-7 h-7 rounded cursor-pointer border-0 p-0"
                />
                <input
                  type="text"
                  value={selectedElement.color}
                  onChange={(e) =>
                    updateElement(selectedElement.id, { color: e.target.value })
                  }
                  className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-1 rounded font-mono uppercase text-xs"
                />
              </div>
            </div>

            {/* Contorno do Texto (Stroke) */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
              <label className="flex justify-between font-semibold text-[11px] mb-1 text-gray-700 dark:text-gray-300">
                <span>Contorno (Stroke)</span>
                <span>{selectedElement.strokeWidth || 0}px</span>
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={selectedElement.strokeWidth || 0}
                  onChange={(e) =>
                    updateElement(selectedElement.id, {
                      strokeWidth: Number(e.target.value),
                    })
                  }
                  className="flex-1 accent-blue-600"
                />
                <input
                  type="color"
                  value={selectedElement.strokeColor || "#000000"}
                  onChange={(e) =>
                    updateElement(selectedElement.id, {
                      strokeColor: e.target.value,
                    })
                  }
                  className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                  title="Cor do Contorno"
                />
              </div>
            </div>

            {/* Sombra & 3D */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-[11px] text-gray-700 dark:text-gray-300">
                  Sombra & Efeito 3D
                </h3>
                <input
                  type="color"
                  value={selectedElement.shadowColor}
                  onChange={(e) =>
                    updateElement(selectedElement.id, {
                      shadowColor: e.target.value,
                    })
                  }
                  className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                  title="Cor da Sombra"
                />
              </div>

              <div>
                <label className="flex justify-between text-[11px] mb-1 text-gray-600 dark:text-gray-400">
                  <span>Profundidade (3D)</span>
                  <span>{selectedElement.depth}</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={selectedElement.depth}
                  onChange={(e) =>
                    updateElement(selectedElement.id, {
                      depth: Number(e.target.value),
                    })
                  }
                  className="w-full accent-blue-600"
                />
              </div>

              <div
                className={
                  selectedElement.depth > 0
                    ? "opacity-35 pointer-events-none mt-1"
                    : "mt-1"
                }
              >
                <div className="grid grid-cols-3 gap-1.5">
                  <div>
                    <label className="block text-[10px] text-center mb-0.5 text-gray-500">
                      Eixo X
                    </label>
                    <input
                      type="number"
                      value={selectedElement.shadowX}
                      onChange={(e) =>
                        updateElement(selectedElement.id, {
                          shadowX: Number(e.target.value),
                        })
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-1 rounded text-center text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-center mb-0.5 text-gray-500">
                      Eixo Y
                    </label>
                    <input
                      type="number"
                      value={selectedElement.shadowY}
                      onChange={(e) =>
                        updateElement(selectedElement.id, {
                          shadowY: Number(e.target.value),
                        })
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-1 rounded text-center text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-center mb-0.5 text-gray-500">
                      Desfoque
                    </label>
                    <input
                      type="number"
                      value={selectedElement.shadowBlur}
                      onChange={(e) =>
                        updateElement(selectedElement.id, {
                          shadowBlur: Number(e.target.value),
                        })
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-1 rounded text-center text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Espaçamento entre Letras e Altura de Linha */}
            <div className="grid grid-cols-2 gap-2 border-t border-gray-200 dark:border-gray-700 pt-2">
              <div>
                <label className="flex justify-between text-[11px] mb-0.5 text-gray-600 dark:text-gray-400">
                  <span>Espaçamento</span>
                  <span>{selectedElement.letterSpacing || 0}px</span>
                </label>
                <input
                  type="range"
                  min="-2"
                  max="12"
                  value={selectedElement.letterSpacing || 0}
                  onChange={(e) =>
                    updateElement(selectedElement.id, {
                      letterSpacing: Number(e.target.value),
                    })
                  }
                  className="w-full accent-blue-600"
                />
              </div>

              <div>
                <label className="flex justify-between text-[11px] mb-0.5 text-gray-600 dark:text-gray-400">
                  <span>Altura Linha</span>
                  <span>{selectedElement.lineHeight || 1.2}</span>
                </label>
                <input
                  type="range"
                  min="0.8"
                  max="2.5"
                  step="0.1"
                  value={selectedElement.lineHeight || 1.2}
                  onChange={(e) =>
                    updateElement(selectedElement.id, {
                      lineHeight: Number(e.target.value),
                    })
                  }
                  className="w-full accent-blue-600"
                />
              </div>
            </div>
          </>
        )}

        {/* PROPRIEDADES COMUNS: OPACIDADE E ROTAÇÃO */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex flex-col gap-2">
          {/* Opacidade */}
          <div>
            <label className="flex justify-between text-[11px] mb-1 text-gray-700 dark:text-gray-300">
              <span>Opacidade</span>
              <span>
                {Math.round(
                  (selectedElement.opacity !== undefined
                    ? selectedElement.opacity
                    : 1) * 100,
                )}
                %
              </span>
            </label>
            <input
              type="range"
              min="0.05"
              max="1"
              step="0.05"
              value={
                selectedElement.opacity !== undefined
                  ? selectedElement.opacity
                  : 1
              }
              onChange={(e) =>
                updateElement(selectedElement.id, {
                  opacity: Number(e.target.value),
                })
              }
              className="w-full accent-blue-600"
            />
          </div>

          {/* Rotação */}
          <div>
            <div className="flex justify-between items-center text-[11px] mb-1 text-gray-700 dark:text-gray-300">
              <span>Rotação</span>
              <div className="flex items-center gap-1.5">
                <span>{selectedElement.rotation}°</span>
                {selectedElement.rotation !== 0 && (
                  <button
                    onClick={() =>
                      updateElement(selectedElement.id, { rotation: 0 })
                    }
                    className="text-[10px] text-blue-500 hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              value={selectedElement.rotation}
              onChange={(e) =>
                updateElement(selectedElement.id, {
                  rotation: Number(e.target.value),
                })
              }
              className="w-full accent-blue-600"
            />
          </div>
        </div>

        {/* BOTÕES DE DUPLICAR E EXCLUIR */}
        <div className="flex gap-2 pt-2 mt-auto border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => duplicateElement(selectedElement.id)}
            className="flex-1 py-1.5 px-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded font-semibold transition"
          >
            📑 Duplicar
          </button>
          <button
            onClick={() => removeElement(selectedElement.id)}
            className="flex-1 py-1.5 px-2 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/60 rounded font-semibold border border-red-200 dark:border-red-800 transition"
          >
            🗑️ Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
