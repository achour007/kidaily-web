import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Navigation from './Navigation';

// Mock des dépendances
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: '/dashboard' }),
}));

// Mock du contexte de langue
const mockLanguageContext = {
  t: {
    dashboard: 'Dashboard',
    children: 'Enfants',
    evaluation: 'Évaluation',
    progress: 'Progrès',
    activities: 'Activités',
    advice: 'Conseils',
    resources: 'Ressources',
    proSpace: 'Espace Pro',
  },
  language: 'fr',
  changeLanguage: jest.fn(),
  supportedLanguages: [],
};

jest.mock('../contexts/LanguageContext', () => ({
  useLanguageContext: () => mockLanguageContext,
}));

// Mock des composants Material-UI
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  Drawer: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  List: ({ children, ...props }: any) => <ul {...props}>{children}</ul>,
  ListItem: ({ children, onClick, ...props }: any) => (
    <li onClick={onClick} {...props} data-testid={`nav-${props['data-testid'] || 'item'}`}>
      {children}
    </li>
  ),
  ListItemIcon: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  ListItemText: ({ children, primary, ...props }: any) => (
    <div {...props} data-testid={`nav-text-${primary?.toLowerCase().replace(/\s+/g, '-') || 'text'}`}>
      {primary || children}
    </div>
  ),
  Typography: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Divider: ({ ...props }: any) => <hr {...props} />,
  IconButton: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  AppBar: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Toolbar: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  useTheme: () => ({
    breakpoints: {
      down: () => false,
    },
  }),
  useMediaQuery: () => false,
}));

// Mock des icônes Material-UI
jest.mock('@mui/icons-material', () => ({
  Dashboard: () => <span>DashboardIcon</span>,
  Assessment: () => <span>AssessmentIcon</span>,
  Timeline: () => <span>TimelineIcon</span>,
  Games: () => <span>GamesIcon</span>,
  Lightbulb: () => <span>LightbulbIcon</span>,
  LocationOn: () => <span>LocationIcon</span>,
  Person: () => <span>PersonIcon</span>,
  Menu: () => <span>MenuIcon</span>,
  Settings: () => <span>SettingsIcon</span>,
}));

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

describe('Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  it('devrait afficher le titre Kidaily', () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    expect(screen.getAllByText('Kidaily')[0]).toBeInTheDocument();
  });

  it('devrait afficher la description', () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    expect(screen.getAllByText('Suivi du développement de l\'enfant')[0]).toBeInTheDocument();
  });

  it('devrait afficher tous les éléments de menu', () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    expect(screen.getAllByText('Dashboard')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Enfants')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Évaluation')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Progrès')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Activités')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Conseils')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Ressources')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Espace Pro')[0]).toBeInTheDocument();
  });

  it('devrait naviguer vers le dashboard quand on clique sur Dashboard', () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    const dashboardItems = screen.getAllByText('Dashboard');
    const dashboardItem = dashboardItems[0].closest('li');
    if (dashboardItem) {
      fireEvent.click(dashboardItem);
    }

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('devrait naviguer vers les enfants quand on clique sur Enfants', () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    const childrenItems = screen.getAllByText('Enfants');
    const childrenItem = childrenItems[0].closest('li');
    if (childrenItem) {
      fireEvent.click(childrenItem);
    }

    expect(mockNavigate).toHaveBeenCalledWith('/children');
  });

  it('devrait naviguer vers l\'évaluation quand on clique sur Évaluation', () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    const evaluationItems = screen.getAllByText('Évaluation');
    const evaluationItem = evaluationItems[0].closest('li');
    if (evaluationItem) {
      fireEvent.click(evaluationItem);
    }

    expect(mockNavigate).toHaveBeenCalledWith('/evaluation');
  });

  it('devrait naviguer vers le suivi quand on clique sur Progrès', () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    const progressItems = screen.getAllByText('Progrès');
    const progressItem = progressItems[0].closest('li');
    if (progressItem) {
      fireEvent.click(progressItem);
    }

    expect(mockNavigate).toHaveBeenCalledWith('/suivi');
  });

  it('devrait naviguer vers les activités quand on clique sur Activités', () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    const activitiesItems = screen.getAllByText('Activités');
    const activitiesItem = activitiesItems[0].closest('li');
    if (activitiesItem) {
      fireEvent.click(activitiesItem);
    }

    expect(mockNavigate).toHaveBeenCalledWith('/activites');
  });
});
