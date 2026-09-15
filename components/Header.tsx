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
  CheckCircle2,
  ShieldAlert,
  GraduationCap,
  Building2,
  Layers
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

  const navLinks = [
    { label: "Painel Geral", href: "/painel-geral" },
    { label: "Meus Certificados", href: "/meus-certificados" },
    { label: "Gerar Relatório", href: "/gerar-relatorio" },
    { label: "Portal Secretaria", href: "/portal-secretaria" },
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
      <header className="w-full border-b border-zinc-800/80 bg-[#0d0f13]/90 px-4 py-3 backdrop-blur-sm lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link 
              href="/painel-geral" 
              className="flex items-center gap-3 rounded-md p-1 focus-visible:ring-2 focus-visible:ring-blue-400"
              aria-label="Página Inicial UFSCar Horas"
            >
              <div className="rounded-md bg-[#1f5ae0] px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] text-white uppercase">
                UFSCar
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-[-0.02em] text-white">
                  UFSCar Horas
                </span>
                <span className="text-[11px] text-zinc-400">
                  Ciência da Computação
                </span>
              </div>
            </Link>
          </div>

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

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 rounded-md border border-zinc-800 bg-[#12171d] p-0.5">
              {/* High Contrast */}
              <button
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
                {accessibility.highContrast ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Font Sizing */}
              <button
                onClick={cycleFontSize}
                title={`Aumentar/Diminuir Texto (Atual: ${accessibility.fontSize})`}
                aria-label="Ajustar Tamanho do Texto"
                className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                  accessibility.fontSize !== 'normal' ? "bg-blue-600 text-white font-bold" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                <Type className="w-4 h-4" />
              </button>

              {/* Audio narration */}
              <button
                onClick={handleAudioToggle}
                title="Audiodescrição / Leitor de Voz"
                aria-label="Ativar Leitura por Voz"
                className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                  accessibility.audioFeedback ? "bg-emerald-500 text-black font-bold" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
                }`}
              >
                {accessibility.audioFeedback ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Focus / Neurodivergent Mode */}
              <button
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
                <Eye className="w-4 h-4" />
              </button>

              {/* Shortcuts help */}
              <button
                onClick={() => setIsShortcutsOpen(true)}
                title="Guia de Atalhos do Teclado (?)"
                aria-label="Guia de Atalhos do Teclado"
                className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-zinc-800/60 text-xs transition-colors cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            </div>

            {/* Prominent Role Selector Toggle */}
            <div className="bg-[#13151b] border border-zinc-800/90 rounded-xl p-0.5 flex items-center shadow-xs">
              <button
                onClick={() => handleRoleChange('student')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeRole === 'student'
                    ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Alternar para visão do Estudante"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Aluno</span>
              </button>

              <button
                onClick={() => handleRoleChange('secretary')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer relative ${
                  activeRole === 'secretary'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Alternar para visão da Secretaria / Docente"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Secretaria</span>
                {pendingTotal > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                )}
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* Role Context Notification Bar */}
      {activeRole === 'secretary' && (
        <div className="w-full bg-blue-950/70 border-b border-blue-800/50 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 text-blue-200 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>
              <strong>Modo Administrativo (Secretaria SGA_UFSCar):</strong> Você pode inspecionar documentos, analisar conformidade com o PPC e homologar ou indeferir certificados.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link 
              href="/portal-secretaria" 
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-2.5 py-1 rounded text-[11px] transition-colors"
            >
              Fila de Triagem ({pendingTotal})
            </Link>
            <Link 
              href="/painel-validacao-docente" 
              className="bg-blue-900/80 hover:bg-blue-800 border border-blue-600/60 text-white font-medium px-2.5 py-1 rounded text-[11px] transition-colors"
            >
              Homologação Docente
            </Link>
            <button
              onClick={resetDemoData}
              title="Restaurar dados originais de teste"
              className="text-blue-300 hover:text-white flex items-center gap-1 text-[11px] hover:underline cursor-pointer ml-2"
            >
              <RotateCcw className="w-3 h-3" />
              Restaurar Demo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
