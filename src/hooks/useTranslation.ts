import { useMemo, useCallback } from 'react';
import { translations, type Translations } from '../translations/translations';

/**
 * Hook personnalisé pour gérer les traductions avec fallback robuste et logging
 * 
 * @param language - La langue actuelle
 * @returns Un objet contenant les traductions et des utilitaires
 */
export const useTranslation = (language: string) => {
  /**
   * Récupère les traductions pour une langue donnée avec fallback robuste
   */
  const getTranslations = useCallback((targetLanguage: string): Translations => {
    // Vérifier si la langue est supportée
    if (!translations[targetLanguage]) {
      console.warn(`[useTranslation] Language "${targetLanguage}" not supported, falling back to French`);
      return translations.fr;
    }

    const targetTranslations = translations[targetLanguage];
    
    // Vérifier si toutes les clés nécessaires sont présentes
    const requiredKeys = Object.keys(translations.fr);
    const missingKeys = requiredKeys.filter(key => !(key in targetTranslations));
    
    if (missingKeys.length > 0) {
      console.warn(`[useTranslation] Missing keys in ${targetLanguage}:`, missingKeys);
      
      // Créer un objet de traductions avec fallback pour les clés manquantes
      const fallbackTranslations = { ...translations.fr };
      Object.assign(fallbackTranslations, targetTranslations);
      
      return fallbackTranslations;
    }

    return targetTranslations;
  }, []);

  /**
   * Traductions mémorisées pour la langue actuelle
   */
  const t = useMemo(() => {
    console.log(`[useTranslation] Loading translations for language: ${language}`);
    const translationsForLanguage = getTranslations(language);
    
    // Log des traductions critiques pour le débogage
    if (process.env.NODE_ENV === 'development') {
      console.log(`[useTranslation] versionLocalInfo: "${translationsForLanguage.versionLocalInfo}"`);
      console.log(`[useTranslation] versionCloudInfo: "${translationsForLanguage.versionCloudInfo}"`);
    }
    
    return translationsForLanguage;
  }, [language, getTranslations]);

  /**
   * Fonction utilitaire pour obtenir une traduction avec fallback
   */
  const translate = useCallback((key: keyof Translations, fallback?: string): string => {
    const translation = t[key];
    if (!translation) {
      console.warn(`[useTranslation] Missing translation for key "${key}" in language "${language}"`);
      return fallback || key;
    }
    return translation;
  }, [t, language]);

  /**
   * Fonction utilitaire pour vérifier si une traduction existe
   */
  const hasTranslation = useCallback((key: keyof Translations): boolean => {
    return key in t && !!t[key];
  }, [t]);

  return {
    t,
    translate,
    hasTranslation,
    language,
    getTranslations
  };
};
