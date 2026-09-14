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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#9e1b22] dark:text-red-400" />
            Gestão de Certificados e Atividades
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            Cadastre, categorize e acompanhe o status de homologação de seus comprovantes.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="bg-[#9e1b22] hover:bg-[#800000] text-white font-extrabold px-4 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-transform hover:scale-105 active:scale-95 focus:ring-2 focus:ring-amber-400"
        >
          <Plus className="w-4 h-4 text-amber-300" /> Novo Certificado
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center gap-4">

        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por título, instituição ou tags (ex: SeCoT, Hackathon)..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#9e1b22] text-slate-900 dark:text-slate-100 font-medium"
            aria-label="Buscar certificados"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:inline" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-auto px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-[#9e1b22]"
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
            className="w-full md:w-auto px-3 py-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-[#9e1b22]"
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

      {/* Grid of Certificates */}
      {filteredCertificates.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <FileCheck className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            Nenhum certificado encontrado
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Tente ajustar os filtros ou cadastre um novo comprovante para começar a contabilizar suas horas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCertificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <CategoryBadge categoryId={cert.categoryId} />
                  <StatusBadge status={cert.status} />
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base leading-snug line-clamp-2">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    Emissor: <span className="font-bold text-slate-800 dark:text-slate-200">{cert.issuer}</span>
                  </p>
                </div>

                {cert.tags && cert.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {cert.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-mono font-semibold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Carga Horária</span>
                  <span className="text-lg font-extrabold text-[#9e1b22] dark:text-red-400">
                    {cert.hoursRequested}h
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPreviewCert(cert)}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-amber-400"
                    title="Visualizar Comprovante & Código Hash UFSCar"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {cert.status === 'draft' && (
                    <button
                      onClick={() => handleDelete(cert.id, cert.title)}
                      className="p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors focus:ring-2 focus:ring-rose-500"
                      title="Excluir Certificado"
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

      {/* Certificate Verification & Detail Modal */}
      {previewCert && (
        <Modal
          isOpen={!!previewCert}
          onClose={() => setPreviewCert(null)}
          title="Ficha do Comprovante & Validação Digital"
          maxWidth="lg"
        >
          <div className="space-y-5 text-sm text-slate-800 dark:text-slate-200">
            <div>
              <span className="text-xs font-bold text-slate-400 block uppercase">Título da Atividade</span>
              <p className="font-extrabold text-slate-900 dark:text-white text-base mt-0.5">{previewCert.title}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-bold text-slate-400 block uppercase">Instituição Emissora</span>
                <p className="font-bold">{previewCert.issuer}</p>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block uppercase">Carga Horária</span>
                <p className="font-extrabold text-[#9e1b22] dark:text-red-400">{previewCert.hoursRequested} horas</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-bold text-slate-400 block uppercase">Categoria</span>
                <CategoryBadge categoryId={previewCert.categoryId} />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 block uppercase">Status de Validação</span>
                <StatusBadge status={previewCert.status} />
              </div>
            </div>

            {/* Digital Hash and QR Code box */}
            <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-4">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shrink-0">
                <QrCode className="w-12 h-12 text-[#9e1b22] dark:text-red-400" />
              </div>

              <div className="space-y-1 w-full">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">
                  Código de Autenticação Digital UFSCar
                </span>
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono font-bold bg-slate-200 dark:bg-slate-950 px-2 py-1 rounded text-[#9e1b22] dark:text-red-300">
                    {previewCert.verificationCode || 'UFSCAR-2024-VER-10923'}
                  </code>
                  <button
                    onClick={() => copyVerificationHash(previewCert.verificationCode || 'UFSCAR-2024-VER-10923')}
                    className="p-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-xs font-bold"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Validação autônoma para prevenção de fraudes.
                </p>
              </div>
            </div>

            {previewCert.feedback && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-800/80">
                <span className="text-xs font-bold text-red-900 dark:text-red-200 block">Parecer do Avaliador / Secretaria:</span>
                <p className="text-xs mt-1 text-slate-800 dark:text-slate-200">{previewCert.feedback}</p>
              </div>
            )}

            <button
              onClick={() => setPreviewCert(null)}
              className="w-full bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-extrabold py-2.5 rounded-xl text-sm"
            >
              Fechar Visualização
            </button>
          </div>
        </Modal>
      )}

    </div>
  );
};
