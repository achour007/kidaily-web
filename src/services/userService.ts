import ApiService from './api';

// Types pour les utilisateurs
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  profession?: string;
  organization?: string;
  bio?: string;
  language?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  profession?: string;
  organization?: string;
  bio?: string;
  language?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// Service utilisateur
export class UserService {
  // Récupérer le profil de l'utilisateur connecté
  static async getProfile(): Promise<User> {
    const response = await ApiService.get<User>('/users/profile');
    return response;
  }

  // Mettre à jour le profil utilisateur
  static async updateProfile(userData: UpdateUserData): Promise<User> {
    const response = await ApiService.put<User>('/users/profile', userData);
    return response;
  }

  // Changer le mot de passe
  static async changePassword(passwordData: ChangePasswordData): Promise<void> {
    await ApiService.post('/users/change-password', passwordData);
  }

  // Supprimer le compte utilisateur
  static async deleteAccount(): Promise<void> {
    await ApiService.delete('/users/profile');
  }

  // Récupérer les statistiques utilisateur
  static async getStats(): Promise<any> {
    const response = await ApiService.get('/users/stats');
    return response;
  }

  // Mettre à jour les préférences utilisateur
  static async updatePreferences(preferences: Record<string, any>): Promise<User> {
    const response = await ApiService.put<User>('/users/preferences', preferences);
    return response;
  }

  // Récupérer les préférences utilisateur
  static async getPreferences(): Promise<Record<string, any>> {
    const response = await ApiService.get<Record<string, any>>('/users/preferences');
    return response;
  }
}

export default UserService; 