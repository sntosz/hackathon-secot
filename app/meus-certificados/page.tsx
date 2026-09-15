"use client";

import React, { useState, useMemo } from "react";
import Header from "../../components/Header";
import { useHours } from "../../context/HoursContext";
import { Certificate, CertificateStatus, ActivityCategory } from "../../lib/types";
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Eye, 
  Download, 
  Edit3, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";

export default function MeusCertificados() {
  const { certificates, setIsAddModalOpen, setSelectedCertificateForModal } = useHours();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [selectedStatus, setSelectedStatus] = useState<string>("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter logic
  const filteredCertificates = useMemo(() => {
    return certificates.filter(cert => {
      const matchesSearch = 
        cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === "Todas" || 
        cert.category === selectedCategory ||
        (selectedCategory === "Ensino & Cursos" && cert.category === "Ensino");

      const matchesStatus = 
        selectedStatus === "Todos" || 
        cert.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [certificates, searchQuery, selectedCategory, selectedStatus]);

  const totalPages = Math.ceil(filteredCertificates.length / itemsPerPage) || 1;
  const paginatedCertificates = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCertificates.slice(start, start + itemsPerPage);
  }, [filteredCertificates, currentPage]);

  const renderStatusBadge = (status: CertificateStatus) => {
    switch (status) {
      case "APROVADO":
        return (
          <span className="bg-[#0f2e1e] border border-emerald-500/40 text-emerald-400 text-[11px] font-bold px-2.5 py-1 rounded-md inline-flex items-center gap-1">
            APROVADO
          </span>
        );
      case "PENDENTE":
        return (
          <span className="bg-[#2f220a] border border-amber-500/40 text-amber-400 text-[11px] font-bold px-2.5 py-1 rounded-md inline-flex items-center gap-1">
            PENDENTE
          </span>
        );
      case "INDEFERIDO":
        return (
          <span className="bg-[#311116] border border-rose-500/40 text-rose-400 text-[11px] font-bold px-2.5 py-1 rounded-md inline-flex items-center gap-1">
            INDEFERIDO
          </span>
        );
      case "RASCUNHO":
      default:
        return (
          <span className="bg-[#1c1f26] border border-zinc-700 text-zinc-400 text-[11px] font-bold px-2.5 py-1 rounded-md inline-flex items-center gap-1">
            RASCUNHO
          </span>
        );
    }
  };

  const renderActionButton = (cert: Certificate) => {
    if (cert.status === "APROVADO") {
      return (
        <button
          onClick={() => setSelectedCertificateForModal(cert)}
          className="px-3 py-1 bg-[#181a21] hover:bg-[#232732] border border-zinc-700/80 text-zinc-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
        >
          Recibo
        </button>
      );
    }
    if (cert.status === "INDEFERIDO") {
      return (
        <button
          onClick={() => setSelectedCertificateForModal(cert)}
          className="px-3 py-1 bg-[#2b1418] hover:bg-[#3d1a20] border border-rose-800/60 text-rose-300 text-xs font-medium rounded-lg transition-colors cursor-pointer"
        >
          Corrigir
        </button>
      );
    }
    if (cert.status === "RASCUNHO") {
      return (
        <button
          onClick={() => setSelectedCertificateForModal(cert)}
          className="px-3 py-1 bg-[#181a21] hover:bg-[#232732] border border-zinc-700/80 text-zinc-300 text-xs font-medium rounded-lg transition-colors cursor-pointer"
        >
          Editar
        </button>
      );
    }
    // Pendente
    return (
      <button
        onClick={() => setSelectedCertificateForModal(cert)}
        className="px-3 py-1 bg-[#181a21] hover:bg-[#232732] border border-zinc-700/80 text-zinc-200 text-xs font-medium rounded-lg transition-colors cursor-pointer"
      >
        Ver
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-zinc-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Title & Action Row matching Figma */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Meus Certificados Enviados
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Consulte a situação das suas submissões para homologação de horas extracurriculares
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Adicionar Certificado
          </button>
        </div>

        {/* Filters Bar matching Figma */}
        <div className="bg-[#111317] border border-zinc-800/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por título, emissor..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#181a20] border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5">
              <select
                value={selectedCategory}
                onChange={e => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-[#181a20] border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-zinc-600 cursor-pointer"
              >
                <option value="Todas">Categoria: Todas</option>
                <option value="Ensino">Ensino & Cursos</option>
                <option value="Extensão">Extensão</option>
                <option value="Pesquisa">Pesquisa</option>
                <option value="Gestão & Representação">Gestão & Representação</option>
                <option value="Cultura, Esporte & Integração">Cultura & Esporte</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <select
                value={selectedStatus}
                onChange={e => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-[#181a20] border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-zinc-600 cursor-pointer"
              >
                <option value="Todos">Situação: Todos</option>
                <option value="APROVADO">Aprovado</option>
                <option value="PENDENTE">Pendente</option>
                <option value="INDEFERIDO">Indeferido</option>
                <option value="RASCUNHO">Rascunho</option>
              </select>
            </div>
          </div>

          <div className="text-xs text-zinc-400 font-medium">
            Total: <strong className="text-zinc-200">{filteredCertificates.length}</strong> certificados cadastrados
          </div>
        </div>

        {/* Table Container matching Figma */}
        <div className="bg-[#111317] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-800/80 text-zinc-400 font-semibold bg-[#14161d]">
                  <th className="py-3.5 px-4">Título do Certificado</th>
                  <th className="py-3.5 px-4">Categoria</th>
                  <th className="py-3.5 px-4">Emissor</th>
                  <th className="py-3.5 px-4">Data Envio</th>
                  <th className="py-3.5 px-4">Horas</th>
                  <th className="py-3.5 px-4">Situação</th>
                  <th className="py-3.5 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {paginatedCertificates.length > 0 ? (
                  paginatedCertificates.map((cert) => (
                    <tr key={cert.id} className="hover:bg-[#161820] transition-colors">
                      {/* Título */}
                      <td className="py-4 px-4 font-semibold text-white max-w-xs">
                        <button
                          onClick={() => setSelectedCertificateForModal(cert)}
                          className="hover:text-emerald-400 text-left transition-colors cursor-pointer"
                        >
                          {cert.title}
                        </button>
                      </td>

                      {/* Categoria */}
                      <td className="py-4 px-4 text-zinc-300">
                        {cert.category === 'Ensino' ? 'Ensino & Cursos' : cert.category}
                      </td>

                      {/* Emissor */}
                      <td className="py-4 px-4 text-zinc-400">
                        {cert.issuer}
                      </td>

                      {/* Data Envio */}
                      <td className="py-4 px-4 text-zinc-400">
                        {cert.submissionDate === 'Rascunho' ? '--/--/----' : cert.submissionDate}
                      </td>

                      {/* Horas */}
                      <td className="py-4 px-4 font-bold text-zinc-200">
                        {cert.hours}h
                      </td>

                      {/* Situação */}
                      <td className="py-4 px-4">
                        {renderStatusBadge(cert.status)}
                      </td>

                      {/* Ações */}
                      <td className="py-4 px-4 text-center">
                        {renderActionButton(cert)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-zinc-500">
                      Nenhum certificado encontrado para os filtros selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer matching Figma */}
          <div className="p-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
            <div>
              Mostrando {Math.min(filteredCertificates.length, (currentPage - 1) * itemsPerPage + 1)}-
              {Math.min(filteredCertificates.length, currentPage * itemsPerPage)} de {filteredCertificates.length} certificados homologados ou salvos
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-[#181a20] hover:bg-[#20232c] border border-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-zinc-300 transition-colors"
              >
                Anterior
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                    currentPage === pageNum
                      ? 'bg-zinc-700 text-white'
                      : 'bg-[#181a20] border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 bg-[#181a20] hover:bg-[#20232c] border border-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-zinc-300 transition-colors"
              >
                Próxima
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
