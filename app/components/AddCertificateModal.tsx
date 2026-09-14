'use client';

import React, { useState } from 'react';
import { Modal } from './Modal';
import { useAppState } from '../context/AppStateContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { CATEGORY_RULES } from '../data/mockData';
import { CategoryId } from '../types';
import { UploadCloud, Sparkles, CheckCircle2, FileText, AlertCircle, Info } from 'lucide-react';

interface AddCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCertificateModal: React.FC<AddCertificateModalProps> = ({ isOpen, onClose }) => {
  const { addCertificate } = useAppState();
  const { announce } = useAccessibility();

  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [categoryId, setCategoryId] = useState<CategoryId>('extensao');
  const [hoursRequested, setHoursRequested] = useState<number>(10);
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [completionDate, setCompletionDate] = useState(new Date().toISOString().split('T')[0]);
  const [tagsInput, setTagsInput] = useState('');
  const [fileName, setFileName] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  // Simulated AI File Extraction Feature
  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsScanning(true);
    setScanSuccess(false);
    announce('Analisando documento com Inteligência Artificial para extração automática...');

    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);

      // Pre-fill fields smartly based on mock file name / heuristics
      if (file.name.toLowerCase().includes('secot') || file.name.toLowerCase().includes('semana')) {
        setTitle('XIX SeCoT - Semana da Computação UFSCar');
        setIssuer('Departamento de Computação UFSCar');
        setCategoryId('extensao');
        setHoursRequested(25);
        setTagsInput('SeCoT, UFSCar, Palestras');
      } else if (file.name.toLowerCase().includes('monitoria')) {
        setTitle('Monitoria Acadêmica de Algoritmos e Programação');
        setIssuer('DC - UFSCar Sorocaba');
        setCategoryId('ensino');
        setHoursRequested(30);
        setTagsInput('Monitoria, Programação');
      } else {
        setTitle(`Certificado de ${file.name.replace(/\.[^/.]+$/, "")}`);
        setIssuer('UFSCar / Organização Concedente');
        setHoursRequested(15);
        setTagsInput('Certificado, UFSCar');
      }

      announce('Extração concluída com sucesso! Os campos foram preenchidos automaticamente.');
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !issuer || !hoursRequested || hoursRequested <= 0) {
      announce('Por favor, preencha todos os campos obrigatórios.', 'assertive');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    addCertificate({
      title,
      issuer,
      categoryId,
      hoursRequested,
      issueDate,
      completionDate,
      fileName: fileName || 'comprovante_upload.pdf',
      fileSize: '1.4 MB',
      status: 'draft',
      tags,
    });

    // Reset Form
    setTitle('');
    setIssuer('');
    setFileName('');
    setScanSuccess(false);
    setTagsInput('');
    onClose();
  };

  const currentCategoryRule = CATEGORY_RULES[categoryId];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cadastrar Novo Certificado / Comprovante"
      ariaDescription="Formulário para registrar certificado de atividade complementar com opção de extração automática de PDF."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Upload Simulation Zone */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-5 text-center transition-colors hover:border-emerald-500">
          <input
            type="file"
            id="certificate-file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleSimulateUpload}
            className="sr-only"
          />

          {isScanning ? (
            <div className="flex flex-col items-center gap-2 py-2 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-8 h-8 animate-spin" />
              <p className="text-xs font-bold">Extraindo dados com Leitor Inteligente (OCR)...</p>
            </div>
          ) : scanSuccess ? (
            <div className="flex flex-col items-center gap-2 py-1 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              <div>
                <p className="text-xs font-bold">{fileName}</p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                  ✨ Dados do PDF identificados e preenchidos abaixo!
                </p>
              </div>
            </div>
          ) : (
            <label
              htmlFor="certificate-file"
              className="cursor-pointer flex flex-col items-center gap-2 py-1 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              <UploadCloud className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              <div>
                <span className="font-bold text-sm text-emerald-700 dark:text-emerald-400 underline">
                  Clique aqui para selecionar o certificado PDF/Imagem
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Suporta leitor automático de horas e título.
                </p>
              </div>
            </label>
          )}
        </div>

        {/* Certificate Title */}
        <div className="space-y-1">
          <label htmlFor="cert-title" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
            Título da Atividade ou Evento <span className="text-rose-500">*</span>
          </label>
          <input
            id="cert-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: XVIII SeCoT - Palestra sobre Engenharia de Software"
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>

        {/* Issuer and Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="cert-issuer" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
              Instituição / Emissor <span className="text-rose-500">*</span>
            </label>
            <input
              id="cert-issuer"
              type="text"
              required
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder="Ex: Departamento de Computação UFSCar"
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="cert-hours" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
              Carga Horária (Horas) <span className="text-rose-500">*</span>
            </label>
            <input
              id="cert-hours"
              type="number"
              min="1"
              max="200"
              required
              value={hoursRequested}
              onChange={(e) => setHoursRequested(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Category Selector */}
        <div className="space-y-1">
          <label htmlFor="cert-category" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
            Categoria da Atividade (Regulamento UFSCar) <span className="text-rose-500">*</span>
          </label>
          <select
            id="cert-category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value as CategoryId)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          >
            {Object.values(CATEGORY_RULES).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} (Mín: {cat.minHours}h / Máx: {cat.maxHours}h)
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1 pt-0.5">
            <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{currentCategoryRule?.description}</span>
          </p>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="cert-issue-date" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
              Data de Emissão
            </label>
            <input
              id="cert-issue-date"
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="cert-tags" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
              Etiquetas / Tags (Separadas por vírgula)
            </label>
            <input
              id="cert-tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Ex: SeCoT, Hackathon, Presencial"
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm shadow-md transition-transform hover:scale-105 active:scale-95 focus:ring-2 focus:ring-emerald-500"
          >
            Salvar em Rascunho
          </button>
        </div>

      </form>
    </Modal>
  );
};
