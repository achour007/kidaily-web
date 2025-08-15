import type { Translations } from './index';
import { fr } from './fr';
import { en } from './en';
import { de } from './de';
import { it } from './it';

// Log des traductions chargées au démarrage de l'application
console.log('[translations.ts] Loading translations...');
console.log('[translations.ts] Available languages:', Object.keys({ fr, en, de, it }));

// Vérification que toutes les traductions sont correctement importées
const allTranslations = { fr, en, de, it };
Object.entries(allTranslations).forEach(([lang, translations]) => {
  console.log(`[translations.ts] ${lang} translations loaded:`, {
    hasVersionLocalInfo: 'versionLocalInfo' in translations,
    hasVersionCloudInfo: 'versionCloudInfo' in translations,
    versionLocalInfo: translations.versionLocalInfo,
    versionCloudInfo: translations.versionCloudInfo,
  });
});

// Export de toutes les traductions
export const translations: Record<string, Translations> = {
  fr,
  en,
  de,
  it,
};

// Export des types et traductions individuelles
export type { Translations } from './index';
export { fr } from './fr';
export { en } from './en';
export { de } from './de';
export { it } from './it';

/**
 * Fonction utilitaire pour obtenir les traductions avec vérification
 * @param language - Code de la langue (fr, en, de, it)
 * @returns Traductions pour la langue spécifiée ou français par défaut
 */
export const getTranslations = (language: string): Translations => {
  console.log(`[translations.ts] getTranslations called for language: ${language}`);
  
  if (!translations[language]) {
    console.warn(`[translations.ts] Language "${language}" not found, falling back to French`);
    return translations.fr;
  }
  
  const result = translations[language];
  console.log(`[translations.ts] Returning translations for ${language}:`, {
    versionLocalInfo: result.versionLocalInfo,
    versionCloudInfo: result.versionCloudInfo,
  });
  
  return result;
};

/**
 * Fonction utilitaire pour vérifier si une langue est supportée
 * @param language - Code de la langue à vérifier
 * @returns true si la langue est supportée, false sinon
 */
export const isLanguageSupported = (language: string): boolean => {
  const supported = Object.keys(translations).includes(language);
  console.log(`[translations.ts] isLanguageSupported(${language}): ${supported}`);
  return supported;
};

// Liste des langues supportées
export const supportedLanguages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];

/**
 * Fonction utilitaire pour obtenir le nom de la langue
 * @param code - Code de la langue
 * @returns Nom de la langue ou 'Français' par défaut
 */
export const getLanguageName = (code: string): string => {
  const language = supportedLanguages.find(lang => lang.code === code);
  return language ? language.name : 'Français';
};

/**
 * Fonction utilitaire pour obtenir le drapeau de la langue
 * @param code - Code de la langue
 * @returns Drapeau de la langue ou 🇫🇷 par défaut
 */
export const getLanguageFlag = (code: string): string => {
  const language = supportedLanguages.find(lang => lang.code === code);
  return language ? language.flag : '🇫🇷';
};
