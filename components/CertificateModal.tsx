"use client";

import React from 'react';
import { useHours } from '../context/HoursContext';
import { X, ShieldCheck, Download, Calendar, Clock, Building, Hash, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

export default function CertificateModal() {
  const { selectedCertificateForModal, setSelectedCertificateForModal, addToast, activeRole } = useHours();

  if (!selectedCertificateForModal || activeRole !== 'student') return null;

  const cert = selectedCertificateForModal;

  const handleDownload = () => {
    addToast(`Download do documento "${cert.fileName || 'comprovante.pdf'}" iniciado.`, 'info');
  };

  const getStatusBadge = () => {
    switch (cert.status) {
      case 'APROVADO':
        return <span className="bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 font-semibold px-2.5 py-1 rounded-md text-xs inline-flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> APROVADO</span>;
      case 'PENDENTE':
        return <span className="bg-amber-950/70 border border-amber-500/40 text-amber-400 font-semibold px-2.5 py-1 rounded-md text-xs inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> PENDENTE</span>;
      case 'INDEFERIDO':
        return <span className="bg-rose-950/70 border border-rose-500/40 text-rose-400 font-semibold px-2.5 py-1 rounded-md text-xs inline-flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> INDEFERIDO</span>;
      default:
        return <span className="bg-zinc-800 border border-zinc-700 text-zinc-300 font-medium px-2.5 py-1 rounded-md text-xs">RASCUNHO</span>;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-details-title"
    >
      <div className="bg-[#12141a] border border-zinc-700/80 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative">
        <button
          onClick={() => setSelectedCertificateForModal(null)}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          aria-label="Fechar detalhes"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start justify-between pr-8 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-zinc-800/80 text-zinc-300 border border-zinc-700 text-[11px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider">
                {cert.category}
              </span>
              {getStatusBadge()}
            </div>
            <h2 id="cert-details-title" className="text-lg font-bold text-white leading-snug">
              {cert.title}
            </h2>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#171922] p-4 rounded-xl border border-zinc-800 mb-5 text-xs">
          <div>
            <span className="text-zinc-400 block mb-0.5 flex items-center gap-1"><Building className="w-3.5 h-3.5" /> Emissor</span>
            <span className="font-semibold text-zinc-200">{cert.issuer}</span>
          </div>
          <div>
            <span className="text-zinc-400 block mb-0.5 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Carga Horária</span>
            <span className="font-bold text-emerald-400 text-sm">{cert.hours} horas</span>
          </div>
          <div>
            <span className="text-zinc-400 block mb-0.5 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Data Conclusão</span>
            <span className="font-semibold text-zinc-200">{cert.completionDate || cert.submissionDate}</span>
          </div>
        </div>

        {/* Feedback ou Parecer Docente */}
        {cert.feedback && (
          <div className={`p-4 rounded-xl border mb-5 text-xs ${
            cert.status === 'INDEFERIDO' 
              ? 'bg-rose-950/20 border-rose-800/50 text-rose-200' 
              : 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
          }`}>
            <div className="font-bold mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Parecer Técnico da Comissão / Secretaria
            </div>
            <p className="leading-relaxed opacity-90">{cert.feedback}</p>
          </div>
        )}

        {/* Simulated Document Preview Card */}
        <div className="bg-[#161820] border border-zinc-800 rounded-xl p-4 mb-5">
          <div className="flex items-center justify-between mb-3 border-b border-zinc-800 pb-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>{cert.fileName || 'comprovante_autenticado.pdf'}</span>
              <span className="text-zinc-500 font-normal">({cert.fileSize || '1.4 MB'})</span>
            </div>
            <button
              onClick={handleDownload}
              className="text-xs text-zinc-300 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Baixar Cópia
            </button>
          </div>

          {/* Document graphical preview */}
          <div className="bg-zinc-950 rounded-lg p-5 border border-zinc-800/80 text-center relative overflow-hidden">
            <div className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold mb-1">
              Universidade Federal de São Carlos — Repositório de Atividades
            </div>
            <div className="text-sm font-semibold text-zinc-200 mb-2">
              Comprovante de Homologação de Atividade Complementar
            </div>
            <div className="text-xs text-zinc-400 max-w-md mx-auto mb-4">
              Certificamos que o aluno <strong className="text-zinc-200">{cert.studentName}</strong> (RA: {cert.studentRa}) concluiu a atividade <strong className="text-zinc-200">{cert.title}</strong> com carga horária de {cert.hours}h.
            </div>

            {/* Hash & QR Simulation */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/90 p-2.5 rounded-lg border border-zinc-800 text-[11px]">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Hash className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hash SHA-256:</span>
                <code className="font-mono text-zinc-300 bg-black/40 px-1.5 py-0.5 rounded">
                  {cert.hash}
                </code>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Autenticidade Verificada
              </div>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
          <span className="text-xs text-zinc-500">
            ID de Registro: #{cert.id}
          </span>
          <button
            onClick={() => setSelectedCertificateForModal(null)}
            className="px-4 py-2 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
