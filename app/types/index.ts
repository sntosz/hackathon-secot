export type CategoryId = 'ensino' | 'pesquisa' | 'extensao' | 'vivencia';

export interface CategoryRule {
  id: CategoryId;
  name: string;
  description: string;
  minHours: number;
  maxHours: number;
  color: string;
  badgeBg: string;
}

export type CertificateStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'needs_info';

export interface Certificate {
  id: string;
  title: string;
  issuer: string; // Organização / Instituição emissora
  categoryId: CategoryId;
  hoursRequested: number;
  hoursApproved?: number;
  issueDate: string; // YYYY-MM-DD
  completionDate: string;
  fileName?: string;
  fileSize?: string;
  fileUrl?: string; // Simulated blob/data url
  status: CertificateStatus;
  feedback?: string;
  createdAt: string;
  tags?: string[];
}

export interface StudentProfile {
  name: string;
  ra: string; // Registro Acadêmico UFSCar
  course: string;
  campus: string;
  email: string;
  totalHoursRequired: number;
  advisorName?: string;
  advisorEmail?: string;
}

export interface SubmissionBatch {
  id: string;
  createdAt: string;
  certificateIds: string[];
  totalHours: number;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  secretariaNote?: string;
  recipientEmail?: string;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  dyslexicFont: boolean;
  reduceAnimations: boolean;
  screenReaderOptimized: boolean;
  theme: 'light' | 'dark' | 'system';
}
