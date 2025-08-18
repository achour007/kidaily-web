import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface Professional {
  id: string;
  name: string;
  specialty: string;
  cantonCode: string;
  canton: string;
  city: string;
  institution: string;
  coordinates: { lat: number; lng: number };
  acceptsNewPatients: boolean;
  rating: number;
  reviews: number;
}

interface MapSectionProps {
  professionals: Professional[];
  stats: {
    totalProfessionals: number;
    cantonsCovered: number;
    specialtiesAvailable: number;
    avgPerCanton: number;
  };
  selectedCanton: string;
  setSelectedCanton: (canton: string) => void;
  professionalCountsByCanton: { [key: string]: number };
}

const MapContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '600px',
  border: '2px solid #e0e0e0',
  borderRadius: '12px',
  backgroundColor: '#f8f9fa',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'grab',
}));

const CantonPath = styled('path')(({ theme }) => ({
  fill: '#e3f2fd',
  stroke: '#1976d2',
  strokeWidth: 2,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    fill: '#bbdefb',
    stroke: '#1565c0',
    strokeWidth: 3,
  }
}));

const CantonLabel = styled('text')(({ theme }) => ({
  fontSize: '12px',
  fontWeight: 'bold',
  fill: '#1976d2',
  pointerEvents: 'none',
  textAnchor: 'middle',
  dominantBaseline: 'middle'
}));

const MapSection: React.FC<MapSectionProps> = ({
  professionals,
  stats,
  selectedCanton,
  setSelectedCanton,
  professionalCountsByCanton
}) => {
  const [hoveredCanton, setHoveredCanton] = useState<string | null>(null);

  const cantons = [
    { code: 'ge', name: 'Genève', path: 'M 50 150 L 80 150 L 80 180 L 50 180 Z', x: 65, y: 165 },
    { code: 'vd', name: 'Vaud', path: 'M 30 120 L 80 120 L 80 150 L 30 150 Z', x: 55, y: 135 },
    { code: 'zh', name: 'Zurich', path: 'M 120 80 L 160 80 L 160 120 L 120 120 Z', x: 140, y: 100 },
    { code: 'be', name: 'Berne', path: 'M 80 80 L 120 80 L 120 120 L 80 120 Z', x: 100, y: 100 },
    { code: 'fr', name: 'Fribourg', path: 'M 60 100 L 90 100 L 90 130 L 60 130 Z', x: 75, y: 115 },
    { code: 'ag', name: 'Argovie', path: 'M 100 60 L 140 60 L 140 100 L 100 100 Z', x: 120, y: 80 },
    { code: 'bl', name: 'Bâle-Campagne', path: 'M 140 40 L 180 40 L 180 80 L 140 80 Z', x: 160, y: 60 },
    { code: 'bs', name: 'Bâle-Ville', path: 'M 180 40 L 200 40 L 200 80 L 180 80 Z', x: 190, y: 60 },
    { code: 'gr', name: 'Grisons', path: 'M 180 120 L 220 120 L 220 180 L 180 180 Z', x: 200, y: 150 },
    { code: 'ju', name: 'Jura', path: 'M 80 40 L 120 40 L 120 80 L 80 80 Z', x: 100, y: 60 },
    { code: 'lu', name: 'Lucerne', path: 'M 100 100 L 130 100 L 130 130 L 100 130 Z', x: 115, y: 115 },
    { code: 'ne', name: 'Neuchâtel', path: 'M 70 80 L 100 80 L 100 110 L 70 110 Z', x: 85, y: 95 },
    { code: 'sg', name: 'Saint-Gall', path: 'M 160 100 L 190 100 L 190 140 L 160 140 Z', x: 175, y: 120 },
    { code: 'sh', name: 'Schaffhouse', path: 'M 140 80 L 170 80 L 170 120 L 140 120 Z', x: 155, y: 100 },
    { code: 'so', name: 'Soleure', path: 'M 90 60 L 120 60 L 120 90 L 90 90 Z', x: 105, y: 75 },
    { code: 'ti', name: 'Tessin', path: 'M 160 160 L 200 160 L 200 200 L 160 200 Z', x: 180, y: 180 },
    { code: 'tg', name: 'Thurgovie', path: 'M 140 120 L 170 120 L 170 150 L 140 150 Z', x: 155, y: 135 },
    { code: 'vs', name: 'Valais', path: 'M 40 160 L 80 160 L 80 200 L 40 200 Z', x: 60, y: 180 },
    { code: 'zg', name: 'Zoug', path: 'M 110 120 L 130 120 L 130 140 L 110 140 Z', x: 120, y: 130 },
    { code: 'ar', name: 'Appenzell Rhodes-Extérieures', path: 'M 170 120 L 190 120 L 190 140 L 170 140 Z', x: 180, y: 130 },
    { code: 'ai', name: 'Appenzell Rhodes-Intérieures', path: 'M 180 120 L 200 120 L 200 140 L 180 140 Z', x: 190, y: 130 },
    { code: 'gl', name: 'Glaris', path: 'M 130 100 L 150 100 L 150 120 L 130 120 Z', x: 140, y: 110 },
    { code: 'nw', name: 'Nidwald', path: 'M 110 100 L 125 100 L 125 115 L 110 115 Z', x: 117.5, y: 107.5 },
    { code: 'ow', name: 'Obwald', path: 'M 100 100 L 115 100 L 115 115 L 100 115 Z', x: 107.5, y: 107.5 },
    { code: 'sz', name: 'Schwytz', path: 'M 110 115 L 125 115 L 125 130 L 110 130 Z', x: 117.5, y: 122.5 },
    { code: 'ur', name: 'Uri', path: 'M 110 130 L 125 130 L 125 145 L 110 145 Z', x: 117.5, y: 137.5 }
  ];

  const handleCantonClick = (cantonCode: string) => {
    setSelectedCanton(cantonCode === selectedCanton ? 'all' : cantonCode);
  };

  const getCantonColor = (cantonCode: string) => {
    if (selectedCanton === cantonCode) return '#4caf50';
    if (hoveredCanton === cantonCode) return '#2196f3';
    const count = professionalCountsByCanton[cantonCode] || 0;
    if (count >= 15) return '#4caf50';
    if (count >= 10) return '#ff9800';
    if (count >= 5) return '#f44336';
    return '#e0e0e0';
  };

  const getCantonStrokeColor = (cantonCode: string) => {
    if (selectedCanton === cantonCode) return '#2e7d32';
    if (hoveredCanton === cantonCode) return '#1976d2';
    return '#1976d2';
  };

  return (
    <Box>
      <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid #e0e0e0' }}>
        <Typography variant="h6" gutterBottom>
          ��️ Carte Interactive des Cantons Suisses
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', mb: 2 }}>
          <Chip 
            label={`${stats.totalProfessionals} professionnels`} 
            color="primary" 
            variant="outlined" 
          />
          <Chip 
            label={`${stats.cantonsCovered} cantons`} 
            color="secondary" 
            variant="outlined" 
          />
          <Chip 
            label={`${stats.avgPerCanton}+ par canton`} 
            color="success" 
            variant="outlined" 
          />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Légende:
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 16, height: 16, bgcolor: '#4caf50', borderRadius: '2px' }} />
            <Typography variant="caption">15+ professionnels</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 16, height: 16, bgcolor: '#ff9800', borderRadius: '2px' }} />
            <Typography variant="caption">10-14 professionnels</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 16, height: 16, bgcolor: '#f44336', borderRadius: '2px' }} />
            <Typography variant="caption">5-9 professionnels</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 16, height: 16, bgcolor: '#e0e0e0', borderRadius: '2px' }} />
            <Typography variant="caption">0-4 professionnels</Typography>
          </Box>
        </Box>
      </Box>

      <MapContainer>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 250 220"
          style={{ 
            cursor: 'grab'
          }}
        >
          {cantons.map((canton) => (
            <g key={canton.code}>
              <CantonPath
                d={canton.path}
                fill={getCantonColor(canton.code)}
                stroke={getCantonStrokeColor(canton.code)}
                strokeWidth={selectedCanton === canton.code ? 3 : 2}
                onClick={() => handleCantonClick(canton.code)}
                onMouseEnter={() => setHoveredCanton(canton.code)}
                onMouseLeave={() => setHoveredCanton(null)}
              />
              <CantonLabel
                x={canton.x}
                y={canton.y}
                fontSize={canton.name.length > 8 ? '8' : '10'}
              >
                {canton.code.toUpperCase()}
              </CantonLabel>
            </g>
          ))}
        </svg>
      </MapContainer>

      {selectedCanton !== 'all' && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid #e0e0e0' }}>
          <Typography variant="h6" gutterBottom>
            �� Canton sélectionné: {cantons.find(c => c.code === selectedCanton)?.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              label={`${professionalCountsByCanton[selectedCanton] || 0} professionnels`} 
              color="primary" 
            />
            <Chip 
              label={`${professionals.filter(p => p.cantonCode === selectedCanton).length} résultats filtrés`} 
              color="secondary" 
            />
          </Box>
        </Box>
      )}

      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          💡 <strong>Comment utiliser la carte :</strong> Cliquez sur un canton pour le sélectionner et filtrer les professionnels. 
          Cliquez à nouveau pour désélectionner. Les couleurs indiquent le nombre de professionnels disponibles.
        </Typography>
      </Alert>
    </Box>
  );
};

export default MapSection;