import React from 'react';
import { Box } from '@mui/material';

interface Canton {
  code: string;
  name: string;
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
      professionalCount: professionalCounts['ge'] || 0,
      coordinates: { x: 120, y: 520 },
      pathData: 'M 80 480 L 160 480 L 160 560 L 80 560 Z'
    },
    {
      code: 'vd',
      name: 'Vaud',
      professionalCount: professionalCounts['vd'] || 0,
      coordinates: { x: 200, y: 450 },
      pathData: 'M 140 400 L 260 400 L 260 500 L 140 500 Z'
    },
    {
      code: 'zh',
      name: 'Zurich',
      professionalCount: professionalCounts['zh'] || 0,
      coordinates: { x: 480, y: 280 },
      pathData: 'M 460 260 L 500 260 L 500 300 L 460 300 Z'
    },
    {
      code: 'be',
      name: 'Berne',
      professionalCount: professionalCounts['be'] || 0,
      coordinates: { x: 320, y: 320 },
      pathData: 'M 300 300 L 340 300 L 340 340 L 300 340 Z'
    }
  ];

  const getColorByCount = (count: number) => {
    if (count >= 15) return '#4caf50';
    if (count >= 10) return '#ff9800';
    if (count >= 5) return '#f44336';
    return '#9e9e9e';
  };

  return (
    <Box sx={{ width: '100%', height: '500px', border: '2px solid #ccc', position: 'relative' }}>
      <svg width='100%' height='100%' viewBox='0 0 800 600'>
        {cantons.map((canton) => (
          <g key={canton.code}>
            <path
              d={canton.pathData}
              fill={selectedCanton === canton.code ? '#1976d2' : getColorByCount(canton.professionalCount)}
              stroke='#ffffff'
              strokeWidth='2'
              style={{ cursor: 'pointer' }}
              onClick={() => onCantonClick(canton.code)}
            />
            <text
              x={canton.coordinates.x}
              y={canton.coordinates.y}
              textAnchor='middle'
              fontSize='12'
              fill='white'
              fontWeight='bold'
              style={{ pointerEvents: 'none' }}
            >
              {canton.code.toUpperCase()}: {canton.professionalCount}
            </text>
          </g>
        ))}
      </svg>
    </Box>
  );
};

export default InteractiveSwissMap;