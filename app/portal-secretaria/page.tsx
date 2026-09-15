"use client";

import React, { useState, useMemo } from "react";
import Header from "../../components/Header";
import { useHours } from "../../context/HoursContext";
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Check, 
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  ExternalLink,
  Filter,
  FileCheck,
  RotateCcw
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Certificate } from "../../lib/types";

export default function PortalSecretaria() {
  const router = useRouter();
  const { 
    certificates, 
    setReviewingCertificate, 
    setCurrentStudentByRa, 
    addToast,
    resetDemoData
  } = useHours();

  const [activeTab, setActiveTab] = useState<"pendentes" | "aprovadas" | "indeferidas">("pendentes");
  const [searchQuery, setSearchQuery] = useState("");

  // Split certificates by status
  const pendingCerts = useMemo(() => certificates.filter(c => c.status === "PENDENTE"), [certificates]);
  const approvedCerts = useMemo(() => certificates.filter(c => c.status === "APROVADO"), [certificates]);
  const rejectedCerts = useMemo(() => certificates.filter(c => c.status === "INDEFERIDO"), [certificates]);

  // Active list based on selected tab
  const activeList = useMemo(() => {
    let list: Certificate[] = [];
    if (activeTab === "pendentes") list = pendingCerts;
    else if (activeTab === "aprovadas") list = approvedCerts;
    else list = rejectedCerts;

    if (!searchQuery.trim()) return list;

    const query = searchQuery.toLowerCase();
    return list.filter(item =>
      item.studentName.toLowerCase().includes(query) ||
      item.title.toLowerCase().includes(query) ||
      item.studentRa.includes(query) ||
      item.issuer.toLowerCase().includes(query)
    );
  }, [activeTab, pendingCerts, approvedCerts, rejectedCerts, searchQuery]);

  // Unique pending students count
  const pendingStudentsCount = new Set(pendingCerts.map(c => c.studentRa)).size;

  const handleOpenReview = (cert: Certificate) => {
    setReviewingCertificate(cert);
    addToast(`Abrindo comprovante de ${cert.studentName} para validação...`, 'info');
  };

  const handleNavigateToStudent = (studentRa: string) => {
    setCurrentStudentByRa(studentRa);
    router.push('/painel-validacao-docente');
  };

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-zinc-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Header Title Row matching Figma */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Portal Administrativo — Divisão de Triagem da Secretaria Acadêmica
            </h1>
            <span className="bg-blue-600/90 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
              Modo Secretariado
            </span>
          </div>
          <div className="text-xs text-zinc-400 flex items-center gap-3">
            <span>Sessão iniciada como: <strong className="text-zinc-200">SGA_UFSCar</strong></span>
            <button
              onClick={resetDemoData}
              className="text-zinc-500 hover:text-zinc-300 flex items-center gap-1 text-[11px] hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Demo
            </button>
          </div>
        </div>

        {/* 4 KPI Stat Cards matching Figma (Dynamically calculated!) */}
        <section aria-label="Métricas da Secretaria" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Solicitações Pendentes */}
          <div className="bg-[#111317] border border-zinc-800/80 rounded-2xl p-5 shadow-sm">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Solicitações Pendentes
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-400 tracking-tight">
              {pendingStudentsCount} Alunos <span className="text-xs text-zinc-400 font-normal">({pendingCerts.length} certs)</span>
            </div>
            <div className="text-xs text-zinc-400 mt-2">
              Aguardando validação inicial
            </div>
          </div>

          {/* Card 2: Aprovadas Hoje */}
          <div className="bg-[#111317] border border-zinc-800/80 rounded-2xl p-5 shadow-sm">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Aprovadas Hoje
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 tracking-tight">
              {approvedCerts.length} Certificados
            </div>
            <div className="text-xs text-zinc-400 mt-2">
              Arquivados no prontuário
            </div>
          </div>

          {/* Card 3: Indeferidas Hoje */}
          <div className="bg-[#111317] border border-zinc-800/80 rounded-2xl p-5 shadow-sm">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Indeferidas Hoje
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-rose-500 tracking-tight">
              {rejectedCerts.length} Casos
            </div>
            <div className="text-xs text-zinc-400 mt-2">
              Notificações enviadas
            </div>
          </div>

          {/* Card 4: Alunos Ativos no Curso */}
          <div className="bg-[#111317] border border-zinc-800/80 rounded-2xl p-5 shadow-sm">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Alunos Ativos no Curso
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              287 Estudantes
            </div>
            <div className="text-xs text-zinc-400 mt-2">
              Prontuários eletrônicos
            </div>
          </div>

        </section>

        {/* Fila Geral de Triagem Table Container matching Figma */}
        <section aria-labelledby="triage-title" className="bg-[#111317] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-sm">
          
          {/* Table Header Row & Filter Pills */}
          <div className="p-4 sm:p-5 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 id="triage-title" className="text-sm font-bold text-white tracking-tight">
                Fila Geral de Triagem (Homologação de Certificados)
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Clique em <strong className="text-blue-400">Revisar</strong> para abrir o comprovante e homologar ou indeferir as horas.
              </p>
            </div>

            {/* Status Pills */}
            <div className="flex items-center bg-[#181a20] p-1 rounded-xl border border-zinc-800 text-xs">
              <button
                onClick={() => setActiveTab("pendentes")}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  activeTab === "pendentes"
                    ? "bg-[#272b36] text-white shadow-xs font-semibold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Pendentes ({pendingCerts.length})
              </button>
              <button
                onClick={() => setActiveTab("aprovadas")}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  activeTab === "aprovadas"
                    ? "bg-[#272b36] text-white shadow-xs font-semibold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Aprovadas ({approvedCerts.length})
              </button>
              <button
                onClick={() => setActiveTab("indeferidas")}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  activeTab === "indeferidas"
                    ? "bg-[#272b36] text-white shadow-xs font-semibold"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Indeferidos ({rejectedCerts.length})
              </button>
            </div>
          </div>

          {/* Search Filter Bar */}
          <div className="px-4 py-3 bg-[#14161d] border-b border-zinc-800 flex items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filtrar por aluno, RA, emissor ou título..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#181a20] border border-zinc-700/70 rounded-lg pl-8 pr-3 py-1.5 text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            <span className="text-zinc-400 text-[11px]">
              Exibindo <strong>{activeList.length}</strong> itens
            </span>
          </div>

          {/* Table content matching Figma */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-800/80 text-zinc-400 font-semibold bg-[#14161d]">
                  <th className="py-3.5 px-4">Estudante / RA</th>
                  <th className="py-3.5 px-4">Título do Certificado</th>
                  <th className="py-3.5 px-4">Categoria</th>
                  <th className="py-3.5 px-4">Horas Solicitadas</th>
                  <th className="py-3.5 px-4">Data Envio</th>
                  <th className="py-3.5 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {activeList.length > 0 ? (
                  activeList.map((cert) => {
                    const initials = cert.studentName.split(' ').map(n => n[0]).slice(0, 2).join('');
                    return (
                      <tr key={cert.id} className="hover:bg-[#161820] transition-colors">
                        
                        {/* Estudante / RA with Avatar */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-zinc-300 text-xs">
                              {initials}
                            </div>
                            <div>
                              <button
                                onClick={() => handleNavigateToStudent(cert.studentRa)}
                                className="font-semibold text-white hover:text-blue-400 text-left transition-colors cursor-pointer"
                                title="Abrir prontuário completo"
                              >
                                {cert.studentName}
                              </button>
                              <div className="text-[11px] text-zinc-500 font-mono">
                                RA: {cert.studentRa}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Título do Certificado */}
                        <td className="py-4 px-4 font-semibold text-zinc-200 max-w-xs">
                          <button
                            onClick={() => handleOpenReview(cert)}
                            className="hover:text-emerald-400 text-left transition-colors cursor-pointer"
                          >
                            {cert.title}
                          </button>
                          <div className="text-[11px] text-zinc-500 font-normal">
                            {cert.issuer}
                          </div>
                        </td>

                        {/* Categoria */}
                        <td className="py-4 px-4 text-zinc-300">
                          {cert.category === 'Ensino' ? 'Ensino & Cursos' : cert.category}
                        </td>

                        {/* Horas Solicitadas */}
                        <td className="py-4 px-4 font-bold text-zinc-200">
                          {cert.hours}h
                        </td>

                        {/* Data Envio */}
                        <td className="py-4 px-4 text-zinc-400">
                          {cert.submissionDate}
                        </td>

                        {/* Ações: [✓ Revisar] button */}
                        <td className="py-4 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenReview(cert)}
                              className={`text-xs font-semibold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
                                cert.status === 'PENDENTE'
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                  : cert.status === 'APROVADO'
                                  ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-400'
                                  : 'bg-rose-950 border border-rose-500/50 text-rose-400'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              {cert.status === 'PENDENTE' ? 'Revisar' : 'Ver Parecer'}
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-zinc-500">
                      Nenhum processo encontrado na aba selecionada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
            <div>
              Mostrando {activeList.length} processos de análise acadêmica
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/painel-validacao-docente"
                className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
              >
                Ir para o Painel de Homologação Docente <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </section>

      </main>
    </div>
  );
}
