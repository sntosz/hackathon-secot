"use client";

import React, { useState, useMemo } from "react";
import Header from "../../components/Header";
import { useHours } from "../../context/HoursContext";
import { Certificate, CertificateStatus } from "../../lib/types";
import { Plus, Search } from "lucide-react";

export default function MeusCertificados() {
  const { certificates, setIsAddModalOpen, setSelectedCertificateForModal, activeRole } = useHours();
  const isStudentMode = activeRole === 'student';

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");
  const [selectedStatus, setSelectedStatus] = useState<string>("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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
          <span className="inline-flex items-center gap-1 rounded-sm border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-emerald-300">
            Aprovado
          </span>
        );
      case "PENDENTE":
        return (
          <span className="inline-flex items-center gap-1 rounded-sm border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-amber-300">
            Pendente
          </span>
        );
      case "INDEFERIDO":
        return (
          <span className="inline-flex items-center gap-1 rounded-sm border border-rose-500/30 bg-rose-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-rose-300">
            Indeferido
          </span>
        );
      case "RASCUNHO":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-sm border border-zinc-700 bg-zinc-900 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-zinc-400">
            Rascunho
          </span>
        );
    }
  };

  const renderActionButton = (cert: Certificate) => {
    if (!isStudentMode) {
      return (
        <span className="rounded-md border border-zinc-700 bg-zinc-900/60 px-3 py-1.5 text-[11px] font-medium text-zinc-500">
          Somente aluno
        </span>
      );
    }

    if (cert.status === "APROVADO") {
      return (
        <button onClick={() => setSelectedCertificateForModal(cert)} className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-[11px] font-medium text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800">
          Recibo
        </button>
      );
    }
    if (cert.status === "INDEFERIDO") {
      return (
        <button onClick={() => setSelectedCertificateForModal(cert)} className="rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-[11px] font-medium text-rose-200 hover:border-rose-400/40 hover:bg-rose-500/15">
          Corrigir
        </button>
      );
    }
    if (cert.status === "RASCUNHO") {
      return (
        <button onClick={() => setSelectedCertificateForModal(cert)} className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-[11px] font-medium text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800">
          Editar
        </button>
      );
    }

    return (
      <button onClick={() => setSelectedCertificateForModal(cert)} className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-[11px] font-medium text-zinc-200 hover:border-zinc-600 hover:bg-zinc-800">
        Ver
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0b0d] text-zinc-100">
      <Header />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-[-0.03em] text-white sm:text-2xl">
              Meus Certificados Enviados
            </h1>
            <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
              Consulte a situação das suas submissões para homologação de horas extracurriculares
            </p>
          </div>

          {isStudentMode ? (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-[11px] font-semibold text-zinc-950 transition-colors hover:bg-emerald-400"
            >
              <Plus className="h-4 w-4" />
              Adicionar Certificado
            </button>
          ) : (
            <div className="rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-[11px] font-medium text-zinc-400">
              Modo Secretaria — ações do aluno desativadas
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border border-zinc-800 bg-[#111317] p-4">
          <div className="flex min-w-[280px] flex-1 flex-wrap items-center gap-3">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar por título, emissor..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full border border-zinc-800 bg-zinc-950/60 py-2 pl-9 pr-3 text-xs text-white placeholder-zinc-500 focus:border-zinc-600 focus:outline-none"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={e => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="cursor-pointer border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-xs text-zinc-300 focus:border-zinc-600 focus:outline-none"
            >
              <option value="Todas">Categoria: Todas</option>
              <option value="Ensino">Ensino & Cursos</option>
              <option value="Extensão">Extensão</option>
              <option value="Pesquisa">Pesquisa</option>
              <option value="Gestão & Representação">Gestão & Representação</option>
              <option value="Cultura, Esporte & Integração">Cultura & Esporte</option>
            </select>

            <select
              value={selectedStatus}
              onChange={e => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="cursor-pointer border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-xs text-zinc-300 focus:border-zinc-600 focus:outline-none"
            >
              <option value="Todos">Situação: Todos</option>
              <option value="APROVADO">Aprovado</option>
              <option value="PENDENTE">Pendente</option>
              <option value="INDEFERIDO">Indeferido</option>
              <option value="RASCUNHO">Rascunho</option>
            </select>
          </div>

          <div className="text-xs text-zinc-400">
            Total: <span className="font-medium text-zinc-200">{filteredCertificates.length}</span> certificados cadastrados
          </div>
        </div>

        <div className="overflow-hidden border border-zinc-800 bg-[#111317]">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/60 text-zinc-400">
                  <th className="px-4 py-3.5 font-medium">Título do Certificado</th>
                  <th className="px-4 py-3.5 font-medium">Categoria</th>
                  <th className="px-4 py-3.5 font-medium">Emissor</th>
                  <th className="px-4 py-3.5 font-medium">Data Envio</th>
                  <th className="px-4 py-3.5 font-medium">Horas</th>
                  <th className="px-4 py-3.5 font-medium">Situação</th>
                  <th className="px-4 py-3.5 text-center font-medium">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {paginatedCertificates.length > 0 ? (
                  paginatedCertificates.map((cert) => (
                    <tr key={cert.id} className="transition-colors hover:bg-zinc-950/40">
                      <td className="max-w-xs px-4 py-4 font-medium text-white">
                        <button onClick={() => setSelectedCertificateForModal(cert)} className="text-left text-white hover:text-emerald-300">
                          {cert.title}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-zinc-300">
                        {cert.category === "Ensino" ? "Ensino & Cursos" : cert.category}
                      </td>
                      <td className="px-4 py-4 text-zinc-400">{cert.issuer}</td>
                      <td className="px-4 py-4 text-zinc-400">{cert.submissionDate === "Rascunho" ? "--/--/----" : cert.submissionDate}</td>
                      <td className="px-4 py-4 font-medium text-zinc-200">{cert.hours}h</td>
                      <td className="px-4 py-4">{renderStatusBadge(cert.status)}</td>
                      <td className="px-4 py-4 text-center">{renderActionButton(cert)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-zinc-500">
                      Nenhum certificado encontrado com os filtros atuais.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border border-zinc-800 bg-[#111317] p-3">
          <div className="text-xs text-zinc-400">
            Página {currentPage} de {totalPages}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-1.5 text-xs font-medium text-zinc-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-1.5 text-xs font-medium text-zinc-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
