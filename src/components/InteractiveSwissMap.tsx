import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

interface Canton {
  code: string;
  name: string;
  capital: string;
  region: string;
  professionalCount: number;
  coordinates: { x: number; y: number };
  pathData: string;
}

interface InteractiveSwissMapProps {
  onCantonClick: (cantonCode: string) => void;
  selectedCanton: string;
  professionalCounts: { [key: string]: number };
}

const InteractiveSwissMap: React.FC<InteractiveSwissMapProps> = ({ 
  onCantonClick, 
  selectedCanton, 
  professionalCounts 
}) => {
  const cantons: Canton[] = [
    {
      code: 'ge',
      name: 'Genève',
      capital: 'Genève',
      region: 'Suisse romande',
      professionalCount: professionalCounts['ge'] || 0,
      coordinates: { x: 120, y: 520 },
      pathData: 'M 80 480 L 160 480 L 160 560 L 80 560 Z'
    },
    {
      code: 'vd',
      name: 'Vaud',
      capital: 'Lausanne',
      region: 'Suisse romande',
      professionalCount: professionalCounts['vd'] || 0,
      coordinates: { x: 200, y: 450 },
      pathData: 'M 140 400 L 260 400 L 260 500 L 140 500 Z'
    },
    {
      code: 'zh',
      name: 'Zurich',
      capital: 'Zurich',
      region: 'Suisse alémanique',
      professionalCount: professionalCounts['zh'] || 0,
      coordinates: { x: 480, y: 280 },
      pathData: 'M 460 260 L 500 260 L 500 300 L 460 300 Z'
    },
    {
      code: 'be',
      name: 'Berne',
      capital: 'Berne',
      region: 'Suisse alémanique',
      professionalCount: professionalCounts['be'] || 0,
      coordinates: { x: 320, y: 320 },
      pathData: 'M 300 300 L 340 300 L 340 340 L 300 340 Z'
    },
    {
      code: 'fr',
      name: 'Fribourg',
      capital: 'Fribourg',
      region: 'Suisse romande',
      professionalCount: professionalCounts['fr'] || 0,
      coordinates: { x: 220, y: 350 },
      pathData: 'M 200 320 L 240 320 L 240 380 L 200 380 Z'
    },
    {
      code: 'ne',
      name: 'Neuchâtel',
      capital: 'Neuchâtel',
      region: 'Suisse romande',
      professionalCount: professionalCounts['ne'] || 0,
      coordinates: { x: 200, y: 280 },
      pathData: 'M 180 260 L 220 260 L 220 300 L 180 300 Z'
    }
  ];

  const getColorByCount = (count: number) => {
    if (count >= 15) return '#4caf50';
    if (count >= 10) return '#ff9800';
    if (count >= 5) return '#f44336';
    return '#9e9e9e';
  };

  const getStatusText = (count: number) => {
    if (count >= 15) return '✅ Objectif atteint';
    if (count >= 10) return '🟡 Bon niveau';
    if (count >= 5) return '🔴 Niveau faible';
    return '⚫ Très faible';
  };

  return (
    <Box>
      {/* Légende */}
      <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Chip label="✅ 15+ professionnels" sx={{ backgroundColor: '#4caf50', color: 'white' }} size="small" />
        <Chip label="🟡 10-14 professionnels" sx={{ backgroundColor: '#ff9800', color: 'white' }} size="small" />
        <Chip label="�� 5-9 professionnels" sx={{ backgroundColor: '#f44336', color: 'white' }} size="small" />
        <Chip label="⚫ < 5 professionnels" sx={{ backgroundColor: '#9e9e9e', color: 'white' }} size="small" />
      </Box>

      {/* Carte SVG */}
      <Box sx={{ width: '100%', height: '500px', border: '2px solid #ccc', borderRadius: '8px', position: 'relative' }}>
        <svg width="100%" height="100%" viewBox="0 0 800 600">
          {/* Contour de la Suisse */}
          <path
            d="M 50 100 L 150 80 L 250 60 L 350 70 L 450 90 L 550 120 L 650 150 L 700 200 L 720 250 L 700 300 L 650 350 L 550 400 L 450 450 L 350 480 L 250 500 L 150 480 L 50 450 L 30 400 L 20 350 L 30 300 L 50 250 L 70 200 L 50 100 Z"
            fill="#f0f0f0"
            stroke="#cccccc"
            strokeWidth="2"
          />
          
          {/* Cantons */}
          {cantons.map((canton) => (
            <g key={canton.code}>
              <path
                d={canton.pathData}
                fill={selectedCanton === canton.code ? '#1976d2' : getColorByCount(canton.professionalCount)}
                stroke="#ffffff"
                strokeWidth="2"
                style={{ cursor: 'pointer' }}
                onClick={() => onCantonClick(canton.code)}
              />
              <text
                x={canton.coordinates.x}
                y={canton.coordinates.y + 8}
                textAnchor="middle"
                fontSize="11"
                fill="white"
                fontWeight="bold"
                style={{ pointerEvents: 'none', textShadow: '2px 2px 2px rgba(0,0,0,0.9)' }}
              >
                {canton.code.toUpperCase()}
              </text>
              <text
                x={canton.coordinates.x}
                y={canton.coordinates.y - 12}
                textAnchor="middle"
                fontSize="9"
                fill="#333"
                fontWeight="bold"
                style={{ pointerEvents: 'none' }}
              >
                {canton.professionalCount}
              </text>
            </g>
          ))}
        </svg>
      </Box>

      {/* Informations du canton sélectionné */}
      {selectedCanton && selectedCanton !== 'all' && (
        <Box sx={{ mt: 2 }}>
          {(() => {
            const canton = cantons.find(c => c.code === selectedCanton);
            return canton ? (
              <Box sx={{ backgroundColor: '#e3f2fd', p: 2, borderRadius: '8px' }}>
                <Typography variant="h6" gutterBottom>
                  🗺️ Canton sélectionné: {canton.name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Typography variant="body2">
                    <strong>Capital:</strong> {canton.capital}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Région:</strong> {canton.region}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Professionnels:</strong> {canton.professionalCount}
                  </Typography>
                  <Chip 
                    label={getStatusText(canton.professionalCount)} 
                    size="small"
                    sx={{ 
                      backgroundColor: getColorByCount(canton.professionalCount),
                      color: 'white'
                    }}
                  />
                </Box>
              </Box>
            ) : null;
          })()}
        </Box>
      )}
    </Box>
  );
};

export default InteractiveSwissMap;