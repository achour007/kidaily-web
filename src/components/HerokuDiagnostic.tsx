import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Alert, 
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { CheckCircle, Error, Warning, Info } from '@mui/icons-material';

interface DiagnosticResult {
  test: string;
  status: 'success' | 'error' | 'warning' | 'info';
  message: string;
  details?: any;
}

const HerokuDiagnostic: React.FC = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostic = async () => {
    setIsRunning(true);
    setResults([]);
    
    const newResults: DiagnosticResult[] = [];
    
    // Test 1: Vérifier l'URL de l'API
    const apiUrl = process.env.REACT_APP_API_URL || 'https://kidaily-backend-cb9a147c3208.herokuapp.com/api';
    newResults.push({
      test: 'Configuration API',
      status: 'info',
      message: `URL configurée: ${apiUrl}`,
      details: { apiUrl }
    });

    // Test 2: Test de connectivité basique
    try {
      const response = await fetch(apiUrl.replace('/api', ''));
      if (response.ok) {
        newResults.push({
          test: 'Connectivité Heroku',
          status: 'success',
          message: 'Serveur Heroku accessible',
          details: { status: response.status, statusText: response.statusText }
        });
      } else {
        newResults.push({
          test: 'Connectivité Heroku',
          status: 'warning',
          message: `Serveur accessible mais erreur ${response.status}`,
          details: { status: response.status, statusText: response.statusText }
        });
      }
    } catch (error: any) {
      newResults.push({
        test: 'Connectivité Heroku',
        status: 'error',
        message: 'Impossible de joindre le serveur Heroku',
        details: { error: error.message }
      });
    }

    // Test 3: Test de la route d'authentification
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@test.com',
          password: 'test123'
        })
      });
      
      if (response.status === 401) {
        newResults.push({
          test: 'Route Auth Login',
          status: 'success',
          message: 'Route /auth/login accessible (401 = identifiants invalides, mais route fonctionne)',
          details: { status: response.status, statusText: response.statusText }
        });
      } else if (response.status === 404) {
        newResults.push({
          test: 'Route Auth Login',
          status: 'error',
          message: 'Route /auth/login non trouvée',
          details: { status: response.status, statusText: response.statusText }
        });
      } else {
        newResults.push({
          test: 'Route Auth Login',
          status: 'warning',
          message: `Route /auth/login répond avec le statut ${response.status}`,
          details: { status: response.status, statusText: response.statusText }
        });
      }
    } catch (error: any) {
      newResults.push({
        test: 'Route Auth Login',
        status: 'error',
        message: 'Erreur lors du test de la route /auth/login',
        details: { error: error.message }
      });
    }

    // Test 4: Test CORS
    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'OPTIONS'
      });
      
      if (response.ok) {
        newResults.push({
          test: 'CORS',
          status: 'success',
          message: 'CORS configuré correctement',
          details: { status: response.status }
        });
      } else {
        newResults.push({
          test: 'CORS',
          status: 'warning',
          message: 'CORS peut poser problème',
          details: { status: response.status, statusText: response.statusText }
        });
      }
    } catch (error: any) {
      newResults.push({
        test: 'CORS',
        status: 'error',
        message: 'Erreur CORS détectée',
        details: { error: error.message }
      });
    }

    setResults(newResults);
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle color="success" />;
      case 'error': return <Error color="error" />;
      case 'warning': return <Warning color="warning" />;
      case 'info': return <Info color="info" />;
      default: return <Info color="info" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'success.main';
      case 'error': return 'error.main';
      case 'warning': return 'warning.main';
      case 'info': return 'info.main';
      default: return 'info.main';
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        🔍 Diagnostic Backend Heroku
      </Typography>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Tests de connectivité
        </Typography>
        <Button 
          variant="contained" 
          onClick={runDiagnostic}
          disabled={isRunning}
          sx={{ mb: 2 }}
        >
          {isRunning ? <CircularProgress size={20} /> : 'Lancer le diagnostic'}
        </Button>
        
        {results.length > 0 && (
          <List>
            {results.map((result, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getStatusIcon(result.status)}
                        <Typography 
                          variant="subtitle1" 
                          sx={{ color: getStatusColor(result.status) }}
                        >
                          {result.test}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {result.message}
                        </Typography>
                        {result.details && (
                          <Typography variant="caption" component="pre" sx={{ 
                            backgroundColor: 'grey.100', 
                            p: 1, 
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            overflow: 'auto'
                          }}>
                            {JSON.stringify(result.details, null, 2)}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                {index < results.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      <Alert severity="info">
        <Typography variant="body2">
          Ce composant teste la connectivité avec votre backend Heroku et identifie les problèmes potentiels.
          Utilisez-le pour diagnostiquer les erreurs de connexion.
        </Typography>
      </Alert>
    </Box>
  );
};

export default HerokuDiagnostic;
