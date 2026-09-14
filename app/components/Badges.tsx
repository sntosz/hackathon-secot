'use client';

import React from 'react';
import { CertificateStatus, CategoryId } from '../types';
import { CATEGORY_RULES } from '../data/mockData';
import { CheckCircle2, Clock, XCircle, HelpCircle, FileText } from 'lucide-react';

export const CategoryBadge: React.FC<{ categoryId: CategoryId; showIcon?: boolean }> = ({ categoryId }) => {
  const category = CATEGORY_RULES[categoryId] || {
    name: categoryId,
  };

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-xs text-[11px] font-semibold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700"
    >
      {category.name}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: CertificateStatus }> = ({ status }) => {
  switch (status) {
    case 'approved':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[11px] font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          Deferido
        </span>
      );
    case 'submitted':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[11px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
          <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
          Em Análise
        </span>
      );
    case 'rejected':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[11px] font-bold bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
          <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          Indeferido
        </span>
      );
    case 'needs_info':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[11px] font-bold bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
          <HelpCircle className="w-3 h-3 text-sky-600 dark:text-sky-400" />
          Exige Ajuste
        </span>
      );
    case 'draft':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs text-[11px] font-bold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
          <FileText className="w-3 h-3 text-slate-500" />
          Rascunho
        </span>
      );
  }
};
