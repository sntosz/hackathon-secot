'use client';

import React, { useState } from 'react';
import { useAppState } from '../context/AppStateContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { CategoryBadge, StatusBadge } from './Badges';
import {
  Printer,
  Mail,
  CheckSquare,
  Square,
  Send,
  FileText,
  Copy,
  Check,
  GraduationCap,
  ShieldCheck,
  QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ReportsView: React.FC = () => {
  const { profile, certificates, submitBatch } = useAppState();
  const { announce } = useAccessibility();

  const [selectedIds, setSelectedIds] = useState<string[]>(
    certificates.map((c) => c.id)
  );

  const [recipientEmail, setRecipientEmail] = useState(
    profile.advisorEmail || 'secretaria.bcc@ufscar.br'
  );
  const [copiedLink, setCopiedLink] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const toggleSelectAll = () => {
    if (selectedIds.length === certificates.length) {
      setSelectedIds([]);
      announce('Todos os certificados foram desmarcados.');
    } else {
      setSelectedIds(certificates.map((c) => c.id));
      announce('Todos os certificados foram selecionados.');
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    } else {
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  const selectedCertificates = certificates.filter((c) => selectedIds.includes(c.id));
  const totalSelectedHours = selectedCertificates.reduce(
    (acc, c) => acc + c.hoursRequested,
    0
  );

  const handlePrint = () => {
    announce('Iniciando diálogo de impressão/exportação para PDF.');
    window.print();
  };

  const handleCopyShareLink = () => {
    const shareableUrl = `${window.location.origin}/portal?ra=${profile.ra}&token=ufscar-demo-2024`;
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    announce('Link público de validação copiado para a área de transferência.');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleSubmitByEmail = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCertificates.length === 0) {
      announce('Selecione pelo menos uma atividade para incluir no relatório.', 'assertive');
      return;
    }

    const batch = submitBatch(selectedIds, recipientEmail);
    setEmailSent(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    announce(`Solicitação oficial ${batch.protocolNumber} enviada com sucesso para ${recipientEmail}!`);
    setTimeout(() => setEmailSent(false), 5000);
  };

  return (
    <div className="space-y-8 animate-fade-in text-slate-900 dark:text-slate-100">

      {/* Official UFSCar Printable Document Paper */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">

        {/* Printable Official Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#9e1b22] dark:border-red-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#9e1b22] text-white flex items-center justify-center font-extrabold text-lg border border-amber-400 shrink-0">
                U
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                UNIVERSIDADE FEDERAL DE SÃO CARLOS
              </h2>
            </div>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Campus Sorocaba • {profile.course}
            </p>
            <p className="text-xs font-semibold text-[#9e1b22] dark:text-red-400">
              Relatório de Consolidação de Atividades Complementares
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 no-print">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-extrabold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors focus:ring-2 focus:ring-amber-400"
            >
              <Printer className="w-4 h-4 text-amber-300" /> Imprimir / PDF
            </button>
            <button
              onClick={handleCopyShareLink}
              className="px-4 py-2.5 bg-red-50 dark:bg-red-950 text-[#9e1b22] dark:text-red-300 border border-red-300 dark:border-red-800 hover:bg-red-100 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors focus:ring-2 focus:ring-amber-400"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copiedLink ? 'Link Copiado!' : 'Copiar Link para Professor'}
            </button>
          </div>
        </div>

        {/* Student Data Identification Block */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block uppercase font-bold text-[10px]">Estudante</span>
            <span className="font-extrabold text-slate-900 dark:text-white text-sm">{profile.name}</span>
          </div>
          <div>
            <span className="text-slate-400 block uppercase font-bold text-[10px]">Registro Acadêmico (RA)</span>
            <span className="font-extrabold text-slate-900 dark:text-white text-sm">{profile.ra}</span>
          </div>
          <div>
            <span className="text-slate-400 block uppercase font-bold text-[10px]">Curso</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{profile.course}</span>
          </div>
          <div>
            <span className="text-slate-400 block uppercase font-bold text-[10px]">Carga Horária Selecionada</span>
            <span className="font-extrabold text-[#9e1b22] dark:text-red-400 text-sm">
              {totalSelectedHours}h / {profile.totalHoursRequired}h
            </span>
          </div>
        </div>

        {/* Certificate Selection Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between no-print">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#9e1b22] dark:text-red-400" />
              Selecione as Atividades Comprovadas para Inclusão:
            </h3>

            <button
              onClick={toggleSelectAll}
              className="text-xs text-[#9e1b22] dark:text-red-400 font-extrabold hover:underline"
            >
              {selectedIds.length === certificates.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-extrabold uppercase border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-3 no-print">Incluir</th>
                  <th className="py-3 px-3">Atividade / Comprovante</th>
                  <th className="py-3 px-3">Emissor</th>
                  <th className="py-3 px-3">Categoria</th>
                  <th className="py-3 px-3">Horas</th>
                  <th className="py-3 px-3">Hash Verificação</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {certificates.map((cert) => {
                  const isChecked = selectedIds.includes(cert.id);
                  return (
                    <tr
                      key={cert.id}
                      onClick={() => toggleSelectOne(cert.id)}
                      className={`cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-red-50/40 dark:bg-red-950/20'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 opacity-60'
                      }`}
                    >
                      <td className="py-3 px-3 no-print">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-[#9e1b22] dark:text-red-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100">
                        {cert.title}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400 font-medium">
                        {cert.issuer}
                      </td>
                      <td className="py-3 px-3">
                        <CategoryBadge categoryId={cert.categoryId} />
                      </td>
                      <td className="py-3 px-3 font-extrabold text-[#9e1b22] dark:text-red-400">
                        {cert.hoursRequested}h
                      </td>
                      <td className="py-3 px-3 font-mono text-[10px] text-slate-500">
                        {cert.verificationCode || 'UFSCAR-2024-HASH'}
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={cert.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Official Crimson Email Submission Block */}
        <form
          onSubmit={handleSubmitByEmail}
          className="bg-gradient-to-r from-[#7a1218] to-[#9e1b22] text-white p-6 rounded-2xl space-y-4 no-print shadow-xl border border-red-800"
        >
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-amber-300" />
            <h3 className="text-base font-extrabold">
              Enviar Solicitação Digital com Protocolo para a Secretaria / Docente
            </h3>
          </div>

          <p className="text-xs text-red-100 leading-relaxed max-w-2xl font-medium">
            Gera um número de protocolo com hash de autenticação e envia o resumo com anexos diretamente ao e-mail institucional responsável.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <div className="w-full flex-1">
              <label htmlFor="recipient-email" className="sr-only">E-mail do destinatário</label>
              <input
                id="recipient-email"
                type="email"
                required
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="Ex: secretaria.bcc@ufscar.br ou docente@ufscar.br"
                className="w-full px-4 py-2.5 bg-red-950 border border-red-700 rounded-xl text-sm text-white font-medium focus:ring-2 focus:ring-amber-300"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-xl text-sm transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-md"
            >
              <Send className="w-4 h-4" /> Enviar Relatório Oficial
            </button>
          </div>

          {emailSent && (
            <div className="p-3.5 bg-emerald-900 text-emerald-100 rounded-xl text-xs font-bold flex items-center gap-2 animate-bounce border border-emerald-700">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Solicitação enviada e registrada no histórico com sucesso!
            </div>
          )}
        </form>

      </div>

    </div>
  );
};
