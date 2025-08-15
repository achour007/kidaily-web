import React, { useEffect, useCallback, useRef } from 'react';
import { useEnvironment, forceTestMode, resetTestMode } from '../config/environment';

interface TestModeProviderProps {
  children: React.ReactNode;
  autoDetect?: boolean;
  forceMode?: boolean;
  onModeChange?: (mode: 'test' | 'production' | 'development') => void;
}

/**
 * Provider de mode test ultra-intelligent pour Kidaily
 * Détecte automatiquement et force le mode test selon le contexte
 */
export const TestModeProvider: React.FC<TestModeProviderProps> = ({ 
  children, 
  autoDetect = true,
  forceMode = false,
  onModeChange 
}) => {
  const { mode, testMode, cypressMode, debug } = useEnvironment();
  const hasInitialized = useRef(false);
  const modeChangeTimeout = useRef<NodeJS.Timeout | null>(null);

  // Fonction de log conditionnelle
  const log = useCallback((message: string, data?: any) => {
    if (debug) {
      console.log(`[TestModeProvider] ${message}`, data || '');
    }
  }, [debug]);

  // Fonction de détection automatique du mode test
  const detectTestMode = useCallback(() => {
    if (typeof window === 'undefined') return false;

    // Vérifier si nous sommes dans Cypress
    if (window.Cypress || window.cypress) {
      log('Cypress détecté - activation du mode test');
      return true;
    }

    // Vérifier les propriétés globales
    if ((window as any).__FORCE_TEST_MODE__ || (window as any).__CYPRESS_TEST_MODE__) {
      log('Mode test forcé détecté');
      return true;
    }

    // Vérifier les paramètres d'URL
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('cypress') || 
        searchParams.has('test') || 
        searchParams.has('e2e') ||
        searchParams.has('debug')) {
      log('Paramètres de test détectés dans l\'URL');
      return true;
    }

    // Vérifier le port de développement (3001 pour Cypress, 3000 pour dev normal)
    if (window.location.hostname === 'localhost' && 
        (window.location.port === '3001' || window.location.port === '3000')) {
      log('Port de développement détecté');
      return true;
    }

    // Vérifier le stockage local/session
    if (localStorage.getItem('cypress_mode') === 'true' ||
        sessionStorage.getItem('cypress_mode') === 'true') {
      log('Mode test détecté dans le stockage');
      return true;
    }

    // Vérifier le user agent
    if (navigator.userAgent.includes('Cypress') || 
        navigator.userAgent.includes('cypress') ||
        navigator.userAgent.includes('test')) {
      log('User agent de test détecté');
      return true;
    }

    // Vérifier les variables d'environnement du navigateur
    if ((window as any).__TEST_MODE__ || (window as any).__CYPRESS_MODE__) {
      log('Variables d\'environnement de test détectées');
      return true;
    }

    return false;
  }, [log]);

  // Fonction d'activation du mode test
  const activateTestMode = useCallback(() => {
    if (typeof window === 'undefined') return;

    log('Activation du mode test');

    // Définir les propriétés globales
    (window as any).__FORCE_TEST_MODE__ = true;
    (window as any).__CYPRESS_TEST_MODE__ = true;
    (window as any).__TEST_MODE__ = true;
    (window as any).__CYPRESS_MODE__ = true;

    // Définir dans le stockage
    localStorage.setItem('cypress_mode', 'true');
    sessionStorage.setItem('cypress_mode', 'true');
    localStorage.setItem('test_mode', 'true');
    sessionStorage.setItem('test_mode', 'true');

    // Forcer le mode test via l'API
    forceTestMode();

    // Notifier le changement de mode
    if (onModeChange) {
      onModeChange('test');
    }

    log('Mode test activé avec succès');
  }, [log, onModeChange]);

  // Fonction de désactivation du mode test
  const deactivateTestMode = useCallback(() => {
    if (typeof window === 'undefined') return;

    log('Désactivation du mode test');

    // Supprimer les propriétés globales
    delete (window as any).__FORCE_TEST_MODE__;
    delete (window as any).__CYPRESS_TEST_MODE__;
    delete (window as any).__TEST_MODE__;
    delete (window as any).__CYPRESS_MODE__;

    // Nettoyer le stockage
    localStorage.removeItem('cypress_mode');
    sessionStorage.removeItem('cypress_mode');
    localStorage.removeItem('test_mode');
    sessionStorage.removeItem('test_mode');

    // Réinitialiser le mode test via l'API
    resetTestMode();

    // Notifier le changement de mode
    if (onModeChange) {
      onModeChange('development');
    }

    log('Mode test désactivé avec succès');
  }, [log, onModeChange]);

  // Initialisation automatique
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    log('Initialisation du TestModeProvider', {
      autoDetect,
      forceMode,
      currentMode: mode,
      testMode,
      cypressMode
    });

    // Si le mode test est forcé
    if (forceMode) {
      log('Mode test forcé par les props');
      activateTestMode();
      return;
    }

    // Si la détection automatique est activée
    if (autoDetect && detectTestMode()) {
      log('Mode test détecté automatiquement');
      activateTestMode();
      return;
    }

    // Si nous sommes déjà en mode test
    if (testMode || cypressMode) {
      log('Mode test déjà activé');
      return;
    }

    log('Mode production/développement maintenu');
  }, [autoDetect, forceMode, mode, testMode, cypressMode, detectTestMode, activateTestMode, log]);

  // Gestion des changements de contexte
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'cypress_mode' || event.key === 'test_mode') {
        log('Changement de mode détecté dans le stockage', {
          key: event.key,
          newValue: event.newValue,
          oldValue: event.oldValue
        });

        if (event.newValue === 'true') {
          activateTestMode();
        } else {
          deactivateTestMode();
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Vérifier à nouveau le mode test quand la page redevient visible
        if (autoDetect && detectTestMode()) {
          log('Mode test détecté lors du retour à la page');
          activateTestMode();
        }
      }
    };

    // Écouter les changements de stockage
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [autoDetect, detectTestMode, activateTestMode, deactivateTestMode, log]);

  // Nettoyage des timeouts
  useEffect(() => {
    const currentTimeout = modeChangeTimeout.current;
    return () => {
      if (currentTimeout) {
        clearTimeout(currentTimeout);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Interface de débogage en mode développement
  useEffect(() => {
    if (debug && typeof window !== 'undefined') {
      // Exposer les fonctions de contrôle pour le débogage
      (window as any).__TEST_MODE_CONTROLS__ = {
        activateTestMode,
        deactivateTestMode,
        detectTestMode,
        currentMode: mode,
        isTestMode: testMode || cypressMode
      };

      log('Contrôles de mode test exposés pour le débogage');
    }
  }, [debug, mode, testMode, cypressMode, activateTestMode, deactivateTestMode, detectTestMode, log]);

  return <>{children}</>;
};

export default TestModeProvider;



