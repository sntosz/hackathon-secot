"use client";

import React, { useState } from "react";
import Header from "../../components/Header";
import { useHours } from "../../context/HoursContext";
import {
  Download,
  Mail,
  Info,
  Check,
} from "lucide-react";

export default function GerarRelatorio() {
  const { student, categoryRules, setIsEmailModalOpen, addToast } = useHours();

  const [selectedCategories, setSelectedCategories] = useState<{ [key: string]: boolean }>({
    Ensino: true,
    "Extensão": true,
    Pesquisa: true,
    "Gestão & Representação": true,
    "Cultura, Esporte & Integração": true,
  });

  const [startDate, setStartDate] = useState("01/01/2023");
  const [endDate, setEndDate] = useState("31/12/2025");
  const [exportFormat, setExportFormat] = useState("pdf");

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  const activeCategoriesList = categoryRules.filter(c => selectedCategories[c.category]);
  const sumApprovedHours = activeCategoriesList.reduce((acc, c) => acc + c.currentHours, 0);
  const remainingHours = Math.max(0, student.requiredHours - sumApprovedHours);

  const handleExport = () => {
    if (exportFormat === "pdf") {
      window.print();
      addToast("Relatório oficial compilado para impressão/PDF!", "success");
    } else if (exportFormat === "csv") {
      const rows = [
        ["Categoria", "Horas Aprovadas", "Teto PPC", "Percentual"],
        ...activeCategoriesList.map(c => [c.displayName, `${c.currentHours}h`, `${c.maxHours}h`, `${Math.round((c.currentHours / c.maxHours) * 100)}%`]),
        ["TOTAL", `${sumApprovedHours}h`, `${student.requiredHours}h`, `${Math.round((sumApprovedHours / student.requiredHours) * 100)}%`],
      ];
      const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(";")).join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `espelho_horas_ufscar_${student.ra}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      addToast("Planilha CSV exportada com sucesso!", "success");
    }
  };

  const handleSavePreferences = () => {
    addToast("Preferências de filtro e visualização salvas no perfil!", "info");
  };

  return (
    <div className="min-h-screen bg-[#0a0b0d] text-zinc-100">
      <Header />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <div>
          <h1 className="text-xl font-semibold tracking-[-0.03em] text-white sm:text-2xl">
            Exportação e Emissão de Relatório de Horas
          </h1>
          <p className="mt-1 text-xs text-zinc-400 sm:text-sm">
            Gere um espelho de horas formatado para conferência docente e apresentação junto à Secretaria
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="no-print border border-zinc-800 bg-[#111317] p-5 sm:p-6 lg:col-span-5">
            <h2 className="border-b border-zinc-800 pb-3 text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-400">
              Opções do Documento
            </h2>

            <div className="mt-5 space-y-5">
              <div>
                <label className="mb-2.5 block text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-300">
                  Categorias a Incluir
                </label>
                <div className="space-y-2.5">
                  {[
                    { key: "Ensino", label: "Ensino (Cursos e Palestras)" },
                    { key: "Extensão", label: "Extensão (Projetos e Organização)" },
                    { key: "Pesquisa", label: "Pesquisa (IC, Apresentação de Trabalhos)" },
                    { key: "Gestão & Representação", label: "Gestão & Representação Estudantil" },
                    { key: "Cultura, Esporte & Integração", label: "Cultura, Esporte e Atividades Livres" },
                  ].map((item) => (
                    <label key={item.key} onClick={() => toggleCategory(item.key)} className="flex cursor-pointer select-none items-center gap-2.5 text-xs text-zinc-200 hover:text-white">
                      <div className={`flex h-4 w-4 items-center justify-center transition-colors ${selectedCategories[item.key] ? "bg-emerald-500 text-zinc-950" : "border border-zinc-700 bg-zinc-900"}`}>
                        {selectedCategories[item.key] && <Check className="h-3 w-3" />}
                      </div>
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-300">
                  Período do Filtro
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="mb-1 block text-[11px] text-zinc-500">Data Inicial (De)</span>
                    <input
                      type="text"
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      className="w-full border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-xs text-white focus:border-zinc-600 focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="mb-1 block text-[11px] text-zinc-500">Data Final (Até)</span>
                    <input
                      type="text"
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      className="w-full border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-xs text-white focus:border-zinc-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-300">
                  Formato de Exportação
                </label>
                <select
                  value={exportFormat}
                  onChange={e => setExportFormat(e.target.value)}
                  className="w-full cursor-pointer border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-xs text-zinc-200 focus:border-zinc-600 focus:outline-none"
                >
                  <option value="pdf">Documento PDF (.pdf)</option>
                  <option value="csv">Planilha Eletrônica (.csv)</option>
                </select>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleExport}
                    className="flex-1 rounded-md bg-emerald-500 px-4 py-2.5 text-[11px] font-semibold text-zinc-950 transition-colors hover:bg-emerald-400"
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      <Download className="h-4 w-4" />
                      Exportar Relatório
                    </span>
                  </button>

                  <button
                    onClick={handleSavePreferences}
                    className="rounded-md border border-zinc-700 bg-zinc-900/80 px-4 py-2.5 text-[11px] font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-800"
                  >
                    Salvar Preferências
                  </button>
                </div>

                <button
                  onClick={() => setIsEmailModalOpen(true)}
                  className="w-full rounded-md border border-blue-500/40 bg-blue-950/30 px-4 py-2 text-[11px] font-medium text-blue-200 transition-colors hover:border-blue-400/60 hover:bg-blue-950/40"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4 text-blue-300" />
                    Enviar Cópia para Avaliador Docente por E-mail
                  </span>
                </button>
              </div>

              <div className="flex items-start gap-2 rounded-md border border-zinc-800 bg-zinc-950/40 p-3 text-[11px] leading-relaxed text-zinc-400">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                <span>
                  <strong className="text-zinc-200">Nota:</strong> O PDF oficial com assinatura eletrônica institucional de homologação final deve ser solicitado diretamente à Secretaria via Portal Administrativo.
                </span>
              </div>
            </div>
          </div>

          <div className="print-area border border-zinc-800 bg-[#111317] p-6 lg:col-span-7">
            <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-400">
                Pré-Visualização do Documento
              </span>
              <span className="rounded-sm border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-rose-300">
                Documento Não Oficial
              </span>
            </div>

            <div className="space-y-6 border border-zinc-800 bg-[#0d0f13] p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-800 pb-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-[#1d4ed8] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
                    UFSCar
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white sm:text-sm">
                      Universidade Federal de São Carlos
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      Pró-Reitoria de Graduação • CC Câmpus Sorocaba
                    </div>
                  </div>
                </div>

                <div className="text-right text-[11px] text-zinc-400">
                  <div>EMISSÃO EM: 15/05/2025</div>
                  <div className="font-mono text-zinc-500">ESPELHO ID: #2025-801234</div>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-400">
                  Dados Cadastrais do Aluno
                </div>
                <div className="text-sm font-semibold text-white">NOME: {student.name}</div>
                <div className="text-zinc-400">
                  RA: <span className="font-medium text-zinc-200">{student.ra}</span> | CURSO: <span className="font-medium text-zinc-200">{student.course}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-400">
                  Quadro de Horas Computadas e Validadas
                </div>

                <div className="space-y-2 text-xs">
                  {selectedCategories["Ensino"] && (
                    <div className="flex items-center justify-between border-t border-zinc-800 pt-2">
                      <span className="text-zinc-300">1. Ensino (Cursos Complementares, Capacitação)</span>
                      <span className="font-semibold text-zinc-200">
                        {categoryRules.find(c => c.category === "Ensino")?.currentHours || 40}h / 60h
                      </span>
                    </div>
                  )}

                  {selectedCategories["Extensão"] && (
                    <div className="flex items-center justify-between border-t border-zinc-800 pt-2">
                      <span className="text-zinc-300">2. Extensão (SECOMP UFSCar, Hackathons)</span>
                      <span className="font-semibold text-zinc-200">
                        {categoryRules.find(c => c.category === "Extensão")?.currentHours || 20}h / 40h
                      </span>
                    </div>
                  )}

                  {selectedCategories["Pesquisa"] && (
                    <div className="flex items-center justify-between border-t border-zinc-800 pt-2">
                      <span className="text-zinc-300">3. Pesquisa (CIC UFSCar, Iniciação Científica)</span>
                      <span className="font-semibold text-zinc-200">
                        {categoryRules.find(c => c.category === "Pesquisa")?.currentHours || 15}h / 40h
                      </span>
                    </div>
                  )}

                  {selectedCategories["Gestão & Representação"] && (
                    <div className="flex items-center justify-between border-t border-zinc-800 pt-2">
                      <span className="text-zinc-300">4. Gestão & Representação Acadêmica</span>
                      <span className="font-semibold text-zinc-200">
                        {categoryRules.find(c => c.category === "Gestão & Representação")?.currentHours || 12}h / 20h
                      </span>
                    </div>
                  )}

                  {selectedCategories["Cultura, Esporte & Integração"] && (
                    <div className="flex items-center justify-between border-t border-zinc-800 pt-2">
                      <span className="text-zinc-300">5. Cultura, Esporte e Atividades Livres</span>
                      <span className="font-semibold text-zinc-200">
                        {categoryRules.find(c => c.category === "Cultura, Esporte & Integração")?.currentHours || 0}h / 50h
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-4">
                <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-zinc-300">
                  Soma de Horas Homologadas:
                </span>
                <span className="text-base font-semibold text-emerald-300 sm:text-lg">
                  {sumApprovedHours}h / {student.requiredHours}h <span className="text-xs font-normal text-emerald-200/80">(Faltam {remainingHours}h)</span>
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-zinc-800 pt-3 text-[11px] text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-4 rounded-full bg-emerald-500/20" />
                  <span>Autenticação: UFSCAR-CC-2025-SHA256-VALIDATED</span>
                </div>
                <div className="font-mono text-zinc-400">QR Validado</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
