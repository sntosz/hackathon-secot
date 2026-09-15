export type ActivityCategory = 
  | 'Ensino'
  | 'Extensão'
  | 'Pesquisa'
  | 'Gestão & Representação'
  | 'Cultura, Esporte & Integração';

export type CertificateStatus = 'PENDENTE' | 'APROVADO' | 'INDEFERIDO' | 'RASCUNHO';

export interface Certificate {
  id: string;
  studentRa: string;
  studentName: string;
  title: string;
  category: ActivityCategory;
  issuer: string;
  submissionDate: string;
  completionDate?: string;
  hours: number;
  status: CertificateStatus;
  hash: string;
  feedback?: string;
  description?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
}

export interface Student {
  ra: string;
  name: string;
  initials: string;
  course: string;
  campus: string;
  pedagogicalProject: string;
  status: 'Matrícula Regular' | 'Formando' | 'Trancado';
  requiredHours: number;
  approvedHours: number;
  pendingHours: number;
}

export interface CategoryProgress {
  category: ActivityCategory;
  displayName: string;
  currentHours: number;
  maxHours: number;
  color: string;
  description: string;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  dyslexiaFont: boolean;
  fontSize: 'normal' | 'large' | 'extralarge';
  focusMode: boolean;
  audioFeedback: boolean;
}
