"use client";

import React from 'react';
import { useHours } from '@/context/HoursContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useHours();

  if (toasts.length === 0) return null;

  return (
    <div 
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      role="region"
      aria-live="polite"
      aria-label="Notificações do sistema"
    >
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
          warning: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
          error: <XCircle className="w-4 h-4 text-rose-400 shrink-0" />,
          info: <Info className="w-4 h-4 text-blue-400 shrink-0" />,
        };

        const bgStyles = {
          success: 'bg-[#101e18] border-emerald-500/50 text-emerald-100',
          warning: 'bg-[#221c12] border-amber-500/50 text-amber-100',
          error: 'bg-[#261214] border-rose-500/50 text-rose-100',
          info: 'bg-[#121a29] border-blue-500/50 text-blue-100',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto border rounded-xl p-3.5 shadow-2xl flex items-center justify-between gap-3 text-xs backdrop-blur-md transition-all ${bgStyles[toast.type]}`}
          >
            <div className="flex items-center gap-2.5">
              {icons[toast.type]}
              <span className="font-medium leading-snug">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-400 hover:text-white p-0.5 rounded transition-colors"
              aria-label="Fechar notificação"
            >
              <X className="w-3.5 h-3.5 cursor-pointer" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
