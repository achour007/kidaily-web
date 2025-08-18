import React, { useState } from 'react';
import { Box, Tooltip, Typography, Chip, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';

interface Canton {
  code: string;
  name: string;
  capital: string;
  region: 'Suisse romande' | 'Suisse alémanique' | 'Suisse italienne';
  professionalCount: number;
  coordinates: { x: number; y: number };
  color: string;
}

interface InteractiveSwissMapProps {
  onCantonClick: (cantonCode: string) => void;
  selectedCanton: string;
  professionalCounts: { [key: string]: number };
}

const MapContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '500px',
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

const CantonPath = styled('path')<{ isSelected: boolean; professionalCount: number }>(({ theme, isSelected, professionalCount }) => ({
  fill: isSelected ? '#1976d2' : 
        professionalCount >= 15 ? '#4caf50' : 
        professionalCount >= 10 ? '#ff9800' : 
        professionalCount >= 5 ? '#f44336' : '#9e9e9e',
  stroke: '#ffffff',
  strokeWidth: isSelected ? 3 : 1.5,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    fill: isSelected ? '#1565c0' : 
          professionalCount >= 15 ? '#388e3c' : 
          professionalCount >= 10 ? '#f57c00' : 
          professionalCount >= 5 ? '#d32f2f' : '#757575',
    strokeWidth: 2.5,
    filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
  }
}));

const MapMarker = styled('circle')<{ isSelected: boolean }>(({ theme, isSelected }) => ({
  fill: isSelected ? '#d32f2f' : '#1976d2',
  stroke: '#ffffff',
  strokeWidth: 2,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    r: '8',
    fill: '#ff5722'
  }
}));

const InteractiveSwissMap: React.FC<InteractiveSwissMapProps> = ({ 
  onCantonClick, 
  selectedCanton, 
  professionalCounts 
}) => {
  const [hoveredCanton, setHoveredCanton] = useState<Canton | null>(null);
  const [mapScale, setMapScale] = useState(1);
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 });

  // Données géographiques simplifiées des cantons suisses
  const cantons: Canton[] = [
    // Suisse romande
    { code: 'ge', name: 'Genève', capital: 'Genève', region: 'Suisse romande', professionalCount: professionalCounts['ge'] || 0, coordinates: { x: 120, y: 380 }, color: '#e3f2fd' },
    { code: 'vd', name: 'Vaud', capital: 'Lausanne', region: 'Suisse romande', professionalCount: professionalCounts['vd'] || 0, coordinates: { x: 180, y: 320 }, color: '#e3f2fd' },
    { code: 'vs', name: 'Valais', capital: 'Sion', region: 'Suisse romande', professionalCount: professionalCounts['vs'] || 0, coordinates: { x: 280, y: 360 }, color: '#e3f2fd' },
    { code: 'fr', name: 'Fribourg', capital: 'Fribourg', region: 'Suisse romande', professionalCount: professionalCounts['fr'] || 0, coordinates: { x: 220, y: 280 }, color: '#e3f2fd' },
    { code: 'ne', name: 'Neuchâtel', capital: 'Neuchâtel', region: 'Suisse romande', professionalCount: professionalCounts['ne'] || 0, coordinates: { x: 200, y: 240 }, color: '#e3f2fd' },
    { code: 'ju', name: 'Jura', capital: 'Delémont', region: 'Suisse romande', professionalCount: professionalCounts['ju'] || 0, coordinates: { x: 240, y: 200 }, color: '#e3f2fd' },
    
    // Suisse alémanique
    { code: 'zh', name: 'Zurich', capital: 'Zurich', region: 'Suisse alémanique', professionalCount: professionalCounts['zh'] || 0, coordinates: { x: 380, y: 220 }, color: '#fff3e0' },
    { code: 'be', name: 'Berne', capital: 'Berne', region: 'Suisse alémanique', professionalCount: professionalCounts['be'] || 0, coordinates: { x: 280, y: 260 }, color: '#fff3e0' },
    { code: 'lu', name: 'Lucerne', capital: 'Lucerne', region: 'Suisse alémanique', professionalCount: professionalCounts['lu'] || 0, coordinates: { x: 360, y: 280 }, color: '#fff3e0' },
    { code: 'ur', name: 'Uri', capital: 'Altdorf', region: 'Suisse alémanique', professionalCount: professionalCounts['ur'] || 0, coordinates: { x: 380, y: 320 }, color: '#fff3e0' },
    { code: 'sz', name: 'Schwytz', capital: 'Schwytz', region: 'Suisse alémanique', professionalCount: professionalCounts['sz'] || 0, coordinates: { x: 400, y: 300 }, color: '#fff3e0' },
    { code: 'ow', name: 'Obwald', capital: 'Sarnen', region: 'Suisse alémanique', professionalCount: professionalCounts['ow'] || 0, coordinates: { x: 360, y: 300 }, color: '#fff3e0' },
    { code: 'nw', name: 'Nidwald', capital: 'Stans', region: 'Suisse alémanique', professionalCount: professionalCounts['nw'] || 0, coordinates: { x: 380, y: 310 }, color: '#fff3e0' },
    { code: 'gl', name: 'Glaris', capital: 'Glaris', region: 'Suisse alémanique', professionalCount: professionalCounts['gl'] || 0, coordinates: { x: 420, y: 280 }, color: '#fff3e0' },
    { code: 'zg', name: 'Zoug', capital: 'Zoug', region: 'Suisse alémanique', professionalCount: professionalCounts['zg'] || 0, coordinates: { x: 380, y: 260 }, color: '#fff3e0' },
    { code: 'so', name: 'Soleure', capital: 'Soleure', region: 'Suisse alémanique', professionalCount: professionalCounts['so'] || 0, coordinates: { x: 280, y: 220 }, color: '#fff3e0' },
    { code: 'bs', name: 'Bâle-Ville', capital: 'Bâle', region: 'Suisse alémanique', professionalCount: professionalCounts['bs'] || 0, coordinates: { x: 280, y: 180 }, color: '#fff3e0' },
    { code: 'bl', name: 'Bâle-Campagne', capital: 'Liestal', region: 'Suisse alémanique', professionalCount: professionalCounts['bl'] || 0, coordinates: { x: 300, y: 200 }, color: '#fff3e0' },
    { code: 'sh', name: 'Schaffhouse', capital: 'Schaffhouse', region: 'Suisse alémanique', professionalCount: professionalCounts['sh'] || 0, coordinates: { x: 380, y: 160 }, color: '#fff3e0' },
    { code: 'ar', name: 'Appenzell R.-E.', capital: 'Herisau', region: 'Suisse alémanique', professionalCount: professionalCounts['ar'] || 0, coordinates: { x: 460, y: 220 }, color: '#fff3e0' },
    { code: 'ai', name: 'Appenzell R.-I.', capital: 'Appenzell', region: 'Suisse alémanique', professionalCount: professionalCounts['ai'] || 0, coordinates: { x: 470, y: 230 }, color: '#fff3e0' },
    { code: 'sg', name: 'Saint-Gall', capital: 'Saint-Gall', region: 'Suisse alémanique', professionalCount: professionalCounts['sg'] || 0, coordinates: { x: 450, y: 240 }, color: '#fff3e0' },
    { code: 'gr', name: 'Grisons', capital: 'Coire', region: 'Suisse alémanique', professionalCount: professionalCounts['gr'] || 0, coordinates: { x: 480, y: 320 }, color: '#fff3e0' },
    { code: 'ag', name: 'Argovie', capital: 'Aarau', region: 'Suisse alémanique', professionalCount: professionalCounts['ag'] || 0, coordinates: { x: 340, y: 220 }, color: '#fff3e0' },
    { code: 'tg', name: 'Thurgovie', capital: 'Frauenfeld', region: 'Suisse alémanique', professionalCount: professionalCounts['tg'] || 0, coordinates: { x: 420, y: 200 }, color: '#fff3e0' },
    
    // Suisse italienne
    { code: 'ti', name: 'Tessin', capital: 'Bellinzone', region: 'Suisse italienne', professionalCount: professionalCounts['ti'] || 0, coordinates: { x: 420, y: 380 }, color: '#e8f5e8' },
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
    return '#9e9e9e'; // Gris - Très faible/aucun
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
        <Chip label="🔴 5-9 professionnels" sx={{ backgroundColor: '#f44336', color: 'white' }} size="small" />
        <Chip label="⚫ < 5 professionnels" sx={{ backgroundColor: '#9e9e9e', color: 'white' }} size="small" />
      </Box>

      <MapContainer>
        {/* Carte SVG interactive */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 600 450"
          style={{ 
            transform: `scale(${mapScale}) translate(${mapPosition.x}px, ${mapPosition.y}px)`,
            transition: 'transform 0.3s ease'
          }}
        >
          {/* Contour de la Suisse (simplifié) */}
          <path
            d="M100,200 L150,180 L200,160 L250,140 L300,150 L350,160 L400,150 L450,160 L500,180 L520,220 L510,260 L490,300 L470,340 L450,380 L400,400 L350,390 L300,400 L250,390 L200,380 L150,360 L120,320 L100,280 Z"
            fill="#f0f0f0"
            stroke="#cccccc"
            strokeWidth="2"
          />
          
          {/* Cantons cliquables */}
          {cantons.map((canton) => (
            <g key={canton.code}>
              {/* Zone canton (cercle simplifié pour la démo) */}
              <circle
                cx={canton.coordinates.x}
                cy={canton.coordinates.y}
                r="25"
                fill={selectedCanton === canton.code ? '#1976d2' : getColorByCount(canton.professionalCount)}
                stroke="#ffffff"
                strokeWidth={selectedCanton === canton.code ? 3 : 1.5}
                style={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  filter: hoveredCanton?.code === canton.code ? 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))' : 'none'
                }}
                onClick={() => handleCantonClick(canton)}
                onMouseEnter={() => handleCantonHover(canton)}
                onMouseLeave={() => handleCantonHover(null)}
              />
              
              {/* Nom du canton */}
              <text
                x={canton.coordinates.x}
                y={canton.coordinates.y + 5}
                textAnchor="middle"
                fontSize="10"
                fill="white"
                fontWeight="bold"
                style={{ pointerEvents: 'none', textShadow: '1px 1px 1px rgba(0,0,0,0.8)' }}
              >
                {canton.code.toUpperCase()}
              </text>
              
              {/* Nombre de professionnels */}
              <text
                x={canton.coordinates.x}
                y={canton.coordinates.y - 15}
                textAnchor="middle"
                fontSize="8"
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
              minWidth: 250,
              zIndex: 1000,
              boxShadow: 3
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
                Région: {hoveredCanton.region}
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

      {/* Informations du canton sélectionné */}
      {selectedCanton && selectedCanton !== 'all' && (
        <Box sx={{ mt: 2 }}>
          {(() => {
            const canton = cantons.find(c => c.code === selectedCanton);
            return canton ? (
              <Card sx={{ backgroundColor: '#e3f2fd' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    📍 Canton sélectionné: {canton.name}
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
