'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { useAppState } from '../context/AppStateContext';
import { CATEGORY_RULES } from '../data/mockData';
import { CategoryId, Certificate } from '../types';
import { RulesEngine } from '../lib/rulesEngine';
import { Info, AlertCircle } from 'lucide-react';

interface EditCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: Certificate | null;
}

export const EditCertificateModal: React.FC<EditCertificateModalProps> = ({
  isOpen,
  onClose,
  certificate,
}) => {
  const { updateCertificate } = useAppState();

  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [categoryId, setCategoryId] = useState<CategoryId>('extensao');
  const [hoursRequested, setHoursRequested] = useState<number>(10);
  const [issueDate, setIssueDate] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (certificate) {
      setTitle(certificate.title);
      setIssuer(certificate.issuer);
      setCategoryId(certificate.categoryId);
      setHoursRequested(certificate.hoursRequested);
      setIssueDate(certificate.issueDate);
      setTagsInput(certificate.tags ? certificate.tags.join(', ') : '');
      setErrors({});
    }
  }, [certificate]);

  if (!certificate) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = RulesEngine.validateCertificateForm({
      title,
      issuer,
      hoursRequested,
      issueDate,
      categoryId,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const success = updateCertificate(certificate.id, {
      title,
      issuer,
      categoryId,
      hoursRequested,
      issueDate,
      tags,
    });

    if (success) {
      onClose();
    }
  };

  const currentCategoryRule = CATEGORY_RULES[categoryId];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Registro de Atividade"
      ariaDescription="Formulário para ajustar informações da atividade cadastrada."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs text-slate-900 dark:text-slate-100">

        {/* Title */}
        <div className="space-y-1">
          <label htmlFor="edit-cert-title" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
            Título da Atividade <span className="text-rose-500">*</span>
          </label>
          <input
            id="edit-cert-title"
            type="text"
            required
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors({ ...errors, title: '' });
            }}
            className={`w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border rounded-sm text-xs font-medium focus:ring-1 focus:ring-slate-500 ${
              errors.title ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
            }`}
          />
          {errors.title && (
            <p className="text-[11px] text-rose-500 flex items-center gap-1 font-semibold">
              <AlertCircle className="w-3 h-3" /> {errors.title}
            </p>
          )}
        </div>

        {/* Issuer and Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label htmlFor="edit-cert-issuer" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
              Instituição Emissora <span className="text-rose-500">*</span>
            </label>
            <input
              id="edit-cert-issuer"
              type="text"
              required
              value={issuer}
              onChange={(e) => {
                setIssuer(e.target.value);
                if (errors.issuer) setErrors({ ...errors, issuer: '' });
              }}
              className={`w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border rounded-sm text-xs font-medium focus:ring-1 focus:ring-slate-500 ${
                errors.issuer ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
              }`}
            />
            {errors.issuer && (
              <p className="text-[11px] text-rose-500 flex items-center gap-1 font-semibold">
                <AlertCircle className="w-3 h-3" /> {errors.issuer}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <label htmlFor="edit-cert-hours" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
              Carga Horária (Horas) <span className="text-rose-500">*</span>
            </label>
            <input
              id="edit-cert-hours"
              type="number"
              min="1"
              max="200"
              required
              value={hoursRequested}
              onChange={(e) => {
                setHoursRequested(Number(e.target.value));
                if (errors.hoursRequested) setErrors({ ...errors, hoursRequested: '' });
              }}
              className={`w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border rounded-sm text-xs font-mono font-bold text-[#8b0000] dark:text-red-400 focus:ring-1 focus:ring-slate-500 ${
                errors.hoursRequested ? 'border-rose-500' : 'border-slate-300 dark:border-slate-700'
              }`}
            />
            {errors.hoursRequested && (
              <p className="text-[11px] text-rose-500 flex items-center gap-1 font-semibold">
                <AlertCircle className="w-3 h-3" /> {errors.hoursRequested}
              </p>
            )}
          </div>
        </div>

        {/* Category */}
        <div className="space-y-1">
          <label htmlFor="edit-cert-category" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
            Modalidade Acadêmica (UFSCar) <span className="text-rose-500">*</span>
          </label>
          <select
            id="edit-cert-category"
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

        {/* Date and Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label htmlFor="edit-cert-date" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
              Data de Emissão
            </label>
            <input
              id="edit-cert-date"
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-sm text-xs font-medium focus:ring-1 focus:ring-slate-500"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="edit-cert-tags" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
              Etiquetas (Tags)
            </label>
            <input
              id="edit-cert-tags"
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
            Salvar Alterações
          </button>
        </div>

      </form>
    </Modal>
  );
};
