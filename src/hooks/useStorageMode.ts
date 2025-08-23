/**
 * HOOK POUR GÉRER LES MODES DE STOCKAGE
 * 
 * Hook React qui gère le basculement entre mode local et cloud
 * et fournit les informations sur l'état actuel
 */

import { useState, useEffect, useCallback } from 'react';
import { DataStorageService } from '../services/DataStorageService';
import { AdaptiveAuthService } from '../services/AdaptiveAuthService';

export interface StorageModeState {
  mode: 'local' | 'cloud';
  isOnline: boolean;
  needsSync: boolean;
  isInitialized: boolean;
  stats: {
    localSize: number;
    hasLocalData: boolean;
    lastSync?: string;
    localUsersCount: number;
  };
}

export interface StorageModeActions {
  switchMode: (newMode: 'local' | 'cloud') => Promise<boolean>;
  syncData: () => Promise<boolean>;
  clearAllData: () => Promise<void>;
  checkConnectivity: () => Promise<boolean>;
  refreshStats: () => void;
}

export function useStorageMode(): [StorageModeState, StorageModeActions] {
  const [state, setState] = useState<StorageModeState>({
    mode: 'local',
    isOnline: false,
    needsSync: false,
    isInitialized: false,
    stats: {
      localSize: 0,
      hasLocalData: false,
      localUsersCount: 0
    }
  });

  /**
   * Initialiser le hook
   */
  const initialize = useCallback(async () => {
    try {
      // Initialiser les services
      DataStorageService.initialize();
      AdaptiveAuthService.initialize();

      // Obtenir la configuration actuelle
      const config = DataStorageService.getConfig();
      const storageStats = DataStorageService.getStorageStats();
      const authStats = AdaptiveAuthService.getAuthStats();
      const isOnline = await DataStorageService.checkConnectivity();

      setState({
        mode: config.mode,
        isOnline,
        needsSync: storageStats.needsSync || false,
        isInitialized: true,
        stats: {
          localSize: storageStats.localSize,
          hasLocalData: storageStats.hasLocalData,
          lastSync: storageStats.lastSync,
          localUsersCount: authStats.localUsersCount
        }
      });

      console.log(`🎯 [useStorageMode] Initialisé en mode ${config.mode.toUpperCase()}`);
    } catch (error) {
      console.error('❌ [useStorageMode] Erreur d\'initialisation:', error);
    }
  }, []);

  /**
   * Basculer entre les modes
   */
  const switchMode = useCallback(async (newMode: 'local' | 'cloud'): Promise<boolean> => {
    try {
      console.log(`🔄 [useStorageMode] Basculement vers ${newMode.toUpperCase()}`);

      // Avertir l'utilisateur s'il y a des données à perdre
      if (state.stats.hasLocalData && newMode !== state.mode) {
        const confirmed = window.confirm(
          newMode === 'local' 
            ? 'Basculer en mode local désactivera la synchronisation serveur. Continuer ?'
            : 'Basculer en mode cloud activera la synchronisation serveur. Continuer ?'
        );
        
        if (!confirmed) {
          return false;
        }
      }

      // Effectuer le basculement
      await AdaptiveAuthService.switchMode(newMode);
      
      // Réinitialiser les services
      await initialize();
      
      return true;
    } catch (error) {
      console.error('❌ [useStorageMode] Erreur basculement mode:', error);
      return false;
    }
  }, [state.mode, state.stats.hasLocalData, initialize]);

  /**
   * Synchroniser les données (mode cloud seulement)
   */
  const syncData = useCallback(async (): Promise<boolean> => {
    if (state.mode === 'local') {
      console.log('🔒 [useStorageMode] Sync ignorée en mode local');
      return true;
    }

    try {
      console.log('☁️ [useStorageMode] Début synchronisation...');
      const success = await DataStorageService.syncPendingData();
      
      if (success) {
        // Rafraîchir les stats
        const storageStats = DataStorageService.getStorageStats();
        setState(prev => ({
          ...prev,
          needsSync: false,
          stats: {
            ...prev.stats,
            lastSync: storageStats.lastSync
          }
        }));
        console.log('✅ [useStorageMode] Synchronisation réussie');
      } else {
        console.warn('⚠️ [useStorageMode] Synchronisation échouée');
      }
      
      return success;
    } catch (error) {
      console.error('❌ [useStorageMode] Erreur synchronisation:', error);
      return false;
    }
  }, [state.mode]);

  /**
   * Effacer toutes les données
   */
  const clearAllData = useCallback(async (): Promise<void> => {
    try {
      const confirmed = window.confirm(
        'Êtes-vous sûr de vouloir effacer toutes les données ? Cette action est irréversible.'
      );
      
      if (!confirmed) return;

      console.log('🗑️ [useStorageMode] Effacement des données...');
      
      await DataStorageService.clearAllData();
      await AdaptiveAuthService.logout();
      
      // Rafraîchir l'état
      await initialize();
      
      console.log('✅ [useStorageMode] Données effacées');
    } catch (error) {
      console.error('❌ [useStorageMode] Erreur effacement:', error);
    }
  }, [initialize]);

  /**
   * Vérifier la connectivité
   */
  const checkConnectivity = useCallback(async (): Promise<boolean> => {
    try {
      const isOnline = await DataStorageService.checkConnectivity();
      setState(prev => ({ ...prev, isOnline }));
      return isOnline;
    } catch (error) {
      console.error('❌ [useStorageMode] Erreur test connectivité:', error);
      return false;
    }
  }, []);

  /**
   * Rafraîchir les statistiques
   */
  const refreshStats = useCallback(() => {
    try {
      const storageStats = DataStorageService.getStorageStats();
      const authStats = AdaptiveAuthService.getAuthStats();
      
      setState(prev => ({
        ...prev,
        needsSync: storageStats.needsSync || false,
        stats: {
          localSize: storageStats.localSize,
          hasLocalData: storageStats.hasLocalData,
          lastSync: storageStats.lastSync,
          localUsersCount: authStats.localUsersCount
        }
      }));
    } catch (error) {
      console.error('❌ [useStorageMode] Erreur rafraîchissement stats:', error);
    }
  }, []);

  /**
   * Effect d'initialisation
   */
  useEffect(() => {
    initialize();
  }, [initialize]);

  /**
   * Effect de surveillance connectivité (mode cloud)
   */
  useEffect(() => {
    if (state.mode === 'cloud' && state.isInitialized) {
      const interval = setInterval(checkConnectivity, 30000); // Vérifier toutes les 30s
      return () => clearInterval(interval);
    }
  }, [state.mode, state.isInitialized, checkConnectivity]);

  /**
   * Effect de synchronisation automatique
   */
  useEffect(() => {
    if (state.mode === 'cloud' && state.isOnline && state.needsSync) {
      // Synchroniser automatiquement après 5 secondes
      const timeout = setTimeout(() => {
        syncData();
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [state.mode, state.isOnline, state.needsSync, syncData]);

  return [
    state,
    {
      switchMode,
      syncData,
      clearAllData,
      checkConnectivity,
      refreshStats
    }
  ];
}

export default useStorageMode;
