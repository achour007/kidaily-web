import React from 'react';
import { Box, Button, Typography, Paper, Alert } from '@mui/material';
import { useLanguageContext } from '../contexts/LanguageContext';

const LanguageTest: React.FC = () => {
  const { language, t, changeLanguage, supportedLanguages } = useLanguageContext();

  const handleLanguageChange = (newLanguage: string) => {
    changeLanguage(newLanguage);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Test des Traductions - VersionSelector
      </Typography>
      
      <Box mb={2}>
        <Typography variant="body1">
          Langue actuelle: <strong>{language}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          versionLocalInfo: "{t.versionLocalInfo}"
        </Typography>
        <Typography variant="body2" color="text.secondary">
          versionCloudInfo: "{t.versionCloudInfo}"
        </Typography>
      </Box>

      <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
        {supportedLanguages.map((lang) => (
          <Button
            key={lang.code}
            variant={lang.code === language ? "contained" : "outlined"}
            size="small"
            onClick={() => handleLanguageChange(lang.code)}
          >
            {lang.flag} {lang.name}
          </Button>
        ))}
      </Box>

      <Box mt={2}>
        <Alert severity="info">
          <Typography variant="body2">
            <strong>Test Version Locale:</strong> {t.versionLocalInfo}
          </Typography>
        </Alert>
      </Box>

      <Box mt={1}>
        <Alert severity="info">
          <Typography variant="body2">
            <strong>Test Version Cloud:</strong> {t.versionCloudInfo}
          </Typography>
        </Alert>
      </Box>

      <Box mt={2}>
        <Typography variant="body2" color="text.secondary">
          Timestamp: {new Date().toLocaleTimeString()}
        </Typography>
      </Box>
    </Paper>
  );
};

export default LanguageTest;
