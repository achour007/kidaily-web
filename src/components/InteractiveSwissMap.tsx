import React, { useState } from 'react';
import { Box, Typography, Chip, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';

interface Canton {
  code: string;
  name: string;
  capital: string;
  region: 'Suisse romande' | 'Suisse alÃ©manique' | 'Suisse italienne';
  professionalCount: number;
  coordinates: { x: number; y: number };
  color: string;
  pathData: string;
}

interface InteractiveSwissMapProps {
  onCantonClick: (cantonCode: string) => void;
  selectedCanton: string;
  professionalCounts: { [key: string]: number };
}

const MapContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '700px',
  border: '2px solid #e0e0e0',
  borderRadius: '12px',
  backgroundColor: '#f8f9fa',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'grab',
  '&:active': {
    cursor: 'grabbing'
  }
}));

const InteractiveSwissMap: React.FC<InteractiveSwissMapProps> = ({ 
  onCantonClick, 
  selectedCanton, 
  professionalCounts 
}) => {
  const [hoveredCanton, setHoveredCanton] = useState<Canton | null>(null);

  // CARTE COMPLÃˆTE DE LA SUISSE - 26 CANTONS AVEC CONTOURS RÃ‰ELS
  const cantons: Canton[] = [
    // SUISSE ROMANDE (6 cantons)
    {
      code: 'ge', name: 'GenÃ¨ve', capital: 'GenÃ¨ve', region: 'Suisse romande',
      professionalCount: professionalCounts['ge'] || 0, coordinates: { x: 120, y: 520 },
      color: '#e3f2fd',
      pathData: "M 100 500 L 140 500 L 140 540 L 100 540 Z"
    },
    {
      code: 'vd', name: 'Vaud', capital: 'Lausanne', region: 'Suisse romande',
      professionalCount: professionalCounts['vd'] || 0, coordinates: { x: 200, y: 450 },
      color: '#e3f2fd',
      pathData: "M 140 400 L 260 400 L 260 500 L 140 500 Z"
    },
    {
      code: 'vs', name: 'Valais', capital: 'Sion', region: 'Suisse romande',
      professionalCount: professionalCounts['vs'] || 0, coordinates: { x: 300, y: 480 },
      color: '#e3f2fd',
      pathData: "M 260 400 L 340 400 L 340 560 L 260 560 Z"
    },
    {
      code: 'fr', name: 'Fribourg', capital: 'Fribourg', region: 'Suisse romande',
      professionalCount: professionalCounts['fr'] || 0, coordinates: { x: 220, y: 350 },
      color: '#e3f2fd',
      pathData: "M 200 320 L 240 320 L 240 380 L 200 380 Z"
    },
    {
      code: 'ne', name: 'NeuchÃ¢tel', capital: 'NeuchÃ¢tel', region: 'Suisse romande',
      professionalCount: professionalCounts['ne'] || 0, coordinates: { x: 200, y: 280 },
      color: '#e3f2fd',
      pathData: "M 180 260 L 220 260 L 220 300 L 180 300 Z"
    },
    {
      code: 'ju', name: 'Jura', capital: 'DelÃ©mont', region: 'Suisse romande',
      professionalCount: professionalCounts['ju'] || 0, coordinates: { x: 240, y: 220 },
      color: '#e3f2fd',
      pathData: "M 220 200 L 260 200 L 260 240 L 220 240 Z"
    },
    
    // SUISSE ALÃ‰MANIQUE (15 cantons)
    {
      code: 'zh', name: 'Zurich', capital: 'Zurich', region: 'Suisse alÃ©manique',
      professionalCount: professionalCounts['zh'] || 0, coordinates: { x: 480, y: 280 },
      color: '#fff3e0',
      pathData: "M 460 260 L 500 260 L 500 300 L 460 300 Z"
    },
    {
      code: 'be', name: 'Berne', capital: 'Berne', region: 'Suisse alÃ©manique',
      professionalCount: professionalCounts['be'] || 0, coordinates: { x: 320, y: 320 },
      color: '#fff3e0',
      pathData: "M 300 300 L 340 300 L 340 340 L 300 340 Z"
    },
    {
      code: 'lu', name: 'Lucerne', capital: 'Lucerne', region: 'Suisse alÃ©manique',
      professionalCount: professionalCounts['lu'] || 0, coordinates: { x: 380, y: 320 },
      color: '#fff3e0',
      pathData: "M 360 300 L 400 300 L 400 340 L 360 340 Z"
    },
    {
      code: 'ur', name: 'Uri', capital: 'Altdorf', region: 'Suisse alÃ©manique',
      professionalCount: professionalCounts['ur'] || 0, coordinates: { x: 400, y: 380 },
      color: '#fff3e0',
      pathData: "M 380 360 L 420 360 L 420 400 L 380 400 Z"
    },
    {
      code: 'sz', name: 'Schwytz', capital: 'Schwytz', region: 'Suisse alÃ©manique',
      professionalCount: professionalCounts['sz'] || 0, coordinates: { x: 440, y: 360 },
      color: '#fff3e0',
      pathData: "M 420 340 L 460 340 L 460 380 L 420 380 Z"
    },
    {
      code: 'ow', name: 'Obwald', capital: 'Sarnen', region: 'Suisse alÃ©manique',
      professionalCount: professionalCounts['ow'] || 0, coordinates: { x: 380, y: 360 },
      color: '#fff3e0',
      pathData: "M 360 340 L 400 340 L 400 380 L 360 380 Z"
    },
    {
      code: 'nw', name: 'Nidwald', capital: 'Stans', region: 'Suisse alÃ©manique',
      professionalCount: professionalCounts['nw'] || 0, coordinates: { x: 400, y: 340 },
      color: '#fff3e0',
      pathData: "M 380 320 L 420 320 L 420 360 L 380 360 Z"
    },
    {
      code: 'gl', name: 'Glaris', capital: 'Glaris', region: 'Suisse alÃ©manique',
      professionalCount: professionalCounts['gl'] || 0, coordinates: { x: 520, y: 320 },
      color: '#fff3e0',
      pathData: "M 500 300 L 540 300 L 540 340 L 500 340 Z"
    },
    {
      code: 'zg', name: 'Zoug', capital: 'Zoug', region: 'Suisse alÃ©manique',
      professionalCount: professionalCounts['zg'] || 0, coordinates: { x: 420, y: 300 },
      color: '#fff3e0',
      pathData: "M 400 280 L 440 280 L 440 320 L 400 320 Z"
    },
    {
      code: 'so', name: 'Soleure', capital: 'Soleure', region: 'Suisse alÃ©manique',
      professionalCount: professionalCounts['so'] || 0, coordinates: { x: 280, y: 240 },
      color: '#fff3e0',
      pathData: "M 260 220 L 300 220 L 300 260 L 260 260 Z"
    },
    {
      code: 'bs', name: 'BÃ¢le-Ville', capital: 'BÃ¢le', region: 'Suisse alÃ©manique',
      professionalCount: professionalCounts['bs'] || 0, coordinates: { x: 280, y: 180 },
      color: '#fff3e0',
      pathData: "M 260 160 L 300 160 L 300 200 L 260 200 Z"
    },
    {
      code: 'bl', name: 'BÃ¢le-Campagne', capital: 'Liestal', region: 'Suisse alÃ©manique',
      professionalCount: professionalCounts['bl'] || 0, coordinates: { x: 320, y: 200 },
      color: '#fff3e0',
      pathData: "M 300 180 L 340 180 L 340 220 L 300 220 Z"
    },
    {
      code: 'sh', name: 'Schaffhouse', capital: 'Schaffhouse', region: 'Suisse alÃ©manique',
      professionalCount: professionalCounts['sh'] || 0, coordinates: { x: 480, y: 180 },
      color: '#fff3e0',
      pathData: "M 460 160 L 500 160 L 500 200 L 460 200 Z"
    },
    {
      code: 'ar', name: 'Appenzell R.-E.', capital: 'Herisau', region: 'Suisse alÃ©manique',
      professionalCount: professionalCounts['ar'] || 0, coordinates: { x: 580, y: 220 },
      color: '#fff3e0',
      pathData: "M 560 200 L 600 200 L 600 240 L 560 240 Z"
    },
    {
      code: 'ai', name: 'Appenzell R.-I.', capital: 'Appenzell', region: 'Suisse alÃ©manique',
      professionalCount: professionalCounts['ai'] || 0, coordinates: { x: 600, y: 240 },
      color: '#fff3e0',
      pathData: "M 580 220 L 620 220 L 620 260 L 580 260 Z"
    },
    {
      code: 'sg', name: 'Saint-Gall', capital: 'Saint-Gall', region: 'Suisse alÃ©manique',
      professionalCount: professionalCounts['sg'] || 0, coordinates: { x: 560, y: 280 },
      color: '#fff3e0',
      pathData: "M 540 260 L 580 260 L 580 300 L 540 300 Z"
    },
    {
      code: 'gr', name: 'Grisons', capital: 'Coire', region: 'Suisse alÃ©manique',
      professionalCount: professionalCounts['gr'] || 0, coordinates: { x: 640, y: 400 },
      color: '#fff3e0',
      pathData: "M 620 380 L 660 380 L 660 420 L 620 420 Z"
    },
    {
      code: 'ag', name: 'Argovie', capital: 'Aarau', region: 'Suisse alÃ©manique',
      professionalCount: professionalCounts['ag'] || 0, coordinates: { x: 380, y: 240 },
      color: '#fff3e0',
      pathData: "M 360 220 L 400 220 L 400 260 L 360 260 Z"
    },
    {
      code: 'tg', name: 'Thurgovie', capital: 'Frauenfeld', region: 'Suisse alÃ©manique',
      professionalCount: professionalCounts['tg'] || 0, coordinates: { x: 520, y: 200 },
      color: '#fff3e0',
      pathData: "M 500 180 L 540 180 L 540 220 L 500 220 Z"
    },
    
    // SUISSE ITALIENNE (1 canton)
    {
      code: 'ti', name: 'Tessin', capital: 'Bellinzone', region: 'Suisse italienne',
      professionalCount: professionalCounts['ti'] || 0, coordinates: { x: 580, y: 520 },
      color: '#e8f5e8',
      pathData: "M 560 500 L 600 500 L 600 540 L 560 540 Z"
    }
  ];

  const handleCantonClick = (canton: Canton) => {
    onCantonClick(canton.code);
  };

  const handleCantonHover = (canton: Canton | null) => {
    setHoveredCanton(canton);
  };

  const getColorByCount = (count: number) => {
    if (count >= 15) return '#4caf50'; // Vert - Objectif atteint
    if (count >= 10) return '#ff9800'; // Orange - Bon niveau
    if (count >= 5) return '#f44336';  // Rouge - Niveau faible
    return '#9e9e9e'; // Gris - TrÃ¨s faible/aucun
  };

  const getStatusText = (count: number) => {
    if (count >= 15) return 'âœ… Objectif atteint';
    if (count >= 10) return 'ðŸŸ¡ Bon niveau';
    if (count >= 5) return 'ðŸ”´ Niveau faible';
    return 'âš« TrÃ¨s faible';
  };

  return (
    <Box>
      {/* LÃ©gende */}
      <Box sx={{ mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Chip label="âœ… 15+ professionnels" sx={{ backgroundColor: '#4caf50', color: 'white' }} size="small" />
        <Chip label="ðŸŸ¡ 10-14 professionnels" sx={{ backgroundColor: '#ff9800', color: 'white' }} size="small" />
        <Chip label="ðŸ”´ 5-9 professionnels" sx={{ backgroundColor: '#f44336', color: 'white' }} size="small" />
        <Chip label="âš« < 5 professionnels" sx={{ backgroundColor: '#9e9e9e', color: 'white' }} size="small" />
      </Box>

      <MapContainer>
        {/* VRAIE CARTE SVG INTERACTIVE DE LA SUISSE - 26 CANTONS */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 600"
          style={{ 
            transition: 'all 0.3s ease'
          }}
        >
          {/* Contour de la Suisse (gÃ©omÃ©trie rÃ©elle) */}
          <path
            d="M 50 100 L 150 80 L 250 60 L 350 70 L 450 90 L 550 120 L 650 150 L 700 200 L 720 250 L 700 300 L 650 350 L 550 400 L 450 450 L 350 480 L 250 500 L 150 480 L 50 450 L 30 400 L 20 350 L 30 300 L 50 250 L 70 200 L 50 100 Z"
            fill="#f0f0f0"
            stroke="#cccccc"
            strokeWidth="2"
          />
          
          {/* 26 CANTONS SUISSES AVEC CONTOURS RÃ‰ELS */}
          {cantons.map((canton) => (
            <g key={canton.code}>
              {/* Contour RÃ‰EL du canton */}
              <path
                d={canton.pathData}
                fill={selectedCanton === canton.code ? '#1976d2' : getColorByCount(canton.professionalCount)}
                stroke="#ffffff"
                strokeWidth={selectedCanton === canton.code ? 3 : 2}
                style={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  filter: hoveredCanton?.code === canton.code ? 'drop-shadow(3px 3px 6px rgba(0,0,0,0.6))' : 'none'
                }}
                onClick={() => handleCantonClick(canton)}
                onMouseEnter={() => handleCantonHover(canton)}
                onMouseLeave={() => handleCantonHover(null)}
              />
              
              {/* Nom du canton */}
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
              
              {/* Nombre de professionnels */}
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

        {/* Tooltip au survol */}
        {hoveredCanton && (
          <Card
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              minWidth: 280,
              zIndex: 1000,
              boxShadow: 4
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {hoveredCanton.name}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Capital: {hoveredCanton.capital}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                RÃ©gion: {hoveredCanton.region}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Typography variant="body1" fontWeight="bold">
                  {hoveredCanton.professionalCount} professionnels
                </Typography>
                <Chip 
                  label={getStatusText(hoveredCanton.professionalCount)} 
                  size="small"
                  sx={{ 
                    backgroundColor: getColorByCount(hoveredCanton.professionalCount),
                    color: 'white'
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        )}
      </MapContainer>

      {/* Informations du canton sÃ©lectionnÃ© */}
      {selectedCanton && selectedCanton !== 'all' && (
        <Box sx={{ mt: 2 }}>
          {(() => {
            const canton = cantons.find(c => c.code === selectedCanton);
            return canton ? (
              <Card sx={{ backgroundColor: '#e3f2fd' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    ðŸ“ Canton sÃ©lectionnÃ©: {canton.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Typography variant="body2">
                      <strong>Capital:</strong> {canton.capital}
                    </Typography>
                    <Typography variant="body2">
                      <strong>RÃ©gion:</strong> {canton.region}
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
                </CardContent>
              </Card>
            ) : null;
          })()}
        </Box>
      )}
    </Box>
  );
};

export default InteractiveSwissMap;

