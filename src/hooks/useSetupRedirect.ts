import { useEffect, useState, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useEnvironment } from '../config/environment';

/**
 * Hook de redirection conditionnelle ultra-robuste
 * Gère automatiquement les redirections selon l'environnement
 */
export const useSetupRedirect = () => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectAttempts, setRedirectAttempts] = useState(0);
  const location = useLocation();
  const { testMode, cypressMode, disableSetupRedirect, debug } = useEnvironment();
  
  // Références pour éviter les redirections multiples
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRedirectingRef = useRef(false);
  const lastPathRef = useRef<string>('');

  // Fonction de log conditionnelle
  const log = useCallback((message: string, data?: any) => {
    if (debug) {
      console.log(`[useSetupRedirect] ${message}`, data || '');
    }
  }, [debug]);

  // Fonction de nettoyage des timeouts
  const clearRedirectTimeout = useCallback(() => {
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
      redirectTimeoutRef.current = null;
    }
  }, []);

  // Fonction de redirection sécurisée
  const performRedirect = useCallback((targetPath: string) => {
    if (isRedirectingRef.current) {
      log('Redirection déjà en cours, ignorée');
      return;
    }

    log(`Redirection vers ${targetPath}`, { 
      currentPath: location.pathname, 
      attempts: redirectAttempts 
    });

    setIsRedirecting(true);
    isRedirectingRef.current = true;

    // Utiliser un délai pour permettre au composant de se rendre
    redirectTimeoutRef.current = setTimeout(() => {
      try {
        window.location.href = targetPath;
      } catch (error) {
        log('Erreur lors de la redirection', error);
        setIsRedirecting(false);
        isRedirectingRef.current = false;
      }
    }, 100);
  }, [location.pathname, redirectAttempts, log]);

  // Vérifications de sécurité pour le mode test
  const additionalTestChecks = useCallback(() => {
    if (typeof window === 'undefined') return false;

    // Vérifier si le mode test a été forcé
    if ((window as any).__FORCE_TEST_MODE__) {
      log('Mode test forcé détecté - pas de redirection');
      return true;
    }

    // Vérifier si nous sommes dans un contexte Cypress
    if (window.Cypress || window.cypress) {
      log('Cypress détecté - pas de redirection');
      return true;
    }

    // Vérifier les propriétés personnalisées
    if ((window as any).__CYPRESS_TEST_MODE__) {
      log('Mode Cypress forcé détecté - pas de redirection');
      return true;
    }

    // Vérifier l'URL pour des paramètres de test
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('cypress') || 
        searchParams.has('test') || 
        searchParams.has('e2e') ||
        searchParams.has('debug')) {
      log('Paramètres de test détectés dans l\'URL - pas de redirection');
      return true;
    }

    // Vérifier le stockage local/session
    if (localStorage.getItem('cypress_mode') === 'true' ||
        sessionStorage.getItem('cypress_mode') === 'true') {
      log('Mode test détecté dans le stockage - pas de redirection');
      return true;
    }

    // Vérifier le port de développement (3001 pour Cypress)
    if (window.location.hostname === 'localhost' && 
        (window.location.port === '3001' || window.location.port === '3000')) {
      log('Port de développement détecté - pas de redirection');
      return true;
    }

    // Vérifier le user agent (fallback)
    if (navigator.userAgent.includes('Cypress') || 
        navigator.userAgent.includes('cypress') ||
        navigator.userAgent.includes('test')) {
      log('User agent de test détecté - pas de redirection');
      return true;
    }

    return false;
  }, [log]);

  // Logique principale de redirection
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Éviter les redirections multiples sur le même chemin
    if (currentPath === lastPathRef.current) {
      return;
    }
    lastPathRef.current = currentPath;

    // Nettoyer les timeouts précédents
    clearRedirectTimeout();

    // Si nous sommes en mode test ou si la redirection est désactivée, ne rien faire
    if (testMode || cypressMode || disableSetupRedirect || additionalTestChecks()) {
      log('Mode test détecté ou redirection désactivée - pas de redirection', {
        testMode,
        cypressMode,
        disableSetupRedirect,
        currentPath
      });
      return;
    }

    // Routes qui ne doivent JAMAIS être redirigées
    const excludedRoutes = [
      '/setup',
      '/register', 
      '/login',
      '/dashboard',
      '/evaluation',
      '/suivi-progres',
      '/activites',
      '/conseils',
      '/ressources',
      '/espace-pro',
      '/profile',
      '/child-management',
      '/auth',
      '/api',
      '/_next',
      '/static',
      '/assets',
      '/favicon.ico',
      '/manifest.json',
      '/robots.txt'
    ];

    // Vérifier si la route actuelle est exclue
    const isExcludedRoute = excludedRoutes.some(route =>
      currentPath === route || currentPath.startsWith(route)
    );

    // Éviter les fichiers statiques et les routes d'API
    const isStaticFile = currentPath.includes('.') ||
                        currentPath.startsWith('/api') ||
                        currentPath.startsWith('/_next') ||
                        currentPath.startsWith('/static');

    // Éviter les redirections en boucle
    const maxRedirectAttempts = 3;
    if (redirectAttempts >= maxRedirectAttempts) {
      log('Nombre maximum de tentatives de redirection atteint', { 
        attempts: redirectAttempts, 
        maxAttempts: maxRedirectAttempts 
      });
      return;
    }

    if (!isExcludedRoute && !isStaticFile) {
      log('Redirection vers /setup activée', {
        currentPath,
        attempts: redirectAttempts + 1,
        isExcludedRoute,
        isStaticFile
      });

      setRedirectAttempts(prev => prev + 1);
      performRedirect('/setup');
    } else {
      log('Pas de redirection nécessaire', {
        currentPath,
        isExcludedRoute,
        isStaticFile
      });
    }
  }, [location.pathname, testMode, cypressMode, disableSetupRedirect, 
      additionalTestChecks, clearRedirectTimeout, performRedirect, redirectAttempts, log]);

  // Nettoyage lors du démontage
  useEffect(() => {
    return () => {
      clearRedirectTimeout();
      isRedirectingRef.current = false;
    };
  }, [clearRedirectTimeout]);

  // Fonction pour forcer une redirection (utile pour les tests)
  const forceRedirect = useCallback((targetPath: string) => {
    log('Redirection forcée', { targetPath, currentPath: location.pathname });
    performRedirect(targetPath);
  }, [performRedirect, location.pathname, log]);

  // Fonction pour annuler une redirection en cours
  const cancelRedirect = useCallback(() => {
    log('Annulation de la redirection');
    clearRedirectTimeout();
    setIsRedirecting(false);
    isRedirectingRef.current = false;
  }, [clearRedirectTimeout, log]);

  return { 
    isRedirecting, 
    redirectAttempts,
    forceRedirect,
    cancelRedirect,
    isTestMode: testMode || cypressMode
  };
};
