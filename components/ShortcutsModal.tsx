"use client";

import React from 'react';
import { useHours } from '../context/HoursContext';
import { X, Keyboard, Eye, Sun, Volume2, Type, CheckCircle } from 'lucide-react';

export default function ShortcutsModal() {
  const { isShortcutsOpen, setIsShortcutsOpen } = useHours();

  if (!isShortcutsOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
    >
      <div className="bg-[#12141a] border border-zinc-700/80 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative">
        <button
          onClick={() => setIsShortcutsOpen(false)}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          aria-label="Fechar guia de acessibilidade"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <h2 id="shortcuts-modal-title" className="text-lg font-bold text-white flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-blue-400" />
            Acessibilidade e Atalhos do Teclado
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            O UFSCar Horas foi desenvolvido em conformidade com as diretrizes WCAG 2.1 (Nível AAA) para garantir usabilidade total para todas as pessoas.
          </p>
        </div>

        {/* Shortcuts Table */}
        <div className="space-y-4 text-xs">
          <div className="bg-[#171922] p-3.5 rounded-xl border border-zinc-800">
            <div className="font-semibold text-zinc-200 mb-2.5 flex items-center gap-1.5">
              <Keyboard className="w-4 h-4 text-emerald-400" />
              Atalhos Globais
            </div>
            <div className="grid grid-cols-2 gap-2 text-zinc-300">
              <div className="flex items-center justify-between bg-black/30 p-2 rounded">
                <span>Abrir este Guia</span>
                <kbd className="bg-zinc-800 px-2 py-0.5 rounded font-mono text-zinc-300">?</kbd>
              </div>
              <div className="flex items-center justify-between bg-black/30 p-2 rounded">
                <span>Fechar Modais</span>
                <kbd className="bg-zinc-800 px-2 py-0.5 rounded font-mono text-zinc-300">Esc</kbd>
              </div>
              <div className="flex items-center justify-between bg-black/30 p-2 rounded">
                <span>Navegação Tabulada</span>
                <kbd className="bg-zinc-800 px-2 py-0.5 rounded font-mono text-zinc-300">Tab / Shift+Tab</kbd>
              </div>
              <div className="flex items-center justify-between bg-black/30 p-2 rounded">
                <span>Confirmar / Acessar</span>
                <kbd className="bg-zinc-800 px-2 py-0.5 rounded font-mono text-zinc-300">Enter / Space</kbd>
              </div>
            </div>
          </div>

          {/* Accessibility Features Explanation */}
          <div className="bg-[#171922] p-3.5 rounded-xl border border-zinc-800 space-y-2.5">
            <div className="font-semibold text-zinc-200 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              Recursos Inclusivos Integrados
            </div>
            
            <div className="flex items-start gap-2 text-zinc-300">
              <Sun className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Alto Contraste WCAG AAA:</strong> Fundo negro puro, texto branco e bordas iluminadas para baixa visão e fotossensibilidade.
              </div>
            </div>

            <div className="flex items-start gap-2 text-zinc-300">
              <Type className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Fonte para Dislexia & Ajuste de Escala:</strong> Tipografia com maior peso na base dos caracteres e controle de escala de texto (100%, 115%, 130%).
              </div>
            </div>

            <div className="flex items-start gap-2 text-zinc-300">
              <Eye className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Modo Foco Neurodivergente:</strong> Redução drástica de transições e ruído visual para suporte a TDAH e espectro autista.
              </div>
            </div>

            <div className="flex items-start gap-2 text-zinc-300">
              <Volume2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Leitor de Voz & Audiodescrição:</strong> Síntese de voz integrada no navegador para confirmações, alertas e dados acadêmicos.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-zinc-800 flex justify-end">
          <button
            onClick={() => setIsShortcutsOpen(false)}
            className="px-4 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-zinc-950 rounded-lg transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
