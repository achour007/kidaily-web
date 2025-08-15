import ApiService from './api';

// Types pour les évaluations
export interface QuestionAnswer {
  questionId: string;
  answer: string;
  notes?: string;
}

export interface DomainScore {
  domain: string;
  score: number;
  totalQuestions: number;
  answeredQuestions: number;
  answers: QuestionAnswer[];
}

export interface Evaluation {
  id: string;
  childId: string;
  date: string;
  ageInMonths: number;
  domainScores: Record<string, DomainScore>;
  notes?: string;
  status: string;
  overallScore?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEvaluationData {
  childId: string;
  ageInMonths: number;
  domainScores: Record<string, DomainScore>;
  notes?: string;
}

export interface UpdateEvaluationData {
  domainScores?: Record<string, DomainScore>;
  notes?: string;
  status?: string;
}

export interface EvaluationStats {
  totalEvaluations: number;
  averageScore: number;
  domainAverages: Record<string, number>;
  progressOverTime: Array<{
    date: string;
    score: number;
  }>;
}

export interface EvaluationFilters {
  childId?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  domain?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Service évaluation
export class EvaluationService {
  // Récupérer toutes les évaluations
  static async getEvaluations(filters?: EvaluationFilters): Promise<{
    evaluations: Evaluation[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const response = await ApiService.get<{
      evaluations: Evaluation[];
      pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>('/evaluations', filters);
    return response;
  }

  // Récupérer une évaluation par ID
  static async getEvaluation(id: string): Promise<Evaluation> {
    const response = await ApiService.get<Evaluation>(`/evaluations/${id}`);
    return response;
  }

  // Créer une nouvelle évaluation
  static async createEvaluation(evaluationData: CreateEvaluationData): Promise<Evaluation> {
    const response = await ApiService.post<Evaluation>('/evaluations', evaluationData);
    return response;
  }

  // Mettre à jour une évaluation
  static async updateEvaluation(id: string, evaluationData: UpdateEvaluationData): Promise<Evaluation> {
    const response = await ApiService.put<Evaluation>(`/evaluations/${id}`, evaluationData);
    return response;
  }

  // Supprimer une évaluation
  static async deleteEvaluation(id: string): Promise<void> {
    await ApiService.delete(`/evaluations/${id}`);
  }

  // Récupérer les statistiques des évaluations
  static async getEvaluationStats(childId?: string): Promise<EvaluationStats> {
    const params = childId ? { childId } : undefined;
    const response = await ApiService.get<EvaluationStats>('/evaluations/stats', params);
    return response;
  }

  // Récupérer les questions d'évaluation par domaine
  static async getEvaluationQuestions(domain: string, ageInMonths: number): Promise<any> {
    const response = await ApiService.get(`/evaluations/questions`, {
      domain,
      ageInMonths,
    });
    return response;
  }

  // Sauvegarder une évaluation en cours
  static async saveDraft(evaluationData: CreateEvaluationData): Promise<Evaluation> {
    const response = await ApiService.post<Evaluation>('/evaluations/draft', evaluationData);
    return response;
  }

  // Finaliser une évaluation
  static async finalizeEvaluation(id: string): Promise<Evaluation> {
    const response = await ApiService.post<Evaluation>(`/evaluations/${id}/finalize`);
    return response;
  }

  // Exporter une évaluation en PDF
  static async exportToPDF(id: string): Promise<Blob> {
    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3000/api'}/evaluations/${id}/export`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'export PDF');
    }

    return response.blob();
  }

  // Calculer le score global d'une évaluation
  static calculateOverallScore(domainScores: Record<string, DomainScore>): number {
    const domains = Object.values(domainScores);
    if (domains.length === 0) return 0;

    const totalScore = domains.reduce((sum, domain) => sum + domain.score, 0);
    const totalQuestions = domains.reduce((sum, domain) => sum + domain.totalQuestions, 0);

    return totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0;
  }

  // Calculer le score d'un domaine
  static calculateDomainScore(answers: QuestionAnswer[], totalQuestions: number): number {
    if (totalQuestions === 0) return 0;

    const correctAnswers = answers.filter(answer => answer.answer === 'yes').length;
    return Math.round((correctAnswers / totalQuestions) * 100);
  }

  // Obtenir le statut d'une évaluation basé sur le score
  static getEvaluationStatus(overallScore: number): string {
    if (overallScore >= 80) return 'excellent';
    if (overallScore >= 60) return 'bon';
    if (overallScore >= 40) return 'moyen';
    return 'à améliorer';
  }

  // Obtenir les recommandations basées sur les scores
  static getRecommendations(domainScores: Record<string, DomainScore>): string[] {
    const recommendations: string[] = [];
    
    Object.entries(domainScores).forEach(([domain, score]) => {
      if (score.score < 60) {
        recommendations.push(`Renforcer les compétences en ${domain}`);
      }
    });

    return recommendations;
  }
}

export default EvaluationService; 