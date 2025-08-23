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
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { register, clearError } from '../store/slices/authSlice';
import { UnifiedErrorAlert, UnifiedError } from '../components/UnifiedErrorAlert';
import { ErrorHandlingService } from '../services/ErrorHandlingService';
import { useLanguageContext } from '../contexts/LanguageContext';
import { AdaptiveAuthService } from '../services/AdaptiveAuthService';
import StorageModeIndicator from '../components/StorageModeIndicator';
import useStorageMode from '../hooks/useStorageMode';

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
  const { language } = useLanguageContext();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  const [unifiedError, setUnifiedError] = useState<UnifiedError | null>(null);
  const [storageState] = useStorageMode();
  const [isAdaptiveMode, setIsAdaptiveMode] = useState(false);

  // Déterminer le mode à utiliser
  useEffect(() => {
    const selectedVersion = localStorage.getItem('selectedVersion');
    const useAdaptive = localStorage.getItem('useAdaptiveAuth') === 'true';
    setIsAdaptiveMode(useAdaptive || selectedVersion === 'local');
  }, [storageState.mode]);

  // Rediriger vers setup après inscription réussie (mode Redux)
  useEffect(() => {
    if (!isAdaptiveMode && isAuthenticated) {
      navigate('/setup');
    }
  }, [isAdaptiveMode, isAuthenticated, navigate]);

  // Gérer les erreurs avec le système unifié
  useEffect(() => {
    if (error) {
      // Créer une erreur unifiée
      const errorObj = typeof error === 'string' ? { message: error } : error;
      const unified = ErrorHandlingService.createUnifiedError(errorObj, language);
      setUnifiedError(unified);
    } else {
      setUnifiedError(null);
    }
  }, [error, language]);

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
      
      // Déterminer si on utilise le mode adaptatif
      if (isAdaptiveMode) {
        // Utiliser AdaptiveAuthService
        const result = await AdaptiveAuthService.register(registerData);
        
        if (result.success) {
          console.log(`✅ Inscription réussie en mode ${result.mode}`);
          navigate('/setup');
        } else {
          const unified = ErrorHandlingService.createUnifiedError(
            { message: result.error }, 
            language
          );
          setUnifiedError(unified);
        }
      } else {
        // Utiliser le système Redux standard
        await dispatch(register(registerData)).unwrap();
      }
    } catch (error: any) {
      const unified = ErrorHandlingService.createUnifiedError(error, language);
      setUnifiedError(unified);
    }
  };



  return (
    <Container maxWidth="sm">
      {/* Indicateur de mode de stockage */}
      <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}>
        <StorageModeIndicator compact />
      </Box>
      
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

          {false && (
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
                                     ⚠️ Attention
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
              

            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Système d'erreur unifié - Style orange professionnel */}
      <Box sx={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1300, maxWidth: '500px', width: '90%' }}>
        <UnifiedErrorAlert
          error={unifiedError}
          onClose={() => setUnifiedError(null)}
          autoHideDuration={8000}
          variant="filled"
        />
      </Box>
    </Container>
  );
};

export default RegisterScreen; 