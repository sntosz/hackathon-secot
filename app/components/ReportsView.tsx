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
    <div className="space-y-5 text-slate-900 dark:text-slate-100">

      {/* Official UFSCar Printable Document Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-md p-5 space-y-4">

        {/* Printable Official Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-300 dark:border-slate-700 pb-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-xs bg-[#8b0000] text-white flex items-center justify-center font-bold text-xs shrink-0">
                U
              </div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
                Universidade Federal de São Carlos — Campus Sorocaba
              </h2>
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Relatório de Consolidação e Entrega de Horas Complementares
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 no-print">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-semibold rounded-sm text-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-amber-300" /> Imprimir / PDF
            </button>
            <button
              onClick={handleCopyShareLink}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-200 font-semibold rounded-sm text-xs flex items-center gap-1.5"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedLink ? 'Link Copiado!' : 'Copiar Link Validação'}
            </button>
          </div>
        </div>

        {/* Student Data Table Block */}
        <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-500 uppercase font-bold text-[10px] block">Estudante</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">{profile.name}</span>
          </div>
          <div>
            <span className="text-slate-500 uppercase font-bold text-[10px] block">Registro Acadêmico (RA)</span>
            <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{profile.ra}</span>
          </div>
          <div>
            <span className="text-slate-500 uppercase font-bold text-[10px] block">Curso / Matriz</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{profile.course}</span>
          </div>
          <div>
            <span className="text-slate-500 uppercase font-bold text-[10px] block">Carga Selecionada</span>
            <span className="font-mono font-bold text-[#8b0000] dark:text-red-400">
              {totalSelectedHours}h / {profile.totalHoursRequired}h exigidas
            </span>
          </div>
        </div>

        {/* Certificate Selection Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between no-print">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs uppercase tracking-wide flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#8b0000] dark:text-red-400" />
              Seleção de Comprovantes no Relatório:
            </h3>

            <button
              onClick={toggleSelectAll}
              className="text-xs text-[#8b0000] dark:text-red-400 font-bold hover:underline"
            >
              {selectedIds.length === certificates.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-md">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2 px-3 no-print">Item</th>
                  <th className="py-2 px-3">Atividade / Comprovante</th>
                  <th className="py-2 px-3">Emissor</th>
                  <th className="py-2 px-3">Modalidade</th>
                  <th className="py-2 px-3 text-right">Horas</th>
                  <th className="py-2 px-3">Autenticação Digital</th>
                  <th className="py-2 px-3 text-center">Status</th>
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
                          ? 'bg-slate-50 dark:bg-slate-800/60 font-medium'
                          : 'opacity-50 hover:opacity-100'
                      }`}
                    >
                      <td className="py-2 px-3 no-print">
                        {isChecked ? (
                          <CheckSquare className="w-3.5 h-3.5 text-[#8b0000] dark:text-red-400" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </td>
                      <td className="py-2 px-3 font-bold text-slate-900 dark:text-slate-100">
                        {cert.title}
                      </td>
                      <td className="py-2 px-3 text-slate-600 dark:text-slate-400">
                        {cert.issuer}
                      </td>
                      <td className="py-2 px-3">
                        <CategoryBadge categoryId={cert.categoryId} />
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-[#8b0000] dark:text-red-400">
                        {cert.hoursRequested}h
                      </td>
                      <td className="py-2 px-3 font-mono text-[10px] text-slate-500">
                        {cert.verificationCode || 'UFSCAR-2024-HASH'}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <StatusBadge status={cert.status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Corporate Email Submission Form */}
        <form
          onSubmit={handleSubmitByEmail}
          className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md space-y-3 no-print border border-slate-300 dark:border-slate-700"
        >
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[#8b0000] dark:text-red-400" />
            <h3 className="text-xs font-bold uppercase tracking-wide text-slate-900 dark:text-slate-100">
              Protocolar Entrega Digital via E-mail Institucional
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="w-full flex-1">
              <label htmlFor="recipient-email" className="sr-only">E-mail do destinatário</label>
              <input
                id="recipient-email"
                type="email"
                required
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="secretaria.bcc@ufscar.br ou docente@ufscar.br"
                className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-sm text-xs text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-slate-500 font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-1.5 bg-[#8b0000] hover:bg-[#700000] text-white font-semibold rounded-sm text-xs flex items-center justify-center gap-1.5 border border-red-900"
            >
              <Send className="w-3.5 h-3.5 text-amber-300" /> Enviar Protocolo Oficial
            </button>
          </div>

          {emailSent && (
            <div className="p-2.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 rounded-sm text-xs font-bold flex items-center gap-2 border border-emerald-300 dark:border-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Solicitação protocolada com sucesso no sistema da UFSCar!
            </div>
          )}
        </form>

      </div>

    </div>
  );
};
