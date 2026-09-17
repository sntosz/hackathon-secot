"use client";

import React, { useState, useEffect } from 'react';
import { useHours } from '../context/HoursContext';
import { 
  X, 
  Check, 
  FileText, 
  ShieldCheck, 
  AlertCircle, 
  Download, 
  ExternalLink, 
  Hash, 
  Calendar, 
  Clock, 
  Building, 
  Copy, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export default function SecretaryReviewModal() {
  const { reviewingCertificate, setReviewingCertificate, deferCertificate, rejectCertificate, categoryRules, addToast, activeRole } = useHours();

  const [feedback, setFeedback] = useState('');
  const [copiedHash, setCopiedHash] = useState(false);

  useEffect(() => {
    if (reviewingCertificate) {
      setFeedback(reviewingCertificate.feedback || '');
    }
  }, [reviewingCertificate]);

  if (!reviewingCertificate || activeRole !== 'secretary') return null;

  const cert = reviewingCertificate;
  const categoryRule = categoryRules.find(r => r.category === cert.category);
  const maxLimit = categoryRule?.maxHours || 60;
  const currentHours = categoryRule?.currentHours || 0;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(cert.hash);
    setCopiedHash(true);
    addToast('Hash SHA-256 copiado para a área de transferência!', 'info');
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleDefer = () => {
    const finalFeedback = feedback.trim() || 'Documentação regular e carga horária validada pela Comissão Docente.';
    deferCertificate(cert.id, finalFeedback);
    setReviewingCertificate(null);
  };

  const handleReject = () => {
    if (!feedback.trim()) {
      addToast('Por favor, informe a justificativa técnica para o indeferimento.', 'warning');
      return;
    }
    rejectCertificate(cert.id, feedback.trim());
    setReviewingCertificate(null);
  };

  const quickFeedbacks = [
    'Documentação regular e carga horária validada pelo PPC.',
    'Falta assinatura eletrônica legível ou código verificador no documento.',
    'Carga horária excede teto remanescente permitido para esta categoria no PPC.',
    'Atividade incompatível com as diretrizes curriculares de Ciência da Computação.',
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
    >
      <div className="bg-[#111318] border border-zinc-700/90 rounded-2xl w-full max-w-4xl p-6 shadow-2xl relative max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-600 text-white px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">
              SGA_UFSCar
            </div>
            <div>
              <h2 id="review-modal-title" className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Homologação de Atividade Complementar
              </h2>
              <p className="text-xs text-zinc-400">
                Divisão de Triagem da Secretaria Acadêmica e Comissão Docente
              </p>
            </div>
          </div>

          <button
            onClick={() => setReviewingCertificate(null)}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Fechar revisão"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student Bar */}
        <div className="bg-[#171922] border border-zinc-800 p-3.5 rounded-xl mb-4 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-zinc-200">
              {cert.studentName.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div>
              <div className="font-bold text-white text-sm">
                {cert.studentName} <span className="text-zinc-400 font-normal">(RA: {cert.studentRa})</span>
              </div>
              <div className="text-zinc-400 text-[11px]">
                Bacharelado em Ciência da Computação • Câmpus Sorocaba • PPC 2021
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-zinc-400 block text-[11px]">Carga Solicitada:</span>
            <span className="text-emerald-400 font-bold text-base">{cert.hours} horas</span>
          </div>
        </div>

        {/* Modal 2-Column Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 overflow-y-auto flex-1 pr-1">
          
          {/* Left Column: Document Inspection & Viewer (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Activity Info */}
            <div className="bg-[#14161f] border border-zinc-800/80 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  {cert.category}
                </span>
                <span className="text-[11px] text-zinc-400">
                  Enviado em: {cert.submissionDate}
                </span>
              </div>

              <h3 className="font-bold text-white text-sm">
                {cert.title}
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400 pt-1">
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">Emissor:</span>
                  <span className="text-zinc-300 font-medium">{cert.issuer}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] uppercase">Conclusão:</span>
                  <span className="text-zinc-300 font-medium">{cert.completionDate || cert.submissionDate}</span>
                </div>
              </div>

              {cert.description && (
                <div className="text-xs text-zinc-300 pt-1 leading-relaxed bg-black/20 p-2.5 rounded-lg border border-zinc-800/60">
                  <span className="text-zinc-500 block text-[10px] uppercase mb-0.5">Descrição do Aluno:</span>
                  {cert.description}
                </div>
              )}
            </div>

            {/* Document Viewer Graphic */}
            <div className="bg-[#14161f] border border-zinc-800/80 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-zinc-800/80 pb-2">
                <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  Comprovante Digital Anexado
                </span>
                <button
                  onClick={() => addToast(`Visualização em tamanho real de "${cert.fileName}" carregada.`, 'info')}
                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Baixar Documento Original
                </button>
              </div>

              {/* Graphical Simulated Certificate Paper */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-5 text-center relative shadow-inner">
                <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">
                  Certificado de Conclusão / Comprovante
                </div>
                <div className="text-sm font-bold text-white mb-2">
                  {cert.title}
                </div>
                <div className="text-xs text-zinc-400 max-w-sm mx-auto mb-3 leading-relaxed">
                  Documento emitido por <strong className="text-zinc-200">{cert.issuer}</strong> certificando a participação de <strong className="text-zinc-200">{cert.studentName}</strong> com carga de <strong className="text-emerald-400">{cert.hours} horas</strong>.
                </div>

                {/* Validation Stamp */}
                <div className="inline-flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-[11px] font-semibold px-3 py-1 rounded-full mb-3">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Assinatura Eletrônica e Código Verificador Legíveis
                </div>

                {/* Hash */}
                <div className="bg-black/50 p-2 rounded-lg border border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span className="truncate pr-2">SHA-256: {cert.hash}</span>
                  <button 
                    onClick={handleCopyHash}
                    className="text-zinc-300 hover:text-white p-1 rounded hover:bg-zinc-800 cursor-pointer"
                    title="Copiar Hash"
                  >
                    {copiedHash ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: PPC Rules & Review Action (5 cols) */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            
            <div className="space-y-4">
              {/* PPC Category Limit Box */}
              <div className="bg-[#14161f] border border-zinc-800/80 rounded-xl p-4 space-y-2 text-xs">
                <div className="font-bold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <AlertCircle className="w-4 h-4 text-blue-400" />
                  Diretriz do PPC UFSCar ({cert.category})
                </div>
                <div className="text-zinc-400 leading-relaxed">
                  Limite máximo da categoria: <strong className="text-zinc-200">{maxLimit}h</strong>.
                  <br />
                  O aluno possui <strong className="text-emerald-400">{currentHours}h</strong> aprovadas.
                </div>
                <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-500">Saldo remanescente:</span>
                  <span className="font-bold text-zinc-200">{Math.max(0, maxLimit - currentHours)}h disponíveis</span>
                </div>
              </div>

              {/* Parecer Técnico Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Parecer Técnico do Avaliador
                </label>
                <textarea
                  rows={4}
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  placeholder="Insira as observações técnicas, despacho da secretaria ou justificativa em caso de indeferimento..."
                  className="w-full bg-[#181a20] border border-zinc-700 rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 resize-none"
                />

                {/* Quick Suggestion Chips */}
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold block mb-1.5">
                    Sugestões Rápidas de Despacho (1 clique):
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {quickFeedbacks.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFeedback(preset)}
                        className="text-left bg-[#181a22] hover:bg-[#20232e] border border-zinc-800 text-[11px] text-zinc-400 hover:text-zinc-200 p-2 rounded-lg transition-colors leading-tight"
                      >
                        ⚡ {preset}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions: Deferir e Indeferir */}
            <div className="pt-3 border-t border-zinc-800 space-y-2 shrink-0">
              <button
                onClick={handleDefer}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer hover:scale-[1.01]"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                Deferir Atividade e Homologar Horas (+{cert.hours}h)
              </button>

              <button
                onClick={handleReject}
                className="w-full bg-[#2a1317] hover:bg-[#3d1920] border border-rose-800 text-rose-400 font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
                Indeferir Solicitação com Parecer
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
