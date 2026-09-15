"use client";

import React, { useState } from "react";
import Header from "../../components/Header";
import { useHours } from "../../context/HoursContext";
import { 
  FileText, 
  Download, 
  Printer, 
  Mail, 
  CheckSquare, 
  Square, 
  Calendar, 
  ShieldCheck, 
  QrCode, 
  Info,
  Check
} from "lucide-react";

export default function GerarRelatorio() {
  const { student, categoryRules, certificates, setIsEmailModalOpen, addToast } = useHours();

  // Selected categories checkboxes
  const [selectedCategories, setSelectedCategories] = useState<{ [key: string]: boolean }>({
    'Ensino': true,
    'Extensão': true,
    'Pesquisa': true,
    'Gestão & Representação': true,
    'Cultura, Esporte & Integração': true,
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

  // Calculate sum based on active categories
  const activeCategoriesList = categoryRules.filter(c => selectedCategories[c.category]);
  const sumApprovedHours = activeCategoriesList.reduce((acc, c) => acc + c.currentHours, 0);
  const remainingHours = Math.max(0, student.requiredHours - sumApprovedHours);

  const handleExport = () => {
    if (exportFormat === "pdf") {
      window.print();
      addToast("Relatório oficial compilado para impressão/PDF!", "success");
    } else if (exportFormat === "csv") {
      // Export CSV
      const rows = [
        ["Categoria", "Horas Aprovadas", "Teto PPC", "Percentual"],
        ...activeCategoriesList.map(c => [c.displayName, `${c.currentHours}h`, `${c.maxHours}h`, `${Math.round((c.currentHours/c.maxHours)*100)}%`]),
        ["TOTAL", `${sumApprovedHours}h`, `${student.requiredHours}h`, `${Math.round((sumApprovedHours/student.requiredHours)*100)}%`]
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
    <div className="min-h-screen bg-[#0a0b0e] text-zinc-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Title & Subtitle matching Figma */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Exportação e Emissão de Relatório de Horas
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Gere um espelho de horas formatado para conferência docente e apresentação junto à Secretaria
          </p>
        </div>

        {/* 2-Column Grid matching Figma */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Opções do Documento (5 cols) */}
          <div className="lg:col-span-5 bg-[#111317] border border-zinc-800/80 rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm no-print">
            <h2 className="text-sm font-bold text-white border-b border-zinc-800 pb-3 uppercase tracking-wider text-[11px] text-zinc-400">
              Opções do Documento
            </h2>

            {/* Categorias a Incluir */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2.5">
                Categorias a Incluir
              </label>
              <div className="space-y-2.5">
                {[
                  { key: 'Ensino', label: 'Ensino (Cursos e Palestras)' },
                  { key: 'Extensão', label: 'Extensão (Projetos e Organização)' },
                  { key: 'Pesquisa', label: 'Pesquisa (IC, Apresentação de Trabalhos)' },
                  { key: 'Gestão & Representação', label: 'Gestão & Representação Estudantil' },
                  { key: 'Cultura, Esporte & Integração', label: 'Cultura, Esporte e Atividades Livres' },
                ].map((item) => (
                  <label
                    key={item.key}
                    onClick={() => toggleCategory(item.key)}
                    className="flex items-center gap-2.5 text-xs text-zinc-200 cursor-pointer select-none hover:text-white"
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                      selectedCategories[item.key]
                        ? 'bg-emerald-500 text-zinc-950'
                        : 'border border-zinc-700 bg-zinc-900'
                    }`}>
                      {selectedCategories[item.key] && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Período do Filtro */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                Período do Filtro
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] text-zinc-500 block mb-1">Data Inicial (De)</span>
                  <input
                    type="text"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full bg-[#181a20] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-600"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-zinc-500 block mb-1">Data Final (Até)</span>
                  <input
                    type="text"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full bg-[#181a20] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-600"
                  />
                </div>
              </div>
            </div>

            {/* Formato de Exportação */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5">
                Formato de Exportação
              </label>
              <select
                value={exportFormat}
                onChange={e => setExportFormat(e.target.value)}
                className="w-full bg-[#181a20] border border-zinc-800 text-zinc-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zinc-600 cursor-pointer"
              >
                <option value="pdf">Documento PDF (.pdf)</option>
                <option value="csv">Planilha Eletrônica (.csv)</option>
              </select>
            </div>

            {/* Action Buttons matching Figma */}
            <div className="pt-2 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleExport}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  Exportar Relatório
                </button>

                <button
                  onClick={handleSavePreferences}
                  className="bg-[#181a20] hover:bg-[#20232c] border border-zinc-700 text-zinc-300 font-medium py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Salvar Preferências
                </button>
              </div>

              {/* Botão de Envio por Email direto para docente (requisito de hackathon) */}
              <button
                onClick={() => setIsEmailModalOpen(true)}
                className="w-full bg-[#161d2f] hover:bg-[#1f2942] border border-blue-500/40 text-blue-300 font-medium py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Mail className="w-4 h-4 text-blue-400" />
                Enviar Cópia para Avaliador Docente por E-mail
              </button>
            </div>

            {/* Notice Footer Note matching Figma */}
            <div className="bg-[#14161d] p-3 rounded-xl border border-zinc-800 text-[11px] text-zinc-400 leading-relaxed flex items-start gap-2">
              <Info className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
              <span>
                <strong>Nota:</strong> O PDF oficial com assinatura eletrônica institucional de homologação final deve ser solicitado diretamente à Secretaria via Portal Administrativo.
              </span>
            </div>
          </div>

          {/* Right Column: Pré-Visualização do Documento (7 cols) */}
          <div className="lg:col-span-7 bg-[#111317] border border-zinc-800/80 rounded-2xl p-6 shadow-sm print-area">
            
            {/* Header of Preview */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                Pré-Visualização do Documento
              </span>
              <span className="bg-[#3b1216] border border-rose-500/50 text-rose-300 text-[10px] font-bold px-2.5 py-0.5 rounded">
                Documento Não Oficial
              </span>
            </div>

            {/* Document Paper Container matching Figma */}
            <div className="bg-[#0e1015] border border-zinc-800 rounded-xl p-6 sm:p-8 space-y-6">
              
              {/* Institution Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-zinc-800 pb-5">
                <div className="flex items-center gap-3">
                  <div className="bg-[#1d4ed8] text-white px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">
                    UFSCar
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-white">
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

              {/* Dados Cadastrais do Aluno */}
              <div className="space-y-1 text-xs">
                <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  Dados Cadastrais do Aluno
                </div>
                <div className="text-white font-bold text-sm">
                  NOME: {student.name}
                </div>
                <div className="text-zinc-400 text-xs">
                  RA: <strong className="text-zinc-200">{student.ra}</strong> | CURSO: <strong className="text-zinc-200">{student.course}</strong>
                </div>
              </div>

              {/* Quadro de Horas Computadas e Validadas */}
              <div className="space-y-3 pt-2">
                <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  Quadro de Horas Computadas e Validadas
                </div>

                <div className="space-y-2 text-xs divide-y divide-zinc-800/60">
                  {selectedCategories['Ensino'] && (
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-zinc-300">1. Ensino (Cursos Complementares, Capacitação)</span>
                      <span className="font-semibold text-zinc-200">
                        {categoryRules.find(c => c.category === 'Ensino')?.currentHours || 40}h / 60h
                      </span>
                    </div>
                  )}

                  {selectedCategories['Extensão'] && (
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-zinc-300">2. Extensão (SECOMP UFSCar, Hackathons)</span>
                      <span className="font-semibold text-zinc-200">
                        {categoryRules.find(c => c.category === 'Extensão')?.currentHours || 20}h / 40h
                      </span>
                    </div>
                  )}

                  {selectedCategories['Pesquisa'] && (
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-zinc-300">3. Pesquisa (CIC UFSCar, Iniciação Científica)</span>
                      <span className="font-semibold text-zinc-200">
                        {categoryRules.find(c => c.category === 'Pesquisa')?.currentHours || 15}h / 40h
                      </span>
                    </div>
                  )}

                  {selectedCategories['Gestão & Representação'] && (
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-zinc-300">4. Gestão & Representação Acadêmica</span>
                      <span className="font-semibold text-zinc-200">
                        {categoryRules.find(c => c.category === 'Gestão & Representação')?.currentHours || 12}h / 20h
                      </span>
                    </div>
                  )}

                  {selectedCategories['Cultura, Esporte & Integração'] && (
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-zinc-300">5. Cultura, Esporte e Atividades Livres</span>
                      <span className="font-semibold text-zinc-200">
                        {categoryRules.find(c => c.category === 'Cultura, Esporte & Integração')?.currentHours || 0}h / 50h
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Soma de Horas Homologadas Banner matching Figma */}
              <div className="bg-[#0b1b13] border border-emerald-500/40 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Soma de Horas Homologadas:
                </span>
                <span className="text-base sm:text-lg font-bold text-emerald-400">
                  {sumApprovedHours}h / {student.requiredHours}h <span className="text-xs font-normal text-emerald-300/80">(Faltam {remainingHours}h)</span>
                </span>
              </div>

              {/* Digital Stamp & QR Verification Footer */}
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Autenticação: UFSCAR-CC-2025-SHA256-VALIDATED</span>
                </div>
                <div className="flex items-center gap-1 text-zinc-400 font-mono">
                  <QrCode className="w-3.5 h-3.5 text-zinc-400" />
                  QR Validado
                </div>
              </div>

            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
