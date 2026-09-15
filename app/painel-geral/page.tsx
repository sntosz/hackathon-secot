"use client";

import React from "react";
import Header from "../../components/Header";
import { useHours } from "../../context/HoursContext";
import { 
  CheckCircle2, 
  Clock, 
  FileText, 
  AlertTriangle, 
  Plus, 
  Printer, 
  Info, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award
} from "lucide-react";
import Link from "next/link";

export default function PainelGeral() {
  const { student, categoryRules, certificates, setIsAddModalOpen, setSelectedCertificateForModal } = useHours();

  const approvedHours = student.approvedHours;
  const totalRequired = student.requiredHours;
  const remainingHours = Math.max(0, totalRequired - approvedHours);
  const completionPercentage = Math.min(100, Math.round((approvedHours / totalRequired) * 1000) / 10);

  const pendingCount = certificates.filter(c => c.status === "PENDENTE").length;
  const pendingHours = certificates.filter(c => c.status === "PENDENTE").reduce((sum, c) => sum + c.hours, 0);
  const rejectedCount = certificates.filter(c => c.status === "INDEFERIDO").length;
  const totalSent = certificates.length;

  const handlePrintSheet = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-zinc-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Banner / Hero Section matching Figma */}
        <section aria-labelledby="hero-title" className="bg-[#111317] border border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-md">
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/60 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <h1 id="hero-title" className="text-base sm:text-lg font-bold text-white tracking-tight">
                Área do Aluno • Painel de Controle de Horas Complementares
              </h1>
              <span className="bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                {student.status}
              </span>
            </div>
            <div className="text-xs text-zinc-400 font-medium">
              Ano Letivo: <strong className="text-zinc-200">2025</strong>
            </div>
          </div>

          {/* Student Profile Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-zinc-800/90 border border-zinc-700 flex items-center justify-center font-bold text-white text-base shadow-xs">
                {student.initials}
              </div>
              <div>
                <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>{student.name}</span>
                  <span className="text-xs text-zinc-400 font-normal">
                    (RA: {student.ra})
                  </span>
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">
                  {student.course} • {student.campus} • {student.pedagogicalProject}
                </div>
              </div>
            </div>

            {/* Top Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                Submeter Novo Certificado
              </button>

              <button
                onClick={handlePrintSheet}
                className="bg-[#181a21] hover:bg-[#20232c] border border-zinc-700 text-zinc-200 font-medium px-4 py-2 rounded-xl text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4 text-zinc-400" />
                Imprimir Ficha de Atividades
              </button>
            </div>
          </div>
        </section>

        {/* 4 Metric KPI Cards matching Figma */}
        <section aria-label="Indicadores de progresso de horas" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Horas Aprovadas */}
          <div className="bg-[#111317] border border-zinc-800/80 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-zinc-700 transition-all">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Horas Aprovadas
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 tracking-tight">
              {approvedHours}h <span className="text-base sm:text-lg font-semibold text-zinc-400">/ {totalRequired}h</span>
            </div>
            <div className="text-xs text-zinc-400 mt-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Faltam {remainingHours} horas complementares
            </div>
          </div>

          {/* Card 2: Horas em Análise */}
          <div className="bg-[#111317] border border-zinc-800/80 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-zinc-700 transition-all">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Horas em Análise
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-400 tracking-tight">
              {pendingHours}h
            </div>
            <div className="text-xs text-zinc-400 mt-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              {pendingCount} certificados pendentes de parecer
            </div>
          </div>

          {/* Card 3: Certificados Enviados */}
          <div className="bg-[#111317] border border-zinc-800/80 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-zinc-700 transition-all">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Certificados Enviados
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {totalSent} un.
            </div>
            <div className="text-xs text-zinc-400 mt-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              Total de envios no sistema
            </div>
          </div>

          {/* Card 4: Indeferidos */}
          <div className="bg-[#111317] border border-zinc-800/80 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-zinc-700 transition-all">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Indeferidos
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-rose-500 tracking-tight">
              {rejectedCount} un.
            </div>
            <div className="text-xs text-zinc-400 mt-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              Requer nova submissão/correção
            </div>
          </div>

        </section>

        {/* Main 2-Column Layout matching Figma */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Progress by Category (2 cols) */}
          <section aria-labelledby="categories-progress-title" className="lg:col-span-2 bg-[#111317] border border-zinc-800/80 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/60 pb-4 mb-6">
              <h2 id="categories-progress-title" className="text-base font-bold text-white tracking-tight">
                Progresso Estimado por Categoria do Projeto Pedagógico
              </h2>
              <div className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                Progresso geral: {completionPercentage}%
              </div>
            </div>

            {/* Category Progress Bars matching Figma */}
            <div className="space-y-6">
              {categoryRules.map((rule) => {
                const percent = Math.min(100, Math.round((rule.currentHours / rule.maxHours) * 100));
                return (
                  <div key={rule.category} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-200">
                        {rule.displayName}
                      </span>
                      <span className="font-bold text-zinc-300">
                        {rule.currentHours}h <span className="text-zinc-500 font-normal">/ {rule.maxHours}h</span>
                      </span>
                    </div>

                    {/* Progress Bar with category color */}
                    <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/80">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: rule.color,
                        }}
                      />
                    </div>

                    <div className="text-[11px] text-zinc-500">
                      {rule.description}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Summary note */}
            <div className="mt-8 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
              <span>Critérios fixados pelo Colegiado de Computação • PPC 2021</span>
              <Link 
                href="/gerar-relatorio"
                className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
              >
                Gerar espelho oficial <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

          {/* Right Column: Recent Activities & Guidelines (1 col) */}
          <div className="space-y-6">
            
            {/* Recent Activities Feed */}
            <section aria-labelledby="recent-activities-title" className="bg-[#111317] border border-zinc-800/80 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3 mb-4">
                <h3 id="recent-activities-title" className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Atividades Recentes
                </h3>
                <Link href="/meus-certificados" className="text-[11px] text-emerald-400 hover:underline">
                  Ver todas
                </Link>
              </div>

              <div className="space-y-3.5">
                {/* Activity 1: Approved */}
                <div 
                  onClick={() => setSelectedCertificateForModal(certificates[1] || certificates[0])}
                  className="bg-[#161820] hover:bg-[#1c1e28] border border-zinc-800/80 rounded-xl p-3.5 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                      APROVADO
                    </span>
                    <span className="text-[11px] text-zinc-500">Ontem, 14:32</span>
                  </div>
                  <div className="text-xs font-semibold text-white mb-1">
                    Organização de Evento: IX SECOMP UFSCar
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Docente atribuiu 20h na categoria de Extensão.
                  </div>
                </div>

                {/* Activity 2: Pending */}
                <div 
                  onClick={() => setSelectedCertificateForModal(certificates[0])}
                  className="bg-[#161820] hover:bg-[#1c1e28] border border-zinc-800/80 rounded-xl p-3.5 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="bg-amber-950 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                      PENDENTE
                    </span>
                    <span className="text-[11px] text-zinc-500">12/05/2025</span>
                  </div>
                  <div className="text-xs font-semibold text-white mb-1">
                    Curso de Extensão: React & Redux
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    Aguardando parecer do avaliador docente.
                  </div>
                </div>

                {/* Activity 3: Rejected */}
                <div 
                  onClick={() => setSelectedCertificateForModal(certificates[4] || certificates[0])}
                  className="bg-[#161820] hover:bg-[#1c1e28] border border-zinc-800/80 rounded-xl p-3.5 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="bg-rose-950 text-rose-400 border border-rose-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                      INDEFERIDO
                    </span>
                    <span className="text-[11px] text-zinc-500">08/05/2025</span>
                  </div>
                  <div className="text-xs font-semibold text-white mb-1">
                    Palestra: Futuro da Inteligência Artificial
                  </div>
                  <div className="text-[11px] text-rose-300/80">
                    Justificativa: Certificado sem assinatura institucional válida.
                  </div>
                </div>
              </div>
            </section>

            {/* Regulamento de Atividades matching Figma */}
            <section aria-labelledby="regulation-title" className="bg-[#111317] border border-zinc-800/80 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-zinc-300 uppercase tracking-wider">
                <Info className="w-4 h-4 text-blue-400" />
                <span id="regulation-title">Regulamento de Atividades</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Seus certificados devem possuir carga horária explícita, assinatura eletrônica ou código de validação legível para deferimento imediato pela Comissão de Homologação.
              </p>
              <div className="mt-3 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-[11px]">
                <span className="text-zinc-500">Resolução CoG nº 12/2021</span>
                <Link href="/gerar-relatorio" className="text-blue-400 hover:underline">
                  Ver PPC Completo
                </Link>
              </div>
            </section>

          </div>

        </div>

      </main>
    </div>
  );
}
