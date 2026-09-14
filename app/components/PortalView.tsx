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
    <div className="space-y-8 animate-fade-in text-slate-900 dark:text-slate-100">

      {/* Role Switcher Banner */}
      <div className="bg-gradient-to-r from-[#7a1218] to-slate-900 border border-red-800/80 rounded-2xl p-6 text-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-300" />
            <h2 className="text-lg font-extrabold">
              Painel de Validação da Secretaria e Comissão Docente
            </h2>
          </div>
          <p className="text-xs text-red-100 max-w-xl font-medium">
            Interface para o professor responsável ou secretaria validar comprovantes, atribuir pareceres e aprovar cargas horárias.
          </p>
        </div>

        {activeRole === 'student' ? (
          <button
            onClick={() => {
              setActiveRole('professor');
              announce('Visão alternada para Secretaria/Docente.');
            }}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95 shadow-md"
          >
            <UserCheck className="w-4 h-4" /> Activar Visão do Avaliador
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-red-950 border border-red-700 px-3.5 py-2 rounded-xl text-xs text-amber-300 font-extrabold">
            <UserCheck className="w-4 h-4 text-amber-300" /> Modo Avaliador Docente Ativo
          </div>
        )}
      </div>

      {/* Review List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">

        <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#9e1b22] dark:text-red-400" />
              Solicitante: {profile.name} (RA: {profile.ra})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">
              {profile.course} • Campus Sorocaba
            </p>
          </div>

          <span className="text-xs bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 px-3 py-1 rounded-full font-extrabold border border-amber-300 dark:border-amber-800">
            {certificates.filter((c) => c.status === 'submitted').length} certificados pendentes de homologação
          </span>
        </div>

        <div className="space-y-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className={`border rounded-2xl p-5 transition-colors space-y-4 ${
                cert.status === 'approved'
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800'
                  : cert.status === 'rejected'
                  ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CategoryBadge categoryId={cert.categoryId} />
                    <StatusBadge status={cert.status} />
                    <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                      Hash: {cert.verificationCode || 'UFSCAR-HASH'}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 dark:text-slate-100 text-base mt-1">
                    {cert.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Emissor: {cert.issuer} • Emissão: {cert.issueDate} • Carga: <span className="font-extrabold text-[#9e1b22] dark:text-red-400">{cert.hoursRequested}h</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReview(cert.id, 'approved')}
                    className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 shadow-xs transition-colors focus:ring-2 focus:ring-amber-400"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Deferir ({cert.hoursRequested}h)
                  </button>
                  <button
                    onClick={() => handleReview(cert.id, 'rejected')}
                    className="px-3.5 py-2 bg-rose-700 hover:bg-rose-800 text-white font-extrabold text-xs rounded-xl flex items-center gap-1 shadow-xs transition-colors focus:ring-2 focus:ring-rose-500"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Indeferir
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={feedbackText[cert.id] ?? cert.feedback ?? ''}
                    onChange={(e) =>
                      setFeedbackText({ ...feedbackText, [cert.id]: e.target.value })
                    }
                    placeholder="Escreva um parecer ou justificativa para o discente..."
                    className="w-full text-xs px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-[#9e1b22]"
                  />
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* SIGA / Integration Architecture Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-200 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-amber-300 font-extrabold text-sm">
          <Server className="w-5 h-5 text-amber-400" />
          <span>Especificação de Integração Webhook com SIGA / Sistemas UFSCar</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          O protótipo funciona de forma autônoma e descentralizada para o aluno hoje. Seu modelo de dados em JSON inclui chaves de validação criptográfica (hash) preparadas para exportação automática e homologação direta no histórico escolar sem digitação manual.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-amber-300 font-mono font-bold block">1. Formato JSON Schema</span>
            <span className="text-slate-400">Padrão WCAG e compatível com APIs da UFSCar.</span>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-red-400 font-mono font-bold block">2. Hash de Autenticação</span>
            <span className="text-slate-400">Assinatura única para combate a fraudes em certificados.</span>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-amber-400 font-mono font-bold block">3. Funcionamento Offline</span>
            <span className="text-slate-400">Sincroniza automaticamente via LocalStorage.</span>
          </div>
        </div>
      </div>

    </div>
  );
};
