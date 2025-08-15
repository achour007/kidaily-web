import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock des modules externes
jest.mock('./contexts/LanguageContext', () => ({
  LanguageProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="language-provider">{children}</div>,
}));

// Mock des composants internes
jest.mock('./components/Navigation', () => ({
  __esModule: true,
  default: () => <div data-testid="navigation">Navigation</div>,
}));

jest.mock('./components/ProtectedRoute', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="protected-route">{children}</div>,
}));

// Mock des écrans
jest.mock('./screens/SetupScreen', () => ({
  __esModule: true,
  default: () => <div data-testid="setup-screen">Setup Screen</div>,
}));

jest.mock('./screens/LoginScreen', () => ({
  __esModule: true,
  default: () => <div data-testid="login-screen">Login Screen</div>,
}));

jest.mock('./screens/RegisterScreen', () => ({
  __esModule: true,
  default: () => <div data-testid="register-screen">Register Screen</div>,
}));

jest.mock('./screens/Dashboard', () => ({
  __esModule: true,
  default: () => <div data-testid="dashboard">Dashboard</div>,
}));

jest.mock('./screens/Evaluation', () => ({
  __esModule: true,
  default: () => <div data-testid="evaluation">Evaluation</div>,
}));

jest.mock('./screens/SuiviProgres', () => ({
  __esModule: true,
  default: () => <div data-testid="suivi-progres">Suivi Progres</div>,
}));

jest.mock('./screens/Activites', () => ({
  __esModule: true,
  default: () => <div data-testid="activites">Activites</div>,
}));

jest.mock('./screens/Conseils', () => ({
  __esModule: true,
  default: () => <div data-testid="conseils">Conseils</div>,
}));

jest.mock('./screens/Ressources', () => ({
  __esModule: true,
  default: () => <div data-testid="ressources">Ressources</div>,
}));

jest.mock('./screens/EspacePro', () => ({
  __esModule: true,
  default: () => <div data-testid="espace-pro">Espace Pro</div>,
}));

jest.mock('./screens/ProfileEdit', () => ({
  __esModule: true,
  default: () => <div data-testid="profile-edit">Profile Edit</div>,
}));

jest.mock('./screens/ChildManagement', () => ({
  __esModule: true,
  default: () => <div data-testid="child-management">Child Management</div>,
}));

// Mock de react-router-dom
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div data-testid="browser-router">{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div data-testid="routes">{children}</div>,
  Route: ({ element }: { element: React.ReactNode }) => <div data-testid="route">{element}</div>,
  Navigate: () => <div data-testid="navigate">Navigate</div>,
}));

// Mock de redux
jest.mock('react-redux', () => ({
  Provider: ({ children }: { children: React.ReactNode }) => <div data-testid="redux-provider">{children}</div>,
}));

jest.mock('./store', () => ({
  store: {},
}));

jest.mock('./store/hooks', () => ({
  useAppDispatch: () => jest.fn(),
}));

jest.mock('./store/slices/authSlice', () => ({
  clearAuth: jest.fn(),
}));

// Mock de Material-UI
jest.mock('@mui/material/styles', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="theme-provider">{children}</div>,
  createTheme: () => ({}),
}));

jest.mock('@mui/material', () => ({
  CssBaseline: () => <div data-testid="css-baseline" />,
  Box: ({ children, ...props }: any) => <div data-testid="box" {...props}>{children}</div>,
  CircularProgress: () => <div data-testid="circular-progress" />,
}));

describe('App Component', () => {
  beforeEach(() => {
    // Nettoyer les mocks avant chaque test
    jest.clearAllMocks();
  });

  it('devrait rendre l\'application sans erreur', () => {
    render(<App />);
    
    // Vérifier que les composants principaux sont rendus
    expect(screen.getByTestId('redux-provider')).toBeInTheDocument();
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
    expect(screen.getByTestId('language-provider')).toBeInTheDocument();
  });

  it('devrait afficher le navigateur router', () => {
    render(<App />);
    expect(screen.getByTestId('browser-router')).toBeInTheDocument();
  });

  it('devrait afficher les routes', () => {
    render(<App />);
    expect(screen.getByTestId('routes')).toBeInTheDocument();
  });
});
