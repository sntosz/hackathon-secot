'use client';

import React, { useState } from 'react';
import { Modal } from './Modal';
import { Certificate } from '../types';
import { CategoryBadge, StatusBadge } from './Badges';
import { QrCode, Copy, Check, History, MessageSquare, ShieldCheck, Calendar, Building, Clock } from 'lucide-react';

interface ActivityDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: Certificate | null;
}

export const ActivityDetailsModal: React.FC<ActivityDetailsModalProps> = ({
  isOpen,
  onClose,
  certificate,
}) => {
  const [copiedHash, setCopiedHash] = useState(false);

  if (!certificate) return null;

  const copyHash = () => {
    if (certificate.verificationCode) {
      navigator.clipboard.writeText(certificate.verificationCode);
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 3000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ficha Analítica & Histórico do Registro"
      ariaDescription="Detalhes completos da atividade com histórico de edições e parecer docente."
      maxWidth="lg"
    >
      <div className="space-y-4 text-xs text-slate-800 dark:text-slate-200">

        {/* Header Title */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <CategoryBadge categoryId={certificate.categoryId} />
            <StatusBadge status={certificate.status} />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm pt-1">
            {certificate.title}
          </h3>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-800 p-3 rounded-md border border-slate-200 dark:border-slate-700">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <Building className="w-3 h-3 text-slate-400" /> Emissor
            </span>
            <span className="font-semibold text-slate-900 dark:text-slate-100 block mt-0.5">
              {certificate.issuer}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" /> Carga Horária
            </span>
            <span className="font-mono font-bold text-[#8b0000] dark:text-red-400 block mt-0.5">
              Solicitado: {certificate.hoursRequested}h
              {certificate.hoursApproved !== undefined && (
                <span className="text-emerald-700 dark:text-emerald-400 block text-[11px]">
                  Deferido: {certificate.hoursApproved}h
                </span>
              )}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" /> Emissão
            </span>
            <span className="font-mono text-slate-700 dark:text-slate-300 block mt-0.5">
              {certificate.issueDate}
            </span>
          </div>
        </div>

        {/* Teacher Feedback / Parecer */}
        {certificate.feedback && (
          <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-md border border-red-200 dark:border-red-900 space-y-1">
            <span className="text-[10px] font-bold text-red-900 dark:text-red-200 uppercase flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-[#8b0000] dark:text-red-400" /> Parecer Docente / Despacho
            </span>
            <p className="text-xs text-slate-800 dark:text-slate-200 font-mono">
              {certificate.feedback}
            </p>
          </div>
        )}

        {/* Digital Verification Code & Hash */}
        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md border border-slate-300 dark:border-slate-700 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8b0000] dark:text-red-400" /> Hash de Autenticação Digital SIGA
            </span>
            <code className="text-xs font-mono font-bold text-[#8b0000] dark:text-red-300 block">
              {certificate.verificationCode || 'UFSCAR-2024-HASH'}
            </code>
          </div>
          <button
            onClick={copyHash}
            className="px-2.5 py-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-[11px] font-semibold flex items-center gap-1 border border-slate-300 dark:border-slate-600"
          >
            {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedHash ? 'Copiado!' : 'Copiar Hash'}</span>
          </button>
        </div>

        {/* Activity Edit History & Audit Timeline */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide flex items-center gap-1.5">
            <History className="w-3.5 h-3.5 text-[#8b0000] dark:text-red-400" />
            Histórico da Atividade & Transições de Status
          </span>

          <div className="space-y-2 border-l-2 border-slate-200 dark:border-slate-700 pl-3">
            {certificate.history && certificate.history.length > 0 ? (
              certificate.history.map((item, idx) => (
                <div key={idx} className="space-y-0.5 relative">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {item.action} ({item.role === 'student' ? 'Aluno' : item.role === 'professor' ? 'Docente' : 'Sistema'})
                    </span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {new Date(item.timestamp).toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono">
                    {item.details}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-[11px] text-slate-500 font-mono">
                Registrado em {new Date(certificate.createdAt).toLocaleString('pt-BR')}.
              </div>
            )}
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-semibold py-1.5 rounded-sm text-xs"
          >
            Fechar Ficha
          </button>
        </div>

      </div>
    </Modal>
  );
};
