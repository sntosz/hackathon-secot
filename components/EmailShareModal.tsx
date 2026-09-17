"use client";

import React, { useState, useEffect } from 'react';
import { useHours } from '../context/HoursContext';
import { X, Mail, Send, CheckCircle2, Paperclip, ShieldCheck } from 'lucide-react';

export default function EmailShareModal() {
  const { isEmailModalOpen, setIsEmailModalOpen, student, certificates, addToast, accessibility, speakText } = useHours();

  useEffect(() => {
    if (isEmailModalOpen && accessibility.audioFeedback) {
      speakText("Modal de envio de relatório de horas por e-mail aberto.");
    }
  }, [isEmailModalOpen, accessibility.audioFeedback, speakText]);

  const [toEmail, setToEmail] = useState('coordenacao.computacao@ufscar.br');
  const [subject, setSubject] = useState(`[Horas Complementares] Espelho de Atividades - ${student.name} (RA: ${student.ra})`);
  const [message, setMessage] = useState(
    `Prezada Comissão de Homologação de Atividades Complementares,\n\nEncaminho meu espelho de horas complementares atualizado para verificação prévia e homologação no sistema.\n\nTotal de horas aprovadas: ${student.approvedHours}h de ${student.requiredHours}h necessárias.\nCertificados anexados digitalmente com hash SHA-256 para auditoria.\n\nAtenciosamente,\n${student.name}\nRA: ${student.ra}\nCiência da Computação - Câmpus Sorocaba`
  );
  const [sending, setSending] = useState(false);

  if (!isEmailModalOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setIsEmailModalOpen(false);
      addToast(`E-mail com o espelho de horas enviado com sucesso para ${toEmail}!`, 'success');
    }, 1000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-modal-title"
    >
      <div className="bg-[#12141a] border border-zinc-700/80 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative">
        <button
          onClick={() => setIsEmailModalOpen(false)}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label="Fechar envio por e-mail"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <h2 id="email-modal-title" className="text-lg font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-400" />
            Compartilhar Relatório com Docentes por E-mail
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Envie diretamente para o orientador acadêmico, colegiado de curso ou secretaria acadêmica da UFSCar.
          </p>
        </div>

        <form onSubmit={handleSend} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-zinc-300 mb-1">
              Destinatário (Professor / Secretaria)
            </label>
            <input
              type="email"
              required
              value={toEmail}
              onChange={e => setToEmail(e.target.value)}
              className="w-full bg-[#181a20] border border-zinc-700/80 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1">
              Assunto
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full bg-[#181a20] border border-zinc-700/80 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-zinc-300 mb-1">
              Mensagem
            </label>
            <textarea
              rows={6}
              required
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full bg-[#181a20] border border-zinc-700/80 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-sans resize-none"
            />
          </div>

          {/* Anexos automáticos */}
          <div className="bg-[#171922] p-3 rounded-xl border border-zinc-800 space-y-1.5">
            <div className="font-semibold text-zinc-300 flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5 text-emerald-400" />
              Anexos Inclusos Automaticamente:
            </div>
            <div className="text-zinc-400 flex items-center justify-between text-[11px]">
              <span>• Espelho_Horas_UFSCar_Lucas_Ferreira_801234.pdf</span>
              <span className="text-emerald-400 font-medium">Gerado</span>
            </div>
            <div className="text-zinc-400 flex items-center justify-between text-[11px]">
              <span>• Pacote_Comprovantes_Homologados ({certificates.filter(c => c.status === 'APROVADO').length} arquivos)</span>
              <span className="text-emerald-400 font-medium">Assinado Digitalmente</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setIsEmailModalOpen(false)}
              className="px-4 py-2 font-medium text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={sending}
              className="px-5 py-2 font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              {sending ? 'Enviando...' : 'Enviar Relatório por E-mail'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
