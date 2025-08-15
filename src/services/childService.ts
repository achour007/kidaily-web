import ApiService from './api';

// Types pour les enfants
export interface Child {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  parentId: string;
  createdAt: string;
  updatedAt: string;
  lastEvaluation?: string;
  domainProgress?: Record<string, number>;
}

export interface CreateChildData {
  name: string;
  dateOfBirth: string;
  gender: string;
}

export interface UpdateChildData {
  name?: string;
  dateOfBirth?: string;
  gender?: string;
}

export interface ChildStats {
  totalEvaluations: number;
  lastEvaluationDate?: string;
  averageScore?: number;
  domainProgress: Record<string, number>;
}

// Service enfant
export class ChildService {
  // Récupérer tous les enfants de l'utilisateur
  static async getChildren(): Promise<Child[]> {
    const response = await ApiService.get<Child[]>('/children');
    return response;
  }

  // Récupérer un enfant par ID
  static async getChild(id: string): Promise<Child> {
    const response = await ApiService.get<Child>(`/children/${id}`);
    return response;
  }

  // Créer un nouvel enfant
  static async createChild(childData: CreateChildData): Promise<Child> {
    const response = await ApiService.post<Child>('/children', childData);
    return response;
  }

  // Mettre à jour un enfant
  static async updateChild(id: string, childData: UpdateChildData): Promise<Child> {
    const response = await ApiService.put<Child>(`/children/${id}`, childData);
    return response;
  }

  // Supprimer un enfant
  static async deleteChild(id: string): Promise<void> {
    await ApiService.delete(`/children/${id}`);
  }

  // Récupérer les statistiques d'un enfant
  static async getChildStats(id: string): Promise<ChildStats> {
    const response = await ApiService.get<ChildStats>(`/children/${id}/stats`);
    return response;
  }

  // Récupérer l'historique des évaluations d'un enfant
  static async getChildEvaluations(id: string, params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<any> {
    const response = await ApiService.get(`/children/${id}/evaluations`, params);
    return response;
  }

  // Récupérer les activités recommandées pour un enfant
  static async getChildActivities(id: string, params?: {
    domain?: string;
    age?: number;
    limit?: number;
  }): Promise<any> {
    const response = await ApiService.get(`/children/${id}/activities`, params);
    return response;
  }

  // Calculer l'âge en mois d'un enfant
  static calculateAgeInMonths(dateOfBirth: string): number {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const ageInMs = today.getTime() - birthDate.getTime();
    const ageInMonths = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 30.44));
    return ageInMonths;
  }

  // Vérifier si un enfant est dans la tranche d'âge pour une évaluation
  static isAgeAppropriate(dateOfBirth: string, minAge: number, maxAge: number): boolean {
    const ageInMonths = this.calculateAgeInMonths(dateOfBirth);
    return ageInMonths >= minAge && ageInMonths <= maxAge;
  }
}

export default ChildService; 