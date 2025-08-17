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
  Avatar,
  IconButton,
  InputAdornment,
  Fade,
  Grow,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  School,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login, clearError } from '../store/slices/authSlice';
import { useLanguageContext } from '../contexts/LanguageContext';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.auth);
  const { language, t, changeLanguage, supportedLanguages } = useLanguageContext();

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/setup');
    }
  }, [isAuthenticated, navigate]);

  // Nettoyer les erreurs quand l'utilisateur tape
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [email, password, dispatch, error]);

  const validateForm = (): boolean => {
    let isValid = true;

    // Validation email
    if (!email) {
      setEmailError(t.emailRequired);
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(t.emailInvalid);
      isValid = false;
    } else {
      setEmailError('');
    }

    // Validation mot de passe
    if (!password) {
      setPasswordError(t.passwordRequired);
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError(t.passwordMinLength);
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Récupérer la version depuis localStorage
      const version = localStorage.getItem('selectedVersion') || 'local';
      await dispatch(login({ email, password, language, version })).unwrap();
      // La redirection se fait automatiquement via useEffect
    } catch (error) {
      // L'erreur est gérée par le slice Redux
      console.error('Erreur de connexion:', error);
    }
  };

  const handleLanguageChange = (event: any) => {
    changeLanguage(event.target.value);
  };

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative' }}>
      {/* Sélecteur de langue en haut à droite */}
      <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 1000 }}>
        <FormControl size="small">
          <Select
            value={language}
            onChange={handleLanguageChange}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              borderRadius: 1,
              minWidth: 100,
            }}
            startAdornment={<LanguageIcon sx={{ mr: 1, color: 'text.secondary' }} />}
          >
            {supportedLanguages.map((lang) => (
              <MenuItem key={lang.code} value={lang.code}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      {/* Contenu principal */}
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Container maxWidth="sm">
          <Grow in timeout={800}>
            <Paper
              elevation={24}
              sx={{
                p: 4,
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              {/* Header moderne */}
              <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    width: 56,
                    height: 56,
                    mr: 2,
                    background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                  }}
                >
                  <School sx={{ fontSize: 32 }} />
                </Avatar>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(45deg, #1976d2, #764ba2)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Kidaily
                </Typography>
              </Box>

              {/* Sous-titre */}
              <Typography
                variant="body1"
                sx={{
                  textAlign: 'center',
                  mb: 3,
                  color: 'text.secondary',
                  opacity: 0.8,
                }}
              >
                {t.subtitle}
              </Typography>

              {/* Formulaire de connexion */}
              <Fade in timeout={1000}>
                <Box component="form" onSubmit={handleSubmit} noValidate data-testid="login-form">
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label={t.email}
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!emailError}
                    helperText={emailError}
                    data-testid="email-input"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label={t.password}
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!passwordError}
                    helperText={passwordError}
                    data-testid="password-input"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    data-testid="login-submit"
                    sx={{
                      mt: 3,
                      mb: 2,
                      py: 1.5,
                      borderRadius: 2,
                      background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      t.login
                    )}
                  </Button>
                  {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      {error}
                    </Alert>
                  )}
                  <Box mt={2} textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      {t.noAccount}{' '}
                      <Link component={RouterLink} to="/register" variant="body2">
                        {t.createAccount}
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </Fade>
            </Paper>
          </Grow>
        </Container>
      </Box>
    </Box>
  );
};

export default LoginScreen; 