"use client";

import React from "react";
import Header from "../../components/Header";
import { useHours } from "../../context/HoursContext";
import {
  Plus,
  Printer,
  Info,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function PainelGeral() {
  const { student, categoryRules, certificates, setIsAddModalOpen, setSelectedCertificateForModal, activeRole } = useHours();
  const isStudentMode = activeRole === 'student';

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
    <div className="min-h-screen bg-[#0a0b0d] text-zinc-100">
      <Header />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <section aria-labelledby="hero-title" className="border border-zinc-800 bg-[#111317] p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-3">
              <h1 id="hero-title" className="text-base font-semibold tracking-[-0.02em] text-white sm:text-lg">
                Área do Aluno • Painel de Controle de Horas Complementares
              </h1>
              <span className="rounded-sm border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-emerald-300">
                {student.status}
              </span>
            </div>
            <div className="text-[11px] text-zinc-400">
              Ano Letivo: <span className="font-medium text-zinc-200">2025</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-md border border-zinc-700 bg-zinc-800 text-base font-semibold text-zinc-100">
                {student.initials}
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-white sm:text-base">
                  <span>{student.name}</span>
                  <span className="text-xs text-zinc-400">(RA: {student.ra})</span>
                </div>
                <div className="mt-0.5 text-xs text-zinc-400">
                  {student.course} • {student.campus} • {student.pedagogicalProject}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {isStudentMode ? (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-[11px] font-semibold text-zinc-950 transition-colors hover:bg-emerald-400"
                >
                  <Plus className="h-4 w-4" />
                  Submeter Novo Certificado
                </button>
              ) : (
                <div className="rounded-md border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-[11px] font-medium text-zinc-400">
                  Modo Secretaria — envio do aluno desativado
                </div>
              )}

              <button
                onClick={handlePrintSheet}
                className="inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-[11px] font-medium text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-800"
              >
                <Printer className="h-4 w-4 text-zinc-400" />
                Imprimir Ficha de Atividades
              </button>
            </div>
          </div>
        </section>

        <section aria-label="Indicadores de progresso de horas" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Horas Aprovadas",
              value: `${approvedHours}h`,
              note: `Faltam ${remainingHours} horas complementares`,
              accent: "text-emerald-300",
              dot: "bg-emerald-400",
            },
            {
              label: "Horas em Análise",
              value: `${pendingHours}h`,
              note: `${pendingCount} certificados pendentes de parecer`,
              accent: "text-amber-300",
              dot: "bg-amber-400",
            },
            {
              label: "Certificados Enviados",
              value: `${totalSent} un.`,
              note: "Total de envios no sistema",
              accent: "text-zinc-100",
              dot: "bg-blue-400",
            },
            {
              label: "Indeferidos",
              value: `${rejectedCount} un.`,
              note: "Requer nova submissão/correção",
              accent: "text-rose-300",
              dot: "bg-rose-400",
            },
          ].map((item) => (
            <div key={item.label} className="border border-zinc-800 bg-[#111317] p-5 transition-colors hover:border-zinc-700">
              <div className="mb-2 text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-400">
                {item.label}
              </div>
              <div className={`text-2xl font-semibold tracking-[-0.04em] sm:text-3xl ${item.accent}`}>
                {item.value}
                {item.label === "Horas Aprovadas" && (
                  <span className="ml-1 text-base font-medium text-zinc-400">/ {totalRequired}h</span>
                )}
              </div>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-zinc-400">
                <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
                {item.note}
              </div>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section aria-labelledby="categories-progress-title" className="border border-zinc-800 bg-[#111317] p-6 lg:col-span-2">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-4">
              <h2 id="categories-progress-title" className="text-base font-semibold tracking-[-0.02em] text-white">
                Progresso Estimado por Categoria do Projeto Pedagógico
              </h2>
              <div className="rounded-sm border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-emerald-300">
                Progresso geral: {completionPercentage}%
              </div>
            </div>

            <div className="space-y-6">
              {categoryRules.map((rule) => {
                const percent = Math.min(100, Math.round((rule.currentHours / rule.maxHours) * 100));
                return (
                  <div key={rule.category} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-zinc-200">{rule.displayName}</span>
                      <span className="font-medium text-zinc-300">
                        {rule.currentHours}h <span className="text-zinc-500">/ {rule.maxHours}h</span>
                      </span>
                    </div>

                    <div className="h-2.5 w-full overflow-hidden border border-zinc-800 bg-zinc-950">
                      <div
                        className="h-full transition-all duration-500"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: rule.color,
                        }}
                      />
                    </div>

                    <div className="text-[11px] text-zinc-500">{rule.description}</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-zinc-800 pt-4 text-xs text-zinc-400">
              <span>Critérios fixados pelo Colegiado de Computação • PPC 2021</span>
              <Link href="/gerar-relatorio" className="inline-flex items-center gap-1 font-medium text-emerald-300 hover:text-emerald-200">
                Gerar espelho oficial <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </section>

          <div className="space-y-6">
            <section aria-labelledby="recent-activities-title" className="border border-zinc-800 bg-[#111317] p-5">
              <div className="mb-4 flex items-center justify-between border-b border-zinc-800 pb-3">
                <h3 id="recent-activities-title" className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-300">
                  Atividades Recentes
                </h3>
                <Link href="/meus-certificados" className="text-[11px] font-medium text-emerald-300 hover:text-emerald-200">
                  Ver todas
                </Link>
              </div>

              <div className="space-y-3.5">
                <div onClick={() => isStudentMode && setSelectedCertificateForModal(certificates[1] || certificates[0])} className={`border border-zinc-800 bg-zinc-950/40 p-3.5 transition-colors ${isStudentMode ? "cursor-pointer hover:border-zinc-700" : "cursor-default opacity-80"}`}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="rounded-sm border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-emerald-300">
                      Aprovado
                    </span>
                    <span className="text-[11px] text-zinc-500">Ontem, 14:32</span>
                  </div>
                  <div className="mb-1 text-xs font-medium text-white">Organização de Evento: IX SECOMP UFSCar</div>
                  <div className="text-[11px] text-zinc-400">Docente atribuiu 20h na categoria de Extensão.</div>
                </div>

                <div onClick={() => isStudentMode && setSelectedCertificateForModal(certificates[0])} className={`border border-zinc-800 bg-zinc-950/40 p-3.5 transition-colors ${isStudentMode ? "cursor-pointer hover:border-zinc-700" : "cursor-default opacity-80"}`}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="rounded-sm border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-amber-300">
                      Pendente
                    </span>
                    <span className="text-[11px] text-zinc-500">12/05/2025</span>
                  </div>
                  <div className="mb-1 text-xs font-medium text-white">Curso de Extensão: React & Redux</div>
                  <div className="text-[11px] text-zinc-400">Aguardando parecer do avaliador docente.</div>
                </div>

                <div onClick={() => isStudentMode && setSelectedCertificateForModal(certificates[4] || certificates[0])} className={`border border-zinc-800 bg-zinc-950/40 p-3.5 transition-colors ${isStudentMode ? "cursor-pointer hover:border-zinc-700" : "cursor-default opacity-80"}`}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="rounded-sm border border-rose-500/30 bg-rose-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-rose-300">
                      Indeferido
                    </span>
                    <span className="text-[11px] text-zinc-500">08/05/2025</span>
                  </div>
                  <div className="mb-1 text-xs font-medium text-white">Palestra: Futuro da Inteligência Artificial</div>
                  <div className="text-[11px] text-rose-300/80">Justificativa: Certificado sem assinatura institucional válida.</div>
                </div>
              </div>
            </section>

            <section aria-labelledby="regulation-title" className="border border-zinc-800 bg-[#111317] p-5">
              <div className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-300">
                <Info className="h-4 w-4 text-blue-300" />
                <span id="regulation-title">Regulamento de Atividades</span>
              </div>
              <p className="text-xs leading-relaxed text-zinc-400">
                Seus certificados devem possuir carga horária explícita, assinatura eletrônica ou código de validação legível para deferimento imediato pela Comissão de Homologação.
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-zinc-800 pt-3 text-[11px] text-zinc-500">
                <span>Resolução CoG nº 12/2021</span>
                <Link href="/gerar-relatorio" className="text-blue-300 hover:text-blue-200">
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
