import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import VersionSelector from './VersionSelector';

// Mock simple du contexte de langue
const mockLanguageContext = {
  language: 'fr',
  t: {
    version: 'Version',
    local: 'Locale',
    cloud: 'Cloud',
    localDescription: 'Données stockées localement',
    cloudDescription: 'Synchronisation avec le serveur',
    versionLocalInfo: 'Version locale - Les données sont stockées localement',
    versionCloudInfo: 'Version cloud - Les données seront synchronisées avec le serveur distant',
  },
  changeLanguage: jest.fn(),
  supportedLanguages: [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
  ],
  getLanguageName: jest.fn(),
  getLanguageFlag: jest.fn(),
  reloadTranslations: jest.fn(),
};

jest.mock('../contexts/LanguageContext', () => ({
  useLanguageContext: () => mockLanguageContext,
}));

// Mock du hook useForceUpdate
jest.mock('../hooks/useForceUpdate', () => ({
  useForceUpdate: jest.fn(() => jest.fn()),
}));

// Composant wrapper pour les tests
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
};

describe('VersionSelector Component', () => {
  beforeEach(() => {
    // Nettoyer les mocks avant chaque test
    jest.clearAllMocks();
  });

  it('devrait afficher le composant VersionSelector', async () => {
    render(
      <TestWrapper>
        <VersionSelector />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Version')).toBeInTheDocument();
    });
  });

  it('devrait afficher les options locale et cloud', async () => {
    render(
      <TestWrapper>
        <VersionSelector />
      </TestWrapper>
    );

    await waitFor(() => {
      // Utiliser getAllByText pour gérer les éléments multiples
      const localeElements = screen.getAllByText('Locale');
      const cloudElements = screen.getAllByText('Cloud');
      
      expect(localeElements.length).toBeGreaterThan(0);
      expect(cloudElements.length).toBeGreaterThan(0);
    });
  });

  it('devrait afficher les descriptions des versions', async () => {
    render(
      <TestWrapper>
        <VersionSelector />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Données stockées localement')).toBeInTheDocument();
      expect(screen.getByText('Synchronisation avec le serveur')).toBeInTheDocument();
    });
  });

  it('devrait afficher le message d\'information pour la version locale', async () => {
    render(
      <TestWrapper>
        <VersionSelector />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Version locale - Les données sont stockées localement')).toBeInTheDocument();
    });
  });

  it('devrait changer de version quand on clique sur cloud', async () => {
    const onVersionChange = jest.fn();
    
    render(
      <TestWrapper>
        <VersionSelector onVersionChange={onVersionChange} />
      </TestWrapper>
    );

    await waitFor(() => {
      const cloudRadio = screen.getByDisplayValue('cloud');
      fireEvent.click(cloudRadio);
    });

    expect(onVersionChange).toHaveBeenCalledWith('cloud');
  });

  it('devrait être désactivé quand disabled est true', async () => {
    render(
      <TestWrapper>
        <VersionSelector disabled={true} />
      </TestWrapper>
    );

    await waitFor(() => {
      const radioButtons = screen.getAllByRole('radio');
      radioButtons.forEach(radio => {
        expect(radio).toBeDisabled();
      });
    });
  });
});
