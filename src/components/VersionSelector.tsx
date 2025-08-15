import React, { useState, useEffect } from 'react';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Paper,
  Alert,
  Box,
  Chip,
} from '@mui/material';
import {
  Storage as StorageIcon,
  Cloud as CloudIcon,
  Security as SecurityIcon,
  Sync as SyncIcon,
} from '@mui/icons-material';
import { useLanguageContext } from '../contexts/LanguageContext';
import { useForceUpdate } from '../hooks/useForceUpdate';

interface VersionSelectorProps {
  onVersionChange?: (version: string) => void;
  disabled?: boolean;
}

/**
 * Composant de sélection de version (locale/cloud) avec traductions robustes
 */
const VersionSelector: React.FC<VersionSelectorProps> = ({ onVersionChange, disabled = false }) => {
  const [version, setVersion] = useState(() => {
    const savedVersion = localStorage.getItem('selectedVersion');
    return savedVersion || 'local';
  });
  
  const { language, t, reloadTranslations } = useLanguageContext();
  const forceUpdate = useForceUpdate();

  // Charger la version sauvegardée
  useEffect(() => {
    const savedVersion = localStorage.getItem('selectedVersion');
    if (savedVersion && savedVersion !== version) {
      setVersion(savedVersion);
    }
  }, [version]);

  // Vérification explicite que les traductions sont disponibles
  useEffect(() => {
    console.log(`[VersionSelector] Checking translations for language: ${language}`);
    
    // Vérifier si les traductions critiques sont présentes
    const hasVersionLocalInfo = t && 'versionLocalInfo' in t && !!t.versionLocalInfo;
    const hasVersionCloudInfo = t && 'versionCloudInfo' in t && !!t.versionCloudInfo;
    
    console.log(`[VersionSelector] Translation check:`, {
      hasVersionLocalInfo,
      hasVersionCloudInfo,
      versionLocalInfo: t?.versionLocalInfo,
      versionCloudInfo: t?.versionCloudInfo,
    });
    
    // Si les traductions ne sont pas disponibles, forcer le rechargement
    if (!hasVersionLocalInfo || !hasVersionCloudInfo) {
      console.warn(`[VersionSelector] Missing translations for language: ${language}, forcing reload`);
      reloadTranslations();
      forceUpdate();
    }
  }, [language, t, reloadTranslations, forceUpdate]);

  const handleVersionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVersion = event.target.value;
    setVersion(newVersion);
    localStorage.setItem('selectedVersion', newVersion);
    if (onVersionChange) {
      onVersionChange(newVersion);
    }
  };

  // Logs de débogage pour tracer les traductions
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[VersionSelector] Language: ${language}`);
      console.log(`[VersionSelector] versionLocalInfo: "${t.versionLocalInfo}"`);
      console.log(`[VersionSelector] versionCloudInfo: "${t.versionCloudInfo}"`);
    }
  }, [language, t.versionLocalInfo, t.versionCloudInfo]);

  // Vérification que les traductions sont disponibles avant le rendu
  if (!t || !t.versionLocalInfo || !t.versionCloudInfo) {
    console.warn(`[VersionSelector] Translations not ready for language: ${language}`);
    return (
      <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Loading translations...
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 2 }} key={`version-selector-${language}-${t.versionLocalInfo}`}>
      <Typography variant="subtitle2" gutterBottom>
        {t.version}
      </Typography>
      
      {/* Explication des versions */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <Chip 
            icon={<StorageIcon />} 
            label={t.local} 
            size="small"
            color={version === 'local' ? 'primary' : 'default'}
          />
          <Chip 
            icon={<CloudIcon />} 
            label={t.cloud} 
            size="small"
            color={version === 'cloud' ? 'primary' : 'default'}
          />
        </Box>
      </Box>
      
      <FormControl component="fieldset" fullWidth>
        <RadioGroup
          row
          value={version}
          onChange={handleVersionChange}
        >
          <FormControlLabel
            value="local"
            control={<Radio />}
            label={
              <Box>
                <Typography variant="body2">{t.local}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {t.localDescription}
                </Typography>
              </Box>
            }
            disabled={disabled}
          />
          <FormControlLabel
            value="cloud"
            control={<Radio />}
            label={
              <Box>
                <Typography variant="body2">{t.cloud}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {t.cloudDescription}
                </Typography>
              </Box>
            }
            disabled={disabled}
          />
        </RadioGroup>
      </FormControl>
      
      {(version === 'local' || version === 'cloud') && (
        <Alert severity="info" sx={{ mt: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {version === 'local' ? <SecurityIcon /> : <SyncIcon />}
            {version === 'local' ? t.versionLocalInfo : t.versionCloudInfo}
          </Box>
        </Alert>
      )}
    </Paper>
  );
};

export default VersionSelector;
