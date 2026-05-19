"use client";

import React, { useState, useEffect } from "react";

export default function BetaPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verifica se o utilizador já fechou o popup antes
    const hasSeenPopup = localStorage.getItem("cardforge_beta_popup");
    if (!hasSeenPopup) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    // Guarda no navegador para não mostrar novamente
    localStorage.setItem("cardforge_beta_popup", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 transition-opacity">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700 transform transition-all">
        <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <span className="text-2xl">🚧</span> Versão Beta
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
          Bem-vindo ao CardForge! A aplicação está atualmente em fase{" "}
          <strong>Beta</strong>. Isto significa que estamos a afinar os motores:
          a ferramenta poderá sofrer bastantes mudanças e receberá novidades e
          funcionalidades incríveis no futuro.
          <br />
          <br />
          Aproveite para testar e obrigado por utilizar!
        </p>

        <div className="flex flex-col gap-4 mt-2">
          <button
            onClick={handleClose}
            className="w-full bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-bold py-2 px-4 rounded transition-colors hover:bg-gray-700 dark:hover:bg-gray-300 active:bg-gray-800 dark:active:bg-gray-400"
          >
            Entendi, vamos lá!
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
    </div>
  );
}
