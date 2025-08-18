import React from 'react';
import { Box } from '@mui/material';

const InteractiveSwissMap = () => {
  return (
    <Box sx={{ width: '100%', height: '400px', border: '2px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h3>🗺️ Carte de la Suisse</h3>
        <p>4 cantons principaux</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '20px' }}>
          <div style={{ padding: '10px', backgroundColor: '#4caf50', color: 'white', borderRadius: '5px' }}>GE: 16</div>
          <div style={{ padding: '10px', backgroundColor: '#f44336', color: 'white', borderRadius: '5px' }}>VD: 7</div>
          <div style={{ padding: '10px', backgroundColor: '#f44336', color: 'white', borderRadius: '5px' }}>ZH: 7</div>
          <div style={{ padding: '10px', backgroundColor: '#f44336', color: 'white', borderRadius: '5px' }}>BE: 5</div>
        </div>
      </div>
    </Box>
  );
};

export default InteractiveSwissMap;