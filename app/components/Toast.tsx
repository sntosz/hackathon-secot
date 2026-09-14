'use client';

import React from 'react';
import { useAppState } from '../context/AppStateContext';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAppState();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none no-print"
    >
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';

        const bgClass = isError
          ? 'bg-rose-900/95 border-rose-700 text-rose-100'
          : isSuccess
          ? 'bg-emerald-900/95 border-emerald-700 text-emerald-100'
          : isWarning
          ? 'bg-amber-900/95 border-amber-700 text-amber-100'
          : 'bg-slate-900/95 border-slate-700 text-slate-100';

        const Icon = isError
          ? XCircle
          : isSuccess
          ? CheckCircle2
          : isWarning
          ? AlertTriangle
          : Info;

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3 rounded-md border shadow-lg flex items-start gap-2.5 transition-all text-xs ${bgClass}`}
            role="alert"
          >
            <Icon className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-0.5">
              <div className="font-bold uppercase tracking-wide text-[11px]">{toast.title}</div>
              <p className="font-medium text-[11px] leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-0.5 hover:opacity-75 rounded"
              aria-label="Fechar notificação"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
