import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  Chip,
} from '@mui/material';
import {
  GetApp as GetAppIcon,
  Close as CloseIcon,
  Phone as PhoneIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { usePWA } from '../hooks/usePWA';
import { useLanguageContext } from '../contexts/LanguageContext';

const InstallPWA: React.FC = () => {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const { t } = useLanguageContext();
  const [dismissed, setDismissed] = React.useState(false);

  // Ne pas afficher si l'app est déjà installée ou si l'utilisateur a fermé la bannière
  if (isInstalled || dismissed || !isInstallable) {
    return null;
  }

  return (
    <Card 
      sx={{ 
        mb: 3, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        position: 'relative',
      }}
    >
      <IconButton
        sx={{ 
          position: 'absolute', 
          top: 8, 
          right: 8, 
          color: 'white' 
        }}
        onClick={() => setDismissed(true)}
      >
        <CloseIcon />
      </IconButton>
      
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <PhoneIcon sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h6" gutterBottom>
              {t.installApp || 'Installer Kidaily'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {t.installAppDescription || 'Accédez rapidement à l\'application depuis votre écran d\'accueil'}
            </Typography>
          </Box>
        </Box>
        
        {/* Avantages de l'installation */}
        <Box sx={{ mb: 2 }}>
          <Chip 
            icon={<StarIcon />} 
            label={t.premiumFeatures || 'Fonctionnalités Premium'} 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              color: 'white',
              mb: 1,
              mr: 1
            }} 
          />
          <Chip 
            label={t.offlineMode || 'Mode Hors Ligne'} 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              color: 'white',
              mb: 1,
              mr: 1
            }} 
          />
          <Chip 
            label={t.unlimitedProfiles || 'Profils Illimités'} 
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              color: 'white',
              mb: 1
            }} 
          />
        </Box>
        
        <Button
          variant="contained"
          startIcon={<GetAppIcon />}
          onClick={installApp}
          sx={{
            bgcolor: 'white',
            color: '#667eea',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.9)',
            },
          }}
        >
          {t.installAppButton || 'Installer l\'application'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default InstallPWA; 