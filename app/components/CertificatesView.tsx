'use client';

import React, { useState } from 'react';
import { useAppState } from '../context/AppStateContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { CATEGORY_RULES } from '../data/mockData';
import { CategoryId, Certificate } from '../types';
import { CategoryBadge, StatusBadge } from './Badges';
import {
  FileText,
  UploadCloud,
  Sparkles,
  Trash2,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Eye,
  Plus,
  FileCheck,
  AlertCircle
} from 'lucide-react';

interface CertificatesViewProps {
  onOpenAddModal: () => void;
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({ onOpenAddModal }) => {
  const { certificates, deleteCertificate } = useAppState();
  const { announce } = useAccessibility();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);

  // Filtering
  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cert.tags && cert.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory = selectedCategory === 'all' || cert.categoryId === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || cert.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Tem certeza que deseja excluir o certificado "${title}"?`)) {
      deleteCertificate(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Gestão de Certificados e Atividades
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Cadastre, categorize e organize suas comprovantes para homologação.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-105 active:scale-95 focus:ring-2 focus:ring-emerald-500"
        >
          <Plus className="w-4 h-4" /> Novo Certificado
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center gap-4">

        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, emissor ou tag (ex: SeCoT, Hackathon)..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100"
            aria-label="Buscar certificados"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:inline" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-auto px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
            aria-label="Filtrar por categoria"
          >
            <option value="all">Todas as Categorias</option>
            {Object.values(CATEGORY_RULES).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full md:w-auto px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
            aria-label="Filtrar por status"
          >
            <option value="all">Todos os Status</option>
            <option value="approved">Aprovados</option>
            <option value="submitted">Em Análise</option>
            <option value="draft">Rascunhos</option>
            <option value="rejected">Indeferidos</option>
          </select>
        </div>

      </div>

      {/* Certificate Cards Grid */}
      {filteredCertificates.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <FileCheck className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            Nenhum certificado encontrado
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Tente ajustar os filtros de busca ou cadastre um novo comprovante para começar a organizar suas horas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCertificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">

                {/* Top bar badges */}
                <div className="flex items-center justify-between gap-2">
                  <CategoryBadge categoryId={cert.categoryId} />
                  <StatusBadge status={cert.status} />
                </div>

                {/* Title */}
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-snug line-clamp-2">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Emissor: <span className="font-semibold">{cert.issuer}</span>
                  </p>
                </div>

                {/* Tags */}
                {cert.tags && cert.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {cert.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom details & Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Carga Horária</span>
                  <span className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400">
                    {cert.hoursRequested}h
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPreviewCert(cert)}
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-emerald-500"
                    title="Visualizar Detalhes do Certificado"
                    aria-label={`Visualizar detalhes do certificado ${cert.title}`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {cert.status === 'draft' && (
                    <button
                      onClick={() => handleDelete(cert.id, cert.title)}
                      className="p-2 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors focus:ring-2 focus:ring-rose-500"
                      title="Excluir Certificado"
                      aria-label={`Excluir certificado ${cert.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Preview Certificate Details Drawer/Modal */}
      {previewCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs no-print">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">
                Detalhes do Comprovante
              </h3>
              <button
                onClick={() => setPreviewCert(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕ Fechar
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
              <div>
                <span className="text-xs text-slate-400 block font-semibold uppercase">Título da Atividade</span>
                <p className="font-bold text-slate-900 dark:text-white text-base mt-0.5">{previewCert.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-slate-400 block font-semibold uppercase">Instituição / Emissor</span>
                  <p className="font-semibold">{previewCert.issuer}</p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-semibold uppercase">Carga Horária</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">{previewCert.hoursRequested} horas</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-xs text-slate-400 block font-semibold uppercase">Categoria</span>
                  <CategoryBadge categoryId={previewCert.categoryId} />
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-semibold uppercase">Status no Sistema</span>
                  <StatusBadge status={previewCert.status} />
                </div>
              </div>

              {previewCert.feedback && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="text-xs font-bold text-slate-500 block">Observação / Parecer da Secretaria:</span>
                  <p className="text-xs mt-1 text-slate-700 dark:text-slate-300">{previewCert.feedback}</p>
                </div>
              )}

              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                  <div>
                    <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">{previewCert.fileName || 'certificado.pdf'}</p>
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-400">{previewCert.fileSize || '1.2 MB'} • Documento Anexo</p>
                  </div>
                </div>
                <span className="text-xs bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded font-medium">
                  Validado
                </span>
              </div>
            </div>

            <button
              onClick={() => setPreviewCert(null)}
              className="w-full bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-sm"
            >
              Fechar Visualização
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
