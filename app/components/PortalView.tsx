'use client';

import React, { useState } from 'react';
import { useAppState } from '../context/AppStateContext';
import { StatusBadge, CategoryBadge } from './Badges';
import { ActivityDetailsModal } from './ActivityDetailsModal';
import { Certificate } from '../types';
import {
  Building2,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Server,
  GraduationCap,
  UserCheck,
  HelpCircle,
  Eye,
  Sliders
} from 'lucide-react';

export const PortalView: React.FC = () => {
  const { profile, certificates, reviewCertificate, activeRole, setActiveRole, addToast } = useAppState();

  const [feedbackText, setFeedbackText] = useState<{ [key: string]: string }>({});
  const [approvedHoursOverride, setApprovedHoursOverride] = useState<{ [key: string]: number }>({});
  const [selectedCertForDetails, setSelectedCertForDetails] = useState<Certificate | null>(null);

  const handleReviewAction = (
    certId: string,
    status: 'approved' | 'rejected' | 'needs_info',
    defaultHours: number
  ) => {
    const customHours = approvedHoursOverride[certId] !== undefined
      ? approvedHoursOverride[certId]
      : defaultHours;

    const note = feedbackText[certId] || (
      status === 'approved'
        ? `Aprovado com ${customHours}h deferidas em conformidade com as normas da UFSCar.`
        : (status === 'needs_info' ? 'Solicitado ajuste no documento ou comprovante complementar.' : 'Documentação insuficiente para o deferimento de horas.')
    );

    reviewCertificate(certId, status, note, status === 'approved' ? customHours : 0);
  };

  return (
    <div className="space-y-5 text-slate-900 dark:text-slate-100">

      {/* Role Switcher Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-md p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#8b0000] dark:text-red-400" />
            <h2 className="text-sm font-bold uppercase tracking-wide">
              Módulo da Secretaria & Comissão de Homologação Docente
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Interface para auditoria de comprovantes, ajuste de horas deferidas e homologação acadêmica.
          </p>
        </div>

        {activeRole === 'student' ? (
          <button
            onClick={() => {
              setActiveRole('professor');
            }}
            className="px-3 py-1.5 bg-[#8b0000] hover:bg-[#700000] text-white font-semibold rounded-sm text-xs flex items-center gap-1.5 border border-red-900"
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-300" /> Alternar para Modo Avaliador
          </button>
        ) : (
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-1 rounded-sm text-xs text-slate-800 dark:text-slate-200 font-bold">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Modo Avaliador Ativo
          </div>
        )}
      </div>

      {/* Review List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-md p-4 space-y-4">

        <div className="border-b border-slate-200 dark:border-slate-800 pb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-[#8b0000] dark:text-red-400" />
              Solicitante: {profile.name} (RA: {profile.ra})
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {profile.course} | Campus Sorocaba
            </p>
          </div>

          <span className="text-[11px] bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-xs font-bold border border-amber-300 dark:border-amber-800">
            {certificates.filter((c) => c.status === 'submitted').length} atividade(s) pendentes de análise
          </span>
        </div>

        <div className="space-y-3">
          {certificates.map((cert) => {
            const currentHours = approvedHoursOverride[cert.id] !== undefined
              ? approvedHoursOverride[cert.id]
              : (cert.hoursApproved ?? cert.hoursRequested);

            return (
              <div
                key={cert.id}
                className="border border-slate-200 dark:border-slate-800 rounded-md p-3 space-y-2.5 bg-slate-50/50 dark:bg-slate-800/40"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CategoryBadge categoryId={cert.categoryId} />
                      <StatusBadge status={cert.status} />
                      <span className="text-[10px] font-mono text-slate-500">
                        Hash: {cert.verificationCode || 'UFSCAR-HASH'}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs mt-1">
                      {cert.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Emissor: {cert.issuer} | Data: {cert.issueDate} | Solicitado: <span className="font-mono font-bold text-[#8b0000] dark:text-red-400">{cert.hoursRequested}h</span>
                    </p>
                  </div>

                  {/* Review Actions */}
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    {/* Hours Override Control */}
                    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-sm px-1.5 py-0.5 text-[11px]">
                      <Sliders className="w-3 h-3 text-slate-400" />
                      <span className="text-[10px] font-semibold text-slate-500">Horas:</span>
                      <input
                        type="number"
                        min="1"
                        max={cert.hoursRequested}
                        value={currentHours}
                        onChange={(e) => setApprovedHoursOverride({ ...approvedHoursOverride, [cert.id]: Number(e.target.value) })}
                        className="w-12 text-center font-mono font-bold text-slate-900 dark:text-slate-100 bg-transparent focus:outline-hidden"
                      />
                    </div>

                    <button
                      onClick={() => handleReviewAction(cert.id, 'approved', cert.hoursRequested)}
                      className="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-sm flex items-center gap-1"
                      title="Deferir atividade"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Deferir
                    </button>

                    <button
                      onClick={() => handleReviewAction(cert.id, 'needs_info', cert.hoursRequested)}
                      className="px-2 py-1 bg-sky-700 hover:bg-sky-800 text-white font-semibold text-xs rounded-sm flex items-center gap-1"
                      title="Solicitar Ajuste"
                    >
                      <HelpCircle className="w-3.5 h-3.5" /> Ajuste
                    </button>

                    <button
                      onClick={() => handleReviewAction(cert.id, 'rejected', cert.hoursRequested)}
                      className="px-2 py-1 bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs rounded-sm flex items-center gap-1"
                      title="Indeferir atividade"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Indeferir
                    </button>

                    <button
                      onClick={() => setSelectedCertForDetails(cert)}
                      className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                      title="Ver Histórico & Detalhes"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={feedbackText[cert.id] ?? cert.feedback ?? ''}
                      onChange={(e) =>
                        setFeedbackText({ ...feedbackText, [cert.id]: e.target.value })
                      }
                      placeholder="Inserir parecer descritivo do docente ou justificativa de indeferimento..."
                      className="w-full text-xs px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-sm text-slate-900 dark:text-slate-100 font-medium focus:ring-1 focus:ring-slate-500"
                    />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Details Modal */}
      <ActivityDetailsModal
        isOpen={!!selectedCertForDetails}
        onClose={() => setSelectedCertForDetails(null)}
        certificate={selectedCertForDetails}
      />

      {/* SIGA / Integration Specification Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-md p-4 text-slate-200 space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wide">
          <Server className="w-4 h-4 text-amber-400" />
          <span>Diretrizes de Integração Webhook / SIGA UFSCar (Schema v1)</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          A plataforma opera de forma autônoma e descentralizada para o discente. Seus registros possuem contrato em JSON (`SIGA_COMPLEMENTARY_HOURS_SCHEMA_v1`) com suporte a exportação direta e assinatura por hash de validação.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="bg-slate-950 p-2.5 rounded-sm border border-slate-800 space-y-0.5">
            <span className="text-amber-300 font-mono font-bold block">1. Contrato JSON Standard</span>
            <span className="text-slate-400 text-[11px]">Esquema unificado por cursos e horas.</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-sm border border-slate-800 space-y-0.5">
            <span className="text-red-400 font-mono font-bold block">2. Assinatura Digital</span>
            <span className="text-slate-400 text-[11px]">Hash para verificação anti-fraude.</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-sm border border-slate-800 space-y-0.5">
            <span className="text-amber-400 font-mono font-bold block">3. Validação Autônoma</span>
            <span className="text-slate-400 text-[11px]">Permite auditoria acadêmica sem dependência de API.</span>
          </div>
        </div>
      </div>

    </div>
  );
};
