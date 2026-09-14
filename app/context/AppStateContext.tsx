'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Certificate, StudentProfile, SubmissionBatch, AuditLogItem } from '../types';
import {
  INITIAL_CERTIFICATES,
  INITIAL_STUDENT_PROFILE,
  INITIAL_BATCHES,
  INITIAL_AUDIT_LOGS,
  UFSCAR_COURSES
} from '../data/mockData';
import { useAccessibility } from './AccessibilityContext';

interface AppStateContextType {
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  certificates: Certificate[];
  batches: SubmissionBatch[];
  auditLogs: AuditLogItem[];
  addCertificate: (cert: Omit<Certificate, 'id' | 'createdAt'>) => Certificate;
  updateCertificate: (id: string, certData: Partial<Certificate>) => void;
  deleteCertificate: (id: string) => void;
  submitBatch: (certificateIds: string[], recipientEmail?: string) => SubmissionBatch;
  reviewCertificate: (id: string, status: Certificate['status'], feedback?: string, hoursApproved?: number) => void;
  changeCourse: (courseId: string) => void;
  exportJSONBackup: () => void;
  importJSONBackup: (jsonData: string) => boolean;
  resetAllData: () => void;
  activeRole: 'student' | 'professor';
  setActiveRole: (role: 'student' | 'professor') => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [batches, setBatches] = useState<SubmissionBatch[]>(INITIAL_BATCHES);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [activeRole, setActiveRole] = useState<'student' | 'professor'>('student');
  const [isLoaded, setIsLoaded] = useState(false);
  const { announce } = useAccessibility();

  useEffect(() => {
    const savedCertificates = localStorage.getItem('ufscar_certificates');
    const savedBatches = localStorage.getItem('ufscar_batches');
    const savedProfile = localStorage.getItem('ufscar_profile');
    const savedLogs = localStorage.getItem('ufscar_audit_logs');

    if (savedCertificates) {
      try { setCertificates(JSON.parse(savedCertificates)); } catch (e) {}
    }
    if (savedBatches) {
      try { setBatches(JSON.parse(savedBatches)); } catch (e) {}
    }
    if (savedProfile) {
      try { setProfile(JSON.parse(savedProfile)); } catch (e) {}
    }
    if (savedLogs) {
      try { setAuditLogs(JSON.parse(savedLogs)); } catch (e) {}
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

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('ufscar_profile', JSON.stringify(profile));
  }, [profile, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('ufscar_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs, isLoaded]);

  const addAuditLog = (action: string, userRole: 'student' | 'professor' | 'system', details: string) => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      userRole,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addCertificate = (certData: Omit<Certificate, 'id' | 'createdAt'>) => {
    const verCode = `UFSCAR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const newCert: Certificate = {
      ...certData,
      id: `cert-${Date.now()}`,
      createdAt: new Date().toISOString(),
      verificationCode: certData.verificationCode || verCode,
    };
    setCertificates((prev) => [newCert, ...prev]);
    addAuditLog('Cadastrou Certificado', 'student', `Atividade "${newCert.title}" (${newCert.hoursRequested}h) registrada.`);
    announce(`Certificado "${newCert.title}" cadastrado com sucesso.`);
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
        addAuditLog('Excluiu Certificado', 'student', `Removido o registro "${found.title}".`);
        announce(`Certificado "${found.title}" excluído.`);
      }
      return prev.filter((c) => c.id !== id);
    });
  };

  const submitBatch = (certificateIds: string[], recipientEmail?: string) => {
    const selectedCerts = certificates.filter((c) => certificateIds.includes(c.id));
    const totalHours = selectedCerts.reduce((acc, c) => acc + c.hoursRequested, 0);
    const protocolNumber = `PROT-UFSCAR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBatch: SubmissionBatch = {
      id: `batch-${Date.now()}`,
      createdAt: new Date().toISOString(),
      certificateIds,
      totalHours,
      status: 'pending',
      recipientEmail: recipientEmail || profile.advisorEmail,
      protocolNumber,
    };

    setBatches((prev) => [newBatch, ...prev]);

    setCertificates((prev) =>
      prev.map((c) =>
        certificateIds.includes(c.id) ? { ...c, status: 'submitted' } : c
      )
    );

    addAuditLog('Enviou Lote para Homologação', 'student', `Gerado protocolo ${protocolNumber} com ${selectedCerts.length} atividades (${totalHours}h).`);
    announce(`Lote de ${selectedCerts.length} certificados enviado para validação com protocolo ${protocolNumber}.`);
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

    const targetCert = certificates.find((c) => c.id === id);
    addAuditLog(
      status === 'approved' ? 'Aprovou Certificado' : 'Indeferiu Certificado',
      'professor',
      `Professor alterou status de "${targetCert?.title || id}" para ${status}. Parecer: ${feedback || 'Sem observações'}.`
    );
    announce(`Status do certificado alterado para ${status}.`);
  };

  const changeCourse = (courseId: string) => {
    const course = UFSCAR_COURSES.find((c) => c.id === courseId);
    if (course) {
      setProfile((prev) => ({
        ...prev,
        course: course.name,
        totalHoursRequired: course.totalHours,
      }));
      addAuditLog('Alterou Curso do Perfil', 'student', `Matrícula configurada para ${course.name} (${course.totalHours}h exigidas).`);
      announce(`Curso alterado para ${course.name}. Requisito atualizado para ${course.totalHours} horas.`);
    }
  };

  const exportJSONBackup = () => {
    const data = {
      profile,
      certificates,
      batches,
      auditLogs,
      exportedAt: new Date().toISOString(),
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_horas_ufscar_${profile.ra}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    announce('Backup em arquivo JSON baixado com sucesso!');
  };

  const importJSONBackup = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.certificates && Array.isArray(parsed.certificates)) {
        setCertificates(parsed.certificates);
      }
      if (parsed.profile) {
        setProfile(parsed.profile);
      }
      if (parsed.batches) {
        setBatches(parsed.batches);
      }
      if (parsed.auditLogs) {
        setAuditLogs(parsed.auditLogs);
      }
      announce('Dados do backup JSON importados com sucesso!');
      return true;
    } catch (e) {
      announce('Erro ao importar arquivo de backup JSON.', 'assertive');
      return false;
    }
  };

  const resetAllData = () => {
    setCertificates(INITIAL_CERTIFICATES);
    setProfile(INITIAL_STUDENT_PROFILE);
    setBatches(INITIAL_BATCHES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    localStorage.removeItem('ufscar_certificates');
    localStorage.removeItem('ufscar_batches');
    localStorage.removeItem('ufscar_profile');
    localStorage.removeItem('ufscar_audit_logs');
    announce(`Dados do protótipo restaurados para o padrão original da UFSCar.`);
  };

  return (
    <AppStateContext.Provider
      value={{
        profile,
        setProfile,
        certificates,
        batches,
        auditLogs,
        addCertificate,
        updateCertificate,
        deleteCertificate,
        submitBatch,
        reviewCertificate,
        changeCourse,
        exportJSONBackup,
        importJSONBackup,
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
