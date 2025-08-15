// Configuration centralisée des environnements Kidaily
// Système robuste de détection automatique pour tests et production

export interface EnvironmentConfig {
  // Mode de l'application
  mode: 'development' | 'production' | 'test' | 'staging';
  
  // Configuration des tests
  testMode: boolean;
  cypressMode: boolean;
  disableSetupRedirect: boolean;
  
  // Configuration de l'API
  apiUrl: string;
  apiTimeout: number;
  
  // Configuration de l'application
  appName: string;
  version: string;
  debug: boolean;
  
  // Configuration des logs
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  enableConsoleLogs: boolean;
}

// Détection automatique et robuste de l'environnement
const detectEnvironment = (): EnvironmentConfig => {
  // Détection du mode principal
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';
  const isTest = process.env.NODE_ENV === 'test';
  
  // Détection du mode test avancée
  const isTestMode = 
    isTest ||
    process.env.REACT_APP_TEST_MODE === 'true' ||
    process.env.CYPRESS_TEST_MODE === 'true' ||
    process.env.REACT_APP_CYPRESS_MODE === 'true' ||
    (typeof window !== 'undefined' && (
      // Détection Cypress globale
      window.Cypress ||
      window.cypress ||
      // Détection via propriétés personnalisées
      (window as any).__FORCE_TEST_MODE__ ||
      (window as any).__CYPRESS_TEST_MODE__ ||
      // Détection via URL
      window.location.search.includes('cypress') ||
      window.location.search.includes('test') ||
      window.location.search.includes('e2e') ||
      // Détection via hostname/port
      (window.location.hostname === 'localhost' && window.location.port === '3001') ||
      // Détection via user agent
      navigator.userAgent.includes('Cypress') ||
      navigator.userAgent.includes('cypress') ||
      // Détection via paramètres de session
      sessionStorage.getItem('cypress_mode') === 'true' ||
      localStorage.getItem('cypress_mode') === 'true'
    ));

  // Détection du mode Cypress spécifiquement
  const isCypressMode = 
    isTestMode ||
    process.env.CYPRESS_TEST_MODE === 'true' ||
    (typeof window !== 'undefined' && (
      window.Cypress ||
      window.cypress ||
      window.location.search.includes('cypress')
    ));

  // Configuration de l'API
  const apiUrl = process.env.REACT_APP_API_URL || 
    (isTestMode ? 'http://localhost:3000' : 'https://api.kidaily.com');
  
  const apiTimeout = isTestMode ? 10000 : 30000;

  // Configuration des logs
  const logLevel = isTestMode ? 'debug' : (isDevelopment ? 'info' : 'warn');
  const enableConsoleLogs = isTestMode || isDevelopment;

  // Log de débogage en mode test
  if (isTestMode && typeof window !== 'undefined') {
    console.log('[Environment] Détection du mode test:', {
      NODE_ENV: process.env.NODE_ENV,
      REACT_APP_TEST_MODE: process.env.REACT_APP_TEST_MODE,
      CYPRESS_TEST_MODE: process.env.CYPRESS_TEST_MODE,
      windowCypress: window.Cypress,
      windowCypressLower: window.cypress,
      hostname: window.location.hostname,
      port: window.location.port,
      search: window.location.search,
      userAgent: navigator.userAgent,
      isTestMode,
      isCypressMode
    });
  }

  return {
    mode: isTestMode ? 'test' : (isProduction ? 'production' : 'development'),
    testMode: isTestMode,
    cypressMode: isCypressMode,
    disableSetupRedirect: isTestMode,
    apiUrl,
    apiTimeout,
    appName: 'Kidaily',
    version: process.env.REACT_APP_VERSION || '1.0.0',
    debug: isTestMode || isDevelopment,
    logLevel,
    enableConsoleLogs
  };
};

// Configuration globale
export const env = detectEnvironment();

// Hook React pour utiliser la configuration
export const useEnvironment = () => {
  return env;
};

// Fonctions utilitaires
export const isTestMode = () => env.testMode;
export const isCypressMode = () => env.cypressMode;
export const isSetupRedirectDisabled = () => env.disableSetupRedirect;
export const isDevelopment = () => env.mode === 'development';
export const isProduction = () => env.mode === 'production';

// Fonction pour forcer le mode test (utile pour les tests)
export const forceTestMode = () => {
  if (typeof window !== 'undefined') {
    // Définir les propriétés globales
    (window as any).__FORCE_TEST_MODE__ = true;
    (window as any).__CYPRESS_TEST_MODE__ = true;
    
    // Définir dans le stockage local
    localStorage.setItem('cypress_mode', 'true');
    sessionStorage.setItem('cypress_mode', 'true');
    
    // Recharger la configuration
    Object.assign(env, {
      mode: 'test',
      testMode: true,
      cypressMode: true,
      disableSetupRedirect: true,
      debug: true,
      logLevel: 'debug',
      enableConsoleLogs: true
    });
    
    console.log('[Environment] Mode test forcé activé');
  }
};

// Fonction pour réinitialiser le mode test
export const resetTestMode = () => {
  if (typeof window !== 'undefined') {
    // Supprimer les propriétés globales
    delete (window as any).__FORCE_TEST_MODE__;
    delete (window as any).__CYPRESS_TEST_MODE__;
    
    // Nettoyer le stockage
    localStorage.removeItem('cypress_mode');
    sessionStorage.removeItem('cypress_mode');
    
    // Recharger la configuration
    Object.assign(env, detectEnvironment());
    
    console.log('[Environment] Mode test réinitialisé');
  }
};

// Export par défaut
export default env;
