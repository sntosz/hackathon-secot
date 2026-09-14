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
        title="Regulamento & Pergunta Frequentes (UFSCar)"
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs text-slate-800 dark:text-slate-200">
          {UFSCAR_FAQ.map((faq, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="font-extrabold text-[#9e1b22] dark:text-red-400 flex items-center gap-1.5 text-sm">
                <HelpCircle className="w-4 h-4 shrink-0" />
                <span>{faq.q}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed pl-5">
                {faq.a}
              </p>
            </div>
          ))}
          <button
            onClick={() => setIsFAQOpen(false)}
            className="w-full bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-extrabold py-2 rounded-xl text-xs mt-2"
          >
            Entendido
          </button>
        </div>
      </Modal>

      {/* Audit Log Modal */}
      <Modal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        title="Histórico de Ações & Rastreabilidade do Aluno"
        maxWidth="lg"
      >
        <div className="space-y-3 text-xs text-slate-800 dark:text-slate-200">
          {auditLogs.length === 0 ? (
            <p className="text-slate-500 text-center py-4">Nenhuma ação registrada ainda.</p>
          ) : (
            auditLogs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                    <History className="w-3.5 h-3.5 text-[#9e1b22] dark:text-red-400" />
                    {log.action}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium">{log.details}</p>
              </div>
            ))
          )}
          <button
            onClick={() => setIsAuditOpen(false)}
            className="w-full bg-slate-900 dark:bg-slate-800 text-white font-extrabold py-2 rounded-xl text-xs mt-2"
          >
            Fechar Histórico
          </button>
        </div>
      </Modal>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-xs text-center no-print mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#9e1b22] text-white font-extrabold text-xs flex items-center justify-center">U</span>
            <span className="font-extrabold text-slate-200">UFSCar Sorocaba & WorkWiser Hackathon 2024</span>
          </div>
          <div className="text-slate-400 font-medium">
            Acessibilidade WCAG 2.1 AAA • Protótipo Independente
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
