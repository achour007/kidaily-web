import ApiService from './api';

// Types pour l'authentification
export interface LoginCredentials {
  email: string;
  password: string;
  language?: string;
  version?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  token: string;
  refreshToken?: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken?: string;
}

// Service d'authentification
export class AuthService {
  // Connexion utilisateur
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await ApiService.post<AuthResponse>('/auth/login', credentials);
    
    // Si une langue est spécifiée, la mettre à jour
    if (credentials.language) {
      try {
        await ApiService.put('/users/language', { language: credentials.language });
        // Sauvegarder la langue dans localStorage
        localStorage.setItem('selectedLanguage', credentials.language);
      } catch (error) {
        console.warn('Erreur lors de la mise à jour de la langue:', error);
      }
    }

    // Si une version est spécifiée, la sauvegarder
    if (credentials.version) {
      localStorage.setItem('selectedVersion', credentials.version);
    }
    
    return response;
  }

  // Inscription utilisateur
  static async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await ApiService.post<AuthResponse>('/auth/register', userData);
    return response;
  }

  // Rafraîchir le token
  static async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await ApiService.post<RefreshTokenResponse>('/auth/refresh', {
      refreshToken,
    });
    return response;
  }

  // Déconnexion utilisateur
  static async logout(): Promise<void> {
    try {
      await ApiService.post('/auth/logout');
    } catch (error) {
      // Même si l'appel échoue, on nettoie le localStorage
      console.warn('Erreur lors de la déconnexion:', error);
    } finally {
      // Toujours nettoyer le localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  }

  // Vérifier si l'utilisateur est connecté
  static isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Obtenir le token actuel
  static getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Obtenir le refresh token
  static getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  // Sauvegarder les tokens
  static saveTokens(token: string, refreshToken?: string): void {
    localStorage.setItem('token', token);
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  // Nettoyer les tokens
  static clearTokens(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }

  // Vérifier si le token est expiré
  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convertir en millisecondes
      return Date.now() >= expirationTime;
    } catch {
      return true; // Si on ne peut pas décoder le token, on le considère comme expiré
    }
  }

  // Décoder le token JWT pour obtenir les informations utilisateur
  static decodeToken(token: string): any {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch {
      return null;
    }
  }
}

export default AuthService; 