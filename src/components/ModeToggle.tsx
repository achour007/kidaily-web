/**
 * COMPOSANT DE BASCULEMENT DE MODE
 * 
 * Permet de basculer entre mode adaptatif et mode standard
 * et affiche clairement les différences
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Switch,
  FormControlLabel,
  Typography,
  Alert,
  Chip,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Science as ScienceIcon,
  Cloud as CloudIcon,
  Storage as StorageIcon
} from '@mui/icons-material';

import useStorageMode from '../hooks/useStorageMode';

interface ModeToggleProps {
  onChange?: (isAdaptive: boolean) => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ onChange }) => {
  const [isAdaptive, setIsAdaptive] = useState(false);
  const [storageState] = useStorageMode();

  useEffect(() => {
    const useAdaptive = localStorage.getItem('useAdaptiveAuth') === 'true';
    setIsAdaptive(useAdaptive);
  }, []);

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setIsAdaptive(newValue);
    localStorage.setItem('useAdaptiveAuth', newValue.toString());
    onChange?.(newValue);
  };

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 2 }}>
      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={isAdaptive}
              onChange={handleToggle}
              color="primary"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ScienceIcon />
              <Typography variant="h6">
                Mode Expérimental Adaptatif
              </Typography>
              <Chip 
                label={isAdaptive ? 'ACTIVÉ' : 'DÉSACTIVÉ'} 
                color={isAdaptive ? 'success' : 'default'}
                size="small"
              />
            </Box>
          }
        />
      </Box>

      <Alert severity={isAdaptive ? 'success' : 'info'} sx={{ mb: 2 }}>
        <Typography variant="body2">
          {isAdaptive 
            ? `🧪 Mode adaptatif activé - Comportement selon version: ${storageState.mode.toUpperCase()}`
            : '📱 Mode standard - Toujours connecté au serveur cloud'
          }
        </Typography>
      </Alert>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subtitle2">
            🔍 Voir les différences entre les modes
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            
            {/* Mode Standard */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CloudIcon color="primary" />
                <Typography variant="subtitle2" color="primary">
                  Mode Standard
                </Typography>
              </Box>
              <Box sx={{ fontSize: '0.875rem', lineHeight: 1.4 }}>
                <Typography variant="body2" paragraph>
                  ✅ Toujours connecté au serveur<br/>
                  ✅ Synchronisation automatique<br/>
                  ✅ Données partagées entre appareils<br/>
                  ✅ Sauvegarde sur serveur<br/>
                  ❌ Nécessite internet<br/>
                  ❌ Choix local/cloud cosmétique
                </Typography>
              </Box>
            </Box>

            {/* Mode Adaptatif */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <ScienceIcon color="success" />
                <Typography variant="subtitle2" color="success.main">
                  Mode Adaptatif (Expérimental)
                </Typography>
              </Box>
              <Box sx={{ fontSize: '0.875rem', lineHeight: 1.4 }}>
                <Typography variant="body2" paragraph>
                  <strong>Version Locale:</strong><br/>
                  🔒 Stockage uniquement local<br/>
                  📱 Fonctionne hors ligne<br/>
                  🚫 Pas de synchronisation<br/>
                  ⚡ Plus rapide<br/>
                  <br/>
                  <strong>Version Cloud:</strong><br/>
                  ☁️ Synchronisation serveur<br/>
                  📊 Données persistantes<br/>
                  🔄 Cache local + serveur
                </Typography>
              </Box>
            </Box>

          </Box>

          {isAdaptive && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                ⚠️ <strong>Mode expérimental :</strong> Cette fonctionnalité est en cours de développement. 
                En mode local, l'authentification est simulée et les données ne sont pas sauvegardées sur serveur.
              </Typography>
            </Alert>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Statut actuel */}
      {isAdaptive && (
        <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            📊 Configuration actuelle :
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Chip
              icon={storageState.mode === 'local' ? <StorageIcon /> : <CloudIcon />}
              label={`Version ${storageState.mode.toUpperCase()}`}
              color={storageState.mode === 'local' ? 'secondary' : 'primary'}
              size="small"
            />
            <Typography variant="body2" color="text.secondary">
              {storageState.mode === 'local' 
                ? 'Stockage local uniquement, pas de serveur'
                : 'Synchronisation avec serveur activée'
              }
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default ModeToggle;
