"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Papa from "papaparse";
import { toBlob } from "html-to-image";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import { CardData, DesignElement } from "../types/design";
import { ProjectSave } from "../types/project";
import { getCardFileName } from "../utils/textEffects";
import LeftPanel from "../components/LeftPanel";
import CardCanvas from "../components/CardCanvas";
import PropertiesPanel from "../components/PropertiesPanel";
import BetaPopup from "@/components/BetaPopUp";

export default function CardEditorPage() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Motor do Dark Mode
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Estados Base
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [cardBgColor, setCardBgColor] = useState<string>("#ffffff");
  const [cardBorderRadius, setCardBorderRadius] = useState<number>(0);

  const [csvData, setCsvData] = useState<CardData[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [isProjectActive, setIsProjectActive] = useState<boolean>(false);

  // Modal de Salvar
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>("meu_projeto");

  // Dimensões e Zoom
  const [cardWidth, setCardWidth] = useState<number>(400);
  const [cardHeight, setCardHeight] = useState<number>(560);
  const [zoom, setZoom] = useState<number>(1);

  // Elementos de Design
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [filenameColumn, setFilenameColumn] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Histórico de Desfazer / Refazer (Undo / Redo)
  const [past, setPast] = useState<DesignElement[][]>([]);
  const [future, setFuture] = useState<DesignElement[][]>([]);
  const lastHistoryTimeRef = useRef<number>(0);

  const pushHistory = useCallback(() => {
    setPast((prev) => [...prev.slice(-49), elements]);
    setFuture([]);
    lastHistoryTimeRef.current = Date.now();
  }, [elements]);

  const undo = useCallback(() => {
    setPast((prevPast) => {
      if (prevPast.length === 0) return prevPast;
      const previous = prevPast[prevPast.length - 1];
      const newPast = prevPast.slice(0, prevPast.length - 1);
      setFuture((prevFuture) => [elements, ...prevFuture]);
      setElements(previous);
      return newPast;
    });
  }, [elements]);

  const redo = useCallback(() => {
    setFuture((prevFuture) => {
      if (prevFuture.length === 0) return prevFuture;
      const next = prevFuture[0];
      const newFuture = prevFuture.slice(1);
      setPast((prevPast) => [...prevPast, elements]);
      setElements(next);
      return newFuture;
    });
  }, [elements]);

  // Exportação
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);

  const cardRef = useRef<HTMLDivElement>(null);

  const handleCreateNewProject = () => {
    setCardWidth(400);
    setCardHeight(560);
    setCardBgColor("#ffffff");
    setCardBorderRadius(0);
    setElements([]);
    setPast([]);
    setFuture([]);
    setBgImage(null);
    setCsvData([]);
    setHeaders([]);
    setSelectedColumn("");
    setFilenameColumn("");
    setSelectedId(null);
    setPreviewIndex(0);
    setProjectName("meu_projeto");
    setIsProjectActive(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setBgImage(dataUrl);

        const img = new Image();
        img.onload = () => {
          setCardWidth(img.naturalWidth);
          setCardHeight(img.naturalHeight);
          if (img.naturalHeight > 600) {
            setZoom(Number(Math.min(600 / img.naturalHeight, 0.8).toFixed(2)));
          } else {
            setZoom(1);
          }
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBgImage = () => {
    setBgImage(null);
  };

  const saveProject = () => {
    setIsSaveModalOpen(true);
  };

  const confirmSaveProject = (e: React.FormEvent) => {
    e.preventDefault();

    const projectData: ProjectSave = {
      version: "1.0.0",
      cardWidth,
      cardHeight,
      elements,
      bgImage,
      bgColor: cardBgColor,
      borderRadius: cardBorderRadius,
      csvData,
      headers,
    };

    const blob = new Blob([JSON.stringify(projectData, null, 2)], {
      type: "application/json",
    });

    const safeName = projectName.trim() || "meu_projeto";
    const finalName = safeName.endsWith(".cardforge")
      ? safeName
      : `${safeName}.cardforge`;

    saveAs(blob, finalName);
    setIsSaveModalOpen(false);
  };

  const loadProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const baseName = file.name.replace(/\.cardforge$|\.json$/, "");
    if (baseName) setProjectName(baseName);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data: ProjectSave = JSON.parse(event.target?.result as string);

        if (data.version) {
          setCardWidth(data.cardWidth || 400);
          setCardHeight(data.cardHeight || 560);
          setCardBgColor(data.bgColor || "#ffffff");
          setCardBorderRadius(data.borderRadius || 0);
          setElements(data.elements || []);
          setPast([]);
          setFuture([]);
          setBgImage(data.bgImage || null);
          setCsvData(data.csvData || []);
          const cols = data.headers || [];
          setHeaders(cols);
          if (cols.length > 0) {
            setSelectedColumn(cols[0]);
            setFilenameColumn(cols[0]);
          }
          setSelectedId(null);
          setPreviewIndex(0);

          setIsProjectActive(true);
          e.target.value = "";
        }
      } catch (error) {
        console.error("Erro ao carregar o projeto:", error);
        alert("Erro ao carregar o projeto. O ficheiro parece inválido.");
      }
    };
    reader.readAsText(file);
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setCsvData(results.data as CardData[]);
          const cols = results.meta.fields || [];
          setHeaders(cols);
          if (cols.length > 0) {
            setSelectedColumn(cols[0]);
            setFilenameColumn(cols[0]);
          }
          setPreviewIndex(0);
        },
      });
    }
  };

  const handleClearCsv = () => {
    setCsvData([]);
    setHeaders([]);
    setSelectedColumn("");
    setFilenameColumn("");
    setPreviewIndex(0);
  };

  const addElement = (type: "variable" | "static", content: string) => {
    pushHistory();
    const newElement: DesignElement = {
      id: crypto.randomUUID(),
      type,
      content,
      x: Math.round(cardWidth / 2 - 100),
      y: Math.round(cardHeight / 2 - 25),
      fontSize: 24,
      color: "#000000",
      fontFamily: "Arial, Helvetica, sans-serif",
      fontWeight: "normal",
      fontStyle: "normal",
      shadowColor: "#000000",
      shadowX: 0,
      shadowY: 0,
      shadowBlur: 0,
      depth: 0,
      rotation: 0,
      width: 200,
      height: 50,
      textAlign: "center",
      lineHeight: 1.2,
      opacity: 1,
    };
    setElements((prev) => [...prev, newElement]);
    setSelectedId(newElement.id);
  };

  const addImageElement = (url: string, width = 80, height = 80) => {
    pushHistory();
    const newElement: DesignElement = {
      id: crypto.randomUUID(),
      type: "image",
      content: url,
      x: Math.round(cardWidth / 2 - width / 2),
      y: Math.round(cardHeight / 2 - height / 2),
      fontSize: 24,
      color: "#000000",
      fontFamily: "Arial, Helvetica, sans-serif",
      fontWeight: "normal",
      fontStyle: "normal",
      shadowColor: "#000000",
      shadowX: 0,
      shadowY: 0,
      shadowBlur: 0,
      depth: 0,
      rotation: 0,
      width,
      height,
      textAlign: "center",
      opacity: 1,
      borderRadius: 0,
    };
    setElements((prev) => [...prev, newElement]);
    setSelectedId(newElement.id);
  };

  const updateElement = (id: string, updates: Partial<DesignElement>) => {
    const now = Date.now();
    if (now - lastHistoryTimeRef.current > 400) {
      pushHistory();
    }
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...updates } : el)),
    );
  };

  const handleDragStop = (id: string, x: number, y: number) => {
    const current = elements.find((el) => el.id === id);
    if (!current || (current.x === x && current.y === y)) return;
    pushHistory();
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, x, y } : el)),
    );
  };

  const removeElement = useCallback(
    (id: string) => {
      pushHistory();
      setElements((prev) => prev.filter((el) => el.id !== id));
      setSelectedId((current) => (current === id ? null : current));
    },
    [pushHistory],
  );

  const duplicateElement = useCallback(
    (id: string) => {
      const original = elements.find((el) => el.id === id);
      if (!original) return;
      pushHistory();
      const newElement: DesignElement = {
        ...original,
        id: crypto.randomUUID(),
        x: Math.min(original.x + 20, cardWidth - 40),
        y: Math.min(original.y + 20, cardHeight - 40),
      };
      setElements((prev) => [...prev, newElement]);
      setSelectedId(newElement.id);
    },
    [elements, cardWidth, cardHeight, pushHistory],
  );

  const bringToFront = (id: string) => {
    pushHistory();
    setElements((prev) => {
      const item = prev.find((el) => el.id === id);
      if (!item) return prev;
      return [...prev.filter((el) => el.id !== id), item];
    });
  };

  const sendToBack = (id: string) => {
    pushHistory();
    setElements((prev) => {
      const item = prev.find((el) => el.id === id);
      if (!item) return prev;
      return [item, ...prev.filter((el) => el.id !== id)];
    });
  };

  const moveLayerUp = (id: string) => {
    pushHistory();
    setElements((prev) => {
      const index = prev.findIndex((el) => el.id === id);
      if (index === -1 || index === prev.length - 1) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index + 1];
      copy[index + 1] = temp;
      return copy;
    });
  };

  const moveLayerDown = (id: string) => {
    pushHistory();
    setElements((prev) => {
      const index = prev.findIndex((el) => el.id === id);
      if (index <= 0) return prev;
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[index - 1];
      copy[index - 1] = temp;
      return copy;
    });
  };

  const centerElementX = (id: string) => {
    pushHistory();
    setElements((prev) =>
      prev.map((el) =>
        el.id === id
          ? { ...el, x: Math.round((cardWidth - el.width) / 2) }
          : el,
      ),
    );
  };

  const centerElementY = (id: string) => {
    pushHistory();
    setElements((prev) =>
      prev.map((el) =>
        el.id === id
          ? {
              ...el,
              y: Math.round(
                (cardHeight - (el.height || el.fontSize * 1.5)) / 2,
              ),
            }
          : el,
      ),
    );
  };

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value) - 1;
    if (isNaN(val)) val = 0;
    if (val < 0) val = 0;
    if (val >= csvData.length) val = csvData.length - 1;
    setPreviewIndex(val);
  };

  // Exportar apenas a carta atual como imagem PNG
  const exportSingleCard = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    const prevSelected = selectedId;
    setSelectedId(null);

    await new Promise((resolve) => setTimeout(resolve, 80));

    try {
      const blob = await toBlob(cardRef.current, {
        width: cardWidth,
        height: cardHeight,
        style: { transform: "scale(1)", transformOrigin: "top left" },
      });

      if (blob) {
        const fileName = getCardFileName(
          csvData[previewIndex],
          previewIndex,
          filenameColumn,
        );
        saveAs(blob, `${fileName}.png`);
      }
    } catch (err) {
      console.error("Erro ao exportar carta individual:", err);
      alert("Erro ao exportar a carta como imagem.");
    } finally {
      setSelectedId(prevSelected);
      setIsExporting(false);
    }
  };

  // Exportar todas as cartas em um arquivo ZIP
  const exportAllCards = async () => {
    if (!cardRef.current || csvData.length === 0) return;
    setIsExporting(true);
    const prevSelected = selectedId;
    setSelectedId(null);
    setExportProgress(0);

    const zip = new JSZip();
    const node = cardRef.current;
    const originalIndex = previewIndex;

    await new Promise((resolve) => setTimeout(resolve, 100));

    for (let i = 0; i < csvData.length; i++) {
      setPreviewIndex(i);
      setExportProgress(i + 1);
      await new Promise((resolve) => setTimeout(resolve, 120));

      try {
        const blob = await toBlob(node, {
          width: cardWidth,
          height: cardHeight,
          style: { transform: "scale(1)", transformOrigin: "top left" },
        });

        if (blob) {
          const filePrefix = getCardFileName(csvData[i], i, filenameColumn);
          zip.file(`${filePrefix}.png`, blob);
        }
      } catch (err) {
        console.error("Erro ao gerar a carta", i, err);
      }
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${projectName || "minhas_cartas"}.zip`);
    setPreviewIndex(originalIndex);
    setSelectedId(prevSelected);
    setIsExporting(false);
  };

  // Atalhos de Teclado Globais (Ctrl+Z, Ctrl+Shift+Z, Delete, Esc, Setas, Ctrl+D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tagName = target?.tagName.toLowerCase();
      if (
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select" ||
        target?.isContentEditable
      ) {
        return;
      }

      // Atalhos de Desfazer e Refazer (Ctrl+Z e Ctrl+Shift+Z / Ctrl+Y)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
        return;
      }

      if (!selectedId) return;

      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        removeElement(selectedId);
      } else if (e.key === "Escape") {
        setSelectedId(null);
      } else if (
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight"
      ) {
        e.preventDefault();
        const now = Date.now();
        if (now - lastHistoryTimeRef.current > 400) {
          pushHistory();
        }
        const step = e.shiftKey ? 10 : 1;
        const dx =
          e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
        const dy =
          e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
        setElements((prev) =>
          prev.map((el) =>
            el.id === selectedId ? { ...el, x: el.x + dx, y: el.y + dy } : el,
          ),
        );
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        duplicateElement(selectedId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, duplicateElement, removeElement, undo, redo, pushHistory]);

  const currentCard = csvData[previewIndex] || {};
  const selectedElement = elements.find((el) => el.id === selectedId);

  return (
    <div className="w-full h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <BetaPopup />

      {/* MODAL DE SALVAR PROJETO */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span>💾</span> Salvar Projeto
            </h2>

            <form onSubmit={confirmSaveProject}>
              <label className="block text-xs font-semibold mb-1 text-gray-700 dark:text-gray-300">
                Nome do arquivo:
              </label>
              <div className="flex items-center gap-1.5 mb-5">
                <input
                  type="text"
                  autoFocus
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  placeholder="meu_projeto"
                />
                <span className="text-xs text-gray-500 font-mono">
                  .cardforge
                </span>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setIsSaveModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!projectName.trim()}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow"
                >
                  Baixar Projeto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ÁREA PRINCIPAL DA APLICAÇÃO */}
      <div
        className={`flex p-3 font-sans h-full overflow-hidden transition-colors duration-300 ${
          isProjectActive ? "gap-3" : "justify-center items-center"
        }`}
      >
        <LeftPanel
          isProjectActive={isProjectActive}
          handleCreateNewProject={handleCreateNewProject}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          saveProject={saveProject}
          loadProject={loadProject}
          handleImageUpload={handleImageUpload}
          handleRemoveBgImage={handleRemoveBgImage}
          handleCsvUpload={handleCsvUpload}
          handleClearCsv={handleClearCsv}
          cardWidth={cardWidth}
          setCardWidth={setCardWidth}
          cardHeight={cardHeight}
          setCardHeight={setCardHeight}
          cardBgColor={cardBgColor}
          setCardBgColor={setCardBgColor}
          cardBorderRadius={cardBorderRadius}
          setCardBorderRadius={setCardBorderRadius}
          headers={headers}
          selectedColumn={selectedColumn}
          setSelectedColumn={setSelectedColumn}
          filenameColumn={filenameColumn}
          setFilenameColumn={setFilenameColumn}
          addElement={addElement}
          addImageElement={addImageElement}
          csvData={csvData}
          previewIndex={previewIndex}
          handlePageChange={handlePageChange}
          setPreviewIndex={setPreviewIndex}
          exportSingleCard={exportSingleCard}
          exportAllCards={exportAllCards}
          isExporting={isExporting}
          exportProgress={exportProgress}
          bgImage={bgImage}
        />

        {isProjectActive && (
          <>
            <CardCanvas
              zoom={zoom}
              setZoom={setZoom}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
              bgImage={bgImage}
              cardBgColor={cardBgColor}
              cardBorderRadius={cardBorderRadius}
              elements={elements}
              currentCard={currentCard}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              onDragStop={handleDragStop}
              undo={undo}
              redo={redo}
              canUndo={past.length > 0}
              canRedo={future.length > 0}
              canvasRef={cardRef}
            />

            <PropertiesPanel
              elements={elements}
              selectedElement={selectedElement}
              setSelectedId={setSelectedId}
              updateElement={updateElement}
              removeElement={removeElement}
              duplicateElement={duplicateElement}
              bringToFront={bringToFront}
              sendToBack={sendToBack}
              moveLayerUp={moveLayerUp}
              moveLayerDown={moveLayerDown}
              centerElementX={centerElementX}
              centerElementY={centerElementY}
            />
          </>
        )}
      </div>
    </div>
  );
}
