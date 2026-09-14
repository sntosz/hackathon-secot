'use client';

import React, { useState } from 'react';
import { useAppState } from '../context/AppStateContext';
import { CATEGORY_RULES } from '../data/mockData';
import { CategoryBadge, StatusBadge } from './Badges';
import { Certificate } from '../types';
import { ActivityDetailsModal } from './ActivityDetailsModal';
import { EditCertificateModal } from './EditCertificateModal';
import {
  FileText,
  Trash2,
  Search,
  Filter,
  Eye,
  Plus,
  FileCheck,
  Edit3,
  RotateCcw
} from 'lucide-react';

interface CertificatesViewProps {
  onOpenAddModal: () => void;
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({ onOpenAddModal }) => {
  const { certificates, deleteCertificate } = useAppState();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const [selectedCertForDetails, setSelectedCertForDetails] = useState<Certificate | null>(null);
  const [selectedCertForEdit, setSelectedCertForEdit] = useState<Certificate | null>(null);
  const [deleteConfirmId, setDeleteCertForDelete] = useState<{ id: string; title: string } | null>(null);

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cert.tags && cert.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory = selectedCategory === 'all' || cert.categoryId === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || cert.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const confirmDelete = () => {
    if (deleteConfirmId) {
      deleteCertificate(deleteConfirmId.id);
      setDeleteCertForDelete(null);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStatus('all');
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#8b0000] dark:text-red-400" />
            Gestão Analítica de Certificados e Comprovantes
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cadastre, edite, audite e consulte suas atividades complementares de graduação.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="bg-[#8b0000] hover:bg-[#700000] text-white font-semibold px-3 py-1.5 rounded-sm text-xs flex items-center justify-center gap-1.5 border border-red-900 shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 text-amber-300" /> Cadastrar Certificado
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-md p-3 flex flex-col md:flex-row items-center gap-3">

        <div className="relative flex-1 w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filtrar por título, emissor ou palavra-chave..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-sm text-xs focus:ring-1 focus:ring-slate-500 text-slate-900 dark:text-slate-100 font-medium"
            aria-label="Buscar certificados"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-auto px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-sm text-xs text-slate-900 dark:text-slate-100 font-semibold"
            aria-label="Filtrar por categoria"
          >
            <option value="all">Todas as Categorias</option>
            {Object.values(CATEGORY_RULES).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full md:w-auto px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-sm text-xs text-slate-900 dark:text-slate-100 font-semibold"
            aria-label="Filtrar por status"
          >
            <option value="all">Todos os Status</option>
            <option value="approved">Aprovados</option>
            <option value="submitted">Em Análise</option>
            <option value="draft">Rascunhos</option>
            <option value="needs_info">Pendente Correção</option>
            <option value="rejected">Indeferidos</option>
          </select>

          {(searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all') && (
            <button
              onClick={clearFilters}
              className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
              title="Limpar Filtros"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* Table of Certificates */}
      {filteredCertificates.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-md p-8 text-center space-y-2">
          <FileCheck className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Nenhum registro encontrado
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Não foram encontrados certificados correspondentes aos critérios de busca selecionados.
          </p>
          <button
            onClick={clearFilters}
            className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-sm text-xs font-semibold border border-slate-300 dark:border-slate-700 mt-2"
          >
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wide">
                <tr>
                  <th className="py-2.5 px-3">Título da Atividade</th>
                  <th className="py-2.5 px-3">Instituição Emissora</th>
                  <th className="py-2.5 px-3">Modalidade</th>
                  <th className="py-2.5 px-3 text-center">Data Emissão</th>
                  <th className="py-2.5 px-3 text-right">Horas</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredCertificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900 dark:text-slate-100">
                        {cert.title}
                      </div>
                      {cert.tags && cert.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {cert.tags.map((tag) => (
                            <span key={tag} className="text-[10px] text-slate-500 font-mono">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 font-medium">
                      {cert.issuer}
                    </td>
                    <td className="py-2.5 px-3">
                      <CategoryBadge categoryId={cert.categoryId} />
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-600 dark:text-slate-400">
                      {cert.issueDate}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#8b0000] dark:text-red-400">
                      {cert.hoursRequested}h
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <StatusBadge status={cert.status} />
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setSelectedCertForDetails(cert)}
                          className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold flex items-center gap-1"
                          title="Detalhes do registro"
                        >
                          <Eye className="w-3.5 h-3.5" /> Detalhes
                        </button>

                        {(cert.status === 'draft' || cert.status === 'needs_info') && (
                          <>
                            <button
                              onClick={() => setSelectedCertForEdit(cert)}
                              className="p-1 rounded text-slate-600 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="Editar Atividade"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => setDeleteCertForDelete({ id: cert.id, title: cert.title })}
                              className="p-1 rounded text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                              title="Excluir Registro"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Activity Details Modal */}
      <ActivityDetailsModal
        isOpen={!!selectedCertForDetails}
        onClose={() => setSelectedCertForDetails(null)}
        certificate={selectedCertForDetails}
      />

      {/* Edit Activity Modal */}
      <EditCertificateModal
        isOpen={!!selectedCertForEdit}
        onClose={() => setSelectedCertForEdit(null)}
        certificate={selectedCertForEdit}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 no-print">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-xl p-4 max-w-sm w-full space-y-3 text-xs">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide">
              Confirmar Exclusão de Atividade
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Tem certeza que deseja excluir permanentemente o registro <strong>"{deleteConfirmId.title}"</strong>?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setDeleteCertForDelete(null)}
                className="px-3 py-1.5 rounded-sm text-slate-700 dark:text-slate-300 font-semibold"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-semibold rounded-sm"
              >
                Excluir Registro
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
