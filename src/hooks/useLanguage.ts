import { useState, useEffect } from 'react';
import { translations, type Translations, supportedLanguages, getLanguageName, getLanguageFlag } from '../translations/translations';

export const useLanguage = () => {
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    return savedLanguage || 'fr';
  });

  const t = translations[language] || translations.fr;

  const changeLanguage = (newLanguage: string) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage);
      localStorage.setItem('selectedLanguage', newLanguage);
    }
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage && savedLanguage !== language && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, [language]);

  return {
    language,
    t,
    changeLanguage,
    supportedLanguages,
    getLanguageName,
    getLanguageFlag,
  };
};

export type { Translations };
