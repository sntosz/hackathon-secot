'use client';

import React, { useState } from 'react';
import { useAppState } from '../context/AppStateContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { StatusBadge, CategoryBadge } from './Badges';
import {
  Building2,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Server,
  GraduationCap,
  UserCheck,
  QrCode
} from 'lucide-react';

export const PortalView: React.FC = () => {
  const { profile, certificates, reviewCertificate, activeRole, setActiveRole } = useAppState();
  const { announce } = useAccessibility();

  const [feedbackText, setFeedbackText] = useState<{ [key: string]: string }>({});

  const handleReview = (certId: string, status: 'approved' | 'rejected', hours?: number) => {
    const note = feedbackText[certId] || (status === 'approved' ? 'Aprovado e homologado em conformidade com as normas UFSCar.' : 'Documentação insuficiente para deferimento.');
    reviewCertificate(certId, status, note, hours);
    announce(`Certificado analisado e marcado como ${status === 'approved' ? 'Aprovado' : 'Indeferido'}.`);
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
            Interface para auditoria de comprovantes e deferimento oficial de horas complementares.
          </p>
        </div>

        {activeRole === 'student' ? (
          <button
            onClick={() => {
              setActiveRole('professor');
              announce('Visão alternada para Secretaria/Docente.');
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
            {certificates.filter((c) => c.status === 'submitted').length} atividade(s) em análise
          </span>
        </div>

        <div className="space-y-3">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="border border-slate-200 dark:border-slate-800 rounded-md p-3 space-y-2 bg-slate-50/50 dark:bg-slate-800/40"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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
                    Emissor: {cert.issuer} | Data: {cert.issueDate} | Requerido: <span className="font-mono font-bold text-[#8b0000] dark:text-red-400">{cert.hoursRequested}h</span>
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleReview(cert.id, 'approved')}
                    className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-sm flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Deferir ({cert.hoursRequested}h)
                  </button>
                  <button
                    onClick={() => handleReview(cert.id, 'rejected')}
                    className="px-2.5 py-1 bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs rounded-sm flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Indeferir
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
                    placeholder="Parecer do docente / justificativa de deferimento..."
                    className="w-full text-xs px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-sm text-slate-900 dark:text-slate-100 font-medium focus:ring-1 focus:ring-slate-500"
                  />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* SIGA / Integration Specification Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-md p-4 text-slate-200 space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wide">
          <Server className="w-4 h-4 text-amber-400" />
          <span>Diretrizes de Integração Webhook / SIGA UFSCar</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          A plataforma foi projetada para operar de forma autônoma pelo estudante. Seus dados contêm identificadores e hashes de integridade prontos para importação direta no sistema de gestão acadêmica (SIGA).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="bg-slate-950 p-2.5 rounded-sm border border-slate-800 space-y-0.5">
            <span className="text-amber-300 font-mono font-bold block">1. Exportação JSON Standard</span>
            <span className="text-slate-400 text-[11px]">Esquema estruturado por categorias e horas.</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-sm border border-slate-800 space-y-0.5">
            <span className="text-red-400 font-mono font-bold block">2. Assinatura Digital</span>
            <span className="text-slate-400 text-[11px]">Hash criptográfico para integridade do documento.</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-sm border border-slate-800 space-y-0.5">
            <span className="text-amber-400 font-mono font-bold block">3. Validação Autônoma</span>
            <span className="text-slate-400 text-[11px]">Permite auditoria offline sem dependência de API.</span>
          </div>
        </div>
      </div>

    </div>
  );
};
