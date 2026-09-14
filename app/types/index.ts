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

export interface AuditLogItem {
  id: string;
  timestamp: string;
  action: string;
  userRole: 'student' | 'professor' | 'system';
  details: string;
}

export interface CertificateHistoryItem {
  timestamp: string;
  action: string;
  role: 'student' | 'professor' | 'system';
  details: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  categoryId: CategoryId;
  hoursRequested: number;
  hoursApproved?: number;
  issueDate: string;
  completionDate: string;
  fileName?: string;
  fileSize?: string;
  fileUrl?: string;
  status: CertificateStatus;
  feedback?: string;
  createdAt: string;
  updatedAt?: string;
  tags?: string[];
  verificationCode?: string; // Digital Hash Code UFSCar
  history?: CertificateHistoryItem[];
}

export interface StudentProfile {
  name: string;
  ra: string;
  course: string;
  campus: string;
  email: string;
  totalHoursRequired: number;
  advisorName?: string;
  advisorEmail?: string;
  entryYear?: string;
}

export interface SubmissionBatch {
  id: string;
  createdAt: string;
  certificateIds: string[];
  totalHours: number;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  secretariaNote?: string;
  recipientEmail?: string;
  protocolNumber?: string;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  dyslexicFont: boolean;
  reduceAnimations: boolean;
  screenReaderOptimized: boolean;
  theme: 'light' | 'dark';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}
