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

function MainApp() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'certificates' | 'reports' | 'portal'>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Accessibility Header and Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => setActiveTab(tab as any)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Main Content View Container */}
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

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-xs text-center no-print mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="font-bold text-slate-200">UFSCar Sorocaba & WorkWiser Hackathon 2024</span>
            <span className="mx-2">•</span>
            <span>Sistema de Validação de Horas Complementares</span>
          </div>
          <div className="text-slate-500">
            Acessibilidade WCAG 2.1 AAA • Protótipo Navegável Autônomo
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
