"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Certificate, Student, CategoryProgress, ActivityCategory, AccessibilitySettings } from '../lib/types';
import { initialStudent, initialCategoryRules, initialCertificates, triageStudents } from '../lib/mockData';

interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  onUndo?: () => void;
  undoLabel?: string;
}

interface HoursContextType {
  student: Student;
  certificates: Certificate[];
  categoryRules: CategoryProgress[];
  studentsList: Student[];
  currentStudentIndex: number;
  activeTriageStudent: Student;
  setCurrentStudentByRa: (ra: string) => void;
  nextStudent: () => void;
  prevStudent: () => void;
  accessibility: AccessibilitySettings;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  speakText: (text: string) => void;
  addCertificate: (cert: Omit<Certificate, 'id' | 'hash' | 'status' | 'submissionDate'>) => void;
  deferCertificate: (id: string, feedback?: string) => void;
  rejectCertificate: (id: string, feedback: string) => void;
  deferMultipleCertificates: (ids: string[], feedback?: string) => void;
  rejectMultipleCertificates: (ids: string[], feedback: string) => void;
  undoLastAction: () => void;
  canUndo: boolean;
  deleteCertificate: (id: string) => void;
  resetDemoData: () => void;
  toasts: Toast[];
  addToast: (message: string, type?: Toast['type'], onUndo?: () => void, undoLabel?: string) => void;
  removeToast: (id: string) => void;
  selectedCertificateForModal: Certificate | null;
  setSelectedCertificateForModal: (cert: Certificate | null) => void;
  reviewingCertificate: Certificate | null;
  setReviewingCertificate: (cert: Certificate | null) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isShortcutsOpen: boolean;
  setIsShortcutsOpen: (open: boolean) => void;
  isEmailModalOpen: boolean;
  setIsEmailModalOpen: (open: boolean) => void;
  activeRole: 'student' | 'secretary';
  setActiveRole: (role: 'student' | 'secretary') => void;
}

const HoursContext = createContext<HoursContextType | undefined>(undefined);

export const HoursProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [student, setStudent] = useState<Student>(initialStudent);
  const [certificates, setCertificates] = useState<Certificate[]>(initialCertificates);
  const [categoryRules, setCategoryRules] = useState<CategoryProgress[]>(initialCategoryRules);
  const [studentsList, setStudentsList] = useState<Student[]>(triageStudents);
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedCertificateForModal, setSelectedCertificateForModal] = useState<Certificate | null>(null);
  const [reviewingCertificate, setReviewingCertificate] = useState<Certificate | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [historyStack, setHistoryStack] = useState<{ certificates: Certificate[]; description: string }[]>([]);
  const [activeRole, setActiveRole] = useState<'student' | 'secretary'>('student');

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    highContrast: false,
    dyslexiaFont: false,
    fontSize: 'normal',
    focusMode: false,
    audioFeedback: false,
  });

  // Load from localStorage if present
  useEffect(() => {
    try {
      const savedCerts = localStorage.getItem('ufscar_horas_certs_v2');
      if (savedCerts) setCertificates(JSON.parse(savedCerts));
      const savedRole = localStorage.getItem('ufscar_horas_role');
      if (savedRole === 'student' || savedRole === 'secretary') setActiveRole(savedRole);
      const savedA11y = localStorage.getItem('ufscar_horas_a11y');
      if (savedA11y) setAccessibility(JSON.parse(savedA11y));
    } catch (e) {
      console.warn("Storage access failed", e);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ufscar_horas_certs_v2', JSON.stringify(certificates));
    } catch (e) {}
  }, [certificates]);

  useEffect(() => {
    try {
      localStorage.setItem('ufscar_horas_role', activeRole);
    } catch (e) {}
  }, [activeRole]);

  useEffect(() => {
    try {
      localStorage.setItem('ufscar_horas_a11y', JSON.stringify(accessibility));
    } catch (e) {}
  }, [accessibility]);

  // Apply accessibility classes to html
  useEffect(() => {
    const root = document.documentElement;
    if (accessibility.highContrast) {
      root.classList.add('high-contrast-mode');
    } else {
      root.classList.remove('high-contrast-mode');
    }

    if (accessibility.dyslexiaFont) {
      root.classList.add('dyslexia-font-mode');
    } else {
      root.classList.remove('dyslexia-font-mode');
    }

    root.classList.remove('font-size-normal', 'font-size-large', 'font-size-extralarge');
    root.classList.add(`font-size-${accessibility.fontSize}`);

    if (accessibility.focusMode) {
      root.classList.add('focus-assist-mode');
    } else {
      root.classList.remove('focus-assist-mode');
    }
  }, [accessibility]);

  // Keyboard shortcut listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setSelectedCertificateForModal(null);
        setReviewingCertificate(null);
        setIsAddModalOpen(false);
        setIsShortcutsOpen(false);
        setIsEmailModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Recalculate Lucas Ferreira Silva's hours dynamically
  useEffect(() => {
    const lucasCerts = certificates.filter(c => c.studentRa === "801234");
    const approved = lucasCerts
      .filter(c => c.status === 'APROVADO')
      .reduce((acc, c) => acc + c.hours, 0);

    const pending = lucasCerts
      .filter(c => c.status === 'PENDENTE')
      .reduce((acc, c) => acc + c.hours, 0);

    // Update category breakdown
    setCategoryRules(prev =>
      prev.map(cat => {
        const catApproved = lucasCerts
          .filter(c => c.category === cat.category && c.status === 'APROVADO')
          .reduce((acc, c) => acc + c.hours, 0);
        return {
          ...cat,
          currentHours: catApproved,
        };
      })
    );

    setStudent(prev => ({
      ...prev,
      approvedHours: approved,
      pendingHours: pending,
    }));
  }, [certificates]);

  const addToast = (
    message: string, 
    type: Toast['type'] = 'success', 
    onUndo?: () => void, 
    undoLabel?: string
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message, onUndo, undoLabel }]);
    if (accessibility.audioFeedback) {
      speakText(message);
    }
    setTimeout(() => {
      removeToast(id);
    }, onUndo ? 7000 : 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const saveHistory = (description: string) => {
    setHistoryStack(prev => [{ certificates: JSON.parse(JSON.stringify(certificates)), description }, ...prev.slice(0, 5)]);
  };

  const undoLastAction = () => {
    if (historyStack.length === 0) return;
    const [last, ...rest] = historyStack;
    setCertificates(last.certificates);
    setHistoryStack(rest);
    addToast(`Ação desfeita: ${last.description}`, 'info');
  };

  const updateAccessibility = (settings: Partial<AccessibilitySettings>) => {
    setAccessibility(prev => ({ ...prev, ...settings }));
  };

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const addCertificate = (certData: Omit<Certificate, 'id' | 'hash' | 'status' | 'submissionDate'>) => {
    saveHistory(`Envio do certificado ${certData.title}`);
    const randomHash = Array.from({ length: 20 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const newCert: Certificate = {
      ...certData,
      id: `cert-${Date.now()}`,
      studentRa: student.ra,
      studentName: student.name,
      hash: randomHash,
      status: 'PENDENTE',
      submissionDate: new Date().toLocaleDateString('pt-BR'),
      fileName: certData.fileName || 'certificado_digital_anexo.pdf',
      fileSize: certData.fileSize || '1.2 MB',
    };

    setCertificates(prev => [newCert, ...prev]);
    addToast(`Certificado "${newCert.title}" enviado com sucesso para triagem!`, 'success');
  };

  const deferCertificate = (id: string, feedback?: string) => {
    saveHistory(`Homologação de certificado`);
    const targetCert = certificates.find(c => c.id === id);
    const certStudent = targetCert ? targetCert.studentName : "Estudante";
    const certHours = targetCert ? targetCert.hours : 0;

    setCertificates(prev =>
      prev.map(c => {
        if (c.id === id) {
          return {
            ...c,
            status: 'APROVADO',
            feedback: feedback || 'Homologado pela Comissão Docente de Ciência da Computação.',
          };
        }
        return c;
      })
    );
    addToast(
      `Atividade homologada! +${certHours}h creditadas para ${certStudent}.`, 
      'success',
      undoLastAction,
      'Desfazer'
    );
  };

  const rejectCertificate = (id: string, feedback: string) => {
    saveHistory(`Indeferimento de certificado`);
    const targetCert = certificates.find(c => c.id === id);
    const certStudent = targetCert ? targetCert.studentName : "Estudante";

    setCertificates(prev =>
      prev.map(c => {
        if (c.id === id) {
          return {
            ...c,
            status: 'INDEFERIDO',
            feedback: feedback || 'Indeferido: certificado inconsistente com as diretrizes do PPC.',
          };
        }
        return c;
      })
    );
    addToast(
      `Atividade indeferida. Notificação técnica enviada para ${certStudent}.`, 
      'warning',
      undoLastAction,
      'Desfazer'
    );
  };

  const deferMultipleCertificates = (ids: string[], feedback?: string) => {
    saveHistory(`Homologação em lote de ${ids.length} certificados`);
    setCertificates(prev =>
      prev.map(c => {
        if (ids.includes(c.id)) {
          return {
            ...c,
            status: 'APROVADO',
            feedback: feedback || 'Homologado em lote pela Comissão Docente.',
          };
        }
        return c;
      })
    );
    addToast(
      `${ids.length} certificados homologados em lote!`, 
      'success', 
      undoLastAction, 
      'Desfazer'
    );
  };

  const rejectMultipleCertificates = (ids: string[], feedback: string) => {
    saveHistory(`Indeferimento em lote de ${ids.length} certificados`);
    setCertificates(prev =>
      prev.map(c => {
        if (ids.includes(c.id)) {
          return {
            ...c,
            status: 'INDEFERIDO',
            feedback: feedback || 'Indeferido em lote pela Comissão Docente.',
          };
        }
        return c;
      })
    );
    addToast(
      `${ids.length} certificados indeferidos em lote.`, 
      'warning', 
      undoLastAction, 
      'Desfazer'
    );
  };

  const deleteCertificate = (id: string) => {
    saveHistory(`Exclusão de certificado`);
    setCertificates(prev => prev.filter(c => c.id !== id));
    addToast('Certificado removido do prontuário.', 'info', undoLastAction, 'Desfazer');
  };

  const resetDemoData = () => {
    setCertificates(initialCertificates);
    setStudent(initialStudent);
    setCategoryRules(initialCategoryRules);
    setHistoryStack([]);
    try {
      localStorage.removeItem('ufscar_horas_certs_v2');
      localStorage.removeItem('ufscar_horas_triage_filters');
    } catch (e) {}
    addToast('Dados de demonstração restaurados para o padrão original!', 'info');
  };

  const setCurrentStudentByRa = (ra: string) => {
    const idx = studentsList.findIndex(s => s.ra === ra);
    if (idx !== -1) {
      setCurrentStudentIndex(idx);
    }
  };

  const activeTriageStudent = studentsList[currentStudentIndex] || initialStudent;

  const nextStudent = () => {
    setCurrentStudentIndex(prev => (prev + 1) % studentsList.length);
  };

  const prevStudent = () => {
    setCurrentStudentIndex(prev => (prev - 1 + studentsList.length) % studentsList.length);
  };

  return (
    <HoursContext.Provider
      value={{
        student,
        certificates,
        categoryRules,
        studentsList,
        currentStudentIndex,
        activeTriageStudent,
        setCurrentStudentByRa,
        nextStudent,
        prevStudent,
        accessibility,
        updateAccessibility,
        speakText,
        addCertificate,
        deferCertificate,
        rejectCertificate,
        deferMultipleCertificates,
        rejectMultipleCertificates,
        undoLastAction,
        canUndo: historyStack.length > 0,
        deleteCertificate,
        resetDemoData,
        toasts,
        addToast,
        removeToast,
        selectedCertificateForModal,
        setSelectedCertificateForModal,
        reviewingCertificate,
        setReviewingCertificate,
        isAddModalOpen,
        setIsAddModalOpen,
        isShortcutsOpen,
        setIsShortcutsOpen,
        isEmailModalOpen,
        setIsEmailModalOpen,
        activeRole,
        setActiveRole,
      }}
    >
      {children}
    </HoursContext.Provider>
  );
};

export const useHours = () => {
  const context = useContext(HoursContext);
  if (!context) {
    throw new Error('useHours must be used within an HoursProvider');
  }
  return context;
};
