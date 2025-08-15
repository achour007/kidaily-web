import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  Typography,
} from '@mui/material';
import { useLanguageContext } from '../contexts/LanguageContext';

interface LanguageSelectorProps {
  disabled?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  label?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  disabled = false,
  fullWidth = true,
  size = 'medium',
  label,
}) => {
  const { language, changeLanguage, supportedLanguages, getLanguageName, getLanguageFlag } = useLanguageContext();

  const handleChange = (event: SelectChangeEvent<string>) => {
    changeLanguage(event.target.value);
  };

  return (
    <FormControl fullWidth={fullWidth} size={size} disabled={disabled}>
      <InputLabel id="language-selector-label">
        {label || 'Langue'}
      </InputLabel>
      <Select
        labelId="language-selector-label"
        id="language-selector"
        value={language}
        label={label || 'Langue'}
        onChange={handleChange}
      >
        {supportedLanguages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body1">{lang.flag}</Typography>
              <Typography variant="body2">{lang.name}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSelector;
