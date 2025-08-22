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
  // Connexion utilisateur - DIAGNOSTIC COMPLET
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('🔐 [AUTH] Début de la connexion avec:', credentials.email);
    console.log('🔐 [AUTH] URL de l\'API:', process.env.REACT_APP_API_URL || 'https://kidaily-backend-cb9a147c3208.herokuapp.com/api');
    
    try {
      console.log('🔐 [AUTH] Envoi de la requête POST vers /auth/login');
      
      const response = await ApiService.post<AuthResponse>('/auth/login', credentials);
      
      console.log('✅ [AUTH] Réponse reçue:', response);
      
      // Sauvegarder les tokens si présents dans la réponse
      if (response.token) {
        console.log('🔐 [AUTH] Token reçu, sauvegarde...');
        this.saveTokens(response.token, response.refreshToken);
      } else {
        console.warn('⚠️ [AUTH] Aucun token reçu dans la réponse');
      }

      // Si une langue est spécifiée, la mettre à jour
      if (credentials.language) {
        try {
          console.log('🌐 [AUTH] Mise à jour de la langue:', credentials.language);
          await ApiService.post('/users/language', { language: credentials.language });
          localStorage.setItem('selectedLanguage', credentials.language);
          console.log('✅ [AUTH] Langue mise à jour avec succès');
        } catch (error) {
          console.warn('⚠️ [AUTH] Erreur lors de la mise à jour de la langue:', error);
          // Ne pas faire échouer la connexion pour cette erreur
        }
      }

      // Si une version est spécifiée, la sauvegarder
      if (credentials.version) {
        console.log('📱 [AUTH] Sauvegarde de la version:', credentials.version);
        localStorage.setItem('selectedVersion', credentials.version);
      }
      
      console.log('🎉 [AUTH] Connexion réussie pour:', credentials.email);
      return response;
      
    } catch (error: any) {
      console.error('❌ [AUTH] Erreur de connexion:', error);
      console.error('❌ [AUTH] Type d\'erreur:', typeof error);
      console.error('❌ [AUTH] Message d\'erreur:', error.message);
      console.error('❌ [AUTH] Status d\'erreur:', error.status);
      console.error('❌ [AUTH] Stack trace:', error.stack);
      
      // Gestion spécifique des erreurs HTTP pour la connexion
      if (error.status === 401) {
        throw new Error('Vos identifiants de connexion sont incorrects. Veuillez vérifier votre email et mot de passe, puis réessayer.');
      } else if (error.status === 404) {
        throw new Error('Le service d\'authentification est temporairement indisponible. Veuillez réessayer dans quelques instants.');
      } else if (error.status === 400) {
        throw new Error('Veuillez vérifier que tous les champs de connexion sont correctement remplis et réessayer.');
      } else if (error.status === 500) {
        throw new Error('Nous rencontrons actuellement des difficultés techniques. Veuillez réessayer dans quelques instants ou contacter notre équipe support.');
      } else if (error.status === 0 || error.message === 'Network Error' || error.message === 'Failed to fetch') {
        throw new Error('Nous rencontrons actuellement des difficultés techniques. Veuillez vérifier votre connexion internet et réessayer dans quelques instants. Si le problème persiste, contactez notre équipe support.');
      } else {
        // Message d'erreur professionnel et informatif
        throw new Error(`Nous rencontrons une difficulté technique lors de votre connexion. Veuillez réessayer dans quelques instants ou contacter notre équipe support si le problème persiste.`);
      }
    }
  }

  // Inscription utilisateur - GESTION D'ERREURS AMÉLIORÉE
  static async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      console.log('🔐 [AUTH] Début de l\'inscription pour:', userData.email);
      
      const response = await ApiService.post<AuthResponse>('/auth/register', userData);
      
      console.log('✅ [AUTH] Inscription réussie pour:', userData.email);
      return response;
      
    } catch (error: any) {
      console.error('❌ [AUTH] Erreur d\'inscription:', error);
      
      // Gestion spécifique des erreurs HTTP
      if (error.status === 404) {
        throw new Error('Le service d\'inscription est temporairement indisponible. Veuillez réessayer dans quelques instants.');
      } else if (error.status === 409) {
        throw new Error('Un compte avec cette adresse email existe déjà. Veuillez utiliser la fonction "Se connecter" ou réinitialiser votre mot de passe si vous l\'avez oublié.');
      } else if (error.status === 400) {
        throw new Error('Veuillez vérifier que tous les champs d\'inscription sont correctement remplis et réessayer.');
      } else if (error.status === 500) {
        throw new Error('Nous rencontrons actuellement des difficultés techniques. Veuillez réessayer dans quelques instants ou contacter notre équipe support.');
      } else if (error.status === 0 || error.message === 'Network Error' || error.message === 'Failed to fetch') {
        throw new Error('Nous rencontrons actuellement des difficultés techniques. Veuillez vérifier votre connexion internet et réessayer dans quelques instants. Si le problème persiste, contactez notre équipe support.');
      } else {
        // Message d'erreur professionnel et informatif
        throw new Error(`Nous rencontrons une difficulté technique lors de votre inscription. Veuillez réessayer dans quelques instants ou contacter notre équipe support si le problème persiste.`);
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