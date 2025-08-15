import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Paper,
  Grid,
} from '@mui/material';
import { useLanguageContext } from '../contexts/LanguageContext';

interface LanguageInfoProps {
  showDetails?: boolean;
}

export const LanguageInfo: React.FC<LanguageInfoProps> = ({ showDetails = false }) => {
  const { language, t, supportedLanguages, getLanguageName, getLanguageFlag } = useLanguageContext();

  const currentLanguage = supportedLanguages.find(lang => lang.code === language);

  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Box display="flex" alignItems="center" gap={2}>
        <Typography variant="h6" component="h3">
          {t.language}
        </Typography>
        <Chip
          label={`${currentLanguage?.flag} ${currentLanguage?.name}`}
          color="primary"
          variant="outlined"
        />
      </Box>
      
      {showDetails && (
        <Box mt={2}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Langues supportées :
          </Typography>
          <Grid container spacing={1}>
            {supportedLanguages.map((lang) => (
              <Grid item key={lang.code}>
                <Chip
                  label={`${lang.flag} ${lang.name}`}
                  variant={lang.code === language ? "filled" : "outlined"}
                  size="small"
                  color={lang.code === language ? "primary" : "default"}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Paper>
  );
};

export default LanguageInfo;
