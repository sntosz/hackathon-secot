"use client";

import React, { useState, useMemo } from "react";
import Header from "../../components/Header";
import { useHours } from "../../context/HoursContext";
import { 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ExternalLink, 
  Info, 
  ShieldCheck, 
  AlertCircle,
  Clock,
  Filter,
  FileText,
  Eye,
  CheckCircle2,
  Sparkles
} from "lucide-react";

export default function PainelValidacaoDocente() {
  const { 
    certificates, 
    deferCertificate, 
    rejectCertificate, 
    setReviewingCertificate,
    studentsList,
    currentStudentIndex,
    nextStudent,
    prevStudent,
    categoryRules,
    addToast
  } = useHours();

  const [categoryFilter, setCategoryFilter] = useState("Todas as Categorias");
  const [feedbacks, setFeedbacks] = useState<{ [id: string]: string }>({});

  const activeStudent = studentsList[currentStudentIndex] || studentsList[0];

  // Certificates for current student
  const studentCertificates = useMemo(() => {
    return certificates.filter(c => c.studentRa === activeStudent.ra);
  }, [certificates, activeStudent.ra]);

  const pendingCertificates = useMemo(() => {
    return studentCertificates.filter(c => c.status === "PENDENTE");
  }, [studentCertificates]);

  const filteredCertificates = useMemo(() => {
    if (categoryFilter === "Todas as Categorias") return pendingCertificates;
    return pendingCertificates.filter(c => c.category === categoryFilter);
  }, [pendingCertificates, categoryFilter]);

  // Calculate dynamic progress for active student
  const studentApprovedCerts = studentCertificates.filter(c => c.status === "APROVADO");
  const approvedTotal = studentApprovedCerts.reduce((sum, c) => sum + c.hours, 0) + (activeStudent.ra === "801234" ? 0 : activeStudent.approvedHours);
  const targetHours = activeStudent.requiredHours || 210;
  const completionPercent = Math.min(100, Math.round((approvedTotal / targetHours) * 100));

  const pendingAnalysisSum = filteredCertificates.reduce((sum, c) => sum + c.hours, 0);

  const handleFeedbackChange = (id: string, text: string) => {
    setFeedbacks(prev => ({ ...prev, [id]: text }));
  };

  const handleDefer = (id: string) => {
    const feedback = feedbacks[id] || "Atividade homologada com sucesso pela Comissão Docente.";
    deferCertificate(id, feedback);
  };

  const handleReject = (id: string) => {
    const feedback = feedbacks[id];
    if (!feedback || feedback.trim().length === 0) {
      addToast("Por favor, informe a justificativa técnica para o indeferimento.", "warning");
      return;
    }
    rejectCertificate(id, feedback);
  };

  const quickPresets = [
    "Documentação regular e carga horária validada pelo PPC.",
    "Falta assinatura institucional legível ou código de verificação.",
    "Carga horária excede o limite remanescente desta categoria.",
  ];

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-zinc-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Subheader matching Figma */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Painel de Validação da Secretaria e Comissão Docente
            </h1>
            <span className="bg-blue-600/90 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
              Modo Avaliador Ativo
            </span>
          </div>
          <div className="text-xs font-semibold text-amber-400">
            Fila de Pendências: {studentsList.length} alunos cadastrados
          </div>
        </div>

        {/* Student Selector Card matching Figma */}
        <div className="bg-[#111317] border border-zinc-800/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-zinc-200 text-sm">
              {activeStudent.initials}
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>{activeStudent.name}</span>
                <span className="text-xs text-zinc-400 font-normal">
                  (RA: {activeStudent.ra})
                </span>
                <span className="bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  {activeStudent.status}
                </span>
              </div>
              <div className="text-xs text-zinc-400 mt-0.5">
                {activeStudent.course} • {activeStudent.campus} • {activeStudent.pedagogicalProject}
              </div>
            </div>
          </div>

          {/* Student Switcher Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevStudent}
              title="Aluno Anterior"
              className="p-2 bg-[#181a20] hover:bg-[#20232c] border border-zinc-800 rounded-xl text-zinc-300 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-zinc-300 px-3 py-1.5 bg-[#181a20] rounded-xl border border-zinc-800">
              Aluno {currentStudentIndex + 1} de {studentsList.length}
            </span>
            <button
              onClick={nextStudent}
              title="Próximo Aluno"
              className="p-2 bg-[#181a20] hover:bg-[#20232c] border border-zinc-800 rounded-xl text-zinc-300 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Grid matching Figma: Left 2 cols, Right 1 col */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Submissions to Evaluate (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Header of submissions list with category filter */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111317] border border-zinc-800/80 rounded-2xl p-4">
              <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Certificados e Comprovantes Enviados ({filteredCertificates.length} pendentes de parecer)
              </h2>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-zinc-500">Filtrar por:</span>
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="bg-[#181a20] border border-zinc-800 text-zinc-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="Todas as Categorias">Todas as Categorias</option>
                  <option value="Ensino">Ensino & Cursos</option>
                  <option value="Extensão">Extensão</option>
                  <option value="Pesquisa">Pesquisa</option>
                  <option value="Gestão & Representação">Gestão & Representação</option>
                </select>
              </div>
            </div>

            {/* Submission Cards matching Figma */}
            {filteredCertificates.length > 0 ? (
              filteredCertificates.map((cert) => (
                <div 
                  key={cert.id} 
                  className="bg-[#111317] border border-zinc-800/80 rounded-2xl p-5 space-y-4 shadow-sm"
                >
                  {/* Top line: Category, Status & Hash */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#181a22] text-zinc-300 border border-zinc-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        {cert.category === 'Ensino' ? 'ENSINO & CURSOS' : cert.category.toUpperCase()}
                      </span>
                      <span className="bg-[#2f220a] border border-amber-500/40 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded">
                        PENDENTE
                      </span>
                    </div>

                    <button
                      onClick={() => setReviewingCertificate(cert)}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 font-mono flex items-center gap-1.5 transition-colors cursor-pointer bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-lg"
                      title="Abrir Comprovante em Tamanho Real"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspecionar Documento (HASH: {cert.hash.substring(0, 6)}...{cert.hash.substring(cert.hash.length - 4)})</span>
                    </button>
                  </div>

                  {/* Title and Hours */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex-1 min-w-[240px]">
                      <h3 className="text-sm font-bold text-white leading-snug">
                        {cert.title}
                      </h3>
                      <div className="text-xs text-zinc-400 mt-1">
                        {cert.issuer} • {cert.completionDate ? `Concluído em ${cert.completionDate}` : `Realizado em ${cert.submissionDate}`}
                      </div>
                      {cert.description && (
                        <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed bg-black/20 p-2 rounded-lg border border-zinc-800">
                          {cert.description}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-bold text-white">
                        {cert.hours}h
                      </div>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                        SOLICITADAS
                      </div>
                    </div>
                  </div>

                  {/* Parecer Técnico do Avaliador Field matching Figma */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                        Parecer Técnico do Avaliador
                      </label>
                      <span className="text-[10px] text-zinc-500">
                        O parecer fica visível no prontuário do aluno
                      </span>
                    </div>

                    <input
                      type="text"
                      placeholder="Insira observações ou justificativa em caso de indeferimento..."
                      value={feedbacks[cert.id] || ""}
                      onChange={e => handleFeedbackChange(cert.id, e.target.value)}
                      className="w-full bg-[#181a20] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500"
                    />

                    {/* Quick presets */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {quickPresets.map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => handleFeedbackChange(cert.id, preset)}
                          className="text-[10px] bg-[#161822] hover:bg-[#202332] border border-zinc-800 text-zinc-400 hover:text-zinc-200 px-2 py-0.5 rounded transition-colors cursor-pointer"
                        >
                          ⚡ {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions: [✓ Deferir Atividade] and [✕ Indeferir] matching Figma */}
                  <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-zinc-800/60">
                    <button
                      onClick={() => handleDefer(cert.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      Deferir Atividade
                    </button>

                    <button
                      onClick={() => handleReject(cert.id)}
                      className="bg-[#2a1317] hover:bg-[#3d1920] border border-rose-800/80 text-rose-400 font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5 stroke-[2.5]" />
                      Indeferir
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-[#111317] border border-zinc-800/80 rounded-2xl p-12 text-center text-zinc-400">
                <Check className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                <div className="font-bold text-white text-base">Todas as atividades deste aluno foram homologadas!</div>
                <div className="text-xs text-zinc-500 mt-1">
                  Nenhum comprovante pendente de análise nesta categoria. Navegue para o próximo aluno acima.
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Progresso do Aluno & Diretrizes (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Progresso do Aluno Card matching Figma */}
            <div className="bg-[#111317] border border-zinc-800/80 rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 pb-2">
                Progresso do Aluno ({activeStudent.name.split(' ')[0]})
              </div>

              {/* Top Progress Headline */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-2xl font-bold text-white">
                    {approvedTotal}h <span className="text-xs font-normal text-zinc-400">(Meta: {targetHours}h)</span>
                  </div>
                  <span className="bg-blue-600/90 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                    {completionPercent}% Concluído
                  </span>
                </div>

                <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </div>

              {/* Categories list matching Figma */}
              <div className="space-y-4 text-xs pt-1">
                
                {/* Ensino: 60h cap */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-300">Ensino (Cursos, Palestras)</span>
                    <span className="font-bold text-zinc-200">
                      {categoryRules.find(c => c.category === 'Ensino')?.currentHours || 40}h / 60h
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full" 
                      style={{ width: `${Math.min(100, (((categoryRules.find(c => c.category === 'Ensino')?.currentHours || 40) / 60) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Extensão: 40h cap */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-300">Extensão (Projetos, Organização)</span>
                    <span className="font-bold text-zinc-200">
                      {categoryRules.find(c => c.category === 'Extensão')?.currentHours || 20}h / 40h
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full" 
                      style={{ width: `${Math.min(100, (((categoryRules.find(c => c.category === 'Extensão')?.currentHours || 20) / 40) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Pesquisa: 40h cap */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-300">Pesquisa (Iniciação Científica)</span>
                    <span className="font-bold text-zinc-200">
                      {categoryRules.find(c => c.category === 'Pesquisa')?.currentHours || 15}h / 40h
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-400 rounded-full" 
                      style={{ width: `${Math.min(100, (((categoryRules.find(c => c.category === 'Pesquisa')?.currentHours || 15) / 40) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Representação Estudantil: 20h cap */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-300">Representação Estudantil</span>
                    <span className="font-bold text-zinc-200">
                      {categoryRules.find(c => c.category === 'Gestão & Representação')?.currentHours || 12}h / 20h
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full" 
                      style={{ width: `${Math.min(100, (((categoryRules.find(c => c.category === 'Gestão & Representação')?.currentHours || 12) / 20) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Outras Atividades / Cultura: 50h cap */}
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-zinc-300">Cultura, Esporte & Integração</span>
                    <span className="font-bold text-zinc-200">
                      {categoryRules.find(c => c.category === 'Cultura, Esporte & Integração')?.currentHours || 0}h / 50h
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-rose-500 rounded-full" 
                      style={{ width: `${Math.min(100, (((categoryRules.find(c => c.category === 'Cultura, Esporte & Integração')?.currentHours || 0) / 50) * 100))}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* Subtotal Footer */}
              <div className="pt-4 border-t border-zinc-800 space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Horas em análise:</span>
                  <span className="font-bold text-amber-400">{pendingAnalysisSum}h</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Se aprovadas, totaliza:</span>
                  <span className="font-bold text-emerald-400">
                    {Math.min(targetHours, approvedTotal + pendingAnalysisSum)}h {approvedTotal + pendingAnalysisSum >= targetHours ? "(Meta Atingida)" : `(Faltam ${Math.max(0, targetHours - (approvedTotal + pendingAnalysisSum))}h)`}
                  </span>
                </div>
              </div>

            </div>

            {/* Diretrizes de Homologação matching Figma */}
            <div className="bg-[#111317] border border-zinc-800/80 rounded-2xl p-5 space-y-2.5 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider">
                <Info className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Diretrizes de Homologação (PPC CC)</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Conforme o Projeto Pedagógico de Curso (PPC) de Ciência da Computação, cursos extracurriculares têm limite de 60 horas homologadas. Atividades de representação estudantil requerem a ata oficial de posse assinada pela reitoria.
              </p>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
