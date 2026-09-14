'use client';

import React from 'react';
import { CertificateStatus, CategoryId } from '../types';
import { CATEGORY_RULES } from '../data/mockData';
import { CheckCircle2, Clock, XCircle, HelpCircle, FileText } from 'lucide-react';

export const CategoryBadge: React.FC<{ categoryId: CategoryId; showIcon?: boolean }> = ({ categoryId, showIcon = true }) => {
  const category = CATEGORY_RULES[categoryId] || {
    name: categoryId,
    badgeBg: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border-slate-300',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${category.badgeBg}`}
    >
      {category.name}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: CertificateStatus }> = ({ status }) => {
  switch (status) {
    case 'approved':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          Aprovado
        </span>
      );
    case 'submitted':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
          <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-spin-slow" />
          Em Análise
        </span>
      );
    case 'rejected':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
          <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          Indeferido
        </span>
      );
    case 'needs_info':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 dark:bg-sky-950/80 dark:text-sky-300 border border-sky-300 dark:border-sky-800">
          <HelpCircle className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          Pendente Correção
        </span>
      );
    case 'draft':
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
          <FileText className="w-3.5 h-3.5 text-slate-500" />
          Rascunho
        </span>
      );
  }
};
