"use client";

import React, { useState, useEffect } from 'react';
import { useHours } from '../context/HoursContext';
import { ActivityCategory } from '../lib/types';
import { X, Upload, AlertCircle, CheckCircle, FileText } from 'lucide-react';

export default function AddCertificateModal() {
  const { isAddModalOpen, setIsAddModalOpen, addCertificate, categoryRules, addToast, accessibility, speakText } = useHours();

  useEffect(() => {
    if (isAddModalOpen && accessibility.audioFeedback) {
      speakText("Modal de submissão de novo certificado aberto. Preencha os dados da atividade.");
    }
  }, [isAddModalOpen, accessibility.audioFeedback, speakText]);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ActivityCategory>('Ensino');
  const [issuer, setIssuer] = useState('');
  const [hours, setHours] = useState<number>(20);
  const [completionDate, setCompletionDate] = useState('2025-05-15');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');

  if (!isAddModalOpen) return null;

  const currentCategoryRule = categoryRules.find(r => r.category === category);
  const currentCategoryHours = currentCategoryRule?.currentHours || 0;
  const maxCategoryHours = currentCategoryRule?.maxHours || 60;
  const willExceed = currentCategoryHours + hours > maxCategoryHours;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      addToast(`Arquivo "${file.name}" anexado com sucesso!`, 'info');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !issuer.trim() || hours <= 0) {
      addToast('Por favor, preencha todos os campos obrigatórios.', 'warning');
      return;
    }

    addCertificate({
      studentRa: "801234",
      studentName: "Lucas Ferreira Silva",
      title: title.trim(),
      category,
      issuer: issuer.trim(),
      hours: Number(hours),
      completionDate: completionDate.split('-').reverse().join('/'),
      description: description.trim(),
      fileName: fileName || 'comprovante_certificado.pdf',
      fileSize: fileSize || '1.2 MB',
    });

    setIsAddModalOpen(false);
    // Reset form
    setTitle('');
    setIssuer('');
    setHours(20);
    setDescription('');
    setFileName('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-cert-title"
    >
      <div className="bg-[#111318] border border-zinc-700/80 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative">
        <button
          onClick={() => setIsAddModalOpen(false)}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label="Fechar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-5">
          <h2 id="add-cert-title" className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            Submeter Novo Certificado
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Envie as informações e o documento comprobatório para homologação pela Secretaria e Comissão Docente.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Título da Atividade ou Curso <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Curso de Inteligência Artificial Aplicada"
              className="w-full bg-[#181a20] border border-zinc-700/80 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Categoria e Carga Horária */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Categoria (Projeto Pedagógico) <span className="text-rose-400">*</span>
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as ActivityCategory)}
                className="w-full bg-[#181a20] border border-zinc-700/80 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Ensino">Ensino (Cursos, Palestras)</option>
                <option value="Extensão">Extensão (Projetos, Organização)</option>
                <option value="Pesquisa">Pesquisa (IC, Publicações)</option>
                <option value="Gestão & Representação">Gestão & Representação</option>
                <option value="Cultura, Esporte & Integração">Cultura, Esporte & Integração</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Carga Horária Solicitada (horas) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="100"
                required
                value={hours}
                onChange={e => setHours(Number(e.target.value))}
                className="w-full bg-[#181a20] border border-zinc-700/80 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* PPC Limit Real-time Advisory */}
          <div className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
            willExceed 
              ? 'bg-amber-950/30 border-amber-800/60 text-amber-300'
              : 'bg-blue-950/30 border-blue-800/50 text-blue-300'
          }`}>
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">
                Diretriz do PPC UFSCar ({category}): {currentCategoryHours}h aprovadas de {maxCategoryHours}h limite.
              </div>
              {willExceed ? (
                <div className="text-amber-400/90 mt-0.5">
                  Aviso: Com este envio ({hours}h), a soma ({currentCategoryHours + hours}h) excederá o teto da categoria ({maxCategoryHours}h). Apenas o teto regulamentar será aproveitado no cômputo final.
                </div>
              ) : (
                <div className="text-blue-300/80 mt-0.5">
                  Esta categoria comporta até mais {maxCategoryHours - currentCategoryHours} horas complementares válidas.
                </div>
              )}
            </div>
          </div>

          {/* Emissor e Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Instituição / Emissor <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={issuer}
                onChange={e => setIssuer(e.target.value)}
                placeholder="Ex: Coursera, SENAI, UFSCar, USP"
                className="w-full bg-[#181a20] border border-zinc-700/80 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Data de Conclusão <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                required
                value={completionDate}
                onChange={e => setCompletionDate(e.target.value)}
                className="w-full bg-[#181a20] border border-zinc-700/80 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Descrição Sumária da Atividade
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Descreva brevemente o conteúdo programático ou sua atuação no evento..."
              className="w-full bg-[#181a20] border border-zinc-700/80 rounded-lg px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Anexo de Arquivo */}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Comprovante Digital (PDF ou Imagem)
            </label>
            <div className="border-2 border-dashed border-zinc-700 hover:border-emerald-500/80 rounded-xl p-4 text-center transition-colors relative cursor-pointer bg-[#14161d]">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload className="w-6 h-6 text-zinc-400 mx-auto mb-1.5" />
              {fileName ? (
                <div className="text-xs text-emerald-400 font-medium">
                  {fileName} ({fileSize})
                </div>
              ) : (
                <>
                  <div className="text-xs text-zinc-300 font-medium">
                    Clique para selecionar ou arraste o arquivo PDF/JPG aqui
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">
                    Certificado legível com carga horária e código verificador (Máx. 15MB)
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Rodapé e Ações */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-zinc-950 rounded-lg shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              Enviar para Homologação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
