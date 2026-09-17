"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useHours } from "../context/HoursContext";
import { 
  Sun, 
  Moon, 
  Eye, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  Type, 
  RotateCcw,
  GraduationCap,
  Building2
} from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    student, 
    accessibility, 
    updateAccessibility, 
    speakText, 
    setIsShortcutsOpen,
    activeRole,
    setActiveRole,
    resetDemoData,
    certificates,
    addToast
  } = useHours();

  const navLinks = activeRole === 'student'
    ? [
        { label: "Painel Geral", href: "/painel-geral" },
        { label: "Meus Certificados", href: "/meus-certificados" },
        { label: "Gerar Relatório", href: "/gerar-relatorio" },
      ]
    : [
        { label: "Portal Secretaria (Triagem)", href: "/portal-secretaria" },
        { label: "Homologação Docente", href: "/painel-validacao-docente" },
        { label: "Visão Aluno", href: "/painel-geral" },
      ];

  const handleRoleChange = (newRole: 'student' | 'secretary') => {
    setActiveRole(newRole);
    if (newRole === 'secretary') {
      addToast('Alternado para Modo Secretaria / Avaliador Docente (SGA_UFSCar)', 'info');
      if (pathname === '/painel-geral' || pathname === '/meus-certificados') {
        router.push('/portal-secretaria');
      }
    } else {
      addToast('Alternado para Modo Aluno (Lucas Ferreira Silva)', 'info');
      if (pathname === '/portal-secretaria' || pathname === '/painel-validacao-docente') {
        router.push('/painel-geral');
      }
    }
  };

  const handleAudioToggle = () => {
    const nextVal = !accessibility.audioFeedback;
    updateAccessibility({ audioFeedback: nextVal });
    if (nextVal) {
      speakText("Audiodescrição e leitor de tela ativados.");
      addToast("Audiodescrição ativada!", "info");
    } else {
      addToast("Audiodescrição desativada.", "info");
    }
  };

  const cycleFontSize = () => {
    const sizes: ('normal' | 'large' | 'extralarge')[] = ['normal', 'large', 'extralarge'];
    const nextIndex = (sizes.indexOf(accessibility.fontSize) + 1) % sizes.length;
    const nextSize = sizes[nextIndex];
    updateAccessibility({ fontSize: nextSize });
    addToast(`Tamanho da fonte ajustado: ${nextSize === 'normal' ? '100%' : nextSize === 'large' ? '115%' : '130%'}`, 'info');
  };

  const pendingTotal = certificates.filter(c => c.status === 'PENDENTE').length;

  return (
    <div className="sticky top-0 z-40 w-full flex flex-col transition-colors">
      <header className="w-full border-b border-zinc-800/80 bg-[#0d0f13]/95 px-3 py-2.5 sm:px-4 sm:py-3 backdrop-blur-sm lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap sm:flex-nowrap items-center justify-between gap-2.5">
          {/* Logo & Role Badge */}
          <div className="flex items-center gap-2 shrink-0">
            <Link 
              href="/painel-geral" 
              className="flex items-center gap-2 rounded-md p-0.5 focus-visible:ring-2 focus-visible:ring-blue-400"
              aria-label="Página Inicial UFSCar Horas"
            >
              <div className="rounded-md bg-[#1f5ae0] px-2 py-1 text-[10px] font-bold tracking-[0.14em] text-white uppercase">
                UFSCar
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-semibold tracking-[-0.02em] text-white">
                    UFSCar Horas
                  </span>
                  <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    activeRole === 'student' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30' : 'bg-blue-950/80 text-blue-300 border border-blue-500/40'
                  }`}>
                    {activeRole === 'student' ? 'Visão Aluno' : 'SGA Secretaria'}
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav 
            aria-label="Navegação principal" 
            className="hidden items-center gap-1 rounded-md border border-zinc-800 bg-[#12171d] p-1 md:flex"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href === '/portal-secretaria' && pathname === '/painel-validacao-docente');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-1.5 text-[11px] font-medium transition-colors ${
                    isActive
                      ? "border border-zinc-700 bg-zinc-800 text-white"
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Role Selector + Accessibility Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Prominent Role Selector Toggle */}
            <div className="bg-[#13151b] border border-zinc-800/90 rounded-xl p-0.5 flex items-center shadow-xs">
              <button
                type="button"
                onClick={() => handleRoleChange('student')}
                className={`flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeRole === 'student'
                    ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Alternar para visão do Estudante"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Aluno</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('secretary')}
                className={`flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer relative ${
                  activeRole === 'secretary'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Alternar para visão da Secretaria / Docente"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Secretaria</span>
                {pendingTotal > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                )}
              </button>
            </div>

            {/* Accessibility Toolbar */}
            <div className="flex items-center gap-0.5 sm:gap-1 rounded-md border border-zinc-800 bg-[#12171d] p-0.5">
              {/* High Contrast */}
              <button
                type="button"
                onClick={() => {
                  updateAccessibility({ highContrast: !accessibility.highContrast });
                  addToast(accessibility.highContrast ? "Alto contraste desativado" : "Alto contraste ativado (WCAG AAA)", "info");
                }}
                title="Alternar Alto Contraste (WCAG AAA)"
                aria-label="Alternar Alto Contraste"
                className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                  accessibility.highContrast ? "bg-amber-400 text-black font-bold" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                {accessibility.highContrast ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </button>

              {/* Font Sizing */}
              <button
                type="button"
                onClick={cycleFontSize}
                title={`Aumentar/Diminuir Texto (Atual: ${accessibility.fontSize})`}
                aria-label="Ajustar Tamanho do Texto"
                className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                  accessibility.fontSize !== 'normal' ? "bg-blue-600 text-white font-bold" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                <Type className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Audio narration */}
              <button
                type="button"
                onClick={handleAudioToggle}
                title="Audiodescrição / Leitor de Voz"
                aria-label="Ativar Leitura por Voz"
                className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                  accessibility.audioFeedback ? "bg-emerald-500 text-black font-bold" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                {accessibility.audioFeedback ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </button>

              {/* Focus / Neurodivergent Mode */}
              <button
                type="button"
                onClick={() => {
                  updateAccessibility({ focusMode: !accessibility.focusMode });
                  addToast(accessibility.focusMode ? "Modo Foco desativado" : "Modo Foco / Neurodivergente ativado", "info");
                }}
                title="Modo Foco (Redução de Estímulos e Ruído)"
                aria-label="Modo Foco e Redução de Distrações"
                className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                  accessibility.focusMode ? "bg-emerald-600 text-white font-bold" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              {/* Shortcuts help */}
              <button
                type="button"
                onClick={() => setIsShortcutsOpen(true)}
                title="Guia de Atalhos do Teclado (?)"
                aria-label="Guia de Atalhos do Teclado"
                className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800/60 text-xs transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Row */}
      <nav
        aria-label="Navegação móvel"
        className="flex md:hidden items-center gap-1 border-b border-zinc-800/80 bg-[#0d0f13] px-3 py-1.5 overflow-x-auto"
      >
        {navLinks.map((link) => {
          const isActive = pathname === link.href || (link.href === '/portal-secretaria' && pathname === '/painel-validacao-docente');
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors ${
                isActive
                  ? "border border-zinc-700 bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Role Context Notification Bar */}
      {activeRole === 'secretary' && (
        <div className="w-full bg-blue-950/70 border-b border-blue-800/50 px-3 py-1.5 sm:px-4 sm:py-2 text-xs flex flex-wrap items-center justify-between gap-2.5 text-blue-200 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0"></span>
            <span className="text-[11px] sm:text-xs">
              <strong>Modo Administrativo (Secretaria SGA_UFSCar):</strong> Análise e homologação de certificados.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link 
              href="/portal-secretaria" 
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[11px] transition-colors"
            >
              Triagem ({pendingTotal})
            </Link>
            <Link 
              href="/painel-validacao-docente" 
              className="bg-blue-900/80 hover:bg-blue-800 border border-blue-600/60 text-white font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[11px] transition-colors"
            >
              Homologação
            </Link>
            <button
              type="button"
              onClick={resetDemoData}
              title="Restaurar dados originais de teste"
              className="text-blue-300 hover:text-white flex items-center gap-1 text-[11px] hover:underline cursor-pointer ml-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
