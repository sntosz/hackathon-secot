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
      title="Cadastrar Novo Comprovante / Certificado"
      ariaDescription="Formulário para registrar atividade complementar com simulador de leitor inteligente OCR de PDF."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-slate-900 dark:text-slate-100">

        {/* Upload Simulation Dropzone */}
        <div className="bg-slate-50 dark:bg-slate-800/80 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-5 text-center transition-colors hover:border-[#9e1b22]">
          <input
            type="file"
            id="certificate-file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleSimulateUpload}
            className="sr-only"
          />

          {isScanning ? (
            <div className="flex flex-col items-center gap-2 py-2 text-[#9e1b22] dark:text-red-400">
              <Sparkles className="w-8 h-8 animate-spin" />
              <p className="text-xs font-extrabold">Extraindo dados do PDF com Leitor Inteligente (OCR)...</p>
            </div>
          ) : scanSuccess ? (
            <div className="flex flex-col items-center gap-2 py-1 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              <div>
                <p className="text-xs font-bold">{fileName}</p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  ✨ Dados identificados e preenchidos abaixo!
                </p>
              </div>
            </div>
          ) : (
            <label
              htmlFor="certificate-file"
              className="cursor-pointer flex flex-col items-center gap-2 py-1 text-slate-600 dark:text-slate-300 hover:text-[#9e1b22]"
            >
              <UploadCloud className="w-8 h-8 text-[#9e1b22] dark:text-red-400" />
              <div>
                <span className="font-extrabold text-sm text-[#9e1b22] dark:text-red-400 underline">
                  Clique aqui para selecionar o PDF/Imagem do certificado
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Suporta preenchimento automático de carga horária e emissor.
                </p>
              </div>
            </label>
          )}
        </div>

        {/* Title */}
        <div className="space-y-1">
          <label htmlFor="cert-title" className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
            Título da Atividade <span className="text-rose-500">*</span>
          </label>
          <input
            id="cert-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: XIX SeCoT - Palestra sobre Arquitetura de Software"
            className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#9e1b22]"
          />
        </div>

        {/* Issuer and Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="cert-issuer" className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
              Instituição Emissora <span className="text-rose-500">*</span>
            </label>
            <input
              id="cert-issuer"
              type="text"
              required
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder="Ex: Departamento de Computação UFSCar"
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#9e1b22]"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="cert-hours" className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
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
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-extrabold text-[#9e1b22] dark:text-red-400 focus:ring-2 focus:ring-[#9e1b22]"
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-1">
          <label htmlFor="cert-category" className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
            Categoria (Norma UFSCar) <span className="text-rose-500">*</span>
          </label>
          <select
            id="cert-category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value as CategoryId)}
            className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#9e1b22]"
          >
            {Object.values(CATEGORY_RULES).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} (Piso Mín: {cat.minHours}h / Teto Máx: {cat.maxHours}h)
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1 pt-0.5 font-medium">
            <Info className="w-3.5 h-3.5 text-[#9e1b22] shrink-0 mt-0.5" />
            <span>{currentCategoryRule?.description}</span>
          </p>
        </div>

        {/* Dates and Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="cert-issue-date" className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
              Data de Emissão
            </label>
            <input
              id="cert-issue-date"
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#9e1b22]"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="cert-tags" className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
              Etiquetas / Tags
            </label>
            <input
              id="cert-tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Ex: SeCoT, Hackathon, Evento"
              className="w-full px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#9e1b22]"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-bold"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#9e1b22] hover:bg-[#800000] text-white font-extrabold rounded-xl text-sm shadow-md transition-transform hover:scale-105 active:scale-95 focus:ring-2 focus:ring-amber-400"
          >
            Salvar Registro
          </button>
        </div>

      </form>
    </Modal>
  );
};
