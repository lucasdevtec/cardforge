import React from "react";
import { DesignElement } from "../types/design";

interface PropertiesPanelProps {
  selectedElement?: DesignElement;
  updateElement: (id: string, updates: Partial<DesignElement>) => void;
  removeElement: (id: string) => void;
}

export default function PropertiesPanel({
  selectedElement,
  updateElement,
  removeElement,
}: PropertiesPanelProps) {
  if (!selectedElement) {
    return (
      <div className="w-1/4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-y-auto transition-colors">
        <h2 className="text-lg font-bold border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
          Propriedades
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-10">
          Clique em um elemento para editar.
        </p>
      </div>
    );
  }

  return (
    <div className="w-1/4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-y-auto transition-colors">
      <h2 className="text-lg font-bold border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
        Propriedades
      </h2>
      <div className="flex flex-col gap-4 text-sm">
        {selectedElement.type === "static" ? (
          <div>
            <label className="block font-semibold mb-1 text-gray-700 dark:text-gray-300">
              Texto
            </label>
            <input
              type="text"
              value={selectedElement.content}
              onChange={(e) =>
                updateElement(selectedElement.id, { content: e.target.value })
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
              <option value="'Comic Sans MS', cursive">Comic Sans</option>
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

        <div className="flex gap-2">
          <button
            onClick={() =>
              updateElement(selectedElement.id, {
                fontWeight:
                  selectedElement.fontWeight === "bold" ? "normal" : "bold",
              })
            }
            className={`flex-1 py-1 rounded font-bold border transition-colors ${
              selectedElement.fontWeight === "bold"
                ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 border-gray-800 dark:border-gray-200"
                : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
            }`}
          >
            B
          </button>
          <button
            onClick={() =>
              updateElement(selectedElement.id, {
                fontStyle:
                  selectedElement.fontStyle === "italic" ? "normal" : "italic",
              })
            }
            className={`flex-1 py-1 rounded italic border transition-colors ${
              selectedElement.fontStyle === "italic"
                ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 border-gray-800 dark:border-gray-200"
                : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600"
            }`}
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
            <span>Profundidade (3D)</span> <span>{selectedElement.depth}</span>
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
            selectedElement.depth > 0 ? "opacity-40 pointer-events-none" : ""
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
