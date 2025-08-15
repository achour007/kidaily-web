import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { translations, type Translations, supportedLanguages, getLanguageName, getLanguageFlag } from '../translations/translations';

interface LanguageContextType {
  language: string;
  t: Translations;
  changeLanguage: (newLanguage: string) => void;
  supportedLanguages: typeof supportedLanguages;
  getLanguageName: typeof getLanguageName;
  getLanguageFlag: typeof getLanguageFlag;
  reloadTranslations: () => void; // Nouvelle fonction pour forcer le rechargement
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

/**
 * Fournisseur de contexte pour la gestion des langues avec fallback robuste
 */
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    const initialLanguage = savedLanguage || 'fr';
    
    // Vérifier si la langue sauvegardée est supportée
    if (savedLanguage && !translations[savedLanguage]) {
      console.warn(`[LanguageContext] Saved language "${savedLanguage}" not supported, falling back to French`);
      localStorage.setItem('selectedLanguage', 'fr');
      return 'fr';
    }
    
    console.log(`[LanguageContext] Initializing with language: ${initialLanguage}`);
    return initialLanguage;
  });

  // État pour forcer le rechargement des traductions
  const [forceReload, setForceReload] = useState(0);

  /**
   * Récupère les traductions avec fallback robuste et logs détaillés
   */
  const getTranslationsWithFallback = useCallback((targetLanguage: string): Translations => {
    console.log(`[LanguageContext] getTranslationsWithFallback called for language: ${targetLanguage}`);
    
    // Vérifier si la langue est supportée
    if (!translations[targetLanguage]) {
      console.warn(`[LanguageContext] Language "${targetLanguage}" not supported, falling back to French`);
      console.log(`[LanguageContext] Available languages:`, Object.keys(translations));
      return translations.fr;
    }

    const targetTranslations = translations[targetLanguage];
    console.log(`[LanguageContext] Found translations for ${targetLanguage}:`, {
      hasVersionLocalInfo: 'versionLocalInfo' in targetTranslations,
      hasVersionCloudInfo: 'versionCloudInfo' in targetTranslations,
      versionLocalInfo: targetTranslations.versionLocalInfo,
      versionCloudInfo: targetTranslations.versionCloudInfo,
    });
    
    // Vérifier si toutes les clés nécessaires sont présentes
    const requiredKeys = Object.keys(translations.fr);
    const missingKeys = requiredKeys.filter(key => !(key in targetTranslations));
    
    if (missingKeys.length > 0) {
      console.warn(`[LanguageContext] Missing keys in ${targetLanguage}:`, missingKeys);
      
      // Créer un objet de traductions avec fallback pour les clés manquantes
      const fallbackTranslations = { ...translations.fr };
      Object.assign(fallbackTranslations, targetTranslations);
      
      console.log(`[LanguageContext] Using fallback translations for ${targetLanguage}:`, {
        versionLocalInfo: fallbackTranslations.versionLocalInfo,
        versionCloudInfo: fallbackTranslations.versionCloudInfo,
      });
      
      return fallbackTranslations;
    }

    console.log(`[LanguageContext] Returning complete translations for ${targetLanguage}`);
    return targetTranslations;
  }, []);

  /**
   * Traductions mémorisées avec fallback robuste
   */
  const t = useMemo(() => {
    console.log(`[LanguageContext] Loading translations for language: ${language} (forceReload: ${forceReload})`);
    const translationsForLanguage = getTranslationsWithFallback(language);
    
    // Log des traductions critiques pour le débogage
    if (process.env.NODE_ENV === 'development') {
      console.log(`[LanguageContext] Final translations for ${language}:`, {
        versionLocalInfo: translationsForLanguage.versionLocalInfo,
        versionCloudInfo: translationsForLanguage.versionCloudInfo,
      });
    }
    
    return translationsForLanguage;
  }, [language, getTranslationsWithFallback, forceReload]);

  /**
   * Fonction de changement de langue avec validation
   */
  const changeLanguage = useCallback((newLanguage: string) => {
    console.log(`[LanguageContext] Attempting to change language to: ${newLanguage}`);
    
    if (!translations[newLanguage]) {
      console.warn(`[LanguageContext] Language "${newLanguage}" not supported, falling back to French`);
      setLanguage('fr');
      localStorage.setItem('selectedLanguage', 'fr');
      return;
    }

    console.log(`[LanguageContext] Successfully changing language to: ${newLanguage}`);
    setLanguage(newLanguage);
    localStorage.setItem('selectedLanguage', newLanguage);
    
    // Forcer le rechargement des traductions
    setForceReload(prev => prev + 1);
  }, []);

  /**
   * Fonction pour forcer le rechargement des traductions
   */
  const reloadTranslations = useCallback(() => {
    console.log(`[LanguageContext] Force reloading translations for language: ${language}`);
    setForceReload(prev => prev + 1);
  }, [language]);

  /**
   * Effet pour restaurer la langue sauvegardée au démarrage
   */
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage && savedLanguage !== language && translations[savedLanguage]) {
      console.log(`[LanguageContext] Restoring saved language: ${savedLanguage}`);
      setLanguage(savedLanguage);
    }
  }, [language]);

  /**
   * Valeur du contexte mémorisée
   */
  const contextValue = useMemo(() => ({
    language,
    t,
    changeLanguage,
    supportedLanguages,
    getLanguageName,
    getLanguageFlag,
    reloadTranslations
  }), [language, t, changeLanguage, reloadTranslations]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Hook pour utiliser le contexte de langue
 */
export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
};
