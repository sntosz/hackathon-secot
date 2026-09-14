'use client';

import React, { useState } from 'react';
import { useAppState } from '../context/AppStateContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { CATEGORY_RULES } from '../data/mockData';
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
  Sparkles,
  Share2,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ReportsView: React.FC = () => {
  const { profile, certificates, submitBatch } = useAppState();
  const { announce } = useAccessibility();

  // Selected certificates for export
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
    announce('Preparando documento para impressão ou exportação em PDF.');
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
      announce('Selecione ao menos um certificado para enviar no relatório.', 'assertive');
      return;
    }

    submitBatch(selectedIds, recipientEmail);
    setEmailSent(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    announce(`Relatório enviado com sucesso para ${recipientEmail}!`);
    setTimeout(() => setEmailSent(false), 5000);
  };

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Printable UFSCar Official Report Layout */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">

        {/* Printable Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Relatório de Consolidação de Horas Complementares
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Universidade Federal de São Carlos - Campus Sorocaba • Bacharelado em Ciência da Computação
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 no-print">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors focus:ring-2 focus:ring-emerald-500"
            >
              <Printer className="w-4 h-4" /> Imprimir / Exportar PDF
            </button>
            <button
              onClick={handleCopyShareLink}
              className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors focus:ring-2 focus:ring-emerald-500"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copiedLink ? 'Link Copiado!' : 'Copiar Link para Professor'}
            </button>
          </div>
        </div>

        {/* Student Data Box */}
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block uppercase font-bold text-[10px]">Estudante</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">{profile.name}</span>
          </div>
          <div>
            <span className="text-slate-400 block uppercase font-bold text-[10px]">Registro Acadêmico (RA)</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">{profile.ra}</span>
          </div>
          <div>
            <span className="text-slate-400 block uppercase font-bold text-[10px]">Curso</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{profile.course}</span>
          </div>
          <div>
            <span className="text-slate-400 block uppercase font-bold text-[10px]">Carga Horária Selecionada</span>
            <span className="font-extrabold text-emerald-700 dark:text-emerald-400 text-sm">
              {totalSelectedHours}h / {profile.totalHoursRequired}h
            </span>
          </div>
        </div>

        {/* Certificate Selector Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between no-print">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              Selecione as Atividades para Incluir no Relatório:
            </h3>

            <button
              onClick={toggleSelectAll}
              className="text-xs text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
            >
              {selectedIds.length === certificates.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-3 no-print">Incluir</th>
                  <th className="py-3 px-3">Atividade / Certificado</th>
                  <th className="py-3 px-3">Emissor</th>
                  <th className="py-3 px-3">Categoria</th>
                  <th className="py-3 px-3 font-right">Horas</th>
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
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/30'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 opacity-60'
                      }`}
                    >
                      <td className="py-3 px-3 no-print">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100">
                        {cert.title}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {cert.issuer}
                      </td>
                      <td className="py-3 px-3">
                        <CategoryBadge categoryId={cert.categoryId} />
                      </td>
                      <td className="py-3 px-3 font-extrabold text-emerald-700 dark:text-emerald-400">
                        {cert.hoursRequested}h
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

        {/* Submission / Email Form */}
        <form
          onSubmit={handleSubmitByEmail}
          className="bg-emerald-900 text-white p-6 rounded-2xl space-y-4 no-print shadow-lg"
        >
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold">
              Enviar Solicitação de Validação por E-mail à Secretaria/Docente
            </h3>
          </div>

          <p className="text-xs text-emerald-200 max-w-xl">
            Este processo gera um pacote digital contendo o resumo consolidado e os links de acesso direto para a secretaria conferir os documentos e aprovar o lote.
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
                className="w-full px-4 py-2.5 bg-emerald-950 border border-emerald-700 rounded-xl text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-extrabold rounded-xl text-sm transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Enviar Relatório Oficial
            </button>
          </div>

          {emailSent && (
            <div className="p-3 bg-emerald-800 text-emerald-100 rounded-xl text-xs font-semibold flex items-center gap-2 animate-bounce">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Solicitação enviada e registrada no histórico com sucesso!
            </div>
          )}
        </form>

      </div>

    </div>
  );
};
