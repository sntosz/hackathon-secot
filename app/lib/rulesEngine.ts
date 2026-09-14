import { Certificate, CategoryId, CategoryRule, StudentProfile } from '../types';
import { CATEGORY_RULES, UFSCAR_COURSES } from '../data/mockData';

export interface CategoryProgress {
  rule: CategoryRule;
  approvedHours: number;
  pendingHours: number;
  draftHours: number;
  effectiveApprovedHours: number; // Capped at maxHours
  minHoursMet: boolean;
  maxHoursReached: boolean;
  remainingForMin: number;
  hoursCapped: number; // Surplus hours above max limit
}

export interface SummaryStats {
  totalRequired: number;
  approvedHours: number;
  effectiveApprovedHours: number; // Sum of capped category hours
  pendingHours: number;
  remainingTotalHours: number;
  progressPercent: number;
  isGraduateEligible: boolean;
  categoryProgressList: CategoryProgress[];
  alerts: Array<{
    type: 'warning' | 'error' | 'success' | 'info';
    code: string;
    message: string;
  }>;
}

export class RulesEngine {
  /**
   * Calculates detailed category and total progress according to UFSCar normas
   */
  public static calculateProgress(
    certificates: Certificate[],
    profile: StudentProfile
  ): SummaryStats {
    const course = UFSCAR_COURSES.find((c) => c.name === profile.course) || UFSCAR_COURSES[0];
    const totalRequired = course.totalHours || profile.totalHoursRequired;

    const approvedCerts = certificates.filter((c) => c.status === 'approved');
    const pendingCerts = certificates.filter((c) => c.status === 'submitted');
    const draftCerts = certificates.filter((c) => c.status === 'draft' || c.status === 'needs_info');

    let totalRawApproved = 0;
    let totalEffectiveApproved = 0;
    let totalPending = 0;

    const alerts: SummaryStats['alerts'] = [];

    const categoryProgressList: CategoryProgress[] = (Object.keys(CATEGORY_RULES) as CategoryId[]).map(
      (catId) => {
        const rule = CATEGORY_RULES[catId];

        const catApprovedCerts = approvedCerts.filter((c) => c.categoryId === catId);
        const catPendingCerts = pendingCerts.filter((c) => c.categoryId === catId);
        const catDraftCerts = draftCerts.filter((c) => c.categoryId === catId);

        const approvedHours = catApprovedCerts.reduce(
          (acc, c) => acc + (c.hoursApproved ?? c.hoursRequested),
          0
        );
        const pendingHours = catPendingCerts.reduce((acc, c) => acc + c.hoursRequested, 0);
        const draftHours = catDraftCerts.reduce((acc, c) => acc + c.hoursRequested, 0);

        const effectiveApprovedHours = Math.min(approvedHours, rule.maxHours);
        const hoursCapped = Math.max(0, approvedHours - rule.maxHours);

        totalRawApproved += approvedHours;
        totalEffectiveApproved += effectiveApprovedHours;
        totalPending += pendingHours;

        const minHoursMet = effectiveApprovedHours >= rule.minHours;
        const maxHoursReached = approvedHours >= rule.maxHours;
        const remainingForMin = Math.max(0, rule.minHours - effectiveApprovedHours);

        if (!minHoursMet) {
          alerts.push({
            type: 'warning',
            code: `MIN_NOT_MET_${catId.toUpperCase()}`,
            message: `Modalidade ${rule.name}: faltam ${remainingForMin}h para atingir o piso mínimo exigido (${rule.minHours}h).`,
          });
        }

        if (hoursCapped > 0) {
          alerts.push({
            type: 'info',
            code: `MAX_EXCEEDED_${catId.toUpperCase()}`,
            message: `Modalidade ${rule.name}: ${hoursCapped}h excederam o teto limite (${rule.maxHours}h) e não serão contabilizadas para a graduação.`,
          });
        }

        return {
          rule,
          approvedHours,
          pendingHours,
          draftHours,
          effectiveApprovedHours,
          minHoursMet,
          maxHoursReached,
          remainingForMin,
          hoursCapped,
        };
      }
    );

    const remainingTotalHours = Math.max(0, totalRequired - totalEffectiveApproved);
    const progressPercent = Math.min(100, Math.round((totalEffectiveApproved / totalRequired) * 100));

    const allCategoriesMetMin = categoryProgressList.every((cp) => cp.minHoursMet);
    const isGraduateEligible = totalEffectiveApproved >= totalRequired && allCategoriesMetMin;

    if (isGraduateEligible) {
      alerts.unshift({
        type: 'success',
        code: 'ELIGIBLE_FOR_GRADUATION',
        message: 'Parabéns! Você cumpriu a carga horária e todas as exigências por modalidade para colar grau na UFSCar.',
      });
    }

    return {
      totalRequired,
      approvedHours: totalRawApproved,
      effectiveApprovedHours: totalEffectiveApproved,
      pendingHours: totalPending,
      remainingTotalHours,
      progressPercent,
      isGraduateEligible,
      categoryProgressList,
      alerts,
    };
  }

  /**
   * Form validation rules for certificate registration / editing
   */
  public static validateCertificateForm(data: {
    title: string;
    issuer: string;
    hoursRequested: number;
    issueDate: string;
    categoryId: CategoryId;
  }): { isValid: boolean; errors: { [key: string]: string } } {
    const errors: { [key: string]: string } = {};

    if (!data.title || data.title.trim().length < 5) {
      errors.title = 'O título da atividade deve ter pelo menos 5 caracteres.';
    }

    if (!data.issuer || data.issuer.trim().length < 3) {
      errors.issuer = 'Informe a instituição ou órgão emissor responsável.';
    }

    if (!data.hoursRequested || isNaN(data.hoursRequested) || data.hoursRequested <= 0) {
      errors.hoursRequested = 'A carga horária deve ser um número maior que zero.';
    } else if (data.hoursRequested > 200) {
      errors.hoursRequested = 'A carga horária de uma única atividade não pode exceder 200 horas.';
    }

    if (!data.issueDate) {
      errors.issueDate = 'Informe uma data de emissão válida.';
    } else {
      const issueTime = new Date(data.issueDate).getTime();
      const nowTime = new Date().getTime();
      if (issueTime > nowTime + 86400000) {
        errors.issueDate = 'A data de emissão não pode ser no futuro.';
      }
    }

    if (!CATEGORY_RULES[data.categoryId]) {
      errors.categoryId = 'Selecione uma modalidade válida segundo as normas da UFSCar.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
