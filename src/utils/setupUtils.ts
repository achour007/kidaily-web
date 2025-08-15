/**
 * Utilitaires pour la gestion de la configuration initiale
 */

/**
 * Vérifie si la configuration est complète
 */
export const isConfigurationComplete = (): boolean => {
  const savedLanguage = localStorage.getItem('selectedLanguage');
  const savedVersion = localStorage.getItem('selectedVersion');
  const hasCompletedSetup = localStorage.getItem('setupCompleted');
  
  return !!(savedLanguage && savedVersion && hasCompletedSetup);
};

/**
 * Réinitialise la configuration (pour forcer l'affichage de l'écran de configuration)
 */
export const resetConfiguration = (): void => {
  localStorage.removeItem('selectedLanguage');
  localStorage.removeItem('selectedVersion');
  localStorage.removeItem('setupCompleted');
  console.log('[setupUtils] Configuration reset');
};

/**
 * Sauvegarde la configuration
 */
export const saveConfiguration = (language: string, version: string): void => {
  localStorage.setItem('selectedLanguage', language);
  localStorage.setItem('selectedVersion', version);
  localStorage.setItem('setupCompleted', 'true');
  console.log('[setupUtils] Configuration saved:', { language, version });
};

/**
 * Récupère la configuration sauvegardée
 */
export const getSavedConfiguration = () => {
  return {
    language: localStorage.getItem('selectedLanguage') || 'fr',
    version: localStorage.getItem('selectedVersion') || 'local',
    hasCompletedSetup: !!localStorage.getItem('setupCompleted'),
  };
};

/**
 * Force l'affichage de l'écran de configuration (pour les tests)
 */
export const forceSetupScreen = (): void => {
  resetConfiguration();
  console.log('[setupUtils] Setup screen forced - configuration cleared');
};

/**
 * Nettoie complètement le localStorage pour forcer l'affichage de l'écran de configuration
 */
export const clearAllConfiguration = (): void => {
  localStorage.clear();
  console.log('[setupUtils] All localStorage cleared - setup screen will be forced');
};

/**
 * Force la réinitialisation complète et recharge la page
 */
export const forceResetAndReload = (): void => {
  console.log('[setupUtils] Force reset and reload initiated');
  localStorage.clear();
  console.log('[setupUtils] localStorage cleared, reloading page...');
  // Recharger la page après un court délai
  setTimeout(() => {
    window.location.reload();
  }, 100);
};
