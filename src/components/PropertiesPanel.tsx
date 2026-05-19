import React from "react";
import { DesignElement } from "../types/design";

interface PropertiesPanelProps {
  elements: DesignElement[];
  selectedElement?: DesignElement;
  setSelectedId: (id: string | null) => void;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
  removeElement: (id: string) => void;
}

export default function PropertiesPanel({
  elements,
  selectedElement,
  setSelectedId,
  updateElement,
  removeElement,
}: PropertiesPanelProps) {
  // --- VISÃO 1: NENHUM ELEMENTO SELECIONADO (LISTAGEM GERAL) ---
  if (!selectedElement) {
    return (
      <div className="w-1/4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-y-auto transition-colors">
        <h2 className="text-lg font-bold border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
          Elementos na Carta
        </h2>

        {elements.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-10 combined-cl">
            Nenhum elemento adicionado ainda. Use o painel esquerdo para
            começar.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Clique em um item para editar suas propriedades:
            </p>
            {elements.map((el) => {
              const isImage = el.type === "image";
              const isVar = el.type === "variable";

              return (
                <div
                  key={el.id}
                  onClick={() => setSelectedId(el.id)}
                  className="flex items-center justify-between p-2.5 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/40 hover:bg-gray-100 dark:hover:bg-gray-700/60 cursor-pointer transition-colors group"
                >
                  <div className="flex flex-col min-w-0 flex-1 pr-2">
                    <span className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
                      {isImage ? "🖼️ Imagem Fixa" : el.content}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-bold mt-0.5 text-gray-400 dark:text-gray-500">
                      {isVar && "📊 Variável CSV"}
                      {el.type === "static" && "📝 Texto Estático"}
                      {isImage && "✨ Ícone"}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Impede de selecionar o item ao clicar em excluir
                      removeElement(el.id);
                    }}
                    className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                    title="Excluir elemento"
                  >
                    ✕
                  </button>
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

  return (
    <div className="w-1/4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-y-auto transition-colors">
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
        <h2 className="text-lg font-bold">Propriedades</h2>
        <button
          onClick={() => setSelectedId(null)}
          className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-500 dark:text-gray-400 transition"
        >
          Voltar à lista
        </button>
      </div>

      <div className="flex flex-col gap-4 text-sm">
        {isImage ? (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold mb-1 text-xs text-gray-700 dark:text-gray-300">
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
            <div>
              <label className="block font-semibold mb-1 text-xs text-gray-700 dark:text-gray-300">
                Altura (px)
              </label>
              <input
                type="number"
                value={selectedElement.height}
                onChange={(e) =>
                  updateElement(selectedElement.id, {
                    height: Number(e.target.value),
                  })
                }
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-1 rounded text-xs"
              />
            </div>
          </div>
        ) : (
          <>
            {selectedElement.type === "static" ? (
              <div>
                <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
                  Texto
                </label>
                <input
                  type="text"
                  value={selectedElement.content}
                  onChange={(e) =>
                    updateElement(selectedElement.id, {
                      content: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-1 rounded"
                />
              </div>
            ) : (
              <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200">
                Variável: <strong>{selectedElement.content}</strong>
              </div>
            )}

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block font-semibold mb-1 text-xs text-gray-700 dark:text-gray-300">
                  Fonte
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
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="'Times New Roman', serif">Times</option>
                  <option value="'Courier New', monospace">Courier</option>
                  <option value="Impact, fantasy">Impact</option>
                </select>
              </div>
              <div className="w-16">
                <label className="block font-semibold mb-1 text-xs text-gray-700 dark:text-gray-300">
                  Tam.
                </label>
                <input
                  type="number"
                  value={selectedElement.fontSize}
                  onChange={(e) =>
                    updateElement(selectedElement.id, {
                      fontSize: Number(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-1 rounded text-xs"
                />
              </div>
            </div>

            <div className="flex gap-2 mb-2">
              <div className="flex-1">
                <label className="block font-semibold mb-1 text-xs text-gray-700 dark:text-gray-300">
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
                <label className="block font-semibold mb-1 text-xs text-gray-700 dark:text-gray-300">
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
                            ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600 dark:text-blue-400"
                            : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
                        }`}
                        title={`Alinhar ${align}`}
                      >
                        {align === "left" && (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M3 6h18M3 12h12M3 18h18" />
                          </svg>
                        )}
                        {align === "center" && (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M3 6h18M6 12h12M3 18h18" />
                          </svg>
                        )}
                        {align === "right" && (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M3 6h18M9 12h12M3 18h18" />
                          </svg>
                        )}
                        {align === "justify" && (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M3 6h18M3 12h18M3 18h18" />
                          </svg>
                        )}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  updateElement(selectedElement.id, {
                    fontWeight:
                      selectedElement.fontWeight === "bold" ? "normal" : "bold",
                  })
                }
                className={`flex-1 py-1 rounded font-bold border transition-colors ${selectedElement.fontWeight === "bold" ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 border-gray-800 dark:border-gray-200" : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"}`}
              >
                B
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
                className={`flex-1 py-1 rounded italic border transition-colors ${selectedElement.fontStyle === "italic" ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 border-gray-800 dark:border-gray-200" : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"}`}
              >
                I
              </button>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-xs text-gray-700 dark:text-gray-300">
                Cor do Texto
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={selectedElement.color}
                  onChange={(e) =>
                    updateElement(selectedElement.id, { color: e.target.value })
                  }
                  className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                />
                <input
                  type="text"
                  value={selectedElement.color}
                  onChange={(e) =>
                    updateElement(selectedElement.id, { color: e.target.value })
                  }
                  className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-1 rounded text-xs uppercase"
                />
              </div>
            </div>

            <hr className="my-1 border-gray-200 dark:border-gray-700" />
            <h3 className="font-bold text-xs text-gray-700 dark:text-gray-300">
              Sombra & 3D
            </h3>

            <div>
              <label className="block font-semibold mb-1 text-xs text-gray-700 dark:text-gray-300">
                Cor da Sombra/3D
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={selectedElement.shadowColor}
                  onChange={(e) =>
                    updateElement(selectedElement.id, {
                      shadowColor: e.target.value,
                    })
                  }
                  className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                />
                <input
                  type="text"
                  value={selectedElement.shadowColor}
                  onChange={(e) =>
                    updateElement(selectedElement.id, {
                      shadowColor: e.target.value,
                    })
                  }
                  className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-1 rounded text-xs uppercase"
                />
              </div>
            </div>

            <div>
              <label className="flex justify-between text-xs mb-1 text-gray-700 dark:text-gray-300">
                <span>Profundidade (3D)</span>{" "}
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
                  ? "opacity-40 pointer-events-none"
                  : ""
              }
            >
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs text-center mb-1 text-gray-700 dark:text-gray-300">
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
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-1 rounded text-xs text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs text-center mb-1 text-gray-700 dark:text-gray-300">
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
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-1 rounded text-xs text-center"
                  />
                </div>
                <div>
                  <label className="block text-xs text-center mb-1 text-gray-700 dark:text-gray-300">
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
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-1 rounded text-xs text-center"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        <hr className="my-1 border-gray-200 dark:border-gray-700" />

        <div>
          <label className="flex justify-between text-xs mb-1 text-gray-700 dark:text-gray-300">
            <span>Rotação (Graus)</span>{" "}
            <span>{selectedElement.rotation}°</span>
          </label>
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

        <button
          onClick={() => removeElement(selectedElement.id)}
          className="mt-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 px-4 py-2 rounded text-sm font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition w-full"
        >
          Excluir Elemento
        </button>
      </div>
    </div>
  );
}
