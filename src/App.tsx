import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { store } from './store';
import { LanguageProvider } from './contexts/LanguageContext';

// Import des écrans
import Dashboard from './screens/Dashboard';
import Evaluation from './screens/Evaluation';
import SuiviProgres from './screens/SuiviProgres';
import Activites from './screens/Activites';
import Conseils from './screens/Conseils';
import Ressources from './screens/Ressources';
import EspacePro from './screens/EspacePro';
import ProfileEdit from './screens/ProfileEdit';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ChildManagement from './screens/ChildManagement';
import SetupScreen from './screens/SetupScreen';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import { ConditionalRedirect } from './components/ConditionalRedirect';
import TestModeProvider from './components/TestModeProvider';

// Déclaration de type pour Cypress
declare global {
  interface Window {
    Cypress?: any;
  }
}

// Configuration du thème
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const drawerWidth = 280;

// Composant Layout pour les routes protégées
const ProtectedLayout = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', minHeight: '100vh' }}>
    <Navigation />
    <div 
      style={{ 
        flexGrow: 1, 
        padding: '16px 24px',
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
      }}
    >
      {children}
    </div>
  </div>
);

function App() {
  return (
    <Provider store={store}>
      <LanguageProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <TestModeProvider>
            <Router>
              {/* Composant de redirection conditionnelle */}
              <ConditionalRedirect />
              
              {/* Routes de l'application */}
              <Routes>
                {/* Route publique pour le setup */}
                <Route path="/setup" element={<SetupScreen />} />
                
                {/* Routes d'authentification */}
                <Route path="/register" element={<RegisterScreen />} />
                <Route path="/login" element={<LoginScreen />} />
                
                {/* Route par défaut - LoginScreen comme écran d'accueil */}
                <Route path="/" element={<LoginScreen />} />
                
                {/* Routes protégées */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <Dashboard />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />
                <Route path="/evaluation" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <Evaluation />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />
                <Route path="/suivi-progres" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <SuiviProgres />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />
                <Route path="/activites" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <Activites />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />
                <Route path="/conseils" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <Conseils />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />
                <Route path="/ressources" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <Ressources />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />
                <Route path="/espace-pro" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <EspacePro />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <ProfileEdit />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />
                <Route path="/child-management" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <ChildManagement />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />
                
                {/* Routes pour les actions du Dashboard */}
                <Route path="/children/add" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <ChildManagement />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />
                <Route path="/children/:id/edit" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <ChildManagement />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />
                <Route path="/children/:id/dashboard" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <Dashboard />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />
                <Route path="/children/:id/photos" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <ChildManagement />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />
                <Route path="/children/:id/documents" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <ChildManagement />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />
                <Route path="/calendar" element={
                  <ProtectedRoute>
                    <ProtectedLayout>
                      <Dashboard />
                    </ProtectedLayout>
                  </ProtectedRoute>
                } />
                
                {/* Route par défaut */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </TestModeProvider>
        </ThemeProvider>
      </LanguageProvider>
    </Provider>
  );
}

export default App;
