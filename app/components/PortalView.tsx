'use client';

import React, { useState } from 'react';
import { useAppState } from '../context/AppStateContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { StatusBadge, CategoryBadge } from './Badges';
import {
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
  ExternalLink,
  Server,
  ShieldCheck,
  GraduationCap,
  UserCheck,
  Sparkles,
  Info
} from 'lucide-react';

export const PortalView: React.FC = () => {
  const { profile, certificates, batches, reviewCertificate, activeRole, setActiveRole } = useAppState();
  const { announce } = useAccessibility();

  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(batches[0]?.id || null);
  const [feedbackText, setFeedbackText] = useState<{ [key: string]: string }>({});

  const handleReview = (certId: string, status: 'approved' | 'rejected', hours?: number) => {
    const note = feedbackText[certId] || (status === 'approved' ? 'Aprovado em conformidade com as normas do BCC UFSCar.' : 'Documentação insuficiente ou fora das normas.');
    reviewCertificate(certId, status, note, hours);
    announce(`Certificado analisado e marcado como ${status === 'approved' ? 'Aprovado' : 'Indeferido'}.`);
  };

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Role Banner Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-sky-400" />
            <h2 className="text-lg font-bold">
              Painel de Avaliação da Secretaria / Docente Responsável
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-xl">
            Visão independente e isolada para o professor responsável ou secretaria validar, pontuar e deferir os certificados enviados pelos discentes.
          </p>
        </div>

        {activeRole === 'student' ? (
          <button
            onClick={() => {
              setActiveRole('professor');
              announce('Visão alternada para Professor/Secretaria.');
            }}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
          >
            <UserCheck className="w-4 h-4" /> Simular Ações de Docente/Secretaria
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-sky-950 border border-sky-800 px-3 py-1.5 rounded-xl text-xs text-sky-300 font-bold">
            <UserCheck className="w-4 h-4 text-sky-400" /> Modo Avaliador Ativo
          </div>
        )}
      </div>

      {/* Submitted Batches Section */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">

        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-emerald-600" />
              Solicitação em Análise: {profile.name} (RA: {profile.ra})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Curso: {profile.course} • Campus Sorocaba
            </p>
          </div>

          <span className="text-xs bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-full font-bold border border-amber-300 dark:border-amber-800">
            {certificates.filter((c) => c.status === 'submitted').length} certificados aguardando homologação
          </span>
        </div>

        {/* Certificates Review Cards */}
        <div className="space-y-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className={`border rounded-xl p-5 transition-colors space-y-4 ${
                cert.status === 'approved'
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                  : cert.status === 'rejected'
                  ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CategoryBadge categoryId={cert.categoryId} />
                    <StatusBadge status={cert.status} />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base mt-1">
                    {cert.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Emissor: {cert.issuer} • Data Emissão: {cert.issueDate} • Carga Solicitada: <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{cert.hoursRequested}h</span>
                  </p>
                </div>

                {/* Review Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReview(cert.id, 'approved')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-xs transition-colors focus:ring-2 focus:ring-emerald-500"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Deferir ({cert.hoursRequested}h)
                  </button>
                  <button
                    onClick={() => handleReview(cert.id, 'rejected')}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-xs transition-colors focus:ring-2 focus:ring-rose-500"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Indeferir
                  </button>
                </div>
              </div>

              {/* Feedback Input */}
              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={feedbackText[cert.id] ?? cert.feedback ?? ''}
                    onChange={(e) =>
                      setFeedbackText({ ...feedbackText, [cert.id]: e.target.value })
                    }
                    placeholder="Adicionar parecer / justificativa para o aluno..."
                    className="w-full text-xs px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Future UFSCar API Integration Specification Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-200 space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <Server className="w-5 h-5" />
          <span>Arquitetura Pronta para Futura Integração Oficial (SIGA / UFSCar)</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          O protótipo opera de forma 100% autônoma e descentralizada para o aluno hoje. No entanto, o modelo de dados em JSON foi construído prevendo exportação via API REST Webhooks ou GraphQL para o sistema SIGA da UFSCar, permitindo o lançamento direto no histórico escolar sem digitação manual pela secretaria.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-emerald-400 font-mono font-bold block">1. Formato Aberto</span>
            <span className="text-slate-400">Exportação em JSON schema padronizado WCAG/UFSCar.</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-sky-400 font-mono font-bold block">2. Chave de Homologação</span>
            <span className="text-slate-400">Assinatura hash única para combate a fraudes em comprovantes.</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="text-purple-400 font-mono font-bold block">3. Independência Total</span>
            <span className="text-slate-400">Funciona offline / local storage mesmo sem servidores ativas.</span>
          </div>
        </div>
      </div>

    </div>
  );
};
