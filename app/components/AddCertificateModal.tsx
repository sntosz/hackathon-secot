'use client';

import React, { useState } from 'react';
import { Modal } from './Modal';
import { useAppState } from '../context/AppStateContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { CATEGORY_RULES } from '../data/mockData';
import { CategoryId } from '../types';
import { UploadCloud, Sparkles, CheckCircle2, Info } from 'lucide-react';

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

  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsScanning(true);
    setScanSuccess(false);
    announce('Analisando documento com Leitor Inteligente (OCR) para extração automática...');

    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);

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
        setIssuer('UFSCar / Instituição Concedente');
        setHoursRequested(15);
        setTagsInput('Certificado, UFSCar');
      }

      announce('Extração concluída com sucesso! Os campos foram preenchidos.');
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
      title="Cadastrar Comprovante de Atividade"
      ariaDescription="Formulário para registrar atividade complementar com simulador de leitor OCR de PDF."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs text-slate-900 dark:text-slate-100">

        {/* Upload Simulation Dropzone */}
        <div className="bg-slate-50 dark:bg-slate-800/80 border border-dashed border-slate-300 dark:border-slate-700 rounded-sm p-3 text-center transition-colors hover:border-[#8b0000]">
          <input
            type="file"
            id="certificate-file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleSimulateUpload}
            className="sr-only"
          />

          {isScanning ? (
            <div className="flex items-center justify-center gap-2 py-1 text-[#8b0000] dark:text-red-400">
              <Sparkles className="w-4 h-4 animate-spin" />
              <p className="text-xs font-bold">Processando leitor OCR e extraindo dados...</p>
            </div>
          ) : scanSuccess ? (
            <div className="flex items-center justify-center gap-2 py-1 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <p className="text-xs font-semibold">{fileName} — Dados preenchidos com sucesso.</p>
            </div>
          ) : (
            <label
              htmlFor="certificate-file"
              className="cursor-pointer flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 hover:text-[#8b0000]"
            >
              <UploadCloud className="w-4 h-4 text-[#8b0000] dark:text-red-400" />
              <span className="font-semibold text-xs text-[#8b0000] dark:text-red-400 underline">
                Anexar documento PDF/Imagem do certificado
              </span>
            </label>
          )}
        </div>

        {/* Title */}
        <div className="space-y-1">
          <label htmlFor="cert-title" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
            Título da Atividade <span className="text-rose-500">*</span>
          </label>
          <input
            id="cert-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: XIX SeCoT - Palestra sobre Arquitetura de Software"
            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-sm text-xs font-medium focus:ring-1 focus:ring-slate-500"
          />
        </div>

        {/* Issuer and Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label htmlFor="cert-issuer" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
              Instituição Emissora <span className="text-rose-500">*</span>
            </label>
            <input
              id="cert-issuer"
              type="text"
              required
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder="Ex: Departamento de Computação UFSCar"
              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-sm text-xs font-medium focus:ring-1 focus:ring-slate-500"
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
              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-sm text-xs font-mono font-bold text-[#8b0000] dark:text-red-400 focus:ring-1 focus:ring-slate-500"
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-1">
          <label htmlFor="cert-category" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
            Modalidade Acadêmica (UFSCar) <span className="text-rose-500">*</span>
          </label>
          <select
            id="cert-category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value as CategoryId)}
            className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-sm text-xs font-semibold focus:ring-1 focus:ring-slate-500"
          >
            {Object.values(CATEGORY_RULES).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} (Piso: {cat.minHours}h / Teto: {cat.maxHours}h)
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Info className="w-3 h-3 text-[#8b0000] shrink-0" />
            <span>{currentCategoryRule?.description}</span>
          </p>
        </div>

        {/* Dates and Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label htmlFor="cert-issue-date" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
              Data de Emissão
            </label>
            <input
              id="cert-issue-date"
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-sm text-xs font-medium focus:ring-1 focus:ring-slate-500"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="cert-tags" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
              Etiquetas (Tags)
            </label>
            <input
              id="cert-tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="SeCoT, Hackathon, Evento"
              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-sm text-xs font-medium focus:ring-1 focus:ring-slate-500"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 bg-[#8b0000] hover:bg-[#700000] text-white font-semibold rounded-sm text-xs border border-red-900"
          >
            Salvar Registro
          </button>
        </div>

      </form>
    </Modal>
  );
};
