import React from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Typography,
  Link,
  IconButton,
  Fade,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useLanguageContext } from '../contexts/LanguageContext';

// Types pour les erreurs unifiées
export interface UnifiedError {
  type: 'email_exists' | 'invalid_credentials' | 'server_error' | 'network_error' | 'validation_error' | 'server_unavailable' | 'generic';
  message: string;
  action?: {
    label: string;
    url?: string;
    onClick?: () => void;
  };
}

// Props du composant
export interface UnifiedErrorAlertProps {
  error: UnifiedError | null;
  onClose?: () => void;
  autoHideDuration?: number;
  variant?: 'standard' | 'filled' | 'outlined';
  sx?: any;
}

/**
 * Composant unifié pour l'affichage des erreurs
 * Style orange d'avertissement professionnel avec icône triangle et lien d'action
 */
export const UnifiedErrorAlert: React.FC<UnifiedErrorAlertProps> = ({
  error,
  onClose,
  autoHideDuration = 8000,
  variant = 'filled',
  sx = {},
}) => {
  const navigate = useNavigate();
  const { t } = useLanguageContext();

  // Auto-fermeture si demandée
  React.useEffect(() => {
    if (error && autoHideDuration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [error, autoHideDuration, onClose]);

  // Gestion du clic sur l'action
  const handleActionClick = () => {
    if (error?.action?.url) {
      navigate(error.action.url);
    } else if (error?.action?.onClick) {
      error.action.onClick();
    }
  };

  // Ne pas afficher si pas d'erreur
  if (!error) {
    return null;
  }

  return (
    <Fade in={!!error} timeout={300}>
      <Alert
        severity="warning"
        variant={variant}
        icon={<WarningIcon />}
        action={
          onClose && (
            <IconButton
              aria-label="fermer"
              color="inherit"
              size="small"
              onClick={onClose}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          )
        }
        sx={{
          // Style orange d'avertissement professionnel
          backgroundColor: '#fff3e0',
          borderColor: '#ff9800',
          border: '1px solid #ff9800',
          borderRadius: 2,
          '& .MuiAlert-icon': {
            color: '#f57c00',
            fontSize: '1.5rem',
          },
          '& .MuiAlert-message': {
            width: '100%',
          },
          '& .MuiAlert-action': {
            color: '#f57c00',
          },
          // Style pour le variant filled
          ...(variant === 'filled' && {
            backgroundColor: '#fff3e0',
            color: '#e65100',
            '& .MuiAlert-icon': {
              color: '#f57c00',
            },
          }),
          // Style personnalisé
          ...sx,
        }}
      >
        <AlertTitle sx={{ 
          color: '#e65100', 
          fontWeight: 600,
          fontSize: '1rem',
          mb: 0.5,
        }}>
          {t.warning || 'Attention'}
        </AlertTitle>
        
        <Box>
          {/* Message principal */}
          <Typography
            variant="body2"
            sx={{
              color: '#e65100',
              fontSize: '0.95rem',
              mb: error.action ? 1 : 0,
            }}
          >
            {error.message}
          </Typography>

          {/* Lien d'action si présent */}
          {error.action && (
            <Link
              component="button"
              variant="body2"
              onClick={handleActionClick}
              sx={{
                color: '#f57c00',
                fontWeight: 500,
                textDecoration: 'underline',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                '&:hover': {
                  color: '#e65100',
                  textDecoration: 'underline',
                },
              }}
            >
              {error.action.label}
            </Link>
          )}
        </Box>
      </Alert>
    </Fade>
  );
};

export default UnifiedErrorAlert;
