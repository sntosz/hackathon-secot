'use client';

import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useAppState } from '../context/AppStateContext';
import {
  Eye,
  Sun,
  Moon,
  Type,
  ShieldCheck,
  GraduationCap,
  UserCheck,
  RotateCcw,
  FileText,
  LayoutDashboard,
  Share2,
  PlusCircle,
  Building2,
  Download,
  Upload,
  HelpCircle,
  History,
  Check
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAddModal: () => void;
  onOpenFAQModal: () => void;
  onOpenAuditModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  onOpenFAQModal,
  onOpenAuditModal
}) => {
  const { settings, updateSettings, announce } = useAccessibility();
  const { activeRole, setActiveRole, resetAllData, profile, exportJSONBackup, importJSONBackup } = useAppState();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
    announce(`Tema alterado para modo ${nextTheme === 'dark' ? 'escuro' : 'claro'}`);
  };

  const toggleHighContrast = () => {
    updateSettings({ highContrast: !settings.highContrast });
    announce(`Alto contraste ${!settings.highContrast ? 'ativado' : 'desativado'}`);
  };

  const toggleDyslexicFont = () => {
    updateSettings({ dyslexicFont: !settings.dyslexicFont });
    announce(`Fonte para dislexia ${!settings.dyslexicFont ? 'ativada' : 'desativada'}`);
  };

  const setFontSize = (size: 'normal' | 'large' | 'xlarge') => {
    updateSettings({ fontSize: size });
    const labels = { normal: 'padrão', large: 'grande', xlarge: 'muito grande' };
    announce(`Tamanho do texto alterado para ${labels[size]}`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importJSONBackup(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal (Alt + 1)
      </a>

      {/* Top Bar - Official UFSCar Red Accessibility & System Toolbar */}
      <div className="bg-[#7a1218] dark:bg-slate-950 text-white text-xs py-2 px-4 border-b border-[#9e1b22] dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 no-print shadow-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold tracking-wide text-amber-300">
            <ShieldCheck className="w-4 h-4 text-amber-400" /> UFSCar • Sistema de Horas Complementares
          </span>
          <span className="hidden md:inline text-red-300/40">|</span>
          <span className="hidden md:inline text-red-100 text-[11px]">
            WCAG 2.1 AAA Integrado
          </span>
        </div>

        {/* Accessibility Tools Menu */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={`Mudar para modo ${settings.theme === 'dark' ? 'claro' : 'escuro'}`}
            className="p-1.5 rounded bg-[#9e1b22] hover:bg-[#800000] dark:bg-slate-800 dark:hover:bg-slate-700 text-white transition-colors flex items-center gap-1 focus:ring-2 focus:ring-amber-300"
            title="Alternar Tema Claro / Escuro"
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-300" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-amber-200" />
            )}
            <span className="hidden sm:inline font-semibold">{settings.theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
          </button>

          {/* High Contrast Toggle */}
          <button
            onClick={toggleHighContrast}
            aria-pressed={settings.highContrast}
            className={`p-1.5 rounded transition-colors flex items-center gap-1 focus:ring-2 focus:ring-amber-300 ${
              settings.highContrast ? 'bg-amber-400 text-black font-extrabold' : 'bg-[#9e1b22] dark:bg-slate-800 hover:bg-[#800000] text-white'
            }`}
            title="Alternar Alto Contraste"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-semibold">Alto Contraste</span>
          </button>

          {/* Font Sizing Controls */}
          <div className="flex items-center bg-[#9e1b22] dark:bg-slate-800 rounded p-0.5 border border-red-800/60 dark:border-slate-700" role="group" aria-label="Ajustar tamanho da fonte">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-1.5 py-0.5 rounded text-xs font-bold ${settings.fontSize === 'normal' ? 'bg-amber-400 text-black' : 'text-slate-200 hover:text-white'}`}
              aria-label="Tamanho de fonte normal"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-1.5 py-0.5 rounded text-xs font-bold ${settings.fontSize === 'large' ? 'bg-amber-400 text-black' : 'text-slate-200 hover:text-white'}`}
              aria-label="Tamanho de fonte grande"
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`px-1.5 py-0.5 rounded text-xs font-bold ${settings.fontSize === 'xlarge' ? 'bg-amber-400 text-black' : 'text-slate-200 hover:text-white'}`}
              aria-label="Tamanho de fonte muito grande"
            >
              A++
            </button>
          </div>

          {/* Dyslexic Font Toggle */}
          <button
            onClick={toggleDyslexicFont}
            aria-pressed={settings.dyslexicFont}
            className={`p-1.5 rounded transition-colors flex items-center gap-1 ${
              settings.dyslexicFont ? 'bg-amber-400 text-black font-bold' : 'bg-[#9e1b22] dark:bg-slate-800 hover:bg-[#800000] text-slate-200'
            }`}
            title="Ativar fonte especial para dislexia"
          >
            <Type className="w-3.5 h-3.5" />
            <span className="hidden lg:inline font-semibold">Dislexia</span>
          </button>

          {/* FAQ & Guide Button */}
          <button
            onClick={onOpenFAQModal}
            className="p-1.5 bg-[#9e1b22] dark:bg-slate-800 hover:bg-[#800000] rounded text-slate-200 hover:text-white transition-colors flex items-center gap-1"
            title="Dúvidas Frequentes & Regulamento"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden lg:inline font-semibold">Guia & FAQ</span>
          </button>

          {/* Audit Log / History */}
          <button
            onClick={onOpenAuditModal}
            className="p-1.5 bg-[#9e1b22] dark:bg-slate-800 hover:bg-[#800000] rounded text-slate-200 hover:text-white transition-colors flex items-center gap-1"
            title="Histórico de Alterações"
          >
            <History className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden lg:inline font-semibold">Histórico</span>
          </button>

          {/* Role Switcher & Backup Dropdown */}
          <div className="relative border-l border-red-800 dark:border-slate-800 pl-2">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="px-2.5 py-1 rounded bg-[#9e1b22] dark:bg-slate-800 hover:bg-[#800000] text-white border border-red-700 dark:border-slate-700 text-xs flex items-center gap-1.5 font-bold"
              aria-expanded={showRoleMenu}
              aria-haspopup="true"
            >
              {activeRole === 'student' ? (
                <>
                  <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                  <span>Visão Aluno</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-amber-300" />
                  <span>Visão Avaliador</span>
                </>
              )}
            </button>

            {showRoleMenu && (
              <div
                className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 text-slate-200"
                role="menu"
              >
                <div className="px-3 py-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Perfil de Navegação
                </div>
                <button
                  onClick={() => {
                    setActiveRole('student');
                    setShowRoleMenu(false);
                    announce('Modo alterado para Visão do Aluno.');
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-800 ${
                    activeRole === 'student' ? 'bg-slate-800 font-bold text-amber-400' : ''
                  }`}
                  role="menuitem"
                >
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-bold">Aluno ({profile.name})</div>
                    <div className="text-[10px] text-slate-400">Gerenciar atividades e relatórios</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setActiveRole('professor');
                    setShowRoleMenu(false);
                    announce('Modo alterado para Visão da Secretaria / Docente.');
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-800 ${
                    activeRole === 'professor' ? 'bg-slate-800 font-bold text-amber-400' : ''
                  }`}
                  role="menuitem"
                >
                  <UserCheck className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-bold">Secretaria / Docente UFSCar</div>
                    <div className="text-[10px] text-slate-400">Validar e deferir solicitações</div>
                  </div>
                </button>

                <div className="border-t border-slate-800 my-2"></div>

                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Backup de Dados
                </div>

                <button
                  onClick={() => {
                    exportJSONBackup();
                    setShowRoleMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                  role="menuitem"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Exportar Backup (JSON)</span>
                </button>

                <label className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2 cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Importar Backup (JSON)</span>
                  <input type="file" accept=".json" onChange={handleFileUpload} className="sr-only" />
                </label>

                <div className="border-t border-slate-800 my-2"></div>

                <button
                  onClick={() => {
                    resetAllData();
                    setShowRoleMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-950/40 flex items-center gap-2 font-semibold"
                  role="menuitem"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restaurar Dados Demo</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main UFSCar Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* UFSCar Official Crest & Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#9e1b22] text-white flex items-center justify-center font-extrabold text-2xl shadow-md border-2 border-amber-400">
                U
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">
                    UFSCar <span className="text-[#9e1b22] dark:text-red-400">Horas</span>
                  </h1>
                  <span className="text-[10px] bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-200 font-extrabold px-2 py-0.5 rounded border border-red-300 dark:border-red-800">
                    Sorocaba
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {profile.course}
                </p>
              </div>
            </div>

            {/* Main Nav Tabs */}
            <nav className="hidden md:flex items-center gap-1.5" aria-label="Navegação principal">
              <button
                onClick={() => setActiveTab('dashboard')}
                aria-current={activeTab === 'dashboard' ? 'page' : undefined}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'dashboard'
                    ? 'bg-red-50 dark:bg-red-950/50 text-[#9e1b22] dark:text-red-300 border border-red-200 dark:border-red-800'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-[#9e1b22] dark:text-red-400" />
                Painel Geral
              </button>

              <button
                onClick={() => setActiveTab('certificates')}
                aria-current={activeTab === 'certificates' ? 'page' : undefined}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'certificates'
                    ? 'bg-red-50 dark:bg-red-950/50 text-[#9e1b22] dark:text-red-300 border border-red-200 dark:border-red-800'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FileText className="w-4 h-4 text-[#9e1b22] dark:text-red-400" />
                Meus Certificados
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                aria-current={activeTab === 'reports' ? 'page' : undefined}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'reports'
                    ? 'bg-red-50 dark:bg-red-950/50 text-[#9e1b22] dark:text-red-300 border border-red-200 dark:border-red-800'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Share2 className="w-4 h-4 text-[#9e1b22] dark:text-red-400" />
                Gerar Relatório & Enviar
              </button>

              <button
                onClick={() => setActiveTab('portal')}
                aria-current={activeTab === 'portal' ? 'page' : undefined}
                className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'portal'
                    ? 'bg-red-50 dark:bg-red-950/50 text-[#9e1b22] dark:text-red-300 border border-red-200 dark:border-red-800'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Building2 className="w-4 h-4 text-[#9e1b22] dark:text-red-400" />
                Portal Secretaria/SIGA
              </button>
            </nav>

            {/* Quick Primary Button */}
            <div className="flex items-center gap-2">
              {activeRole === 'student' && (
                <button
                  onClick={onOpenAddModal}
                  className="bg-[#9e1b22] hover:bg-[#800000] text-white font-extrabold px-4 py-2 rounded-xl text-sm flex items-center gap-1.5 shadow-md transition-transform active:scale-95 focus:ring-2 focus:ring-amber-400"
                  aria-label="Registrar novo certificado"
                >
                  <PlusCircle className="w-4 h-4 text-amber-300" />
                  <span className="hidden sm:inline">Novo Certificado</span>
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-around p-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`p-2 rounded text-xs flex flex-col items-center gap-1 font-bold ${
              activeTab === 'dashboard' ? 'text-[#9e1b22] dark:text-red-400' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Painel
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`p-2 rounded text-xs flex flex-col items-center gap-1 font-bold ${
              activeTab === 'certificates' ? 'text-[#9e1b22] dark:text-red-400' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <FileText className="w-4 h-4" />
            Certificados
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`p-2 rounded text-xs flex flex-col items-center gap-1 font-bold ${
              activeTab === 'reports' ? 'text-[#9e1b22] dark:text-red-400' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Share2 className="w-4 h-4" />
            Relatórios
          </button>
          <button
            onClick={() => setActiveTab('portal')}
            className={`p-2 rounded text-xs flex flex-col items-center gap-1 font-bold ${
              activeTab === 'portal' ? 'text-[#9e1b22] dark:text-red-400' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Secretaria
          </button>
        </div>
      </header>
    </>
  );
};
