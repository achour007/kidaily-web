import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Mock de localStorage - doit être défini AVANT les autres mocks
const localStorageMock = {
  getItem: jest.fn((key: string): string | null => {
    if (key === 'selectedLanguage') return 'fr';
    if (key === 'selectedVersion') return 'local';
    if (key === 'setupCompleted') return null;
    return null;
  }),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock du contexte de langue
const mockLanguageContext = {
  language: 'fr',
  t: {
    languageSelection: 'Sélection de la langue',
    versionSelection: 'Sélection de la version',
    continue: 'Continuer',
    reset: 'Réinitialiser',
    setupTitle: 'Configuration initiale',
    setupDescription: 'Configurez votre application',
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
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  ],
};

jest.mock('../contexts/LanguageContext', () => ({
  useLanguageContext: () => mockLanguageContext,
}));

// Mock des utilitaires de configuration - APPROCHE SIMPLIFIÉE
jest.mock('../utils/setupUtils', () => ({
  saveConfiguration: jest.fn(),
  getSavedConfiguration: jest.fn(() => ({
    language: 'fr',
    version: 'local',
    hasCompletedSetup: false,
  })),
  clearAllConfiguration: jest.fn(),
}));

// Mock de react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Import du composant après les mocks
import SetupScreen from './SetupScreen';

// Composant wrapper pour les tests
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = createTheme();
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('SetupScreen', () => {
  beforeEach(() => {
    // Nettoyer les mocks avant chaque test
    jest.clearAllMocks();
    mockNavigate.mockClear();
    
    // Configurer localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    
    // Réinitialiser les mocks de localStorage
    localStorageMock.getItem.mockImplementation((key: string): string | null => {
      if (key === 'selectedLanguage') return 'fr';
      if (key === 'selectedVersion') return 'local';
      if (key === 'setupCompleted') return null;
      return null;
    });
  });

  it('devrait afficher le composant SetupScreen', () => {
    render(
      <TestWrapper>
        <SetupScreen />
      </TestWrapper>
    );

    // Vérifier que le composant se rend sans erreur
    expect(screen.getByText('Kidaily')).toBeInTheDocument();
  });

  it('devrait afficher le stepper avec les étapes', () => {
    render(
      <TestWrapper>
        <SetupScreen />
      </TestWrapper>
    );

    expect(screen.getAllByText('Sélection de la langue')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Sélection de la version')[0]).toBeInTheDocument();
  });

  it('devrait permettre la sélection de version', () => {
    render(
      <TestWrapper>
        <SetupScreen />
      </TestWrapper>
    );

    // Vérifier que les options de version sont présentes
    expect(screen.getAllByText(/Locale/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Cloud/i)[0]).toBeInTheDocument();
  });

  it('devrait afficher le bouton continuer', () => {
    render(
      <TestWrapper>
        <SetupScreen />
      </TestWrapper>
    );

    const continueButton = screen.getByRole('button', { name: /continuer/i });
    expect(continueButton).toBeInTheDocument();
  });

  it('devrait naviguer vers login après configuration', async () => {
    render(
      <TestWrapper>
        <SetupScreen />
      </TestWrapper>
    );

    const continueButton = screen.getByRole('button', { name: /continuer/i });
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('devrait afficher les informations de version', () => {
    render(
      <TestWrapper>
        <SetupScreen />
      </TestWrapper>
    );

    // Vérifier que les informations de version sont affichées
    expect(screen.getByText(/version locale/i)).toBeInTheDocument();
    expect(screen.getByText(/données sont stockées localement/i)).toBeInTheDocument();
  });
});
