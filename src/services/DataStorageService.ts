/**
 * SERVICE DE STOCKAGE ADAPTATIF - LOCAL vs CLOUD
 * 
 * Ce service adapte le comportement selon la version choisie :
 * - Local : Stockage uniquement en localStorage, pas de serveur
 * - Cloud : Synchronisation avec le serveur + cache local
 */

export type StorageMode = 'local' | 'cloud';

export interface StorageConfig {
  mode: StorageMode;
  offlineMode: boolean;
  syncEnabled: boolean;
}

export interface UserData {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  children?: any[];
  preferences?: any;
  lastSync?: string;
}

export interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  source: 'local' | 'server' | 'cache';
  needsSync?: boolean;
}

export class DataStorageService {
  private static config: StorageConfig = {
    mode: 'local',
    offlineMode: false,
    syncEnabled: true
  };

  /**
   * Initialiser le service selon la version choisie
   */
  static initialize(): void {
    const selectedVersion = localStorage.getItem('selectedVersion') || 'local';
    this.config.mode = selectedVersion as StorageMode;
    
    if (this.config.mode === 'local') {
      this.config.offlineMode = true;
      this.config.syncEnabled = false;
      console.log('🔒 [DataStorage] Mode LOCAL activé - Stockage exclusivement local');
    } else {
      this.config.offlineMode = false;
      this.config.syncEnabled = true;
      console.log('☁️ [DataStorage] Mode CLOUD activé - Synchronisation serveur');
    }
  }

  /**
   * Obtenir la configuration actuelle
   */
  static getConfig(): StorageConfig {
    return { ...this.config };
  }

  /**
   * Sauvegarder les données utilisateur
   */
  static async saveUserData(userData: UserData): Promise<StorageResult<UserData>> {
    try {
      if (this.config.mode === 'local') {
        return await this.saveLocally(userData);
      } else {
        return await this.saveWithSync(userData);
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        source: 'local'
      };
    }
  }

  /**
   * Charger les données utilisateur
   */
  static async loadUserData(userId?: string): Promise<StorageResult<UserData>> {
    try {
      if (this.config.mode === 'local') {
        return await this.loadLocally();
      } else {
        return await this.loadWithSync(userId);
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        source: 'local'
      };
    }
  }

  /**
   * Vérifier la connectivité (mode cloud seulement)
   */
  static async checkConnectivity(): Promise<boolean> {
    if (this.config.mode === 'local') {
      return true; // Toujours "connecté" en mode local
    }

    try {
      // Test ping vers le serveur
      const response = await fetch(`${process.env.REACT_APP_API_URL}/health`, {
        method: 'GET',
        timeout: 5000
      } as any);
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * MÉTHODES PRIVÉES - MODE LOCAL
   */
  private static async saveLocally(userData: UserData): Promise<StorageResult<UserData>> {
    try {
      const dataToSave = {
        ...userData,
        lastSync: new Date().toISOString(),
        mode: 'local'
      };

      localStorage.setItem('userData', JSON.stringify(dataToSave));
      localStorage.setItem('userDataBackup', JSON.stringify(dataToSave));

      console.log('💾 [DataStorage] Données sauvegardées localement');

      return {
        success: true,
        data: dataToSave,
        source: 'local'
      };
    } catch (error: any) {
      throw new Error(`Erreur sauvegarde locale: ${error.message}`);
    }
  }

  private static async loadLocally(): Promise<StorageResult<UserData>> {
    try {
      const storedData = localStorage.getItem('userData');
      if (!storedData) {
        return {
          success: false,
          error: 'Aucune donnée locale trouvée',
          source: 'local'
        };
      }

      const userData = JSON.parse(storedData);
      console.log('📱 [DataStorage] Données chargées localement');

      return {
        success: true,
        data: userData,
        source: 'local'
      };
    } catch (error: any) {
      throw new Error(`Erreur chargement local: ${error.message}`);
    }
  }

  /**
   * MÉTHODES PRIVÉES - MODE CLOUD
   */
  private static async saveWithSync(userData: UserData): Promise<StorageResult<UserData>> {
    try {
      // 1. Sauvegarder localement d'abord (cache)
      const localData = {
        ...userData,
        lastSync: new Date().toISOString(),
        mode: 'cloud'
      };
      localStorage.setItem('userData', JSON.stringify(localData));

      // 2. Tenter la synchronisation serveur
      const isOnline = await this.checkConnectivity();
      if (isOnline) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user-data`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(userData)
          });

          if (response.ok) {
            const serverData = await response.json();
            console.log('☁️ [DataStorage] Données synchronisées avec le serveur');
            
            return {
              success: true,
              data: serverData,
              source: 'server'
            };
          } else {
            throw new Error('Erreur serveur');
          }
        } catch (error) {
          console.warn('⚠️ [DataStorage] Synchronisation échouée, sauvegarde locale seulement');
          return {
            success: true,
            data: localData,
            source: 'cache',
            needsSync: true
          };
        }
      } else {
        console.warn('📡 [DataStorage] Hors ligne, sauvegarde locale seulement');
        return {
          success: true,
          data: localData,
          source: 'cache',
          needsSync: true
        };
      }
    } catch (error: any) {
      throw new Error(`Erreur sauvegarde cloud: ${error.message}`);
    }
  }

  private static async loadWithSync(userId?: string): Promise<StorageResult<UserData>> {
    try {
      const isOnline = await this.checkConnectivity();
      
      if (isOnline && userId) {
        try {
          // Tenter de charger depuis le serveur
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user-data/${userId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          if (response.ok) {
            const serverData = await response.json();
            // Mettre à jour le cache local
            localStorage.setItem('userData', JSON.stringify(serverData));
            console.log('☁️ [DataStorage] Données chargées depuis le serveur');
            
            return {
              success: true,
              data: serverData,
              source: 'server'
            };
          }
        } catch (error) {
          console.warn('⚠️ [DataStorage] Erreur serveur, utilisation du cache local');
        }
      }

      // Fallback : charger depuis le cache local
      const localData = localStorage.getItem('userData');
      if (localData) {
        const userData = JSON.parse(localData);
        console.log('📱 [DataStorage] Données chargées depuis le cache');
        
        return {
          success: true,
          data: userData,
          source: 'cache',
          needsSync: !isOnline
        };
      }

      return {
        success: false,
        error: 'Aucune donnée disponible',
        source: 'local'
      };
    } catch (error: any) {
      throw new Error(`Erreur chargement cloud: ${error.message}`);
    }
  }

  /**
   * Synchroniser les données en attente (mode cloud)
   */
  static async syncPendingData(): Promise<boolean> {
    if (this.config.mode === 'local') {
      return true; // Pas de sync en mode local
    }

    try {
      const isOnline = await this.checkConnectivity();
      if (!isOnline) {
        return false;
      }

      const localData = localStorage.getItem('userData');
      if (localData) {
        const userData = JSON.parse(localData);
        const result = await this.saveWithSync(userData);
        return result.success && result.source === 'server';
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Effacer toutes les données selon le mode
   */
  static async clearAllData(): Promise<void> {
    if (this.config.mode === 'local') {
      // Mode local : effacer seulement localStorage
      localStorage.removeItem('userData');
      localStorage.removeItem('userDataBackup');
      console.log('🔒 [DataStorage] Données locales effacées');
    } else {
      // Mode cloud : effacer local + tenter serveur
      localStorage.removeItem('userData');
      
      try {
        const isOnline = await this.checkConnectivity();
        if (isOnline) {
          await fetch(`${process.env.REACT_APP_API_URL}/api/user-data`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          console.log('☁️ [DataStorage] Données serveur effacées');
        }
      } catch (error) {
        console.warn('⚠️ [DataStorage] Erreur effacement serveur');
      }
    }
  }

  /**
   * Obtenir les statistiques de stockage
   */
  static getStorageStats(): {
    mode: StorageMode;
    localSize: number;
    hasLocalData: boolean;
    lastSync?: string;
    needsSync?: boolean;
  } {
    const userData = localStorage.getItem('userData');
    const hasLocalData = !!userData;
    const localSize = userData ? new Blob([userData]).size : 0;
    
    let lastSync: string | undefined;
    let needsSync = false;

    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        lastSync = parsed.lastSync;
        needsSync = this.config.mode === 'cloud' && !navigator.onLine;
      } catch {}
    }

    return {
      mode: this.config.mode,
      localSize,
      hasLocalData,
      lastSync,
      needsSync
    };
  }
}

// Initialiser le service au chargement
DataStorageService.initialize();
