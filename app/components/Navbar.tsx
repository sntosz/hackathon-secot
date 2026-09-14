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

      {/* Top Bar - Academic Institutional Utility Header */}
      <div className="bg-[#660000] dark:bg-slate-950 text-slate-100 text-xs py-1.5 px-4 border-b border-[#8b0000] dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 no-print">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold tracking-tight text-white">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> UFSCar • Sistema de Gestão de Horas Complementares
          </span>
          <span className="hidden md:inline text-red-300/30">|</span>
          <span className="hidden md:inline text-slate-200 text-[11px] font-mono">
            Campus Sorocaba
          </span>
        </div>

        {/* Accessibility & System Actions */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={`Mudar para modo ${settings.theme === 'dark' ? 'claro' : 'escuro'}`}
            className="px-2 py-1 rounded-sm bg-[#8b0000] hover:bg-[#700000] dark:bg-slate-800 dark:hover:bg-slate-700 text-white transition-colors flex items-center gap-1 border border-red-800/80 dark:border-slate-700 text-[11px] font-medium"
            title="Alternar Tema Claro / Escuro"
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-3 h-3 text-amber-300" />
            ) : (
              <Moon className="w-3 h-3 text-amber-200" />
            )}
            <span className="hidden sm:inline">{settings.theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}</span>
          </button>

          {/* High Contrast Toggle */}
          <button
            onClick={toggleHighContrast}
            aria-pressed={settings.highContrast}
            className={`px-2 py-1 rounded-sm transition-colors flex items-center gap-1 text-[11px] font-medium border ${
              settings.highContrast
                ? 'bg-amber-400 text-black border-amber-500 font-bold'
                : 'bg-[#8b0000] dark:bg-slate-800 hover:bg-[#700000] text-white border-red-800/80 dark:border-slate-700'
            }`}
            title="Alternar Alto Contraste"
          >
            <Eye className="w-3 h-3" />
            <span className="hidden sm:inline">Alto Contraste</span>
          </button>

          {/* Font Sizing Controls */}
          <div className="flex items-center bg-[#8b0000] dark:bg-slate-800 rounded-sm p-0.5 border border-red-800/80 dark:border-slate-700 text-[11px]" role="group" aria-label="Ajustar tamanho da fonte">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-1.5 py-0.2 rounded-xs font-semibold ${settings.fontSize === 'normal' ? 'bg-amber-400 text-black' : 'text-slate-200 hover:text-white'}`}
              aria-label="Tamanho de fonte normal"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-1.5 py-0.2 rounded-xs font-semibold ${settings.fontSize === 'large' ? 'bg-amber-400 text-black' : 'text-slate-200 hover:text-white'}`}
              aria-label="Tamanho de fonte grande"
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`px-1.5 py-0.2 rounded-xs font-semibold ${settings.fontSize === 'xlarge' ? 'bg-amber-400 text-black' : 'text-slate-200 hover:text-white'}`}
              aria-label="Tamanho de fonte muito grande"
            >
              A++
            </button>
          </div>

          {/* Dyslexic Font Toggle */}
          <button
            onClick={toggleDyslexicFont}
            aria-pressed={settings.dyslexicFont}
            className={`px-2 py-1 rounded-sm transition-colors flex items-center gap-1 text-[11px] font-medium border ${
              settings.dyslexicFont
                ? 'bg-amber-400 text-black border-amber-500 font-bold'
                : 'bg-[#8b0000] dark:bg-slate-800 hover:bg-[#700000] text-white border-red-800/80 dark:border-slate-700'
            }`}
            title="Ativar fonte especial para dislexia"
          >
            <Type className="w-3 h-3" />
            <span className="hidden lg:inline">Dislexia</span>
          </button>

          {/* FAQ & Guide Button */}
          <button
            onClick={onOpenFAQModal}
            className="px-2 py-1 bg-[#8b0000] dark:bg-slate-800 hover:bg-[#700000] text-white rounded-sm text-[11px] font-medium border border-red-800/80 dark:border-slate-700 flex items-center gap-1"
            title="Normas & Regulamento"
          >
            <HelpCircle className="w-3 h-3 text-amber-300" />
            <span className="hidden lg:inline">Regulamento</span>
          </button>

          {/* Audit Log / History */}
          <button
            onClick={onOpenAuditModal}
            className="px-2 py-1 bg-[#8b0000] dark:bg-slate-800 hover:bg-[#700000] text-white rounded-sm text-[11px] font-medium border border-red-800/80 dark:border-slate-700 flex items-center gap-1"
            title="Auditoria"
          >
            <History className="w-3 h-3 text-amber-300" />
            <span className="hidden lg:inline">Histórico</span>
          </button>

          {/* Role Switcher & Backup Dropdown */}
          <div className="relative border-l border-red-800 dark:border-slate-800 pl-1.5">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="px-2.5 py-1 rounded-sm bg-[#8b0000] dark:bg-slate-800 hover:bg-[#700000] text-white border border-red-700 dark:border-slate-700 text-[11px] flex items-center gap-1 font-semibold"
              aria-expanded={showRoleMenu}
              aria-haspopup="true"
            >
              {activeRole === 'student' ? (
                <>
                  <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                  <span>Modo Aluno</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-amber-300" />
                  <span>Modo Avaliador</span>
                </>
              )}
            </button>

            {showRoleMenu && (
              <div
                className="absolute right-0 mt-1 w-60 bg-slate-900 border border-slate-700 rounded-md shadow-lg py-1 z-50 text-slate-200"
                role="menu"
              >
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Alternar Perfil
                </div>
                <button
                  onClick={() => {
                    setActiveRole('student');
                    setShowRoleMenu(false);
                    announce('Modo alterado para Visão do Aluno.');
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-slate-800 ${
                    activeRole === 'student' ? 'bg-slate-800 font-bold text-amber-400' : ''
                  }`}
                  role="menuitem"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                  <div>
                    <div className="font-semibold">Visão do Aluno</div>
                    <div className="text-[10px] text-slate-400">Gestão individual de horas</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setActiveRole('professor');
                    setShowRoleMenu(false);
                    announce('Modo alterado para Visão da Secretaria / Docente.');
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 hover:bg-slate-800 ${
                    activeRole === 'professor' ? 'bg-slate-800 font-bold text-amber-400' : ''
                  }`}
                  role="menuitem"
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                  <div>
                    <div className="font-semibold">Visão Secretaria / Coordenação</div>
                    <div className="text-[10px] text-slate-400">Análise e deferimento</div>
                  </div>
                </button>

                <div className="border-t border-slate-800 my-1"></div>

                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Gerenciamento de Dados
                </div>

                <button
                  onClick={() => {
                    exportJSONBackup();
                    setShowRoleMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                  role="menuitem"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>Exportar Dados (.json)</span>
                </button>

                <label className="w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2 cursor-pointer">
                  <Upload className="w-3.5 h-3.5 text-slate-400" />
                  <span>Importar Dados (.json)</span>
                  <input type="file" accept=".json" onChange={handleFileUpload} className="sr-only" />
                </label>

                <div className="border-t border-slate-800 my-1"></div>

                <button
                  onClick={() => {
                    resetAllData();
                    setShowRoleMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-950/40 flex items-center gap-2 font-semibold"
                  role="menuitem"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Redefinir Dados Demo</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Institutional Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-300 dark:border-slate-800 sticky top-0 z-40 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">

            {/* Academic Crest & Identity */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-sm bg-[#8b0000] text-white flex items-center justify-center font-bold text-lg border border-[#660000]">
                U
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">
                    UFSCar <span className="text-[#8b0000] dark:text-red-400 font-semibold">| Horas Complementares</span>
                  </h1>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {profile.course}
                </p>
              </div>
            </div>

            {/* Main Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Navegação principal">
              <button
                onClick={() => setActiveTab('dashboard')}
                aria-current={activeTab === 'dashboard' ? 'page' : undefined}
                className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-colors flex items-center gap-1.5 border ${
                  activeTab === 'dashboard'
                    ? 'bg-slate-100 dark:bg-slate-800 text-[#8b0000] dark:text-red-400 border-slate-300 dark:border-slate-700'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 border-transparent'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                Painel
              </button>

              <button
                onClick={() => setActiveTab('certificates')}
                aria-current={activeTab === 'certificates' ? 'page' : undefined}
                className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-colors flex items-center gap-1.5 border ${
                  activeTab === 'certificates'
                    ? 'bg-slate-100 dark:bg-slate-800 text-[#8b0000] dark:text-red-400 border-slate-300 dark:border-slate-700'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 border-transparent'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                Certificados
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                aria-current={activeTab === 'reports' ? 'page' : undefined}
                className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-colors flex items-center gap-1.5 border ${
                  activeTab === 'reports'
                    ? 'bg-slate-100 dark:bg-slate-800 text-[#8b0000] dark:text-red-400 border-slate-300 dark:border-slate-700'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 border-transparent'
                }`}
              >
                <Share2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                Gerar Relatório
              </button>

              <button
                onClick={() => setActiveTab('portal')}
                aria-current={activeTab === 'portal' ? 'page' : undefined}
                className={`px-3 py-1.5 rounded-sm text-xs font-semibold transition-colors flex items-center gap-1.5 border ${
                  activeTab === 'portal'
                    ? 'bg-slate-100 dark:bg-slate-800 text-[#8b0000] dark:text-red-400 border-slate-300 dark:border-slate-700'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 border-transparent'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                Portal da Secretaria
              </button>
            </nav>

            {/* Quick Action Button */}
            <div className="flex items-center gap-2">
              {activeRole === 'student' && (
                <button
                  onClick={onOpenAddModal}
                  className="bg-[#8b0000] hover:bg-[#700000] text-white font-semibold px-3 py-1.5 rounded-sm text-xs flex items-center gap-1.5 border border-red-900 shadow-xs active:bg-[#660000]"
                  aria-label="Cadastrar Novo Certificado"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">Cadastrar Certificado</span>
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex justify-around p-1.5">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-2 py-1 rounded-sm text-xs font-semibold flex items-center gap-1 ${
              activeTab === 'dashboard' ? 'text-[#8b0000] dark:text-red-400 font-bold' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Painel
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-2 py-1 rounded-sm text-xs font-semibold flex items-center gap-1 ${
              activeTab === 'certificates' ? 'text-[#8b0000] dark:text-red-400 font-bold' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Certificados
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-2 py-1 rounded-sm text-xs font-semibold flex items-center gap-1 ${
              activeTab === 'reports' ? 'text-[#8b0000] dark:text-red-400 font-bold' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            Relatórios
          </button>
          <button
            onClick={() => setActiveTab('portal')}
            className={`px-2 py-1 rounded-sm text-xs font-semibold flex items-center gap-1 ${
              activeTab === 'portal' ? 'text-[#8b0000] dark:text-red-400 font-bold' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Secretaria
          </button>
        </div>
      </header>
    </>
  );
};
