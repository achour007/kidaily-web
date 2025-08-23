/**
 * INDICATEUR DE MODE DE STOCKAGE
 * 
 * Composant qui affiche l'état actuel du mode de stockage
 * et permet les actions de gestion (sync, switch, etc.)
 */

import React, { useState } from 'react';
import {
  Box,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Typography,
  Alert,
  Button,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Storage as StorageIcon,
  Cloud as CloudIcon,
  Sync as SyncIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  SwapHoriz as SwapIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Info as InfoIcon
} from '@mui/icons-material';

import useStorageMode from '../hooks/useStorageMode';

interface StorageModeIndicatorProps {
  showDetails?: boolean;
  compact?: boolean;
}

const StorageModeIndicator: React.FC<StorageModeIndicatorProps> = ({ 
  showDetails = false, 
  compact = false 
}) => {
  const [state, actions] = useStorageMode();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSwitchMode = async () => {
    setIsLoading(true);
    const newMode = state.mode === 'local' ? 'cloud' : 'local';
    const success = await actions.switchMode(newMode);
    setIsLoading(false);
    handleMenuClose();
    
    if (!success) {
      alert('Erreur lors du basculement de mode');
    }
  };

  const handleSync = async () => {
    setIsLoading(true);
    const success = await actions.syncData();
    setIsLoading(false);
    handleMenuClose();
    
    if (!success) {
      alert('Erreur lors de la synchronisation');
    }
  };

  const handleClearData = async () => {
    await actions.clearAllData();
    handleMenuClose();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatLastSync = (lastSync?: string): string => {
    if (!lastSync) return 'Jamais';
    const date = new Date(lastSync);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffMinutes < 1) return 'À l\'instant';
    if (diffMinutes < 60) return `Il y a ${diffMinutes}min`;
    if (diffMinutes < 1440) return `Il y a ${Math.floor(diffMinutes / 60)}h`;
    return date.toLocaleDateString('fr-FR');
  };

  if (!state.isInitialized) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={16} />
        <Typography variant="caption">Initialisation...</Typography>
      </Box>
    );
  }

  const modeIcon = state.mode === 'local' ? <StorageIcon /> : <CloudIcon />;
  const connectivityIcon = state.isOnline ? <WifiIcon /> : <WifiOffIcon />;
  const modeColor = state.mode === 'local' ? 'secondary' : 'primary';

  if (compact) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Chip
          icon={modeIcon}
          label={state.mode === 'local' ? 'Local' : 'Cloud'}
          color={modeColor}
          size="small"
          variant={state.needsSync ? 'outlined' : 'filled'}
        />
        {state.mode === 'cloud' && (
          <Tooltip title={state.isOnline ? 'En ligne' : 'Hors ligne'}>
            <Box sx={{ color: state.isOnline ? 'success.main' : 'error.main' }}>
              {connectivityIcon}
            </Box>
          </Tooltip>
        )}
        {state.needsSync && (
          <Tooltip title="Synchronisation nécessaire">
            <IconButton size="small" onClick={handleSync} disabled={isLoading}>
              {isLoading ? <CircularProgress size={16} /> : <SyncIcon />}
            </IconButton>
          </Tooltip>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
      {/* En-tête */}
      <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip
            icon={modeIcon}
            label={`Mode ${state.mode === 'local' ? 'Local' : 'Cloud'}`}
            color={modeColor}
            variant="filled"
          />
          {state.mode === 'cloud' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {connectivityIcon}
              <Typography variant="body2" color={state.isOnline ? 'success.main' : 'error.main'}>
                {state.isOnline ? 'En ligne' : 'Hors ligne'}
              </Typography>
            </Box>
          )}
        </Box>

        <IconButton onClick={handleMenuOpen} disabled={isLoading}>
          {isLoading ? <CircularProgress size={20} /> : <MoreVertIcon />}
        </IconButton>
      </Box>

      {/* Statistiques */}
      {showDetails && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Statistiques de stockage :
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, fontSize: '0.875rem' }}>
            <Box>Taille locale : {formatFileSize(state.stats.localSize)}</Box>
            <Box>Données locales : {state.stats.hasLocalData ? 'Oui' : 'Non'}</Box>
            {state.mode === 'local' && (
              <Box sx={{ gridColumn: '1 / -1' }}>
                Utilisateurs locaux : {state.stats.localUsersCount}
              </Box>
            )}
            {state.mode === 'cloud' && (
              <Box sx={{ gridColumn: '1 / -1' }}>
                Dernière sync : {formatLastSync(state.stats.lastSync)}
              </Box>
            )}
          </Box>
        </Box>
      )}

      {/* Alertes */}
      {state.needsSync && (
        <Alert 
          severity="warning" 
          action={
            <Button 
              size="small" 
              onClick={handleSync}
              disabled={isLoading || !state.isOnline}
            >
              Synchroniser
            </Button>
          }
        >
          Synchronisation nécessaire
        </Alert>
      )}

      {state.mode === 'cloud' && !state.isOnline && (
        <Alert severity="error" sx={{ mt: 1 }}>
          Mode hors ligne - Les modifications seront synchronisées lors de la reconnexion
        </Alert>
      )}

      {/* Menu des actions */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleSwitchMode}>
          <SwapIcon sx={{ mr: 1 }} />
          Basculer vers {state.mode === 'local' ? 'Cloud' : 'Local'}
        </MenuItem>
        
        {state.mode === 'cloud' && (
          <MenuItem onClick={handleSync} disabled={!state.isOnline}>
            <SyncIcon sx={{ mr: 1 }} />
            Synchroniser maintenant
          </MenuItem>
        )}
        
        <Divider />
        
        <MenuItem onClick={handleClearData} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Effacer toutes les données
        </MenuItem>
        
        <MenuItem onClick={actions.refreshStats}>
          <InfoIcon sx={{ mr: 1 }} />
          Actualiser les statistiques
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default StorageModeIndicator;
