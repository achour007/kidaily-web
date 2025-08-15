// =============================================================================
// SERVICE D'ÉVALUATION UNIFIÉ KIDAILY
// =============================================================================
// Service professionnel pour la gestion complète des évaluations
// Intégration avec l'API backend et gestion des données locales
// =============================================================================

import { ApiService } from './api';
import {
  Evaluation,
  EvaluationQuestion,
  EvaluationDomain,
  EvaluationTemplate,
  EvaluationAnswer,
  EvaluationResult,
  OverallAnalysis,
  DomainAnalysis,
  ScoreCalculation,
  EvaluationFilters,
  QuestionFilters,
  AgeGroup,
  AGE_GROUPS,
  EvaluationStatus,
  QuestionType,
  QuestionCategory
} from '../types/evaluation';

// =============================================================================
// CONFIGURATION ET CONSTANTES
// =============================================================================

const EVALUATION_ENDPOINTS = {
  // Templates et questions
  TEMPLATES: '/evaluation-templates',
  DOMAINS: '/evaluation-domains',
  QUESTIONS: '/evaluation-questions',
  
  // Évaluations
  EVALUATIONS: '/evaluations',
  ANSWERS: '/evaluation-answers',
  RESULTS: '/evaluation-results',
  
  // Progrès et suivi
  PROGRESS: '/progress',
  MILESTONES: '/development-milestones',
  TRACKING: '/progress-tracking',
  
  // Statistiques et analyses
  STATS: '/evaluation-stats',
  ANALYTICS: '/evaluation-analytics'
} as const;

// =============================================================================
// CLASSE PRINCIPALE DU SERVICE D'ÉVALUATION
// =============================================================================

export class UnifiedEvaluationService {
  private static instance: UnifiedEvaluationService;
  private cache: Map<string, any> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  public static getInstance(): UnifiedEvaluationService {
    if (!UnifiedEvaluationService.instance) {
      UnifiedEvaluationService.instance = new UnifiedEvaluationService();
    }
    return UnifiedEvaluationService.instance;
  }

  // =============================================================================
  // GESTION DES TEMPLATES ET QUESTIONS
  // =============================================================================

  /**
   * Récupère tous les templates d'évaluation disponibles
   */
  public async getEvaluationTemplates(): Promise<EvaluationTemplate[]> {
    const cacheKey = 'evaluation_templates';
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await ApiService.get<EvaluationTemplate[]>(EVALUATION_ENDPOINTS.TEMPLATES);
      this.setCache(cacheKey, response);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des templates:', error);
      throw new Error('Impossible de récupérer les templates d\'évaluation');
    }
  }

  /**
   * Récupère les questions d'évaluation par tranche d'âge
   */
  public async getQuestionsByAge(ageInMonths: number): Promise<{
    domains: EvaluationDomain[];
    totalQuestions: number;
    ageGroup: AgeGroup;
  }> {
    const ageGroup = this.getAgeGroup(ageInMonths);
    const cacheKey = `questions_age_${ageGroup}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const filters: QuestionFilters = {
        ageRange: {
          min: AGE_GROUPS.find(ag => ag.value === ageGroup)?.minMonths || 0,
          max: AGE_GROUPS.find(ag => ag.value === ageGroup)?.maxMonths || 120
        }
      };

      const response = await ApiService.get<{
        domains: EvaluationDomain[];
        totalQuestions: number;
        ageGroup: AgeGroup;
      }>(`${EVALUATION_ENDPOINTS.QUESTIONS}/by-age`, filters);

      this.setCache(cacheKey, response);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des questions:', error);
      throw new Error('Impossible de récupérer les questions d\'évaluation');
    }
  }

  /**
   * Récupère les questions par domaine spécifique
   */
  public async getQuestionsByDomain(domainId: string, ageInMonths: number): Promise<EvaluationQuestion[]> {
    const cacheKey = `questions_domain_${domainId}_age_${ageInMonths}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await ApiService.get<EvaluationQuestion[]>(
        `${EVALUATION_ENDPOINTS.QUESTIONS}/by-domain/${domainId}`,
        { ageInMonths }
      );
      
      this.setCache(cacheKey, response);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des questions par domaine:', error);
      throw new Error('Impossible de récupérer les questions du domaine');
    }
  }

  // =============================================================================
  // GESTION DES ÉVALUATIONS
  // =============================================================================

  /**
   * Crée une nouvelle évaluation
   */
  public async createEvaluation(data: {
    childId: string;
    title: string;
    description?: string;
    ageInMonths: number;
    templateId?: string;
  }): Promise<Evaluation> {
    try {
      const evaluationData = {
        ...data,
        status: 'DRAFT' as EvaluationStatus,
        startedAt: new Date(),
        isPublic: false
      };

      const response = await ApiService.post<Evaluation>(
        EVALUATION_ENDPOINTS.EVALUATIONS,
        evaluationData
      );

      // Invalider le cache des évaluations
      this.invalidateCache('evaluations');
      
      return response;
    } catch (error) {
      console.error('Erreur lors de la création de l\'évaluation:', error);
      throw new Error('Impossible de créer l\'évaluation');
    }
  }

  /**
   * Sauvegarde les réponses d'une évaluation
   */
  public async saveEvaluationAnswers(
    evaluationId: string,
    answers: Array<{
      questionId: string;
      answer: string;
      notes?: string;
      timeSpent?: number;
    }>
  ): Promise<EvaluationAnswer[]> {
    try {
      const response = await ApiService.post<EvaluationAnswer[]>(
        `${EVALUATION_ENDPOINTS.EVALUATIONS}/${evaluationId}/answers`,
        { answers }
      );

      // Invalider le cache des évaluations
      this.invalidateCache('evaluations');
      
      return response;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des réponses:', error);
      throw new Error('Impossible de sauvegarder les réponses');
    }
  }

  /**
   * Finalise une évaluation et calcule les scores
   */
  public async finalizeEvaluation(evaluationId: string): Promise<{
    evaluation: Evaluation;
    result: EvaluationResult;
    analysis: OverallAnalysis;
  }> {
    try {
      const response = await ApiService.post<{
        evaluation: Evaluation;
        result: EvaluationResult;
        analysis: OverallAnalysis;
      }>(`${EVALUATION_ENDPOINTS.EVALUATIONS}/${evaluationId}/finalize`);

      // Invalider tous les caches liés
      this.invalidateCache('evaluations');
      this.invalidateCache('results');
      this.invalidateCache('progress');
      
      return response;
    } catch (error) {
      console.error('Erreur lors de la finalisation de l\'évaluation:', error);
      throw new Error('Impossible de finaliser l\'évaluation');
    }
  }

  /**
   * Récupère une évaluation par ID
   */
  public async getEvaluation(evaluationId: string): Promise<Evaluation> {
    const cacheKey = `evaluation_${evaluationId}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await ApiService.get<Evaluation>(
        `${EVALUATION_ENDPOINTS.EVALUATIONS}/${evaluationId}`
      );
      
      this.setCache(cacheKey, response);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'évaluation:', error);
      throw new Error('Impossible de récupérer l\'évaluation');
    }
  }

  /**
   * Récupère la liste des évaluations avec filtres
   */
  public async getEvaluations(filters?: EvaluationFilters): Promise<{
    evaluations: Evaluation[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const cacheKey = `evaluations_${JSON.stringify(filters)}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await ApiService.get<{
        evaluations: Evaluation[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>(EVALUATION_ENDPOINTS.EVALUATIONS, filters);
      
      this.setCache(cacheKey, response);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des évaluations:', error);
      throw new Error('Impossible de récupérer les évaluations');
    }
  }

  // =============================================================================
  // CALCULS ET ANALYSES
  // =============================================================================

  /**
   * Calcule les scores d'une évaluation
   */
  public calculateScores(
    questions: EvaluationQuestion[],
    answers: Record<string, string>
  ): ScoreCalculation[] {
    return questions.map(question => {
      const answer = answers[question.id];
      const optionIndex = question.options.indexOf(answer);
      const score = optionIndex >= 0 ? question.weights[optionIndex] || 0 : 0;
      const maxPossibleScore = Math.max(...question.weights);
      
      return {
        questionId: question.id,
        answer,
        selectedOption: answer,
        score,
        weight: question.weights[optionIndex] || 0,
        weightedScore: score * (question.weights[optionIndex] || 0),
        maxPossibleScore
      };
    });
  }

  /**
   * Analyse les scores par domaine
   */
  public analyzeDomainScores(
    domains: EvaluationDomain[],
    scoreCalculations: ScoreCalculation[]
  ): DomainAnalysis[] {
    return domains.map(domain => {
      const domainQuestions = domain.questions;
      const domainScores = scoreCalculations.filter(sc => 
        domainQuestions.some(q => q.id === sc.questionId)
      );

      const totalQuestions = domainQuestions.length;
      const answeredQuestions = domainScores.length;
      const totalScore = domainScores.reduce((sum, sc) => sum + sc.score, 0);
      const maxPossibleScore = domainQuestions.reduce((sum, q) => 
        sum + Math.max(...q.weights), 0
      );
      
      const percentage = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
      const status = this.getScoreStatus(percentage);

      return {
        domainId: domain.id,
        domainName: domain.name,
        totalQuestions,
        answeredQuestions,
        totalScore,
        maxPossibleScore,
        percentage,
        percentile: this.calculatePercentile(percentage),
        status
      };
    });
  }

  /**
   * Analyse globale d'une évaluation
   */
  public analyzeOverall(
    domains: EvaluationDomain[],
    scoreCalculations: ScoreCalculation[],
    domainAnalyses: DomainAnalysis[]
  ): OverallAnalysis {
    const totalQuestions = domains.reduce((sum, d) => sum + d.questions.length, 0);
    const answeredQuestions = scoreCalculations.length;
    const overallScore = scoreCalculations.reduce((sum, sc) => sum + sc.score, 0);
    const maxPossibleScore = domains.reduce((sum, d) => 
      sum + d.questions.reduce((qSum, q) => qSum + Math.max(...q.weights), 0), 0
    );

    const overallPercentage = maxPossibleScore > 0 ? (overallScore / maxPossibleScore) * 100 : 0;
    const overallPercentile = this.calculatePercentile(overallPercentage);

    const strengths = domainAnalyses
      .filter(da => da.status === 'EXCELLENT' || da.status === 'GOOD')
      .map(da => `${da.domainName}: ${da.percentage.toFixed(1)}%`);

    const weaknesses = domainAnalyses
      .filter(da => da.status === 'BELOW_AVERAGE' || da.status === 'NEEDS_ATTENTION')
      .map(da => `${da.domainName}: ${da.percentage.toFixed(1)}%`);

    const recommendations = this.generateRecommendations(domainAnalyses);

    return {
      totalQuestions,
      answeredQuestions,
      overallScore,
      maxPossibleScore,
      overallPercentage,
      overallPercentile,
      domainAnalyses,
      strengths,
      weaknesses,
      recommendations,
      nextEvaluationDate: this.calculateNextEvaluationDate(overallPercentage)
    };
  }

  // =============================================================================
  // GESTION DU PROGRÈS ET SUIVI
  // =============================================================================

  /**
   * Récupère le progrès d'un enfant
   */
  public async getChildProgress(
    childId: string,
    period: 'week' | 'month' | 'year' | 'custom' = 'month',
    customDates?: { startDate: Date; endDate: Date }
  ): Promise<any> {
    const cacheKey = `progress_${childId}_${period}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const params: any = { period };
      if (customDates) {
        params.startDate = customDates.startDate.toISOString();
        params.endDate = customDates.endDate.toISOString();
      }

      const response = await ApiService.get(`${EVALUATION_ENDPOINTS.PROGRESS}/${childId}`, params);
      this.setCache(cacheKey, response);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération du progrès:', error);
      throw new Error('Impossible de récupérer le progrès de l\'enfant');
    }
  }

  /**
   * Récupère les statistiques des évaluations
   */
  public async getEvaluationStats(): Promise<any> {
    const cacheKey = 'evaluation_stats';
    
    if (this.isCacheValid(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const response = await ApiService.get(EVALUATION_ENDPOINTS.STATS);
      this.setCache(cacheKey, response);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw new Error('Impossible de récupérer les statistiques');
    }
  }

  // =============================================================================
  // MÉTHODES UTILITAIRES
  // =============================================================================

  /**
   * Détermine le groupe d'âge basé sur l'âge en mois
   */
  private getAgeGroup(ageInMonths: number): AgeGroup {
    if (ageInMonths < 12) return '0-12';
    if (ageInMonths < 24) return '12-24';
    if (ageInMonths < 36) return '24-36';
    if (ageInMonths < 60) return '36-60';
    return '60+';
  }

  /**
   * Détermine le statut d'un score
   */
  private getScoreStatus(percentage: number): 'EXCELLENT' | 'GOOD' | 'AVERAGE' | 'BELOW_AVERAGE' | 'NEEDS_ATTENTION' {
    if (percentage >= 90) return 'EXCELLENT';
    if (percentage >= 75) return 'GOOD';
    if (percentage >= 60) return 'AVERAGE';
    if (percentage >= 40) return 'BELOW_AVERAGE';
    return 'NEEDS_ATTENTION';
  }

  /**
   * Calcule le percentile basé sur le pourcentage
   */
  private calculatePercentile(percentage: number): number {
    // Simulation simple - à remplacer par des données réelles de population
    if (percentage >= 95) return 95;
    if (percentage >= 85) return 85;
    if (percentage >= 75) return 75;
    if (percentage >= 50) return 50;
    if (percentage >= 25) return 25;
    if (percentage >= 15) return 15;
    return 5;
  }

  /**
   * Génère des recommandations basées sur l'analyse des domaines
   */
  private generateRecommendations(domainAnalyses: DomainAnalysis[]): string[] {
    const recommendations: string[] = [];
    
    domainAnalyses.forEach(analysis => {
      if (analysis.status === 'NEEDS_ATTENTION') {
        recommendations.push(`Consulter un professionnel pour le domaine ${analysis.domainName}`);
      } else if (analysis.status === 'BELOW_AVERAGE') {
        recommendations.push(`Privilégier les activités dans le domaine ${analysis.domainName}`);
      } else if (analysis.status === 'EXCELLENT') {
        recommendations.push(`Maintenir l'excellence dans le domaine ${analysis.domainName}`);
      }
    });

    if (recommendations.length === 0) {
      recommendations.push('Continuer le développement équilibré dans tous les domaines');
    }

    return recommendations;
  }

  /**
   * Calcule la date de la prochaine évaluation recommandée
   */
  private calculateNextEvaluationDate(overallPercentage: number): Date {
    const now = new Date();
    let monthsToAdd = 6; // Évaluation semestrielle par défaut
    
    if (overallPercentage < 60) {
      monthsToAdd = 3; // Évaluation trimestrielle si scores faibles
    } else if (overallPercentage >= 90) {
      monthsToAdd = 12; // Évaluation annuelle si scores excellents
    }
    
    return new Date(now.setMonth(now.getMonth() + monthsToAdd));
  }

  // =============================================================================
  // GESTION DU CACHE
  // =============================================================================

  private setCache(key: string, data: any): void {
    this.cache.set(key, data);
    this.cacheExpiry.set(key, Date.now() + this.CACHE_DURATION);
  }

  private isCacheValid(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    return expiry ? Date.now() < expiry : false;
  }

  private invalidateCache(pattern: string): void {
    const keys = Array.from(this.cache.keys());
    keys.forEach(key => {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        this.cacheExpiry.delete(key);
      }
    });
  }

  public clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }
}

// =============================================================================
// EXPORT DE L'INSTANCE SINGLETON
// =============================================================================

export const evaluationService = UnifiedEvaluationService.getInstance();
