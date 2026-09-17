"use client";

import React, { useEffect } from 'react';

export default function ConfirmModal({ open, title, description, onConfirm, onCancel }: {
  open: boolean;
  title: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby={description ? "confirm-modal-description" : undefined}
    >
      <div className="bg-[#0f1113] rounded-2xl p-6 w-full max-w-md border border-zinc-800 shadow-2xl relative">
        <h3 id="confirm-modal-title" className="text-lg font-semibold mb-2 text-white">
          {title}
        </h3>
        {description && (
          <p id="confirm-modal-description" className="text-sm text-zinc-400 mb-6 leading-relaxed">
            {description}
          </p>
        )}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold bg-transparent border border-zinc-700 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:outline-none"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-zinc-950 rounded-lg transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:outline-none shadow-sm"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
