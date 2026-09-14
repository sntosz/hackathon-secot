'use client';

import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useAppState } from '../context/AppStateContext';
import {
  Eye,
  Sun,
  Moon,
  Type,
  Zap,
  RotateCcw,
  ShieldCheck,
  GraduationCap,
  UserCheck,
  HelpCircle,
  FileText,
  LayoutDashboard,
  Share2,
  PlusCircle,
  Building2
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAddModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenAddModal }) => {
  const { settings, updateSettings, resetSettings, announce } = useAccessibility();
  const { activeRole, setActiveRole, resetAllData, profile } = useAppState();
  const [showA11yMenu, setShowA11yMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: nextTheme });
    announce(`Tema alterado para ${nextTheme === 'dark' ? 'escuro' : 'claro'}`);
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

  return (
    <>
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal (Alt + 1)
      </a>

      {/* Top Accessibility Bar */}
      <div className="bg-slate-900 text-slate-100 text-xs py-2 px-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 no-print">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-semibold text-emerald-400">
            <ShieldCheck className="w-4 h-4" /> UFSCar - Gestão de Horas Complementares
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-300">
            Acessibilidade WCAG 2.1 AAA Integrada
          </span>
        </div>

        {/* Accessibility Tools Quick Menu */}
        <div className="flex items-center gap-2">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label={`Mudar para modo ${settings.theme === 'dark' ? 'claro' : 'escuro'}`}
            className="p-1.5 rounded hover:bg-slate-800 transition-colors flex items-center gap-1 focus:ring-2 focus:ring-emerald-400"
            title="Alternar Tema Claro/Escuro"
          >
            {settings.theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-slate-300" />
            )}
            <span className="hidden sm:inline">{settings.theme === 'dark' ? 'Claro' : 'Escuro'}</span>
          </button>

          {/* High Contrast Toggle */}
          <button
            onClick={toggleHighContrast}
            aria-pressed={settings.highContrast}
            className={`p-1.5 rounded transition-colors flex items-center gap-1 focus:ring-2 focus:ring-emerald-400 ${
              settings.highContrast ? 'bg-amber-400 text-black font-bold' : 'hover:bg-slate-800 text-slate-300'
            }`}
            title="Alternar Alto Contraste"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Alto Contraste</span>
          </button>

          {/* Font Sizing Buttons */}
          <div className="flex items-center bg-slate-800 rounded p-0.5 border border-slate-700" role="group" aria-label="Ajustar tamanho da fonte">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-1.5 py-0.5 rounded text-xs ${settings.fontSize === 'normal' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
              aria-label="Tamanho de fonte normal"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-1.5 py-0.5 rounded text-xs ${settings.fontSize === 'large' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
              aria-label="Tamanho de fonte grande"
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`px-1.5 py-0.5 rounded text-xs ${settings.fontSize === 'xlarge' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
              aria-label="Tamanho de fonte muito grande"
            >
              A++
            </button>
          </div>

          {/* Dyslexia Font Toggle */}
          <button
            onClick={toggleDyslexicFont}
            aria-pressed={settings.dyslexicFont}
            className={`p-1.5 rounded transition-colors flex items-center gap-1 ${
              settings.dyslexicFont ? 'bg-indigo-600 text-white font-bold' : 'hover:bg-slate-800 text-slate-300'
            }`}
            title="Ativar fonte para dislexia"
          >
            <Type className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Dislexia</span>
          </button>

          {/* Role Switcher (Estudante vs Professor/Secretaria) */}
          <div className="relative border-l border-slate-700 pl-2">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs flex items-center gap-1.5"
              aria-expanded={showRoleMenu}
              aria-haspopup="true"
            >
              {activeRole === 'student' ? (
                <>
                  <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Visão Aluno</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span>Visão Secretaria/Prof</span>
                </>
              )}
            </button>

            {showRoleMenu && (
              <div
                className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-md shadow-xl py-2 z-50 text-slate-200"
                role="menu"
              >
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Simulação de Perfil
                </div>
                <button
                  onClick={() => {
                    setActiveRole('student');
                    setShowRoleMenu(false);
                    announce('Modo alterado para Visão do Aluno.');
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-800 ${
                    activeRole === 'student' ? 'bg-slate-800 font-bold text-emerald-400' : ''
                  }`}
                  role="menuitem"
                >
                  <GraduationCap className="w-4 h-4" />
                  <div>
                    <div className="font-medium">Aluno ({profile.name})</div>
                    <div className="text-[10px] text-slate-400">Gerenciar horas e certificados</div>
                  </div>
                </button>
                <button
                  onClick={() => {
                    setActiveRole('professor');
                    setShowRoleMenu(false);
                    announce('Modo alterado para Visão do Professor / Secretaria.');
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-slate-800 ${
                    activeRole === 'professor' ? 'bg-slate-800 font-bold text-sky-400' : ''
                  }`}
                  role="menuitem"
                >
                  <UserCheck className="w-4 h-4" />
                  <div>
                    <div className="font-medium">Secretaria / Docente UFSCar</div>
                    <div className="text-[10px] text-slate-400">Validar e revisar solicitações</div>
                  </div>
                </button>
                <div className="border-t border-slate-800 my-1"></div>
                <button
                  onClick={() => {
                    resetAllData();
                    setShowRoleMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-950/40 flex items-center gap-2"
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

      {/* Main Header / Nav */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-xs no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Brand / Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xl shadow-md border border-emerald-600">
                U
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    UFSCar <span className="text-emerald-700 dark:text-emerald-400">Horas</span>
                  </h1>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                    Sorocaba
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {profile.course}
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Navegação principal">
              <button
                onClick={() => setActiveTab('dashboard')}
                aria-current={activeTab === 'dashboard' ? 'page' : undefined}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'dashboard'
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold border-b-2 border-emerald-600'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Painel Geral
              </button>

              <button
                onClick={() => setActiveTab('certificates')}
                aria-current={activeTab === 'certificates' ? 'page' : undefined}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'certificates'
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold border-b-2 border-emerald-600'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                Meus Certificados
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                aria-current={activeTab === 'reports' ? 'page' : undefined}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'reports'
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold border-b-2 border-emerald-600'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Share2 className="w-4 h-4" />
                Gerar Relatório & Enviar
              </button>

              <button
                onClick={() => setActiveTab('portal')}
                aria-current={activeTab === 'portal' ? 'page' : undefined}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeTab === 'portal'
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold border-b-2 border-emerald-600'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Portal Secretaria/SIGA
              </button>
            </nav>

            {/* Quick Action Button */}
            <div className="flex items-center gap-2">
              {activeRole === 'student' && (
                <button
                  onClick={onOpenAddModal}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium px-3 py-2 rounded-lg text-sm flex items-center gap-1.5 shadow-sm transition-transform active:scale-95 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  aria-label="Registrar novo certificado"
                >
                  <PlusCircle className="w-4 h-4" />
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
            className={`p-2 rounded text-xs flex flex-col items-center gap-1 ${
              activeTab === 'dashboard' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Painel
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`p-2 rounded text-xs flex flex-col items-center gap-1 ${
              activeTab === 'certificates' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <FileText className="w-4 h-4" />
            Certificados
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`p-2 rounded text-xs flex flex-col items-center gap-1 ${
              activeTab === 'reports' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <Share2 className="w-4 h-4" />
            Relatórios
          </button>
          <button
            onClick={() => setActiveTab('portal')}
            className={`p-2 rounded text-xs flex flex-col items-center gap-1 ${
              activeTab === 'portal' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-600 dark:text-slate-400'
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
