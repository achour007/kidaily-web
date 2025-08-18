import React from 'react';
import { Box, Card, CardContent, Typography, Alert } from '@mui/material';
import InteractiveSwissMap from './InteractiveSwissMap';

interface MapSectionProps {
  professionals: any[];
  stats: any;
  selectedCanton: string;
  setSelectedCanton: (canton: string) => void;
  professionalCountsByCanton: { [key: string]: number };
}

const MapSection: React.FC<MapSectionProps> = ({
  professionals,
  stats,
  selectedCanton,
  setSelectedCanton,
  professionalCountsByCanton
}) => {
  return (
    <>
      {/* Vraie carte interactive de la Suisse */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 2 
          }}>
            <Typography variant="h6" color="primary">
              🗺️ Carte Interactive Complète de la Suisse
            </Typography>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {professionals.length} / {stats.total} professionnels trouvés
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tous les 26 cantons • Vraie carte interactive
              </Typography>
            </Box>
          </Box>

          {/* Nouvelle carte interactive complète */}
          <InteractiveSwissMap
            onCantonClick={(cantonCode) => setSelectedCanton(cantonCode)}
            selectedCanton={selectedCanton}
            professionalCounts={professionalCountsByCanton}
          />

          {/* Instructions pour la nouvelle carte interactive */}
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>🗺️ Nouvelle Carte Interactive :</strong> Cliquez sur n'importe quel canton pour filtrer les professionnels. 
              Survolez les cantons pour voir les détails. Les couleurs indiquent le niveau de couverture (vert = 15+, orange = 10-14, rouge = 5-9, gris = &lt;5).
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    </>
  );
};

export default MapSection;
