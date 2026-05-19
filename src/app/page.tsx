"use client";

import React, { useState, useRef, useEffect } from "react";
import Papa from "papaparse";
import { toBlob } from "html-to-image";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import { CardData, DesignElement } from "../types/design";
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
  const [csvData, setCsvData] = useState<CardData[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [isProjectActive, setIsProjectActive] = useState<boolean>(false);

  // --- NOVOS ESTADOS PARA O MODAL DE SALVAR ---
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>("meu_projeto");
  // --------------------------------------------

  // Estados Visuais
  const [cardWidth, setCardWidth] = useState<number>(400);
  const [cardHeight, setCardHeight] = useState<number>(600);
  const [zoom, setZoom] = useState<number>(1);

  // Estados de Elementos
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Exportação
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);

  const cardRef = useRef<HTMLDivElement>(null);

  const handleCreateNewProject = () => {
    setCardWidth(400);
    setCardHeight(600);
    setElements([]);
    setBgImage(null);
    setCsvData([]);
    setHeaders([]);
    setSelectedId(null);
    setPreviewIndex(0);
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
            setZoom(Math.min(600 / img.naturalHeight, 0.8));
          } else {
            setZoom(1);
          }
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  // --- ATUALIZADO: Agora apenas abre o modal ---
  const saveProject = () => {
    setIsSaveModalOpen(true);
  };

  // --- NOVO: Função que efetivamente cria o arquivo com o nome escolhido ---
  const confirmSaveProject = (e: React.FormEvent) => {
    e.preventDefault(); // Impede o "refresh" da página ao dar Enter no formulário

    const projectData = {
      version: "1.0.0",
      cardWidth,
      cardHeight,
      elements,
      bgImage,
      csvData,
      headers,
    };

    const blob = new Blob([JSON.stringify(projectData)], {
      type: "application/json",
    });

    // Garante que o arquivo terá a extensão correta caso o usuário a tenha apagado
    const finalName = projectName.endsWith(".cardforge")
      ? projectName
      : `${projectName}.cardforge`;

    saveAs(blob, finalName);
    setIsSaveModalOpen(false); // Fecha o modal após salvar
  };

  const loadProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);

        if (data.version) {
          setCardWidth(data.cardWidth || 400);
          setCardHeight(data.cardHeight || 600);
          setElements(data.elements || []);
          setBgImage(data.bgImage || null);
          setCsvData(data.csvData || []);
          setHeaders(data.headers || []);
          setSelectedId(null);
          setPreviewIndex(0);

          setIsProjectActive(true);
          e.target.value = "";
        }
      } catch (error) {
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
          if (cols.length > 0) setSelectedColumn(cols[0]);
          setPreviewIndex(0);
        },
      });
    }
  };

  const addElement = (type: "variable" | "static", content: string) => {
    const newElement: DesignElement = {
      id: crypto.randomUUID(),
      type,
      content,
      x: cardWidth / 2 - 100,
      y: cardHeight / 2 - 20,
      fontSize: 24,
      color: "#000000",
      fontFamily: "Arial, sans-serif",
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
    };
    setElements([...elements, newElement]);
    setSelectedId(newElement.id);
  };

  const addImageElement = (url: string) => {
    const newElement: DesignElement = {
      id: crypto.randomUUID(),
      type: "image",
      content: url,
      x: cardWidth / 2 - 40,
      y: cardHeight / 2 - 40,
      fontSize: 24,
      color: "#000000",
      fontFamily: "Arial, sans-serif",
      fontWeight: "normal",
      fontStyle: "normal",
      shadowColor: "#000000",
      shadowX: 0,
      shadowY: 0,
      shadowBlur: 0,
      depth: 0,
      rotation: 0,
      width: 80,
      height: 80,
      textAlign: "center",
    };
    setElements([...elements, newElement]);
    setSelectedId(newElement.id);
  };

  const updateElement = (id: string, updates: Partial<DesignElement>) => {
    setElements(
      elements.map((el) => (el.id === id ? { ...el, ...updates } : el)),
    );
  };

  const removeElement = (id: string) => {
    setElements(elements.filter((el) => el.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value) - 1;
    if (isNaN(val)) val = 0;
    if (val < 0) val = 0;
    if (val >= csvData.length) val = csvData.length - 1;
    setPreviewIndex(val);
  };

  const exportAllCards = async () => {
    if (!cardRef.current || csvData.length === 0) return;
    setIsExporting(true);
    setSelectedId(null);
    setExportProgress(0);

    const zip = new JSZip();
    const node = cardRef.current;
    const originalIndex = previewIndex;

    await new Promise((resolve) => setTimeout(resolve, 100));

    for (let i = 0; i < csvData.length; i++) {
      setPreviewIndex(i);
      setExportProgress(i + 1);
      await new Promise((resolve) => setTimeout(resolve, 150));

      try {
        const blob = await toBlob(node, {
          width: cardWidth,
          height: cardHeight,
          style: { transform: "scale(1)", transformOrigin: "top left" },
        });

        if (blob) {
          const filePrefix =
            csvData[i].nome || csvData[i].name || `carta_${i + 1}`;
          zip.file(`${filePrefix}.png`, blob);
        }
      } catch (err) {
        console.error("Erro ao gerar a carta", i, err);
      }
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "minhas_cartas.zip");
    setPreviewIndex(originalIndex);
    setIsExporting(false);
  };

  const currentCard = csvData[previewIndex] || {};
  const selectedElement = elements.find((el) => el.id === selectedId);

  return (
    <div className="w-full h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <BetaPopup />

      {/* --- NOVO: MODAL DE SALVAR PROJETO --- */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-sm w-full p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
              💾 Salvar Projeto
            </h2>

            {/* O onSubmit lida com o Enter no teclado */}
            <form onSubmit={confirmSaveProject}>
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                Nome do arquivo
              </label>
              <div className="flex items-center gap-2 mb-6">
                <input
                  type="text"
                  autoFocus
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="flex-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  placeholder="meu_projeto"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsSaveModalOpen(false)}
                  className="px-4 py-2 rounded text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!projectName.trim()}
                  className="px-4 py-2 rounded text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* --------------------------------------- */}

      <div
        className={`flex p-4 font-sans h-full overflow-hidden transition-colors duration-300 ${
          isProjectActive ? "gap-4" : "justify-center items-center"
        }`}
      >
        <LeftPanel
          isProjectActive={isProjectActive}
          handleCreateNewProject={handleCreateNewProject}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          saveProject={saveProject} // Dispara o modal agora!
          loadProject={loadProject}
          handleImageUpload={handleImageUpload}
          handleCsvUpload={handleCsvUpload}
          cardWidth={cardWidth}
          setCardWidth={setCardWidth}
          cardHeight={cardHeight}
          setCardHeight={setCardHeight}
          headers={headers}
          selectedColumn={selectedColumn}
          setSelectedColumn={setSelectedColumn}
          addElement={addElement}
          addImageElement={addImageElement}
          csvData={csvData}
          previewIndex={previewIndex}
          handlePageChange={handlePageChange}
          setPreviewIndex={setPreviewIndex}
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
              elements={elements}
              currentCard={currentCard}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              updateElement={updateElement}
              canvasRef={cardRef}
            />

            <PropertiesPanel
              elements={elements}
              selectedElement={selectedElement}
              setSelectedId={setSelectedId}
              updateElement={updateElement}
              removeElement={removeElement}
            />
          </>
        )}
      </div>
    </div>
  );
}
