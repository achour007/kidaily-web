import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useSetupRedirect } from '../hooks/useSetupRedirect';

export const ConditionalRedirect: React.FC = () => {
  const { isRedirecting } = useSetupRedirect();
  
  if (isRedirecting) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={60} />
        <Box component="p" color="text.secondary">
          Redirection vers la configuration...
        </Box>
      </Box>
    );
  }
  
  return null;
};
