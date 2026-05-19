"use client";

import React, { useState, useRef } from "react";
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

  // Estados Base
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<CardData[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [previewIndex, setPreviewIndex] = useState<number>(0);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBgImage(url);
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
      img.src = url;
    }
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
      x: cardWidth / 2 - 50,
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
    <div className={`${isDarkMode ? "dark" : ""} w-full h-screen`}>
      <BetaPopup />
      <div className="flex gap-4 p-4 font-sans h-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden transition-colors duration-300">
        <LeftPanel
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
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
          csvData={csvData}
          previewIndex={previewIndex}
          handlePageChange={handlePageChange}
          setPreviewIndex={setPreviewIndex}
          exportAllCards={exportAllCards}
          isExporting={isExporting}
          exportProgress={exportProgress}
          bgImage={bgImage}
        />

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
          selectedElement={selectedElement}
          updateElement={updateElement}
          removeElement={removeElement}
        />
      </div>
    </div>
  );
}
