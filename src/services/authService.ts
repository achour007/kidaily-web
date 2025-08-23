import ApiService from './api';

// Classe d'erreur qui préserve le status HTTP
export class AuthError extends Error {
  public status: number;
  public originalError: any;
  
  constructor(message: string, status: number, originalError?: any) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
    this.originalError = originalError;
  }
}

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
  // Connexion utilisateur - DIAGNOSTIC COMPLET
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
        try {
      
      const response = await ApiService.post<AuthResponse>('/auth/login', credentials);
      

      
      // Sauvegarder les tokens si présents dans la réponse
      if (response.token) {

        this.saveTokens(response.token, response.refreshToken);
      } else {
        console.warn('⚠️ [AUTH] Aucun token reçu dans la réponse');
      }

      // Si une langue est spécifiée, la mettre à jour
      if (credentials.language) {
        try {

          await ApiService.post('/users/language', { language: credentials.language });
          localStorage.setItem('selectedLanguage', credentials.language);

        } catch (error) {
          console.warn('⚠️ [AUTH] Erreur lors de la mise à jour de la langue:', error);
          // Ne pas faire échouer la connexion pour cette erreur
        }
      }

      // Si une version est spécifiée, la sauvegarder
      if (credentials.version) {

        localStorage.setItem('selectedVersion', credentials.version);
      }
      

      return response;
      
    } catch (error: any) {

      
      // Gestion spécifique des erreurs HTTP pour la connexion avec préservation du status
      if (error.status === 401) {
        throw new AuthError('Email ou mot de passe incorrect', 401, error);
      } else if (error.status === 404) {
        throw new AuthError('Le serveur est temporairement indisponible', 404, error);
      } else if (error.status === 400) {
        throw new AuthError('Vérifiez vos informations', 400, error);
      } else if (error.status === 500) {
        throw new AuthError('Erreur du serveur, réessayez plus tard', 500, error);
      } else if (error.status === 0 || error.message === 'Network Error' || error.message === 'Failed to fetch') {
        throw new AuthError('Vérifiez votre connexion internet', 0, error);
      } else {
        // Message d'erreur avec status préservé
        throw new AuthError(error.message || 'Une erreur est survenue', error.status || 500, error);
      }
    }
  }

  // Inscription utilisateur - GESTION D'ERREURS AMÉLIORÉE
  static async register(userData: RegisterData): Promise<AuthResponse> {
    try {

      
      const response = await ApiService.post<AuthResponse>('/auth/register', userData);
      

      return response;
      
    } catch (error: any) {

      
      // Gestion spécifique des erreurs HTTP avec préservation du status
      if (error.status === 404) {
        throw new AuthError('Le serveur est temporairement indisponible', 404, error);
      } else if (error.status === 409) {
        throw new AuthError('Cet email est déjà enregistré', 409, error);
      } else if (error.status === 400) {
        throw new AuthError('Vérifiez vos informations', 400, error);
      } else if (error.status === 500) {
        throw new AuthError('Erreur du serveur, réessayez plus tard', 500, error);
      } else if (error.status === 0 || error.message === 'Network Error' || error.message === 'Failed to fetch') {
        throw new AuthError('Vérifiez votre connexion internet', 0, error);
      } else {
        // Message d'erreur avec status préservé
        throw new AuthError(error.message || 'Une erreur est survenue', error.status || 500, error);
      }
    }
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
    
    // En mode développement, accepter les tokens simulés
    if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
      return !!token && (token.startsWith('dev-token-') || token.startsWith('Bearer '));
    }
    
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