'use client';

import React, { useState } from 'react';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { AppStateProvider, useAppState } from './context/AppStateContext';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { CertificatesView } from './components/CertificatesView';
import { AddCertificateModal } from './components/AddCertificateModal';
import { ReportsView } from './components/ReportsView';
import { PortalView } from './components/PortalView';
import { Modal } from './components/Modal';
import { UFSCAR_FAQ } from './data/mockData';
import { HelpCircle, History, BookOpen, ShieldCheck } from 'lucide-react';

function MainApp() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'certificates' | 'reports' | 'portal'>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);

  const { auditLogs } = useAppState();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">

      {/* Navigation & Toolbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab as any)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenFAQModal={() => setIsFAQOpen(true)}
        onOpenAuditModal={() => setIsAuditOpen(true)}
      />

      {/* Main Container */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 focus:outline-hidden" tabIndex={-1}>
        {activeTab === 'dashboard' && (
          <DashboardView
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onNavigateToReports={() => setActiveTab('reports')}
            onNavigateToCertificates={() => setActiveTab('certificates')}
          />
        )}

        {activeTab === 'certificates' && (
          <CertificatesView onOpenAddModal={() => setIsAddModalOpen(true)} />
        )}

        {activeTab === 'reports' && <ReportsView />}

        {activeTab === 'portal' && <PortalView />}
      </main>

      {/* Add Certificate Modal */}
      <AddCertificateModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* FAQ & Rules Drawer Modal */}
      <Modal
        isOpen={isFAQOpen}
        onClose={() => setIsFAQOpen(false)}
        title="Regulamento & Normas UFSCar"
        maxWidth="lg"
      >
        <div className="space-y-3 text-xs text-slate-800 dark:text-slate-200">
          {UFSCAR_FAQ.map((faq, idx) => (
            <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="font-bold text-[#8b0000] dark:text-red-400 flex items-center gap-1.5 text-xs uppercase tracking-wide">
                <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{faq.q}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
          <button
            onClick={() => setIsFAQOpen(false)}
            className="w-full bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-semibold py-1.5 rounded-sm text-xs mt-2"
          >
            Entendido
          </button>
        </div>
      </Modal>

      {/* Audit Log Modal */}
      <Modal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        title="Histórico Analítico de Operações"
        maxWidth="lg"
      >
        <div className="space-y-2.5 text-xs text-slate-800 dark:text-slate-200">
          {auditLogs.length === 0 ? (
            <p className="text-slate-500 text-center py-4">Nenhuma ação registrada ainda.</p>
          ) : (
            auditLogs.map((log) => (
              <div key={log.id} className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                    <History className="w-3.5 h-3.5 text-[#8b0000] dark:text-red-400" />
                    {log.action}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-[11px] font-mono">{log.details}</p>
              </div>
            ))
          )}
          <button
            onClick={() => setIsAuditOpen(false)}
            className="w-full bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-semibold py-1.5 rounded-sm text-xs mt-2"
          >
            Fechar Histórico
          </button>
        </div>
      </Modal>

      {/* Institutional Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-4 text-xs text-center no-print mt-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-xs bg-[#8b0000] text-white font-bold text-[10px] flex items-center justify-center">U</span>
            <span className="font-semibold text-slate-300">UFSCar Sorocaba & WorkWiser — Gestão de Horas</span>
          </div>
          <div className="text-slate-400 font-mono text-[11px]">
            WCAG 2.1 AAA • Protótipo de Produção
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <AccessibilityProvider>
      <AppStateProvider>
        <MainApp />
      </AppStateProvider>
    </AccessibilityProvider>
  );
}
