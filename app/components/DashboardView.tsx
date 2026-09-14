'use client';

import React from 'react';
import { useAppState } from '../context/AppStateContext';
import { CATEGORY_RULES } from '../data/mockData';
import { CategoryId } from '../types';
import { StatusBadge, CategoryBadge } from './Badges';
import {
  Award,
  CheckCircle2,
  Clock,
  FileCheck2,
  AlertTriangle,
  TrendingUp,
  PlusCircle,
  Share2,
  BookOpen,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface DashboardProps {
  onOpenAddModal: () => void;
  onNavigateToReports: () => void;
  onNavigateToCertificates: () => void;
}

export const DashboardView: React.FC<DashboardProps> = ({
  onOpenAddModal,
  onNavigateToReports,
  onNavigateToCertificates,
}) => {
  const { profile, certificates } = useAppState();

  // Calculations
  const approvedCertificates = certificates.filter((c) => c.status === 'approved');
  const pendingCertificates = certificates.filter((c) => c.status === 'submitted');
  const draftCertificates = certificates.filter((c) => c.status === 'draft');

  const approvedHours = approvedCertificates.reduce(
    (acc, c) => acc + (c.hoursApproved ?? c.hoursRequested),
    0
  );

  const pendingHours = pendingCertificates.reduce((acc, c) => acc + c.hoursRequested, 0);

  const totalRequired = profile.totalHoursRequired;
  const progressPercent = Math.min(100, Math.round((approvedHours / totalRequired) * 100));
  const remainingHours = Math.max(0, totalRequired - approvedHours);

  // Category breakdown
  const categoryStats = (Object.keys(CATEGORY_RULES) as CategoryId[]).map((catId) => {
    const rule = CATEGORY_RULES[catId];
    const catApprovedCerts = approvedCertificates.filter((c) => c.categoryId === catId);
    const catPendingCerts = pendingCertificates.filter((c) => c.categoryId === catId);

    const catApprovedHours = catApprovedCerts.reduce(
      (acc, c) => acc + (c.hoursApproved ?? c.hoursRequested),
      0
    );
    const catPendingHours = catPendingCerts.reduce((acc, c) => acc + c.hoursRequested, 0);

    const isMinMet = catApprovedHours >= rule.minHours;
    const isMaxExceeded = catApprovedHours > rule.maxHours;

    return {
      rule,
      approvedHours: catApprovedHours,
      pendingHours: catPendingHours,
      isMinMet,
      isMaxExceeded,
    };
  });

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Welcome & Student Hero Header */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-emerald-200 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" /> {profile.campus} • RA: {profile.ra}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Olá, {profile.name}! 👋
            </h2>
            <p className="text-emerald-100/80 text-sm max-w-2xl">
              Acompanhe seu progresso de Horas Complementares em tempo real. Mantenha seus certificados organizados e prontos para homologação acadêmica.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 focus:ring-2 focus:ring-white"
            >
              <PlusCircle className="w-4 h-4" /> Registrar Certificado
            </button>
            <button
              onClick={onNavigateToReports}
              className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-600 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 focus:ring-2 focus:ring-emerald-400"
            >
              <Share2 className="w-4 h-4" /> Gerar Relatório
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        {/* Total Progress Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Progresso Total Geral
              </span>
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                {approvedHours}h
              </span>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                / {totalRequired}h obrigatórias
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>{progressPercent}% Concluído</span>
              <span>Faltam {remainingHours}h</span>
            </div>
            <div
              className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700"
              role="progressbar"
              aria-valuenow={approvedHours}
              aria-valuemin={0}
              aria-valuemax={totalRequired}
              aria-label="Progresso de horas complementares"
            >
              <div
                className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Approved Hours Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Horas Homologadas
            </span>
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-emerald-700 dark:text-emerald-400">
              {approvedHours}h
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {approvedCertificates.length} certificados aceitos pela secretaria
            </p>
          </div>
        </div>

        {/* Pending Analysis Hours Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Em Análise / Enviadas
            </span>
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              {pendingHours}h
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {pendingCertificates.length} solicitações sob análise docente
            </p>
          </div>
        </div>

        {/* Drafts Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Rascunhos / Organizar
            </span>
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <FileCheck2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-800 dark:text-slate-200">
              {draftCertificates.length}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Certificados registrados prontos para incluir no relatório
            </p>
          </div>
        </div>

      </div>

      {/* Category Rules & Progress Breakdown */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Distribuição por Categoria (Critérios UFSCar BCC)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cada grupo possui limites mínimos e máximos de aproveitamento.
            </p>
          </div>
          <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-md font-medium">
            Regra Padrão: Mín. 10h~30h por categoria
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categoryStats.map(({ rule, approvedHours, pendingHours, isMinMet, isMaxExceeded }) => {
            const catPercent = Math.min(100, Math.round((approvedHours / rule.maxHours) * 100));

            return (
              <div
                key={rule.id}
                className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                      {rule.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                      {rule.description}
                    </p>
                  </div>
                  <CategoryBadge categoryId={rule.id} />
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>
                      {approvedHours}h <span className="font-normal text-slate-500">Aprovadas</span>
                      {pendingHours > 0 && (
                        <span className="text-amber-600 dark:text-amber-400 text-[11px] ml-1">
                          (+{pendingHours}h pendentes)
                        </span>
                      )}
                    </span>
                    <span>
                      Limite MÁX: {rule.maxHours}h (MÍN: {rule.minHours}h)
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${catPercent}%` }}
                    />
                  </div>
                </div>

                {/* Validation Status Badges */}
                <div className="flex items-center gap-2 text-xs pt-1">
                  {isMinMet ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mínimo exigido atingido
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5" /> Faltam {rule.minHours - approvedHours}h para o mínimo
                    </span>
                  )}

                  {isMaxExceeded && (
                    <span className="inline-flex items-center gap-1 text-purple-700 dark:text-purple-400 font-medium ml-auto">
                      <Sparkles className="w-3.5 h-3.5" /> Limite máximo atingido
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Certificates Table Preview */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Últimos Certificados Cadastrados
          </h3>
          <button
            onClick={onNavigateToCertificates}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1 focus:ring-2 focus:ring-emerald-500"
          >
            Ver Todos ({certificates.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Atividade / Certificado</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Carga Horária</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {certificates.slice(0, 4).map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">
                      {cert.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {cert.issuer} • Emissão: {cert.issueDate}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <CategoryBadge categoryId={cert.categoryId} />
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                    {cert.hoursRequested}h
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={cert.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
