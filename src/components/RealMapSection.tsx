import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import { Icon, LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Box,
  Typography,
  Chip,
  Alert,
  Paper,
} from '@mui/material';

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

interface RealMapSectionProps {
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

// Type pour les coordonnées des cantons
type CantonCode = 'ge' | 'vd' | 'zh' | 'be' | 'fr' | 'ag' | 'bl' | 'bs' | 'gr' | 'ju' | 'lu' | 'ne' | 'sg' | 'sh' | 'so' | 'ti' | 'tg' | 'vs' | 'zg' | 'ar' | 'ai' | 'gl' | 'nw' | 'ow' | 'sz' | 'ur';

// Coordonnées réelles des cantons suisses
const cantonCoordinates: Record<CantonCode, { lat: number; lng: number; name: string }> = {
  'ge': { lat: 46.2044, lng: 6.1432, name: 'Genève' },
  'vd': { lat: 46.5197, lng: 6.6323, name: 'Vaud' },
  'zh': { lat: 47.3769, lng: 8.5417, name: 'Zurich' },
  'be': { lat: 46.9479, lng: 7.4474, name: 'Berne' },
  'fr': { lat: 46.8065, lng: 7.1619, name: 'Fribourg' },
  'ag': { lat: 47.3904, lng: 8.0454, name: 'Argovie' },
  'bl': { lat: 47.4419, lng: 7.7644, name: 'Bâle-Campagne' },
  'bs': { lat: 47.5596, lng: 7.5886, name: 'Bâle-Ville' },
  'gr': { lat: 46.6569, lng: 9.5784, name: 'Grisons' },
  'ju': { lat: 47.3444, lng: 7.3501, name: 'Jura' },
  'lu': { lat: 47.0502, lng: 8.3093, name: 'Lucerne' },
  'ne': { lat: 46.9929, lng: 6.9319, name: 'Neuchâtel' },
  'sg': { lat: 47.4245, lng: 9.3767, name: 'Saint-Gall' },
  'sh': { lat: 47.6969, lng: 8.6370, name: 'Schaffhouse' },
  'so': { lat: 47.2074, lng: 7.5312, name: 'Soleure' },
  'ti': { lat: 46.1707, lng: 8.7957, name: 'Tessin' },
  'tg': { lat: 47.6038, lng: 9.0554, name: 'Thurgovie' },
  'vs': { lat: 46.1553, lng: 7.5988, name: 'Valais' },
  'zg': { lat: 47.1662, lng: 8.5155, name: 'Zoug' },
  'ar': { lat: 47.3663, lng: 9.3004, name: 'Appenzell Rhodes-Extérieures' },
  'ai': { lat: 47.3102, lng: 9.4090, name: 'Appenzell Rhodes-Intérieures' },
  'gl': { lat: 46.9812, lng: 9.0658, name: 'Glaris' },
  'nw': { lat: 46.9267, lng: 8.3849, name: 'Nidwald' },
  'ow': { lat: 46.8779, lng: 8.2513, name: 'Obwald' },
  'sz': { lat: 47.0207, lng: 8.6514, name: 'Schwytz' },
  'ur': { lat: 46.7739, lng: 8.5964, name: 'Uri' }
};

const RealMapSection: React.FC<RealMapSectionProps> = ({
  professionals,
  stats,
  selectedCanton,
  setSelectedCanton,
  professionalCountsByCanton
}) => {
  const [mapCenter] = useState<LatLngTuple>([46.8182, 8.2275]); // Centre de la Suisse
  const [mapZoom] = useState(8);

  // Icône personnalisée pour les marqueurs
  const customIcon = new Icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyQzIgMTcuNTIgNi40OCAyMiAxMiAyMkMxNy41MiAyMiAyMiAxNy41MiAyMiAxMkMyMiA2LjQ4IDE3LjUyIDIgMTIgMloiIGZpbGw9IiNFMzM0MzYiLz4KPHBhdGggZD0iTTEyIDZDNi40OCA2IDIgMTAuNDggMiAxNkMyIDE5LjUyIDQuNDggMjIgOCAyMkMxMiAyMiAxNiAxOS41MiAxNiAxNkMxNiAxMC40OCAxMS41MiA2IDcgNloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const getCantonColor = (cantonCode: string) => {
    const count = professionalCountsByCanton[cantonCode] || 0;
    if (count >= 15) return '#4caf50';
    if (count >= 10) return '#ff9800';
    if (count >= 5) return '#f44336';
    return '#e0e0e0';
  };

  // Fonction helper pour obtenir le nom du canton
  const getCantonName = (cantonCode: string): string => {
    return cantonCoordinates[cantonCode as CantonCode]?.name || cantonCode;
  };

  return (
    <Box>
      {/* Statistiques de la carte */}
      <Paper elevation={2} sx={{ mb: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          ��️ Carte Interactive Réelle de la Suisse
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

        {/* Légende des couleurs */}
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
      </Paper>

      {/* Vraie carte interactive */}
      <Paper elevation={3} sx={{ height: '600px', overflow: 'hidden' }}>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          {/* Couche de carte OpenStreetMap */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Contrôles de zoom */}
          <ZoomControl position="topright" />

          {/* Marqueurs des cantons */}
          {Object.entries(cantonCoordinates).map(([cantonCode, coords]) => (
            <Marker
              key={cantonCode}
              position={[coords.lat, coords.lng] as LatLngTuple}
              icon={customIcon}
              eventHandlers={{
                click: () => setSelectedCanton(cantonCode === selectedCanton ? 'all' : cantonCode),
              }}
            >
              <Popup>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {coords.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {professionalCountsByCanton[cantonCode] || 0} professionnels
                  </Typography>
                  <Chip
                    label={getCantonColor(cantonCode) === '#4caf50' ? '15+ prof.' :
                           getCantonColor(cantonCode) === '#ff9800' ? '10-14 prof.' :
                           getCantonColor(cantonCode) === '#f44336' ? '5-9 prof.' : '0-4 prof.'}
                    size="small"
                    sx={{
                      bgcolor: getCantonColor(cantonCode),
                      color: 'white',
                      mt: 1
                    }}
                  />
                </Box>
              </Popup>
            </Marker>
          ))}

          {/* Marqueurs des professionnels */}
          {professionals.map((professional) => (
            <Marker
              key={professional.id}
              position={[professional.coordinates.lat, professional.coordinates.lng] as LatLngTuple}
              icon={new Icon({
                iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyQzIgMTcuNTIgNi40OCAyMiAxMiAyMkMxNy41MiAyMiAyMiAxNy41MiAyMiAxMkMyMiA2LjQ4IDE3LjUyIDIgMTIgMloiIGZpbGw9IiMyMTk2RjMiLz4KPHBhdGggZD0iTTEyIDZDNi40OCA2IDIgMTAuNDggMiAxNkMyIDE5LjUyIDQuNDggMjIgOCAyMkMxMiAyMiAxNiAxOS41MiAxNiAxNkMxNiAxMC40OCAxMS41MiA2IDcgNloiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=',
                iconSize: [20, 32],
                iconAnchor: [10, 32],
                popupAnchor: [1, -34],
              })}
            >
              <Popup>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {professional.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {professional.specialty}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {professional.city}, {professional.canton}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {professional.institution}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: '#ffc107', mr: 0.5 }}>
                      ★
                    </Typography>
                    <Typography variant="body2">
                      {professional.rating} ({professional.reviews} avis)
                    </Typography>
                  </Box>
                  <Chip
                    label={professional.acceptsNewPatients ? 'Nouveaux patients' : 'Liste d\'attente'}
                    color={professional.acceptsNewPatients ? 'success' : 'warning'}
                    size="small"
                  />
                </Box>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Paper>

      {/* Informations sur le canton sélectionné */}
      {selectedCanton !== 'all' && (
        <Paper elevation={2} sx={{ mt: 2, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            �� Canton sélectionné: {getCantonName(selectedCanton)}
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
        </Paper>
      )}

      {/* Instructions d'utilisation */}
      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          💡 <strong>Comment utiliser la vraie carte :</strong>
          Cliquez sur les marqueurs des cantons pour les sélectionner et filtrer les professionnels.
          Utilisez les contrôles de zoom pour naviguer. Les couleurs indiquent le nombre de professionnels disponibles.
        </Typography>
      </Alert>
    </Box>
  );
};

export default RealMapSection;
