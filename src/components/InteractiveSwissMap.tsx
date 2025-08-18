import React, { useState } from 'react';
import { Box, Typography, Chip, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';

interface Canton {
  code: string;
  name: string;
  capital: string;
  region: 'Suisse romande' | 'Suisse alémanique' | 'Suisse italienne';
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
  cursor: 'grab'
}));

const InteractiveSwissMap: React.FC<InteractiveSwissMapProps> = ({
  onCantonClick,
  selectedCanton,
  professionalCounts
}) => {
  const [hoveredCanton, setHoveredCanton] = useState<Canton | null>(null);

  const cantons: Canton[] = [
    {
      code: 'ge', name: 'Genève', capital: 'Genève', region: 'Suisse romande',
      professionalCount: professionalCounts['ge'] || 0, coordinates: { x: 120, y: 520 },
      color: '#e3f2fd',
      pathData: 'M 80 480 L 160 480 L 160 560 L 80 560 Z'
    },
    {
      code: 'vd', name: 'Vaud', capital: 'Lausanne', region: 'Suisse romande',
      professionalCount: professionalCounts['vd'] || 0, coordinates: { x: 200, y: 450 },
      color: '#e3f2fd',
      pathData: 'M 140 400 L 260 400 L 260 500 L 140 500 Z'
    },
    {
      code: 'zh', name: 'Zurich', capital: 'Zurich', region: 'Suisse alémanique',
      professionalCount: professionalCounts['zh'] || 0, coordinates: { x: 480, y: 280 },
      color: '#fff3e0',
      pathData: 'M 460 260 L 500 260 L 500 300 L 460 300 Z'
    },
    {
      code: 'be', name: 'Berne', capital: 'Berne', region: 'Suisse alémanique',
      professionalCount: professionalCounts['be'] || 0, coordinates: { x: 320, y: 320 },
      color: '#fff3e0',
      pathData: 'M 300 300 L 340 300 L 340 340 L 300 340 Z'
    }
  ];

  const handleCantonClick = (canton: Canton) => {
    onCantonClick(canton.code);
  };

  const handleCantonHover = (canton: Canton | null) => {
    setHoveredCanton(canton);
  };

  const getColorByCount = (count: number) => {
    if (count >= 15) return '#4caf50';
    if (count >= 10) return '#ff9800';
    if (count >= 5) return '#f44336';
    return '#9e9e9e';
  };

  return (
    <Box>
      <MapContainer>
        <svg width='100%' height='100%' viewBox='0 0 800 600'>
          {cantons.map((canton) => (
            <g key={canton.code}>
              <path
                d={canton.pathData}
                fill={getColorByCount(canton.professionalCount)}
                stroke='#ffffff'
                strokeWidth='2'
                style={{ cursor: 'pointer' }}
                onClick={() => handleCantonClick(canton)}
                onMouseEnter={() => handleCantonHover(canton)}
                onMouseLeave={() => handleCantonHover(null)}
              />
              <text
                x={canton.coordinates.x}
                y={canton.coordinates.y}
                textAnchor='middle'
                fontSize='12'
                fill='white'
                fontWeight='bold'
              >
                {canton.code.toUpperCase()}: {canton.professionalCount}
              </text>
            </g>
          ))}
        </svg>
      </MapContainer>
    </Box>
  );
};

export default InteractiveSwissMap;
