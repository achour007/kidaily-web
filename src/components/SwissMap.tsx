import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
} from '@mui/material';
import {
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  MyLocation as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Close as CloseIcon,
  LocalHospital as HospitalIcon,
} from '@mui/icons-material';
import { SwissHealthcareData, SwissProfessional } from '../data/swissHealthcareProfessionals';

interface SwissMapProps {
  professionals: SwissProfessional[];
  getSpecialtyColor: (specialty: string) => string;
  getSpecialtyIcon: (specialty: string) => React.ReactNode;
}

const SwissMap: React.FC<SwissMapProps> = ({ 
  professionals, 
  getSpecialtyColor, 
  getSpecialtyIcon 
}) => {
  const [selectedProfessional, setSelectedProfessional] = useState<SwissProfessional | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Coordonnées centre de la Suisse
  const swissCenter = { lat: 46.8182, lng: 8.2275 };

  // Limites de la Suisse pour le calcul des positions
  const swissBounds = {
    north: 47.8084,
    south: 45.8180,
    east: 10.4921,
    west: 5.9560
  };

  // Convertir les coordonnées géographiques en positions sur la carte
  const coordsToPosition = (lat: number, lng: number) => {
    const x = ((lng - swissBounds.west) / (swissBounds.east - swissBounds.west)) * 100;
    const y = ((swissBounds.north - lat) / (swissBounds.north - swissBounds.south)) * 100;
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  const handleZoomIn = () => setZoomLevel(Math.min(3, zoomLevel + 0.2));
  const handleZoomOut = () => setZoomLevel(Math.max(0.5, zoomLevel - 0.2));

  const handleMarkerClick = (professional: SwissProfessional) => {
    setSelectedProfessional(professional);
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          {/* Contrôles de carte */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 2 
          }}>
            <Typography variant="h6" color="primary">
              🇨🇭 Carte des Professionnels Suisses
            </Typography>
            <Box>
              <IconButton onClick={handleZoomOut} size="small">
                <ZoomOutIcon />
              </IconButton>
              <IconButton onClick={handleZoomIn} size="small">
                <ZoomInIcon />
              </IconButton>
              <Tooltip title="Centrer sur la Suisse">
                <IconButton onClick={() => setZoomLevel(1)} size="small">
                  <LocationIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Carte de la Suisse */}
          <Box sx={{ 
            width: '100%', 
            height: 500, 
            bgcolor: '#e8f4fd',
            position: 'relative',
            borderRadius: 2,
            border: '2px solid #2196f3',
            overflow: 'hidden',
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center',
            transition: 'transform 0.3s ease',
          }}>
            {/* Contour simplifié de la Suisse */}
            <svg
              viewBox="0 0 100 100"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 1
              }}
            >
              {/* Forme approximative de la Suisse */}
              <path
                d="M15,45 Q20,30 35,35 Q50,25 70,30 Q85,35 90,50 Q85,70 70,75 Q50,80 35,75 Q20,70 15,45 Z"
                fill="#f0f7ff"
                stroke="#2196f3"
                strokeWidth="0.5"
                opacity="0.7"
              />
              {/* Lac Léman */}
              <ellipse cx="25" cy="65" rx="8" ry="4" fill="#2196f3" opacity="0.6" />
              {/* Lac de Zurich */}
              <ellipse cx="70" cy="45" rx="6" ry="2" fill="#2196f3" opacity="0.6" />
            </svg>

            {/* Marqueurs des professionnels */}
            {professionals.map((professional) => {
              const position = coordsToPosition(
                professional.coordinates.lat, 
                professional.coordinates.lng
              );
              
              return (
                <Tooltip
                  key={professional.id}
                  title={`${professional.name} - ${professional.institution}`}
                  arrow
                >
                  <Box
                    onClick={() => handleMarkerClick(professional)}
                    sx={{
                      position: 'absolute',
                      left: `${position.x}%`,
                      top: `${position.y}%`,
                      width: 40,
                      height: 40,
                      bgcolor: getSpecialtyColor(professional.specialty),
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      cursor: 'pointer',
                      zIndex: 10,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                      border: '2px solid white',
                      transform: 'translate(-50%, -50%)',
                      '&:hover': {
                        transform: 'translate(-50%, -50%) scale(1.2)',
                        zIndex: 20,
                      },
                      transition: 'transform 0.2s ease',
                    }}
                  >
                    {getSpecialtyIcon(professional.specialty)}
                  </Box>
                </Tooltip>
              );
            })}

            {/* Labels des principales villes */}
            <Box sx={{ position: 'absolute', left: '25%', top: '65%', zIndex: 5 }}>
              <Typography variant="caption" sx={{ 
                bgcolor: 'rgba(255,255,255,0.9)', 
                px: 1, 
                borderRadius: 1,
                fontSize: '0.7rem'
              }}>
                Genève
              </Typography>
            </Box>
            <Box sx={{ position: 'absolute', left: '35%', top: '60%', zIndex: 5 }}>
              <Typography variant="caption" sx={{ 
                bgcolor: 'rgba(255,255,255,0.9)', 
                px: 1, 
                borderRadius: 1,
                fontSize: '0.7rem'
              }}>
                Lausanne
              </Typography>
            </Box>
            <Box sx={{ position: 'absolute', left: '70%', top: '45%', zIndex: 5 }}>
              <Typography variant="caption" sx={{ 
                bgcolor: 'rgba(255,255,255,0.9)', 
                px: 1, 
                borderRadius: 1,
                fontSize: '0.7rem'
              }}>
                Zürich
              </Typography>
            </Box>
            <Box sx={{ position: 'absolute', left: '50%', top: '50%', zIndex: 5 }}>
              <Typography variant="caption" sx={{ 
                bgcolor: 'rgba(255,255,255,0.9)', 
                px: 1, 
                borderRadius: 1,
                fontSize: '0.7rem'
              }}>
                Bern
              </Typography>
            </Box>
            <Box sx={{ position: 'absolute', left: '60%', top: '80%', zIndex: 5 }}>
              <Typography variant="caption" sx={{ 
                bgcolor: 'rgba(255,255,255,0.9)', 
                px: 1, 
                borderRadius: 1,
                fontSize: '0.7rem'
              }}>
                Lugano
              </Typography>
            </Box>
          </Box>

          {/* Instructions */}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
            Cliquez sur les marqueurs colorés pour voir les détails des professionnels
          </Typography>
        </CardContent>
      </Card>

      {/* Dialog avec détails du professionnel */}
      <Dialog 
        open={!!selectedProfessional} 
        onClose={() => setSelectedProfessional(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedProfessional && (
          <>
            <DialogTitle sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}>
              <Box>
                <Typography variant="h6">
                  {selectedProfessional.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedProfessional.institution}
                </Typography>
              </Box>
              <IconButton onClick={() => setSelectedProfessional(null)}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent>
              <Box sx={{ mb: 2 }}>
                <Rating value={selectedProfessional.rating} readOnly size="small" />
                <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
                  ({selectedProfessional.reviews} avis)
                </Typography>
              </Box>

              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedProfessional.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                {selectedProfessional.specialties.map((specialty, idx) => (
                  <Chip key={idx} label={specialty} size="small" variant="outlined" />
                ))}
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                <Typography variant="body2">
                  📍 <strong>Adresse:</strong> {selectedProfessional.address}
                </Typography>
                <Typography variant="body2">
                  🕒 <strong>Délai d'attente:</strong> {selectedProfessional.waitingTime}
                </Typography>
                <Typography variant="body2">
                  🗣️ <strong>Langues:</strong> {selectedProfessional.languages.join(', ')}
                </Typography>
                <Typography variant="body2">
                  💳 <strong>Assurances:</strong> {selectedProfessional.insuranceAccepted.join(', ')}
                </Typography>
              </Box>

              {selectedProfessional.acceptsNewPatients ? (
                <Chip label="✅ Accepte de nouveaux patients" color="success" />
              ) : (
                <Chip label="⏳ Liste d'attente" color="warning" />
              )}
            </DialogContent>

            <DialogActions>
              <Button
                startIcon={<PhoneIcon />}
                href={`tel:${selectedProfessional.phone}`}
                variant="outlined"
              >
                {selectedProfessional.phone}
              </Button>
              <Button
                startIcon={<EmailIcon />}
                href={`mailto:${selectedProfessional.email}`}
                variant="outlined"
              >
                Email
              </Button>
              {selectedProfessional.website && (
                <Button
                  startIcon={<HospitalIcon />}
                  href={selectedProfessional.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                >
                  Site web
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default SwissMap;
