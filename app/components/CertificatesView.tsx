'use client';

import React, { useState } from 'react';
import { useAppState } from '../context/AppStateContext';
import { CATEGORY_RULES, UFSCAR_FAQ } from '../data/mockData';
import { CategoryBadge, StatusBadge } from './Badges';
import { Modal } from './Modal';
import {
  FileText,
  Trash2,
  Search,
  Filter,
  Eye,
  Plus,
  FileCheck,
  QrCode,
  Check,
  Copy,
  HelpCircle,
  History,
  ShieldCheck
} from 'lucide-react';

interface CertificatesViewProps {
  onOpenAddModal: () => void;
}

export const CertificatesView: React.FC<CertificatesViewProps> = ({ onOpenAddModal }) => {
  const { certificates, deleteCertificate } = useAppState();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [previewCert, setPreviewCert] = useState<any | null>(null);
  const [copiedHash, setCopiedHash] = useState(false);

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

  const copyVerificationHash = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#8b0000] dark:text-red-400" />
            Gestão de Certificados e Comprovantes
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Listagem analítica de atividades submetidas para aproveitamento de horas.
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
            <option value="rejected">Indeferidos</option>
          </select>
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
            Ajuste os filtros de pesquisa ou utilize o botão acima para cadastrar um novo comprovante.
          </p>
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
                          onClick={() => setPreviewCert(cert)}
                          className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold flex items-center gap-1"
                          title="Detalhar registro"
                        >
                          <Eye className="w-3.5 h-3.5" /> Detalhes
                        </button>
                        {cert.status === 'draft' && (
                          <button
                            onClick={() => handleDelete(cert.id, cert.title)}
                            className="p-1 rounded text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* Certificate Verification & Detail Modal */}
      {previewCert && (
        <Modal
          isOpen={!!previewCert}
          onClose={() => setPreviewCert(null)}
          title="Ficha Analítica do Registro"
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs text-slate-800 dark:text-slate-200">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Atividade / Documento</span>
              <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{previewCert.title}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Instituição Emissora</span>
                <p className="font-semibold">{previewCert.issuer}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Carga Horária Registrada</span>
                <p className="font-mono font-bold text-[#8b0000] dark:text-red-400">{previewCert.hoursRequested}h</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Modalidade</span>
                <CategoryBadge categoryId={previewCert.categoryId} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Status de Deferimento</span>
                <StatusBadge status={previewCert.status} />
              </div>
            </div>

            {/* Digital Hash box */}
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md border border-slate-300 dark:border-slate-700 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">
                  Autenticação Digital SIGA/UFSCar
                </span>
                <code className="text-xs font-mono font-bold text-[#8b0000] dark:text-red-300">
                  {previewCert.verificationCode || 'UFSCAR-2024-VER-10923'}
                </code>
              </div>
              <button
                onClick={() => copyVerificationHash(previewCert.verificationCode || 'UFSCAR-2024-VER-10923')}
                className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-[11px] font-semibold flex items-center gap-1 border border-slate-300 dark:border-slate-600"
              >
                {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copiar Hash</span>
              </button>
            </div>

            {previewCert.feedback && (
              <div className="p-2.5 bg-red-50 dark:bg-red-950/40 rounded-md border border-red-200 dark:border-red-900">
                <span className="text-[10px] font-bold text-red-900 dark:text-red-200 uppercase block">Despacho / Observações do Avaliador:</span>
                <p className="text-xs mt-0.5 text-slate-800 dark:text-slate-200 font-mono">{previewCert.feedback}</p>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => setPreviewCert(null)}
                className="w-full bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-semibold py-1.5 rounded-sm text-xs"
              >
                Fechar Ficha
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
