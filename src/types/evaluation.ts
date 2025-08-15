// =============================================================================
// TYPES UNIFIÉS DU SYSTÈME D'ÉVALUATION KIDAILY
// =============================================================================
// Ces types sont partagés entre l'application web et mobile
// pour assurer la cohérence des données
// =============================================================================

// =============================================================================
// TYPES DE BASE
// =============================================================================

export type EvaluationStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'REVIEWED' | 'ARCHIVED';
export type MilestoneStatus = 'PENDING' | 'ACHIEVED' | 'DELAYED' | 'ADVANCED';
export type QuestionType = 'LIKERT_5' | 'LIKERT_3' | 'YES_NO' | 'MULTIPLE_CHOICE' | 'TEXT';
export type QuestionCategory = 'DEVELOPMENTAL' | 'BEHAVIORAL' | 'ACADEMIC' | 'SOCIAL' | 'EMOTIONAL';

// =============================================================================
// INTERFACES DES QUESTIONS D'ÉVALUATION
// =============================================================================

export interface EvaluationQuestion {
  id: string;
  question: string;
  domainId: string;
  order: number;
  questionType: QuestionType;
  options: string[];
  weights: number[];
  minAge: number; // Âge minimum en mois
  maxAge: number; // Âge maximum en mois
  category: QuestionCategory;
  isRequired: boolean;
  helpText?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EvaluationDomain {
  id: string;
  name: string;
  description?: string;
  order: number;
  color?: string; // Couleur hexadécimale
  icon?: string; // Nom de l'icône Material-UI
  templateId: string;
  questions: EvaluationQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EvaluationTemplate {
  id: string;
  name: string;
  description?: string;
  version: string;
  isActive: boolean;
  domains: EvaluationDomain[];
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// INTERFACES DES ÉVALUATIONS
// =============================================================================

export interface EvaluationAnswer {
  id: string;
  evaluationId: string;
  questionId: string;
  answer: string;
  score?: number;
  weight?: number;
  notes?: string;
  timeSpent?: number; // Temps passé en secondes
  createdAt: Date;
  updatedAt: Date;
}

export interface Evaluation {
  id: string;
  title: string;
  description?: string;
  status: EvaluationStatus;
  childId: string;
  evaluatorId: string;
  templateId?: string;
  ageInMonths: number;
  startedAt?: Date;
  completedAt?: Date;
  
  // Scores calculés
  overallScore?: number;
  overallPercentile?: number;
  domainScores?: Record<string, number>;
  
  // Métadonnées
  notes?: string;
  tags?: string[];
  isPublic: boolean;
  
  // Relations
  child?: Child;
  evaluator?: User;
  template?: EvaluationTemplate;
  answers: EvaluationAnswer[];
  
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// INTERFACES DES RÉSULTATS ET ANALYSES
// =============================================================================

export interface DomainScore {
  domainId: string;
  domainName: string;
  score: number;
  percentile: number;
  totalQuestions: number;
  answeredQuestions: number;
  averageScore: number;
  maxPossibleScore: number;
}

export interface EvaluationResult {
  id: string;
  evaluationId: string;
  childId: string;
  
  // Scores détaillés
  overallScore: number;
  overallPercentile: number;
  domainScores: DomainScore[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  
  // Métadonnées
  analysisDate: Date;
  isAnalyzed: boolean;
  analyzedBy?: string;
  
  // Relations
  evaluation?: Evaluation;
  child?: Child;
  analyzer?: User;
  
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// INTERFACES POUR LE SUIVI ET LES PROGRÈS
// =============================================================================

export interface DevelopmentMilestone {
  id: string;
  childId: string;
  domain: string;
  milestone: string;
  expectedAge: number; // Âge attendu en mois
  achievedAge?: number; // Âge d'accomplissement en mois
  status: MilestoneStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgressTracking {
  id: string;
  childId: string;
  domain: string;
  date: Date;
  score: number;
  previousScore?: number;
  improvement?: number; // Amélioration en pourcentage
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// INTERFACES POUR LES CALCULS ET ANALYSES
// =============================================================================

export interface ScoreCalculation {
  questionId: string;
  answer: string;
  selectedOption: string;
  score: number;
  weight: number;
  weightedScore: number;
  maxPossibleScore: number;
}

export interface DomainAnalysis {
  domainId: string;
  domainName: string;
  totalQuestions: number;
  answeredQuestions: number;
  totalScore: number;
  maxPossibleScore: number;
  percentage: number;
  percentile: number;
  status: 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'BELOW_AVERAGE' | 'NEEDS_ATTENTION';
}

export interface OverallAnalysis {
  totalQuestions: number;
  answeredQuestions: number;
  overallScore: number;
  maxPossibleScore: number;
  overallPercentage: number;
  overallPercentile: number;
  domainAnalyses: DomainAnalysis[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  nextEvaluationDate?: Date;
}

// =============================================================================
// INTERFACES POUR LES FILTRES ET REQUÊTES
// =============================================================================

export interface EvaluationFilters {
  childId?: string;
  status?: EvaluationStatus;
  dateFrom?: Date;
  dateTo?: Date;
  ageRange?: {
    min: number;
    max: number;
  };
  domains?: string[];
  evaluatorId?: string;
  isPublic?: boolean;
}

export interface QuestionFilters {
  ageRange?: {
    min: number;
    max: number;
  };
  domains?: string[];
  categories?: QuestionCategory[];
  questionTypes?: QuestionType[];
  isRequired?: boolean;
}

// =============================================================================
// INTERFACES POUR LES RÉPONSES API
// =============================================================================

export interface EvaluationListResponse {
  evaluations: Evaluation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface EvaluationStatsResponse {
  totalEvaluations: number;
  completedEvaluations: number;
  draftEvaluations: number;
  inProgressEvaluations: number;
  averageScore: number;
  evaluationsThisMonth: number;
  evaluationsThisYear: number;
  topDomains: {
    domain: string;
    averageScore: number;
    evaluationCount: number;
  }[];
}

export interface ProgressResponse {
  childId: string;
  period: 'week' | 'month' | 'year' | 'custom';
  startDate: Date;
  endDate: Date;
  overallProgress: number;
  domainProgress: Record<string, number>;
  milestones: DevelopmentMilestone[];
  recentEvaluations: Evaluation[];
  recommendations: string[];
}

// =============================================================================
// TYPES UTILITAIRES
// =============================================================================

export type AgeGroup = '0-12' | '12-24' | '24-36' | '36-60' | '60+';

export interface AgeGroupConfig {
  value: AgeGroup;
  label: string;
  minMonths: number;
  maxMonths: number;
  description: string;
}

export const AGE_GROUPS: AgeGroupConfig[] = [
  {
    value: '0-12',
    label: '0-12 mois',
    minMonths: 0,
    maxMonths: 12,
    description: 'Nourrisson - Développement sensoriel et moteur de base'
  },
  {
    value: '12-24',
    label: '1-2 ans',
    minMonths: 12,
    maxMonths: 24,
    description: 'Toddler - Premiers pas, premiers mots, exploration'
  },
  {
    value: '24-36',
    label: '2-3 ans',
    minMonths: 24,
    maxMonths: 36,
    description: 'Préscolaire - Langage, motricité fine, socialisation'
  },
  {
    value: '36-60',
    label: '3-5 ans',
    minMonths: 36,
    maxMonths: 60,
    description: 'Maternelle - Préparation scolaire, créativité, autonomie'
  },
  {
    value: '60+',
    label: '5+ ans',
    minMonths: 60,
    maxMonths: 120,
    description: 'Scolaire - Apprentissages formels, compétences avancées'
  }
];

// =============================================================================
// INTERFACES DES UTILISATEURS ET ENFANTS (EXTENSIONS)
// =============================================================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  // ... autres champs existants
}

export interface Child {
  id: string;
  name: string;
  birthDate: Date;
  gender: string;
  // ... autres champs existants
}
