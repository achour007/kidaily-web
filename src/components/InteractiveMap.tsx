import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Circle,
  Tooltip
} from 'react-leaflet';
import { Icon, LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Box,
  Typography,
  Chip,
  Alert,
  Paper,
  useTheme,
  useMediaQuery,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Tooltip as MuiTooltip,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Switch,
  FormControlLabel,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  MyLocation as LocationIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Fullscreen as FullscreenIcon,
  Layers as LayersIcon,
  MedicalServices as MedicalIcon,
  ExpandMore as ExpandMoreIcon,
  Star as StarIcon,
  LocationOn as LocationOnIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';

interface Professional {
  id: string;
  name: string;
  specialty: string;
  specialtyCode: string;
  cantonCode: string;
  canton: string;
  city: string;
  institution: string;
  coordinates: { lat: number; lng: number };
  acceptsNewPatients: boolean;
  rating: number;
  reviews: number;
  phone?: string;
  email?: string;
  website?: string;
  languages?: string[];
  availability?: string;
  insurance?: string[];
  experience?: number;
  education?: string[];
}

interface InteractiveMapProps {
  professionals: Professional[];
  selectedCanton: string;
  setSelectedCanton: (canton: string) => void;
  onProfessionalSelect?: (professional: Professional) => void;
}

// Coordonnées des cantons suisses avec informations détaillées
const cantonCoordinates: Record<string, { 
  lat: number; 
  lng: number; 
  name: string;
  population: number;
  area: number;
  capital: string;
  region: string;
  languages: string[];
}> = {
  // Suisse romande (francophone)
  'ge': { lat: 46.2044, lng: 6.1432, name: 'Genève', population: 500000, area: 282, capital: 'Genève', region: 'Suisse romande', languages: ['Français'] },
  'vd': { lat: 46.5197, lng: 6.6323, name: 'Vaud', population: 800000, area: 3212, capital: 'Lausanne', region: 'Suisse romande', languages: ['Français'] },
  'fr': { lat: 46.8065, lng: 7.1619, name: 'Fribourg', population: 320000, area: 1671, capital: 'Fribourg', region: 'Suisse romande', languages: ['Français', 'Allemand'] },
  'ju': { lat: 47.3444, lng: 7.3501, name: 'Jura', population: 73000, area: 838, capital: 'Delémont', region: 'Suisse romande', languages: ['Français'] },
  'ne': { lat: 46.9929, lng: 6.9319, name: 'Neuchâtel', population: 180000, area: 803, capital: 'Neuchâtel', region: 'Suisse romande', languages: ['Français'] },
  'vs': { lat: 46.1553, lng: 7.5988, name: 'Valais', population: 340000, area: 5224, capital: 'Sion', region: 'Suisse romande', languages: ['Français', 'Allemand'] },

  // Suisse alémanique (germanophone)
  'zh': { lat: 47.3769, lng: 8.5417, name: 'Zurich', population: 1500000, area: 1729, capital: 'Zurich', region: 'Suisse alémanique', languages: ['Allemand'] },
  'be': { lat: 46.9479, lng: 7.4474, name: 'Berne', population: 1000000, area: 5959, capital: 'Berne', region: 'Suisse alémanique', languages: ['Allemand', 'Français'] },
  'ag': { lat: 47.3904, lng: 8.0454, name: 'Argovie', population: 680000, area: 1404, capital: 'Aarau', region: 'Suisse alémanique', languages: ['Allemand'] },
  'bl': { lat: 47.4419, lng: 7.7644, name: 'Bâle-Campagne', population: 290000, area: 518, capital: 'Liestal', region: 'Suisse alémanique', languages: ['Allemand'] },
  'bs': { lat: 47.5596, lng: 7.5886, name: 'Bâle-Ville', population: 200000, area: 37, capital: 'Bâle', region: 'Suisse alémanique', languages: ['Allemand'] },
  'lu': { lat: 47.0502, lng: 8.3093, name: 'Lucerne', population: 410000, area: 1494, capital: 'Lucerne', region: 'Suisse alémanique', languages: ['Allemand'] },
  'sg': { lat: 47.4245, lng: 9.3767, name: 'Saint-Gall', population: 510000, area: 2026, capital: 'Saint-Gall', region: 'Suisse alémanique', languages: ['Allemand'] },
  'sh': { lat: 47.6969, lng: 8.6370, name: 'Schaffhouse', population: 82000, area: 298, capital: 'Schaffhouse', region: 'Suisse alémanique', languages: ['Allemand'] },
  'so': { lat: 47.2074, lng: 7.5312, name: 'Soleure', population: 275000, area: 790, capital: 'Soleure', region: 'Suisse alémanique', languages: ['Allemand'] },
  'tg': { lat: 47.6038, lng: 9.0554, name: 'Thurgovie', population: 280000, area: 991, capital: 'Frauenfeld', region: 'Suisse alémanique', languages: ['Allemand'] },
  'zg': { lat: 47.1662, lng: 8.5155, name: 'Zoug', population: 130000, area: 239, capital: 'Zoug', region: 'Suisse alémanique', languages: ['Allemand'] },
  'ar': { lat: 47.3663, lng: 9.3004, name: 'Appenzell Rhodes-Extérieures', population: 55000, area: 243, capital: 'Herisau', region: 'Suisse alémanique', languages: ['Allemand'] },
  'ai': { lat: 47.3102, lng: 9.4090, name: 'Appenzell Rhodes-Intérieures', population: 16000, area: 173, capital: 'Appenzell', region: 'Suisse alémanique', languages: ['Allemand'] },
  'gl': { lat: 46.9812, lng: 9.0658, name: 'Glaris', population: 41000, area: 685, capital: 'Glaris', region: 'Suisse alémanique', languages: ['Allemand'] },
  'nw': { lat: 46.9267, lng: 8.3849, name: 'Nidwald', population: 43000, area: 276, capital: 'Stans', region: 'Suisse alémanique', languages: ['Allemand'] },
  'ow': { lat: 46.8779, lng: 8.2513, name: 'Obwald', population: 38000, area: 491, capital: 'Sarnen', region: 'Suisse alémanique', languages: ['Allemand'] },
  'sz': { lat: 47.0207, lng: 8.6514, name: 'Schwytz', population: 160000, area: 908, capital: 'Schwytz', region: 'Suisse alémanique', languages: ['Allemand'] },
  'ur': { lat: 46.7739, lng: 8.5964, name: 'Uri', population: 37000, area: 1077, capital: 'Altdorf', region: 'Suisse alémanique', languages: ['Allemand'] },

  // Suisse italienne (italophone)
  'ti': { lat: 46.1707, lng: 8.7957, name: 'Tessin', population: 350000, area: 2812, capital: 'Bellinzone', region: 'Suisse italienne', languages: ['Italien'] },

  // Suisse rhéto-romane (romanche)
  'gr': { lat: 46.6569, lng: 9.5784, name: 'Grisons', population: 200000, area: 7105, capital: 'Coire', region: 'Suisse rhéto-romane', languages: ['Allemand', 'Italien', 'Romanche'] }
};

// Composant pour les contrôles de la carte
const MapControls: React.FC<{
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFullscreen: () => void;
  onReset: () => void;
  isMobile: boolean;
  isFullscreen: boolean;
}> = ({ onZoomIn, onZoomOut, onFullscreen, onReset, isMobile, isFullscreen }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: isMobile ? 8 : 20,
        right: isMobile ? 8 : 20,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? 0.5 : 1,
      }}
    >
      <MuiTooltip title="Zoom +" placement="left">
        <IconButton
          onClick={onZoomIn}
          sx={{
            bgcolor: 'white',
            boxShadow: 2,
            '&:hover': { bgcolor: 'grey.100' },
            minWidth: isMobile ? 40 : 48,
            minHeight: isMobile ? 40 : 48,
            '& .MuiSvgIcon-root': {
              fontSize: isMobile ? '1.2rem' : '1.5rem'
            }
          }}
        >
          <ZoomInIcon />
        </IconButton>
      </MuiTooltip>
      
      <MuiTooltip title="Zoom -" placement="left">
        <IconButton
          onClick={onZoomOut}
          sx={{
            bgcolor: 'white',
            boxShadow: 2,
            '&:hover': { bgcolor: 'grey.100' },
            minWidth: isMobile ? 40 : 48,
            minHeight: isMobile ? 40 : 48,
            '& .MuiSvgIcon-root': {
              fontSize: isMobile ? '1.2rem' : '1.5rem'
            }
          }}
        >
          <ZoomOutIcon />
        </IconButton>
      </MuiTooltip>
      
      <MuiTooltip title={isFullscreen ? "Quitter le plein écran" : "Plein écran"} placement="left">
        <IconButton
          onClick={onFullscreen}
          sx={{
            bgcolor: isFullscreen ? 'rgba(76, 175, 80, 0.9)' : 'white',
            boxShadow: 2,
            '&:hover': { 
              bgcolor: isFullscreen ? 'rgba(76, 175, 80, 1)' : 'grey.100' 
            },
            color: isFullscreen ? 'white' : 'inherit',
            transition: 'all 0.2s ease-in-out',
            minWidth: isMobile ? 40 : 48,
            minHeight: isMobile ? 40 : 48,
            '& .MuiSvgIcon-root': {
              fontSize: isMobile ? '1.2rem' : '1.5rem'
            }
          }}
        >
          <FullscreenIcon />
        </IconButton>
      </MuiTooltip>
      
      <MuiTooltip title="Réinitialiser la vue" placement="left">
        <IconButton
          onClick={onReset}
          sx={{
            bgcolor: 'white',
            boxShadow: 2,
            '&:hover': { bgcolor: 'grey.100' },
            minWidth: isMobile ? 40 : 48,
            minHeight: isMobile ? 40 : 48,
            '& .MuiSvgIcon-root': {
              fontSize: isMobile ? '1.2rem' : '1.5rem'
            }
          }}
        >
          <LocationIcon />
        </IconButton>
      </MuiTooltip>
    </Box>
  );
};

// Composant pour les filtres avancés
const AdvancedFilters: React.FC<{
  filters: {
    specialty: string;
    rating: number;
    acceptsNewPatients: boolean;
    maxDistance: number;
    languages: string[];
  };
  onFilterChange: (filters: any) => void;
  specialties: string[];
  languages: string[];
  isMobile: boolean;
}> = ({ filters, onFilterChange, specialties, languages, isMobile }) => {
  const [expanded, setExpanded] = useState(false);

  const handleFilterChange = (key: string, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <Paper elevation={2} sx={{ mb: 2, overflow: 'hidden' }}>
      <Accordion 
        expanded={expanded} 
        onChange={() => setExpanded(!expanded)}
        sx={{ '&:before': { display: 'none' } }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterIcon />
            <Typography variant="subtitle1">Filtres Avancés</Typography>
            <Badge 
              badgeContent={
                Object.values(filters).filter(v => 
                  v !== '' && v !== 0 && v !== false && (Array.isArray(v) ? v.length > 0 : true)
                ).length
              } 
              color="primary"
            />
          </Box>
        </AccordionSummary>
        
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Spécialité */}
            <FormControl fullWidth size="small">
              <InputLabel>Spécialité</InputLabel>
              <Select
                value={filters.specialty}
                onChange={(e) => handleFilterChange('specialty', e.target.value)}
                label="Spécialité"
              >
                <MenuItem value="">Toutes les spécialités</MenuItem>
                {specialties.map((specialty) => (
                  <MenuItem key={specialty} value={specialty}>
                    {specialty}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Note minimum */}
            <Box>
              <Typography variant="body2" gutterBottom>
                Note minimum: {filters.rating}★
              </Typography>
              <Slider
                value={filters.rating}
                onChange={(_, value) => handleFilterChange('rating', value)}
                min={0}
                max={5}
                step={0.5}
                marks
                valueLabelDisplay="auto"
              />
            </Box>

            {/* Distance maximale */}
            <Box>
              <Typography variant="body2" gutterBottom>
                Distance maximale: {filters.maxDistance}km
              </Typography>
              <Slider
                value={filters.maxDistance}
                onChange={(_, value) => handleFilterChange('maxDistance', value)}
                min={5}
                max={100}
                step={5}
                marks
                valueLabelDisplay="auto"
              />
            </Box>

            {/* Nouveaux patients */}
            <FormControlLabel
              control={
                <Switch
                  checked={filters.acceptsNewPatients}
                  onChange={(e) => handleFilterChange('acceptsNewPatients', e.target.checked)}
                />
              }
              label="Accepte de nouveaux patients"
            />

            {/* Langues */}
            <FormControl fullWidth size="small">
              <InputLabel>Langues</InputLabel>
              <Select
                multiple
                value={filters.languages}
                onChange={(e) => handleFilterChange('languages', e.target.value)}
                label="Langues"
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {languages.map((language) => (
                  <MenuItem key={language} value={language}>
                    {language}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  professionals,
  selectedCanton,
  setSelectedCanton,
  onProfessionalSelect
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const mapRef = useRef<any>(null);
  // Centre de la Suisse pour couvrir tous les cantons
  const [mapCenter] = useState<LatLngTuple>([46.8182, 8.2275]); // Centre géographique de la Suisse
  const [mapZoom, setMapZoom] = useState(isMobile ? 6 : 7); // Zoom plus large pour voir toute la Suisse
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtres avancés
  const [filters, setFilters] = useState({
    specialty: '',
    rating: 0,
    acceptsNewPatients: false,
    maxDistance: 50,
    languages: [] as string[]
  });

  // États pour les contrôles de la carte
  const [showProfessionalMarkers, setShowProfessionalMarkers] = useState(true);
  const [showCantonMarkers, setShowCantonMarkers] = useState(true);

  // Ajuster le zoom pour mobile
  useEffect(() => {
    setMapZoom(isMobile ? 7 : 8);
  }, [isMobile]);

  // Extraire les spécialités et langues uniques
  const specialties = useMemo(() => 
    [...new Set(professionals.map(p => p.specialty))].sort(), 
    [professionals]
  );
  
  const languages = useMemo(() => 
    [...new Set(professionals.flatMap(p => p.languages || []))].sort(), 
    [professionals]
  );

  // Filtrage avancé des professionnels
  const filteredProfessionals = useMemo(() => {
    return professionals.filter(professional => {
      // Filtre par recherche textuelle
      const matchesSearch = !searchTerm || 
        professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        professional.institution.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtre par canton
      const matchesCanton = selectedCanton === 'all' || professional.cantonCode === selectedCanton;

      // Filtre par spécialité
      const matchesSpecialty = !filters.specialty || professional.specialty === filters.specialty;

      // Filtre par note
      const matchesRating = professional.rating >= filters.rating;

      // Filtre par nouveaux patients
      const matchesNewPatients = !filters.acceptsNewPatients || professional.acceptsNewPatients;

      // Filtre par langues
      const matchesLanguages = filters.languages.length === 0 || 
        filters.languages.some(lang => professional.languages?.includes(lang));

      return matchesSearch && matchesCanton && matchesSpecialty && 
             matchesRating && matchesNewPatients && matchesLanguages;
    });
  }, [professionals, searchTerm, selectedCanton, filters]);

  // Statistiques mises à jour avec informations linguistiques
  const stats = useMemo(() => {
    const regions = [...new Set(Object.values(cantonCoordinates).map(c => c.region))];
    const allLanguages = [...new Set(Object.values(cantonCoordinates).flatMap(c => c.languages))];
    
    return {
      totalProfessionals: professionals.length,
      filteredProfessionals: filteredProfessionals.length,
      cantonsCovered: Object.keys(cantonCoordinates).length,
      specialtiesAvailable: specialties.length,
      regionsCovered: regions.length,
      languagesOfficial: allLanguages.length,
      avgPerCanton: Math.round(professionals.length / Object.keys(cantonCoordinates).length)
    };
  }, [professionals, filteredProfessionals, specialties]);

  // Fonctions de contrôle de la carte
  const handleZoomIn = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() + 1);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() - 1);
    }
  }, []);

  const handleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.setView(mapCenter, mapZoom);
      setSelectedCanton('all');
      setSearchTerm('');
      setFilters({
        specialty: '',
        rating: 0,
        acceptsNewPatients: false,
        maxDistance: 50,
        languages: []
      });
    }
  }, [mapCenter, mapZoom, setSelectedCanton]);

  // Icônes personnalisées
  const createCustomIcon = useCallback((color: string, size: number = 1) => {
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="${24 * size}" height="${24 * size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="${color}"/>
          <path d="M12 6C6.48 6 2 10.48 2 16C2 19.52 4.48 22 8 22C12 22 16 19.52 16 16C16 10.48 11.52 6 7 6Z" fill="white"/>
        </svg>
      `)}`,
      iconSize: [24 * size, 24 * size],
      iconAnchor: [12 * size, 12 * size],
      popupAnchor: [0, -12 * size],
    });
  }, []);

  const getCantonColor = useCallback((cantonCode: string) => {
    const count = professionals.filter(p => p.cantonCode === cantonCode).length;
    if (count >= 15) return '#4caf50';
    if (count >= 10) return '#ff9800';
    if (count >= 5) return '#f44336';
    return '#e0e0e0';
  }, [professionals]);

  const getCantonIcon = useCallback((cantonCode: string) => {
    const count = professionals.filter(p => p.cantonCode === cantonCode).length;
    if (count >= 15) return createCustomIcon('#4caf50', 1.5);
    if (count >= 10) return createCustomIcon('#ff9800', 1.3);
    if (count >= 5) return createCustomIcon('#f44336', 1.2);
    return createCustomIcon('#e0e0e0', 1);
  }, [professionals, createCustomIcon]);

  // Gestionnaire de clic sur un professionnel
  const handleProfessionalClick = useCallback((professional: Professional) => {
    if (onProfessionalSelect) {
      onProfessionalSelect(professional);
    }
  }, [onProfessionalSelect]);

  return (
    <Box>
      {/* Barre de recherche et filtres */}
      <Paper elevation={2} sx={{ mb: 2, p: isMobile ? 1.5 : 2 }}>
        <Box sx={{ 
          display: 'flex', 
          gap: isMobile ? 1 : 2, 
          flexWrap: 'wrap', 
          alignItems: 'center',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <TextField
            placeholder="Rechercher un professionnel, spécialité, ville..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ 
              flexGrow: 1, 
              minWidth: isMobile ? '100%' : 250,
              width: isMobile ? '100%' : 'auto'
            }}
            size={isMobile ? "small" : "small"}
            fullWidth={isMobile}
          />
          
          <Box sx={{ 
            display: 'flex', 
            gap: isMobile ? 1 : 2, 
            flexWrap: 'wrap',
            width: isMobile ? '100%' : 'auto'
          }}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
              size={isMobile ? "small" : "small"}
              sx={{ 
                flex: isMobile ? 1 : 'none',
                minHeight: isMobile ? 44 : 'auto'
              }}
            >
              {isMobile ? 'Filtres' : 'Filtres'}
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<LayersIcon />}
              onClick={() => setShowCantonMarkers(!showCantonMarkers)}
              size={isMobile ? "small" : "small"}
              sx={{ 
                flex: isMobile ? 1 : 'none',
                minHeight: isMobile ? 44 : 'auto'
              }}
            >
              {isMobile ? 'Cantons' : 'Cantons'}
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<MedicalIcon />}
              onClick={() => setShowProfessionalMarkers(!showProfessionalMarkers)}
              size={isMobile ? "small" : "small"}
              sx={{ 
                flex: isMobile ? 1 : 'none',
                minHeight: isMobile ? 44 : 'auto'
              }}
            >
              {isMobile ? 'Prof.' : 'Professionnels'}
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Filtres avancés */}
      <Collapse in={showFilters}>
        <AdvancedFilters
          filters={filters}
          onFilterChange={setFilters}
          specialties={specialties}
          languages={languages}
          isMobile={isMobile}
        />
      </Collapse>

      {/* Statistiques de la carte */}
      <Paper elevation={2} sx={{ mb: 2, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          🗺️ Carte Interactive de la Suisse
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gap: isMobile ? 1 : 2, 
          mb: 2,
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(150px, 1fr))'
        }}>
          <Chip
            label={`${stats.filteredProfessionals}/${stats.totalProfessionals} prof.`}
            color="primary"
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}
          />
          <Chip
            label={`${stats.cantonsCovered} cantons`}
            color="secondary"
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}
          />
          <Chip
            label={`${stats.specialtiesAvailable} spécialités`}
            color="info"
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}
          />
          <Chip
            label={`${stats.regionsCovered} régions`}
            color="warning"
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}
          />
          <Chip
            label={`${stats.languagesOfficial} langues`}
            color="success"
            variant="outlined"
            size={isMobile ? "small" : "medium"}
            sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}
          />
        </Box>

        {/* Légende des couleurs */}
        <Box sx={{ 
          display: 'flex', 
          gap: isMobile ? 1 : 2, 
          flexWrap: 'wrap', 
          alignItems: 'center',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.875rem' : 'inherit' }}>
            Légende:
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gap: isMobile ? 0.5 : 1, 
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, auto)',
            width: isMobile ? '100%' : 'auto'
          }}>
            {[
              { color: '#4caf50', label: '15+ prof.' },
              { color: '#ff9800', label: '10-14 prof.' },
              { color: '#f44336', label: '5-9 prof.' },
              { color: '#e0e0e0', label: '0-4 prof.' }
            ].map((item) => (
              <Box key={item.label} sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                justifyContent: isMobile ? 'center' : 'flex-start'
              }}>
                <Box sx={{ 
                  width: isMobile ? 14 : 16, 
                  height: isMobile ? 14 : 16, 
                  bgcolor: item.color, 
                  borderRadius: '2px' 
                }} />
                <Typography variant="caption" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Carte interactive */}
      <Paper elevation={3} sx={{ 
        height: isMobile ? '400px' : '600px', 
        overflow: 'hidden',
        borderRadius: 2,
        position: 'relative'
      }}>
        <MapContainer
          ref={mapRef}
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          doubleClickZoom={!isMobile}
          scrollWheelZoom={!isMobile}
          dragging={true}
          touchZoom={true}
        >
          {/* Couche de carte OpenStreetMap */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Marqueurs des cantons */}
          {showCantonMarkers && Object.entries(cantonCoordinates).map(([cantonCode, coords]) => {
            const professionalCount = professionals.filter(p => p.cantonCode === cantonCode).length;
            return (
              <Marker
                key={cantonCode}
                position={[coords.lat, coords.lng] as LatLngTuple}
                icon={getCantonIcon(cantonCode)}
                eventHandlers={{
                  click: () => setSelectedCanton(cantonCode === selectedCanton ? 'all' : cantonCode),
                }}
              >
                <Popup>
                  <Box sx={{ 
                    minWidth: isMobile ? '180px' : '280px',
                    maxWidth: isMobile ? '250px' : '350px'
                  }}>
                    <Typography variant={isMobile ? "subtitle1" : "h6"} gutterBottom>
                      🏛️ {coords.name}
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 1, 
                      mb: 1,
                      flexDirection: isMobile ? 'column' : 'row',
                      alignItems: isMobile ? 'flex-start' : 'center'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: isMobile ? 0.5 : 1 }}>
                        <LocationOnIcon color="primary" fontSize="small" />
                        <Typography variant="body2" color="primary" fontWeight="medium" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                          Capitale: {coords.capital}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: isMobile ? 0.5 : 1 }}>
                        <LanguageIcon color="secondary" fontSize="small" />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                          Région: {coords.region}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 1, 
                      mb: 1,
                      flexDirection: isMobile ? 'column' : 'row',
                      alignItems: isMobile ? 'flex-start' : 'center'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: isMobile ? 0.5 : 1 }}>
                        <MedicalIcon color="success" fontSize="small" />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                          {professionalCount} professionnels
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: isMobile ? 0.5 : 1 }}>
                        <StarIcon color="warning" fontSize="small" />
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                          Population: {coords.population.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LayersIcon color="info" fontSize="small" />
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>
                        Superficie: {coords.area} km²
                      </Typography>
                    </Box>
                    
                    {/* Langues officielles */}
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: isMobile ? '0.7rem' : 'inherit' }}>
                        Langues: {coords.languages.join(', ')}
                      </Typography>
                    </Box>
                    
                    <Chip
                      label={getCantonColor(cantonCode) === '#4caf50' ? '15+ prof.' :
                             getCantonColor(cantonCode) === '#ff9800' ? '10-14 prof.' :
                             getCantonColor(cantonCode) === '#f44336' ? '5-9 prof.' : '0-4 prof.'}
                      size="small"
                      sx={{
                        bgcolor: getCantonColor(cantonCode),
                        color: 'white',
                        mt: 1,
                        fontSize: isMobile ? '0.7rem' : 'inherit'
                      }}
                    />
                  </Box>
                </Popup>
              </Marker>
            );
          })}

          {/* Marqueurs des professionnels */}
          {showProfessionalMarkers && filteredProfessionals.map((professional) => (
            <Marker
              key={professional.id}
              position={[professional.coordinates.lat, professional.coordinates.lng] as LatLngTuple}
              icon={createCustomIcon('#2196f3', 1)}
              eventHandlers={{
                click: () => handleProfessionalClick(professional),
              }}
            >
              <Popup>
                <Box sx={{ minWidth: isMobile ? '200px' : '250px' }}>
                  <Typography variant="h6" gutterBottom>
                    {professional.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <MedicalIcon color="primary" fontSize="small" />
                    <Typography variant="body2" color="primary" fontWeight="medium">
                      {professional.specialty}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <LocationOnIcon color="action" fontSize="small" />
                    <Typography variant="body2" color="text.secondary">
                      {professional.city}, {professional.canton}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" gutterBottom>
                    {professional.institution}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <StarIcon sx={{ color: '#ffc107', mr: 0.5 }} />
                    <Typography variant="body2">
                      {professional.rating} ({professional.reviews} avis)
                    </Typography>
                  </Box>
                  
                  {professional.languages && professional.languages.length > 0 && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Langues: {professional.languages.join(', ')}
                      </Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={professional.acceptsNewPatients ? 'Nouveaux patients' : 'Liste d\'attente'}
                      color={professional.acceptsNewPatients ? 'success' : 'warning'}
                      size="small"
                    />
                    {professional.phone && (
                      <Chip
                        icon={<PhoneIcon />}
                        label="Appeler"
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    )}
                    {professional.email && (
                      <Chip
                        icon={<EmailIcon />}
                        label="Email"
                        color="secondary"
                        size="small"
                        variant="outlined"
                      />
                    )}
                    {professional.website && (
                      <Chip
                        icon={<LanguageIcon />}
                        label="Site web"
                        color="info"
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>
              </Popup>
            </Marker>
          ))}

          {/* Cercle de distance si un canton est sélectionné */}
          {selectedCanton !== 'all' && cantonCoordinates[selectedCanton] && (
            <Circle
              center={[cantonCoordinates[selectedCanton].lat, cantonCoordinates[selectedCanton].lng]}
              radius={filters.maxDistance * 1000} // Convertir km en mètres
              pathOptions={{
                color: '#1976d2',
                fillColor: '#1976d2',
                fillOpacity: 0.1,
                weight: 2
              }}
            >
              <Tooltip permanent>
                Rayon de recherche: {filters.maxDistance}km
              </Tooltip>
            </Circle>
          )}
        </MapContainer>

        {/* Contrôles de la carte */}
        <MapControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFullscreen={handleFullscreen}
          onReset={handleReset}
          isMobile={isMobile}
          isFullscreen={isFullscreen}
        />
      </Paper>

      {/* Informations sur le canton sélectionné */}
      {selectedCanton !== 'all' && cantonCoordinates[selectedCanton] && (
        <Paper elevation={2} sx={{ mt: 2, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            🎯 Canton sélectionné: {cantonCoordinates[selectedCanton].name}
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            flexWrap: 'wrap',
            flexDirection: isSmallMobile ? 'column' : 'row'
          }}>
            <Chip
              label={`${filteredProfessionals.length} professionnels trouvés`}
              color="primary"
              size={isMobile ? "small" : "medium"}
            />
            <Chip
              label={`${cantonCoordinates[selectedCanton].population.toLocaleString()} habitants`}
              color="secondary"
              size={isMobile ? "small" : "medium"}
            />
            <Chip
              label={`${cantonCoordinates[selectedCanton].area} km²`}
              color="info"
              size={isMobile ? "small" : "medium"}
            />
          </Box>

          {/* Liste des professionnels du canton */}
          {filteredProfessionals.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Professionnels disponibles:
              </Typography>
              <List dense>
                {filteredProfessionals.slice(0, 5).map((professional) => (
                  <ListItem 
                    key={professional.id}
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                      borderRadius: 1,
                      mb: 0.5
                    }}
                    onClick={() => handleProfessionalClick(professional)}
                  >
                    <ListItemIcon>
                      <MedicalIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={professional.name}
                      secondary={`${professional.specialty} - ${professional.city}`}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StarIcon sx={{ color: '#ffc107', fontSize: 16 }} />
                      <Typography variant="caption">
                        {professional.rating}
                      </Typography>
                    </Box>
                  </ListItem>
                ))}
                {filteredProfessionals.length > 5 && (
                  <ListItem>
                    <ListItemText
                      secondary={`... et ${filteredProfessionals.length - 5} autres professionnels`}
                    />
                  </ListItem>
                )}
              </List>
            </Box>
          )}
        </Paper>
      )}

      {/* Instructions d'utilisation */}
      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          💡 <strong>Comment utiliser la carte :</strong>
          {isMobile ? 
            'Touchez les marqueurs des cantons pour les sélectionner. Utilisez les gestes de pincement pour zoomer.' : 
            'Cliquez sur les marqueurs des cantons pour les sélectionner et filtrer les professionnels. Utilisez les contrôles de zoom pour naviguer.'
          }
          Les couleurs indiquent le nombre de professionnels disponibles par canton.
        </Typography>
      </Alert>
    </Box>
  );
};

export default InteractiveMap;