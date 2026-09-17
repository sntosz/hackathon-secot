"use client";

import React from 'react';

export default function PaginationControls({
  page,
  totalPages,
  onPrev,
  onNext,
  onJump
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onJump: (n: number) => void;
}) {
  return (
    <nav aria-label="Paginação" className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm w-full">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={page <= 1}
          aria-label="Página anterior"
          className="px-2.5 sm:px-3 py-1 bg-[#121316] border border-zinc-800 rounded text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-400 focus:outline-none"
        >
          Anterior
        </button>
        <span className="text-zinc-400">
          Pág <strong className="text-white">{page}</strong> de <strong className="text-white">{totalPages}</strong>
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={page >= totalPages}
          aria-label="Próxima página"
          className="px-2.5 sm:px-3 py-1 bg-[#121316] border border-zinc-800 rounded text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-400 focus:outline-none"
        >
          Próxima
        </button>
      </div>
      <div className="flex items-center gap-2 text-zinc-400">
        <label htmlFor="jump-to-page" className="text-xs">Ir para:</label>
        <select
          id="jump-to-page"
          value={page}
          onChange={e => onJump(Number(e.target.value))}
          aria-label="Selecionar página"
          className="bg-[#0f1113] border border-zinc-800 text-white rounded px-2 py-1 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-400 focus:outline-none"
        >
          {Array.from({ length: totalPages }).map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
}
