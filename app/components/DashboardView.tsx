'use client';

import React from 'react';
import { useAppState } from '../context/AppStateContext';
import { UFSCAR_COURSES } from '../data/mockData';
import { RulesEngine } from '../lib/rulesEngine';
import { CategoryBadge, StatusBadge } from './Badges';
import {
  Award,
  CheckCircle2,
  Clock,
  AlertTriangle,
  PlusCircle,
  Share2,
  ArrowRight,
  Sliders,
  Check,
  AlertCircle,
  FileCheck2
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
  const { profile, certificates, changeCourse } = useAppState();

  const stats = RulesEngine.calculateProgress(certificates, profile);

  return (
    <div className="space-y-5">

      {/* Institutional Student Header Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-md p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              {profile.campus} • RA: {profile.ra}
            </span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Ingresso: {profile.entryYear || '2022'}
            </span>
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Painel do Estudante — {profile.name}
          </h2>

          <div className="flex items-center gap-2 text-xs pt-0.5">
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Matriz Curricular:</span>
            <select
              value={UFSCAR_COURSES.find((c) => c.name === profile.course)?.id || 'bcc'}
              onChange={(e) => changeCourse(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-sm text-slate-900 dark:text-slate-100 font-semibold px-2 py-0.5 text-xs focus:ring-1 focus:ring-slate-500"
              aria-label="Selecionar curso"
            >
              {UFSCAR_COURSES.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.totalHours}h exigidas)
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAddModal}
            className="px-3 py-1.5 bg-[#8b0000] hover:bg-[#700000] text-white font-semibold rounded-sm text-xs border border-red-900 flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5 text-amber-300" /> Cadastrar Certificado
          </button>
          <button
            onClick={onNavigateToReports}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-sm text-xs font-semibold flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" /> Emissão de Relatório
          </button>
        </div>
      </div>

      {/* Compliance Alerts Panel */}
      {stats.alerts.length > 0 && (
        <div className="space-y-2">
          {stats.alerts.map((alert, idx) => {
            const isSuccess = alert.type === 'success';
            const isWarning = alert.type === 'warning';
            const bg = isSuccess
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : isWarning
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200';

            const Icon = isSuccess ? CheckCircle2 : isWarning ? AlertTriangle : AlertCircle;

            return (
              <div
                key={idx}
                className={`p-2.5 rounded-sm border text-xs font-medium flex items-center gap-2 ${bg}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{alert.message}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Main KPI Data Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

        {/* Total Progress */}
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-md p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            <span>Aproveitamento Efetivo</span>
            <span className="font-mono text-slate-700 dark:text-slate-300">{stats.progressPercent}%</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {stats.effectiveApprovedHours}h
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Exigido: {stats.totalRequired}h</span>
          </div>
          <div
            className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-xs overflow-hidden border border-slate-200 dark:border-slate-700"
            role="progressbar"
            aria-valuenow={stats.effectiveApprovedHours}
            aria-valuemin={0}
            aria-valuemax={stats.totalRequired}
          >
            <div
              className="h-full bg-[#8b0000] dark:bg-red-600 transition-all"
              style={{ width: `${stats.progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Faltam <strong className="text-slate-700 dark:text-slate-300">{stats.remainingTotalHours}h</strong> para a colação de grau.
          </p>
        </div>

        {/* Total Homologated Hours */}
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-md p-3.5 space-y-1">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Horas Homologadas (Bruto)
          </div>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
            {stats.approvedHours}h
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {certificates.filter((c) => c.status === 'approved').length} atividade(s) deferidas.
          </p>
        </div>

        {/* Pending Hours */}
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-md p-3.5 space-y-1">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Em Análise Docente
          </div>
          <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">
            {stats.pendingHours}h
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {certificates.filter((c) => c.status === 'submitted').length} solicitação(ões) em análise.
          </p>
        </div>

        {/* Drafts & Actionable */}
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-md p-3.5 space-y-1">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Rascunhos / Pendentes
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
            {certificates.filter((c) => c.status === 'draft' || c.status === 'needs_info').length}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Prontos para edição ou submissão.
          </p>
        </div>

      </div>

      {/* Category Rules & Progress Breakdown */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-md p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wide">
            <Award className="w-4 h-4 text-[#8b0000] dark:text-red-400" />
            Quadro de Cumprimento por Modalidade (Norma UFSCar)
          </h3>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            {profile.course}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2 px-3">Modalidade / Categoria</th>
                <th className="py-2 px-3">Horas Aprovadas</th>
                <th className="py-2 px-3">Aproveitamento Efetivo</th>
                <th className="py-2 px-3">Limites (Piso / Teto)</th>
                <th className="py-2 px-3">Progresso Modalidade</th>
                <th className="py-2 px-3">Status da Categoria</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {stats.categoryProgressList.map((cp) => {
                const catPercent = Math.min(100, Math.round((cp.approvedHours / cp.rule.maxHours) * 100));

                return (
                  <tr key={cp.rule.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {cp.rule.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {cp.rule.description}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-slate-100">
                      {cp.approvedHours}h
                      {cp.pendingHours > 0 && (
                        <span className="text-amber-600 dark:text-amber-400 text-[10px] block font-mono">
                          (+{cp.pendingHours}h em análise)
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#8b0000] dark:text-red-400">
                      {cp.effectiveApprovedHours}h
                      {cp.hoursCapped > 0 && (
                        <span className="text-slate-400 text-[10px] block font-normal">
                          ({cp.hoursCapped}h acima do teto)
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 font-mono">
                      Mín: {cp.rule.minHours}h | Máx: {cp.rule.maxHours}h
                    </td>
                    <td className="py-2.5 px-3 min-w-[130px]">
                      <div className="flex justify-between text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        <span>{catPercent}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-xs overflow-hidden">
                        <div
                          className="h-full bg-[#8b0000] dark:bg-red-500 transition-all"
                          style={{ width: `${catPercent}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      {cp.minHoursMet ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3 h-3" /> Mínimo Atingido
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-semibold text-[11px]">
                          <AlertTriangle className="w-3 h-3" /> Faltam {cp.remainingForMin}h
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Certificates Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-md p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
            Registros Acadêmicos Recentes
          </h3>
          <button
            onClick={onNavigateToCertificates}
            className="text-xs font-semibold text-[#8b0000] hover:underline dark:text-red-400 flex items-center gap-1"
          >
            Ver Quadro Completo ({certificates.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-2 px-3">Descrição da Atividade</th>
                <th className="py-2 px-3">Modalidade</th>
                <th className="py-2 px-3 text-right">Horas</th>
                <th className="py-2 px-3">Código de Autenticação</th>
                <th className="py-2 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {certificates.slice(0, 5).map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                  <td className="py-2 px-3">
                    <div className="font-bold text-slate-900 dark:text-slate-100">
                      {cert.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      Emissor: {cert.issuer} | Data: {cert.issueDate}
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <CategoryBadge categoryId={cert.categoryId} />
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-[#8b0000] dark:text-red-400">
                    {cert.hoursRequested}h
                  </td>
                  <td className="py-2 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                    {cert.verificationCode || 'UFSCAR-PENDENTE'}
                  </td>
                  <td className="py-2 px-3 text-center">
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
