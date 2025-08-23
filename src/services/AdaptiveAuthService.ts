/**
 * SERVICE D'AUTHENTIFICATION ADAPTATIF
 * 
 * Gère l'authentification différemment selon le mode :
 * - Local : Authentification simulée, pas de serveur
 * - Cloud : Authentification réelle via API
 */

import { AuthService } from './authService';

export interface LocalUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password?: string; // Hash local seulement
  createdAt: string;
  lastLogin: string;
}

export interface AuthResult {
  success: boolean;
  user?: any;
  token?: string;
  mode: 'local' | 'cloud';
  error?: string;
}

export class AdaptiveAuthService {
  private static currentMode: 'local' | 'cloud' = 'local';

  /**
   * Initialiser selon la version choisie
   */
  static initialize(): void {
    const selectedVersion = localStorage.getItem('selectedVersion') || 'local';
    this.currentMode = selectedVersion as 'local' | 'cloud';
    
    console.log(`🔐 [AdaptiveAuth] Mode ${this.currentMode.toUpperCase()} activé`);
  }

  /**
   * Connexion adaptative
   */
  static async login(email: string, password: string): Promise<AuthResult> {
    this.initialize();

    if (this.currentMode === 'local') {
      return await this.loginLocal(email, password);
    } else {
      return await this.loginCloud(email, password);
    }
  }

  /**
   * Inscription adaptative
   */
  static async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<AuthResult> {
    this.initialize();

    if (this.currentMode === 'local') {
      return await this.registerLocal(userData);
    } else {
      return await this.registerCloud(userData);
    }
  }

  /**
   * Déconnexion adaptative
   */
  static async logout(): Promise<void> {
    if (this.currentMode === 'local') {
      // Mode local : effacer seulement les données de session
      localStorage.removeItem('localToken');
      localStorage.removeItem('currentLocalUser');
      console.log('🔒 [AdaptiveAuth] Déconnexion locale');
    } else {
      // Mode cloud : déconnexion serveur + local
      try {
        await AuthService.logout();
      } catch (error) {
        console.warn('⚠️ [AdaptiveAuth] Erreur déconnexion serveur');
      }
      localStorage.removeItem('token');
      console.log('☁️ [AdaptiveAuth] Déconnexion cloud');
    }
  }

  /**
   * Vérifier l'état de connexion
   */
  static isAuthenticated(): boolean {
    if (this.currentMode === 'local') {
      return !!localStorage.getItem('localToken');
    } else {
      return !!localStorage.getItem('token');
    }
  }

  /**
   * Obtenir l'utilisateur actuel
   */
  static getCurrentUser(): any | null {
    if (this.currentMode === 'local') {
      const userData = localStorage.getItem('currentLocalUser');
      return userData ? JSON.parse(userData) : null;
    } else {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    }
  }

  /**
   * MÉTHODES PRIVÉES - MODE LOCAL
   */
  private static async loginLocal(email: string, password: string): Promise<AuthResult> {
    try {
      // Récupérer les utilisateurs locaux
      const localUsers = this.getLocalUsers();
      const user = localUsers.find(u => u.email === email);

      if (!user) {
        return {
          success: false,
          error: 'Utilisateur non trouvé en mode local',
          mode: 'local'
        };
      }

      // Vérification simple du mot de passe (en mode local)
      const passwordMatch = await this.verifyLocalPassword(password, user.password || '');
      
      if (!passwordMatch) {
        return {
          success: false,
          error: 'Mot de passe incorrect',
          mode: 'local'
        };
      }

      // Créer un token local
      const localToken = this.generateLocalToken(user);
      
      // Sauvegarder la session
      localStorage.setItem('localToken', localToken);
      localStorage.setItem('currentLocalUser', JSON.stringify({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }));

      // Mettre à jour la dernière connexion
      user.lastLogin = new Date().toISOString();
      this.saveLocalUsers(localUsers);

      console.log('🔒 [AdaptiveAuth] Connexion locale réussie');

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        },
        token: localToken,
        mode: 'local'
      };
    } catch (error: any) {
      return {
        success: false,
        error: `Erreur connexion locale: ${error.message}`,
        mode: 'local'
      };
    }
  }

  private static async registerLocal(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<AuthResult> {
    try {
      const localUsers = this.getLocalUsers();
      
      // Vérifier si l'utilisateur existe déjà
      const existingUser = localUsers.find(u => u.email === userData.email);
      if (existingUser) {
        return {
          success: false,
          error: 'Cet email est déjà enregistré en mode local',
          mode: 'local'
        };
      }

      // Créer un nouvel utilisateur local
      const newUser: LocalUser = {
        id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: await this.hashLocalPassword(userData.password),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      // Sauvegarder l'utilisateur
      localUsers.push(newUser);
      this.saveLocalUsers(localUsers);

      // Connecter automatiquement
      const loginResult = await this.loginLocal(userData.email, userData.password);
      
      console.log('🔒 [AdaptiveAuth] Inscription locale réussie');
      
      return loginResult;
    } catch (error: any) {
      return {
        success: false,
        error: `Erreur inscription locale: ${error.message}`,
        mode: 'local'
      };
    }
  }

  /**
   * MÉTHODES PRIVÉES - MODE CLOUD
   */
  private static async loginCloud(email: string, password: string): Promise<AuthResult> {
    try {
      const response = await AuthService.login({
        email,
        password,
        language: localStorage.getItem('selectedLanguage') || 'fr',
        version: 'cloud'
      });

      console.log('☁️ [AdaptiveAuth] Connexion cloud réussie');

      return {
        success: true,
        user: response.user,
        token: response.token,
        mode: 'cloud'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        mode: 'cloud'
      };
    }
  }

  private static async registerCloud(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Promise<AuthResult> {
    try {
      const response = await AuthService.register(userData);

      console.log('☁️ [AdaptiveAuth] Inscription cloud réussie');

      return {
        success: true,
        user: response.user,
        token: response.token,
        mode: 'cloud'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        mode: 'cloud'
      };
    }
  }

  /**
   * UTILITAIRES MODE LOCAL
   */
  private static getLocalUsers(): LocalUser[] {
    const users = localStorage.getItem('localUsers');
    return users ? JSON.parse(users) : [];
  }

  private static saveLocalUsers(users: LocalUser[]): void {
    localStorage.setItem('localUsers', JSON.stringify(users));
  }

  private static async hashLocalPassword(password: string): Promise<string> {
    // Hash simple pour le mode local (ne pas utiliser en production)
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'kidaily_local_salt');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private static async verifyLocalPassword(password: string, hash: string): Promise<boolean> {
    const passwordHash = await this.hashLocalPassword(password);
    return passwordHash === hash;
  }

  private static generateLocalToken(user: LocalUser): string {
    const payload = {
      id: user.id,
      email: user.email,
      mode: 'local',
      iat: Date.now()
    };
    return btoa(JSON.stringify(payload));
  }

  /**
   * Méthodes utilitaires
   */
  static getMode(): 'local' | 'cloud' {
    return this.currentMode;
  }

  static async switchMode(newMode: 'local' | 'cloud'): Promise<void> {
    // Déconnecter l'utilisateur actuel
    await this.logout();
    
    // Changer le mode
    localStorage.setItem('selectedVersion', newMode);
    this.currentMode = newMode;
    
    console.log(`🔄 [AdaptiveAuth] Mode basculé vers ${newMode.toUpperCase()}`);
  }

  /**
   * Obtenir les statistiques d'authentification
   */
  static getAuthStats(): {
    mode: 'local' | 'cloud';
    isAuthenticated: boolean;
    localUsersCount: number;
    currentUser?: any;
  } {
    return {
      mode: this.currentMode,
      isAuthenticated: this.isAuthenticated(),
      localUsersCount: this.getLocalUsers().length,
      currentUser: this.getCurrentUser()
    };
  }
}

// Initialiser le service
AdaptiveAuthService.initialize();
