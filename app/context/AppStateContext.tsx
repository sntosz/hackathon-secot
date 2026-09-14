'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Certificate, StudentProfile, SubmissionBatch } from '../types';
import { INITIAL_CERTIFICATES, INITIAL_STUDENT_PROFILE, INITIAL_BATCHES } from '../data/mockData';
import { useAccessibility } from './AccessibilityContext';

interface AppStateContextType {
  profile: StudentProfile;
  certificates: Certificate[];
  batches: SubmissionBatch[];
  addCertificate: (cert: Omit<Certificate, 'id' | 'createdAt'>) => Certificate;
  updateCertificate: (id: string, certData: Partial<Certificate>) => void;
  deleteCertificate: (id: string) => void;
  submitBatch: (certificateIds: string[], recipientEmail?: string) => SubmissionBatch;
  reviewCertificate: (id: string, status: Certificate['status'], feedback?: string, hoursApproved?: number) => void;
  resetAllData: () => void;
  activeRole: 'student' | 'professor';
  setActiveRole: (role: 'student' | 'professor') => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [batches, setBatches] = useState<SubmissionBatch[]>(INITIAL_BATCHES);
  const [activeRole, setActiveRole] = useState<'student' | 'professor'>('student');
  const [isLoaded, setIsLoaded] = useState(false);
  const { announce } = useAccessibility();

  useEffect(() => {
    const savedCertificates = localStorage.getItem('ufscar_certificates');
    const savedBatches = localStorage.getItem('ufscar_batches');
    const savedProfile = localStorage.getItem('ufscar_profile');

    if (savedCertificates) {
      try { setCertificates(JSON.parse(savedCertificates)); } catch (e) {}
    }
    if (savedBatches) {
      try { setBatches(JSON.parse(savedBatches)); } catch (e) {}
    }
    if (savedProfile) {
      try { setProfile(JSON.parse(savedProfile)); } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('ufscar_certificates', JSON.stringify(certificates));
  }, [certificates, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('ufscar_batches', JSON.stringify(batches));
  }, [batches, isLoaded]);

  const addCertificate = (certData: Omit<Certificate, 'id' | 'createdAt'>) => {
    const newCert: Certificate = {
      ...certData,
      id: `cert-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCertificates((prev) => [newCert, ...prev]);
    announce(`Certificado "${newCert.title}" adicionado com sucesso.`);
    return newCert;
  };

  const updateCertificate = (id: string, certData: Partial<Certificate>) => {
    setCertificates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...certData } : c))
    );
    announce(`Certificado atualizado com sucesso.`);
  };

  const deleteCertificate = (id: string) => {
    setCertificates((prev) => {
      const found = prev.find((c) => c.id === id);
      if (found) {
        announce(`Certificado "${found.title}" excluído.`);
      }
      return prev.filter((c) => c.id !== id);
    });
  };

  const submitBatch = (certificateIds: string[], recipientEmail?: string) => {
    const selectedCerts = certificates.filter((c) => certificateIds.includes(c.id));
    const totalHours = selectedCerts.reduce((acc, c) => acc + c.hoursRequested, 0);

    const newBatch: SubmissionBatch = {
      id: `batch-${Date.now()}`,
      createdAt: new Date().toISOString(),
      certificateIds,
      totalHours,
      status: 'pending',
      recipientEmail: recipientEmail || profile.advisorEmail,
    };

    setBatches((prev) => [newBatch, ...prev]);

    // Update state of certificates to submitted
    setCertificates((prev) =>
      prev.map((c) =>
        certificateIds.includes(c.id) ? { ...c, status: 'submitted' } : c
      )
    );

    announce(`Lote de ${selectedCerts.length} certificados enviado para validação com sucesso.`);
    return newBatch;
  };

  const reviewCertificate = (id: string, status: Certificate['status'], feedback?: string, hoursApproved?: number) => {
    setCertificates((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status,
              feedback: feedback || c.feedback,
              hoursApproved: hoursApproved !== undefined ? hoursApproved : (status === 'approved' ? c.hoursRequested : 0),
            }
          : c
      )
    );
    announce(`Status do certificado alterado para ${status}.`);
  };

  const resetAllData = () => {
    setCertificates(INITIAL_CERTIFICATES);
    setProfile(INITIAL_STUDENT_PROFILE);
    setBatches(INITIAL_BATCHES);
    localStorage.removeItem('ufscar_certificates');
    localStorage.removeItem('ufscar_batches');
    localStorage.removeItem('ufscar_profile');
    announce(`Dados do protótipo restaurados para o estado inicial.`);
  };

  return (
    <AppStateContext.Provider
      value={{
        profile,
        certificates,
        batches,
        addCertificate,
        updateCertificate,
        deleteCertificate,
        submitBatch,
        reviewCertificate,
        resetAllData,
        activeRole,
        setActiveRole,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
};
