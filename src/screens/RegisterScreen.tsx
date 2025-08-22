import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Link,
  Container,
  Paper,
  Snackbar,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { register, clearError } from '../store/slices/authSlice';

const RegisterScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((state) => {
    const authState = state.auth;
    console.log('🔍 [DEBUG] Store auth state:', authState);
    return authState;
  });
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Rediriger vers setup après inscription réussie
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/setup');
    }
  }, [isAuthenticated, navigate]);

  // Gérer les erreurs localement aussi
  useEffect(() => {
    console.log('🔍 [DEBUG] useEffect error - error actuel:', error);
    if (error) {
      console.log('🚨 [DEBUG] Erreur Redux détectée:', error);
      setLocalError(error);
      setShowErrorToast(true);
    } else {
      console.log('✅ [DEBUG] Pas d\'erreur Redux');
    }
  }, [error]);

  // Afficher la notification toast quand il y a une erreur
  useEffect(() => {
    console.log('🔍 [DEBUG] useEffect error changé:', error);
    if (error) {
      console.log('🚨 [DEBUG] Erreur détectée, affichage du toast');
      setShowErrorToast(true);
    }
  }, [error]);

  // Nettoyer les erreurs seulement quand l'utilisateur modifie un champ spécifique
  // (pas automatiquement pour permettre la lecture des messages d'erreur)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Nettoyer l'erreur du champ modifié
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    let isValid = true;

    // Validation prénom
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
      isValid = false;
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'Le prénom doit contenir au moins 2 caractères';
      isValid = false;
    }

    // Validation nom
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
      isValid = false;
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Le nom doit contenir au moins 2 caractères';
      isValid = false;
    }

    // Validation email
    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
      isValid = false;
    }

    // Validation mot de passe
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      isValid = false;
    }

    // Validation confirmation mot de passe
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      await dispatch(register(registerData)).unwrap();
      // La redirection se fait automatiquement via useEffect
    } catch (error: any) {
      // L'erreur est gérée par le slice Redux
      console.error('Erreur d\'inscription:', error);
      
      // FORCER l'affichage de l'erreur localement
      if (error && error.message) {
        console.log('🚨 [DEBUG] Erreur capturée dans handleSubmit:', error.message);
        setLocalError(error.message);
        setShowErrorToast(true);
      }
    }
  };

  // Log de débogage dans le render
  console.log('🔍 [DEBUG] RENDER - error:', error, 'localError:', localError, 'showErrorToast:', showErrorToast);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 500,
            borderRadius: 2,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Créer un compte
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rejoignez Kidaily pour suivre le développement de votre enfant
            </Typography>
          </Box>

          {(error || localError) && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                p: 2,
                border: '2px solid #d32f2f',
                backgroundColor: '#ffebee',
                '& .MuiAlert-icon': {
                  fontSize: '1.5rem'
                },
                '& .MuiAlert-message': {
                  fontSize: '1rem',
                  lineHeight: 1.5,
                  fontWeight: 500
                }
              }}
              onClose={() => dispatch(clearError())}
              action={
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={() => dispatch(clearError())}
                  sx={{ color: '#d32f2f', fontWeight: 'bold' }}
                >
                  FERMER
                </Button>
              }
            >
              <Box>
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    color: '#d32f2f', 
                    fontWeight: 'bold',
                    mb: 1,
                    textTransform: 'uppercase'
                  }}
                >
                                     ⚠️ Difficulté technique détectée
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: '#d32f2f',
                    fontWeight: 500,
                    lineHeight: 1.6
                  }}
                >
                  {error}
                </Typography>
                <Box sx={{ mt: 2, p: 2, backgroundColor: '#fff3e0', borderRadius: 1, border: '1px solid #ffb74d' }}>
                  <Typography variant="body2" sx={{ color: '#e65100', fontWeight: 500 }}>
                    💡 <strong>Que faire maintenant ?</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#e65100', mt: 1 }}>
                                         • Si vous avez déjà un compte, utilisez "Se connecter" ci-dessous
                     • Si c'est votre première fois, essayez avec une autre adresse email
                     • Contactez notre équipe support si le problème persiste
                  </Typography>
                </Box>
              </Box>
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }} data-testid="register-form">
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                required
                fullWidth
                id="firstName"
                label="Prénom"
                name="firstName"
                autoComplete="given-name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName}
                disabled={loading}
                data-testid="firstName-input"
              />
              <TextField
                required
                fullWidth
                id="lastName"
                label="Nom"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                error={!!errors.lastName}
                helperText={errors.lastName}
                disabled={loading}
                data-testid="lastName-input"
              />
            </Box>

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresse email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              disabled={loading}
              data-testid="email-input"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              disabled={loading}
              data-testid="password-input"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirmer le mot de passe"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              disabled={loading}
              data-testid="confirmPassword-input"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
              data-testid="register-submit"
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Créer un compte'
              )}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2">
                Déjà un compte ?{' '}
                <Link component={RouterLink} to="/login" variant="body2">
                  Se connecter
                </Link>
              </Typography>
              
              {/* Bouton de test pour forcer l'affichage d'une erreur */}
              <Button
                variant="outlined"
                size="small"
                sx={{ mt: 2 }}
                onClick={() => {
                  console.log('🧪 [TEST] Bouton de test cliqué');
                  setLocalError('🧪 Erreur de test - Vérification de l\'affichage');
                  setShowErrorToast(true);
                }}
              >
                🧪 Tester l'affichage d'erreur
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Notification toast pour les erreurs - TRÈS VISIBLE */}
      <Snackbar
        open={showErrorToast && !!(error || localError)}
        autoHideDuration={8000}
        onClose={() => setShowErrorToast(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            backgroundColor: '#d32f2f',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            minWidth: '400px',
            '& .MuiSnackbarContent-message': {
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span style={{ fontSize: '1.5rem' }}>🚨</span>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            ERREUR D'INSCRIPTION DÉTECTÉE !
          </Typography>
        </Box>
      </Snackbar>
    </Container>
  );
};

export default RegisterScreen; 