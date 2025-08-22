import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Select,
  MenuItem,
  Button,
  Alert,
  Chip,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  SelectChangeEvent,
} from '@mui/material';
import {
  Storage as StorageIcon,
  Cloud as CloudIcon,
  Security as SecurityIcon,
  Sync as SyncIcon,
  Language as LanguageIcon,
  Settings as SettingsIcon,
  ArrowForward as ArrowForwardIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useLanguageContext } from '../contexts/LanguageContext';
import { saveConfiguration, getSavedConfiguration, clearAllConfiguration } from '../utils/setupUtils';
import HerokuDiagnostic from '../components/HerokuDiagnostic';

/**
 * Écran de configuration initiale pour la sélection de version et de langue
 * Cet écran s'affiche TOUJOURS au démarrage de l'application
 */
const SetupScreen: React.FC = () => {
  const navigate = useNavigate();
  const { language, t, changeLanguage, supportedLanguages } = useLanguageContext();
  
  const [version, setVersion] = useState(() => {
    const savedConfig = getSavedConfiguration();
    return savedConfig?.version || 'local';
  });
  
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [isConfigured, setIsConfigured] = useState(false);
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  // Vérifier si la configuration est déjà faite
  useEffect(() => {
    const savedConfig = getSavedConfiguration();
    if (savedConfig?.hasCompletedSetup) {
      setIsConfigured(true);
      console.log('[SetupScreen] Configuration already exists, but showing setup screen anyway');
    } else {
      console.log('[SetupScreen] No existing configuration found');
    }
  }, []);

  // FORCER l'affichage du SetupScreen - ne jamais rediriger automatiquement
  useEffect(() => {
    console.log('[SetupScreen] SetupScreen mounted - will always display');
  }, []);

  const handleVersionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVersion = event.target.value;
    setVersion(newVersion);
    localStorage.setItem('selectedVersion', newVersion);
  };

  const handleLanguageChange = (event: SelectChangeEvent<string>) => {
    const newLanguage = event.target.value;
    setSelectedLanguage(newLanguage);
    changeLanguage(newLanguage);
  };

  const handleContinue = () => {
    // Sauvegarder les configurations
    saveConfiguration(selectedLanguage, version);
    
    // Naviguer vers le dashboard après le setup
    console.log('[SetupScreen] Configuration saved, navigating to dashboard');
    navigate('/dashboard');
  };

  const handleResetConfiguration = () => {
    // Nettoyer la configuration
    clearAllConfiguration();
    setIsConfigured(false);
    console.log('[SetupScreen] Configuration reset');
    // Recharger la page pour forcer l'affichage du setup
    window.location.reload();
  };

  const steps = [
    { label: t.languageSelection || 'Sélection de la langue', icon: <LanguageIcon /> },
    { label: t.versionSelection || 'Sélection de la version', icon: <SettingsIcon /> },
  ];

  return (
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
      <Container maxWidth="md">
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
          {/* Header */}
          <Box display="flex" alignItems="center" justifyContent="center" mb={4}>
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 64,
                height: 64,
                mr: 2,
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              }}
            >
              <SettingsIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography
              variant="h3"
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

          {/* Stepper */}
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={1} alternativeLabel>
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepLabel icon={step.icon}>
                    {step.label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Configuration Section */}
          <Box sx={{ mb: 4 }}>
            {/* Sélecteur de Langue */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LanguageIcon />
                {t.languageSelection || 'Sélection de la langue'}
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                    '& .MuiSelect-select': {
                      color: '#333',
                      fontWeight: 500,
                    },
                  }}
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

            {/* Sélecteur de Version */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SettingsIcon />
                {t.versionSelection || 'Sélection de la version'}
              </Typography>
              
              {/* Chips d'information */}
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip 
                  icon={<StorageIcon />} 
                  label={t.local || 'Locale'} 
                  color={version === 'local' ? 'primary' : 'default'}
                  variant={version === 'local' ? 'filled' : 'outlined'}
                />
                <Chip 
                  icon={<CloudIcon />} 
                  label={t.cloud || 'Cloud'} 
                  color={version === 'cloud' ? 'primary' : 'default'}
                  variant={version === 'cloud' ? 'filled' : 'outlined'}
                />
              </Box>

              <FormControl component="fieldset" fullWidth>
                <RadioGroup
                  value={version}
                  onChange={handleVersionChange}
                >
                  <FormControlLabel
                    value="local"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          {t.local || 'Locale'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t.localDescription || 'Données stockées localement'}
                        </Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="cloud"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          {t.cloud || 'Cloud'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {t.cloudDescription || 'Synchronisation avec le serveur'}
                        </Typography>
                      </Box>
                    }
                  />
                </RadioGroup>
              </FormControl>

              {/* Message d'information */}
              {(version === 'local' || version === 'cloud') && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {version === 'local' ? <SecurityIcon /> : <SyncIcon />}
                    {version === 'local' ? t.versionLocalInfo : t.versionCloudInfo}
                  </Box>
                </Alert>
              )}
            </Box>
          </Box>

          {/* Boutons */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleContinue}
              endIcon={<ArrowForwardIcon />}
              sx={{
                background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                },
              }}
            >
              {t.continue || 'Continuer'}
            </Button>
            
            {isConfigured && (
              <Button
                variant="outlined"
                size="large"
                onClick={handleResetConfiguration}
                startIcon={<RefreshIcon />}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
              >
                Réinitialiser
              </Button>
            )}
          </Box>

                     {/* Message si déjà configuré */}
           {isConfigured && (
             <Alert severity="info" sx={{ mt: 2 }}>
               {t.alreadyConfigured || 'Configuration déjà effectuée. Vous pouvez modifier vos choix ci-dessus ou réinitialiser la configuration.'}
             </Alert>
           )}

           {/* Bouton de diagnostic */}
           <Box sx={{ mt: 3, textAlign: 'center' }}>
             <Button
               variant="outlined"
               onClick={() => setShowDiagnostic(!showDiagnostic)}
               sx={{ mb: 2 }}
             >
               {showDiagnostic ? 'Masquer le diagnostic' : '🔍 Diagnostic Backend Heroku'}
             </Button>
           </Box>

           {/* Composant de diagnostic */}
           {showDiagnostic && <HerokuDiagnostic />}
         </Paper>
       </Container>
     </Box>
   );
 };

export default SetupScreen;
