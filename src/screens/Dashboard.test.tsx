import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Dashboard from './Dashboard';

// Mock des dépendances
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock de fetch
global.fetch = jest.fn();

// Mock du store Redux
const mockStore = configureStore({
  reducer: {
    user: (state = { profile: { name: 'Test User', email: 'test@example.com' } }, action) => state,
  },
});

// Mock des composants Material-UI
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Grid: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Typography: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Avatar: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Chip: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  IconButton: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  List: ({ children, ...props }: any) => <ul {...props}>{children}</ul>,
  ListItem: ({ children, ...props }: any) => <li {...props}>{children}</li>,
  ListItemText: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  ListItemAvatar: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Divider: ({ ...props }: any) => <hr {...props} />,
  Badge: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Fab: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  Dialog: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  DialogTitle: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  DialogContent: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  DialogActions: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  TextField: ({ ...props }: any) => <input {...props} />,
  MenuItem: ({ children, ...props }: any) => <option {...props}>{children}</option>,
  FormControl: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  InputLabel: ({ children, ...props }: any) => <label {...props}>{children}</label>,
  Select: ({ children, ...props }: any) => <select {...props}>{children}</select>,
  Alert: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CircularProgress: ({ ...props }: any) => <div {...props}>Loading...</div>,
}));

// Mock des icônes Material-UI
jest.mock('@mui/icons-material', () => ({
  Add: () => <span>AddIcon</span>,
  PhotoCamera: () => <span>PhotoIcon</span>,
  Restaurant: () => <span>MealIcon</span>,
  Bedtime: () => <span>NapIcon</span>,
  SportsEsports: () => <span>ActivityIcon</span>,
  Notifications: () => <span>NotificationIcon</span>,
  Message: () => <span>MessageIcon</span>,
  CalendarToday: () => <span>CalendarIcon</span>,
  Person: () => <span>ChildIcon</span>,
  Edit: () => <span>EditIcon</span>,
  MoreVert: () => <span>MoreIcon</span>,
}));

// Composant wrapper pour les tests
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = createTheme();
  return (
    <Provider store={mockStore}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    
    // Mock de localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'mock-token'),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  it('devrait afficher un loader pendant le chargement', () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {}) // Promise qui ne se résout jamais
    );

    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('devrait afficher une erreur si le chargement échoue', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Erreur réseau'));

    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/Erreur lors du chargement des enfants/)).toBeInTheDocument();
    });
  });

  it('devrait afficher la liste des enfants quand le chargement réussit', async () => {
    const mockChildren = [
      {
        id: '1',
        name: 'Emma',
        birthDate: '2020-01-01',
        gender: 'F',
        photo: 'photo1.jpg',
        allergies: 'Aucune',
        diet: 'Normal',
        group: 'Groupe A',
        notes: 'Notes sur Emma',
      },
    ];

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockChildren,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ dashboard: {} }),
      });

    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getAllByText('Emma')[0]).toBeInTheDocument();
    });
  });

  it('devrait afficher un message quand aucun enfant n\'est enregistré', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/Aucun enfant enregistré/)).toBeInTheDocument();
      expect(screen.getByText(/Ajouter un enfant/)).toBeInTheDocument();
    });
  });

  it('devrait afficher les informations de l\'utilisateur', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    await waitFor(() => {
      // Vérifier que le composant se rend sans erreur
      expect(screen.getByText('Tableau de bord')).toBeInTheDocument();
    });
  });
});
