'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Certificate, StudentProfile, SubmissionBatch, AuditLogItem, ToastMessage } from '../types';
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
  toasts: ToastMessage[];
  addToast: (type: ToastMessage['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  addCertificate: (cert: Omit<Certificate, 'id' | 'createdAt'>) => Certificate;
  updateCertificate: (id: string, certData: Partial<Certificate>) => boolean;
  deleteCertificate: (id: string) => void;
  submitBatch: (certificateIds: string[], recipientEmail?: string) => SubmissionBatch | null;
  reviewCertificate: (id: string, status: Certificate['status'], feedback?: string, hoursApproved?: number) => void;
  changeCourse: (courseId: string) => void;
  exportJSONBackup: () => void;
  importJSONBackup: (jsonData: string) => Promise<boolean>;
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
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeRole, setActiveRole] = useState<'student' | 'professor'>('student');
  const [isLoaded, setIsLoaded] = useState(false);
  const { announce } = useAccessibility();

  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = { id, type, title, message };
    setToasts((prev) => [...prev, newToast]);
    announce(`${title}: ${message}`, type === 'error' ? 'assertive' : 'polite');
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

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

    // Sync with API route asynchronously
    fetch('/api/certificates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(certificates),
    }).catch(() => {});
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
    const nowStr = new Date().toISOString();
    const newCert: Certificate = {
      ...certData,
      id: `cert-${Date.now()}`,
      createdAt: nowStr,
      updatedAt: nowStr,
      verificationCode: certData.verificationCode || verCode,
      history: [
        {
          timestamp: nowStr,
          action: 'Cadastro Inicial',
          role: 'student',
          details: `Atividade cadastrada como Rascunho com ${certData.hoursRequested}h solicitadas.`,
        },
      ],
    };
    setCertificates((prev) => [newCert, ...prev]);
    addAuditLog('Cadastrou Certificado', 'student', `Atividade "${newCert.title}" (${newCert.hoursRequested}h) registrada.`);
    addToast('success', 'Certificado Cadastrado', `A atividade "${newCert.title}" foi salva como rascunho.`);
    return newCert;
  };

  const updateCertificate = (id: string, certData: Partial<Certificate>): boolean => {
    let updated = false;
    const nowStr = new Date().toISOString();

    setCertificates((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          updated = true;
          const newHistory = [
            ...(c.history || []),
            {
              timestamp: nowStr,
              action: 'Edição de Dados',
              role: activeRole,
              details: `Informações da atividade alteradas (Título: ${certData.title || c.title}, Carga: ${certData.hoursRequested || c.hoursRequested}h).`,
            },
          ];
          return {
            ...c,
            ...certData,
            updatedAt: nowStr,
            history: newHistory,
          };
        }
        return c;
      })
    );

    if (updated) {
      addAuditLog('Atualizou Certificado', activeRole, `Dados do certificado "${id}" atualizados.`);
      addToast('info', 'Registro Atualizado', 'As alterações na atividade foram salvas.');
    }
    return updated;
  };

  const deleteCertificate = (id: string) => {
    setCertificates((prev) => {
      const found = prev.find((c) => c.id === id);
      if (found) {
        addAuditLog('Excluiu Certificado', 'student', `Removido o registro "${found.title}".`);
        addToast('warning', 'Certificado Removido', `O registro "${found.title}" foi excluído com sucesso.`);
      }
      return prev.filter((c) => c.id !== id);
    });
  };

  const submitBatch = (certificateIds: string[], recipientEmail?: string): SubmissionBatch | null => {
    const selectedCerts = certificates.filter(
      (c) => certificateIds.includes(c.id) && (c.status === 'draft' || c.status === 'needs_info')
    );

    if (selectedCerts.length === 0) {
      addToast('error', 'Envio Bloqueado', 'Selecione ao menos um rascunho ou item pendente para incluir no lote.');
      return null;
    }

    const totalHours = selectedCerts.reduce((acc, c) => acc + c.hoursRequested, 0);
    const protocolNumber = `PROT-UFSCAR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const nowStr = new Date().toISOString();

    const newBatch: SubmissionBatch = {
      id: `batch-${Date.now()}`,
      createdAt: nowStr,
      certificateIds,
      totalHours,
      status: 'pending',
      recipientEmail: recipientEmail || profile.advisorEmail,
      protocolNumber,
    };

    setBatches((prev) => [newBatch, ...prev]);

    setCertificates((prev) =>
      prev.map((c) => {
        if (certificateIds.includes(c.id)) {
          const newHistory = [
            ...(c.history || []),
            {
              timestamp: nowStr,
              action: 'Enviado para Análise',
              role: 'student' as const,
              details: `Incluso no protocolo ${protocolNumber} para ${recipientEmail || 'secretaria'}.`,
            },
          ];
          return { ...c, status: 'submitted', history: newHistory, updatedAt: nowStr };
        }
        return c;
      })
    );

    addAuditLog('Enviou Lote para Homologação', 'student', `Gerado protocolo ${protocolNumber} com ${selectedCerts.length} atividades (${totalHours}h).`);
    addToast('success', 'Lote Protocolado', `Protocolo ${protocolNumber} gerado com ${selectedCerts.length} atividade(s).`);
    return newBatch;
  };

  const reviewCertificate = (
    id: string,
    status: Certificate['status'],
    feedback?: string,
    hoursApproved?: number
  ) => {
    const nowStr = new Date().toISOString();
    const targetCert = certificates.find((c) => c.id === id);

    if (!targetCert) return;

    const approvedHoursVal = hoursApproved !== undefined
      ? hoursApproved
      : (status === 'approved' ? targetCert.hoursRequested : 0);

    setCertificates((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const newHistory = [
            ...(c.history || []),
            {
              timestamp: nowStr,
              action: status === 'approved' ? 'Deferimento Docente' : (status === 'needs_info' ? 'Solicitação de Ajuste' : 'Indeferimento'),
              role: 'professor' as const,
              details: `Status alterado para ${status}. Horas deferidas: ${approvedHoursVal}h. Parecer: ${feedback || 'Sem parecer.'}`,
            },
          ];
          return {
            ...c,
            status,
            feedback: feedback || c.feedback,
            hoursApproved: approvedHoursVal,
            updatedAt: nowStr,
            history: newHistory,
          };
        }
        return c;
      })
    );

    addAuditLog(
      status === 'approved' ? 'Aprovou Certificado' : (status === 'needs_info' ? 'Solicitou Ajustes' : 'Indeferiu Certificado'),
      'professor',
      `Avaliador revisou "${targetCert.title}" -> ${status} (${approvedHoursVal}h deferidas).`
    );

    const labels = {
      approved: 'Deferido',
      rejected: 'Indeferido',
      needs_info: 'Pendente Correção',
      submitted: 'Em Análise',
      draft: 'Rascunho',
    };

    addToast('info', 'Parecer Registrado', `Atividade "${targetCert.title}" atualizada para: ${labels[status]}.`);
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
      addToast('info', 'Matriz Curricular Atualizada', `Curso alterado para ${course.name} (${course.totalHours}h exigidas).`);
    }
  };

  const exportJSONBackup = () => {
    const data = {
      profile,
      certificates,
      batches,
      auditLogs,
      exportedAt: new Date().toISOString(),
      schemaVersion: 'SIGA_COMPLEMENTARY_HOURS_SCHEMA_v1',
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_ufscar_${profile.ra}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('success', 'Backup Exportado', 'Arquivo de dados baixado com sucesso.');
  };

  const importJSONBackup = async (jsonData: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonData,
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        addToast('error', 'Erro na Importação', result.error || 'Arquivo de backup inválido.');
        return false;
      }

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

      addAuditLog('Importou Backup', 'system', `Importadas ${parsed.certificates.length} atividades de arquivo JSON.`);
      addToast('success', 'Dados Restaurados', 'Sua base de certificados foi atualizada a partir do arquivo.');
      return true;
    } catch (e) {
      addToast('error', 'Falha na Leitura', 'Formato de arquivo JSON corrompido ou incompatível.');
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
    addToast('info', 'Dados Restaurados', 'Base de dados redefinida para os padrões da UFSCar.');
  };

  return (
    <AppStateContext.Provider
      value={{
        profile,
        setProfile,
        certificates,
        batches,
        auditLogs,
        toasts,
        addToast,
        removeToast,
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
