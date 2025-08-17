import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  Avatar,
  Divider,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Rating,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  AccessTime as TimeIcon,
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  Psychology as PsychologyIcon,
  RecordVoiceOver as SpeechIcon,
  FitnessCenter as PhysioIcon,
  Language as LanguageIcon,
  Public as WebsiteIcon,
  LocalHospital as HospitalIcon,
} from '@mui/icons-material';
import { SwissHealthcareData } from '../data/swissHealthcareProfessionals';
import { ComprehensiveSwissDatabase } from '../data/comprehensiveSwissDatabase';
import { ExpandedSwissDatabase } from '../data/expandedSwissDatabase';

const Ressources: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedCanton, setSelectedCanton] = useState('all');
  const [acceptsNewOnly, setAcceptsNewOnly] = useState(false);

  // Utiliser la base de données MASSIVE (100+ professionnels)
  const specialties = ComprehensiveSwissDatabase.getSpecialties();
  const cantons = ComprehensiveSwissDatabase.getCantons();
  const allProfessionals = ExpandedSwissDatabase.getAllProfessionals();
  
  // Filtrage avancé
  let professionals = allProfessionals;
  
  // Filtrer par canton
  if (selectedCanton !== 'all') {
    professionals = ComprehensiveSwissDatabase.filterByCantons(professionals, [selectedCanton]);
  }
  
  // Filtrer par spécialité
  if (selectedSpecialty !== 'all') {
    professionals = ComprehensiveSwissDatabase.filterBySpecialties(professionals, [selectedSpecialty]);
  }
  
  // Filtrer par disponibilité
  if (acceptsNewOnly) {
    professionals = ComprehensiveSwissDatabase.filterByAvailability(professionals, true);
  }
  
  // Recherche textuelle
  if (searchTerm) {
    professionals = ComprehensiveSwissDatabase.searchByText(professionals, searchTerm);
  }
  
  // Statistiques de la base massive
  const stats = ExpandedSwissDatabase.getStatistics();

  // Utiliser la FAQ suisse
  const faqItems = SwissHealthcareData.getSwissFAQ();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };



  const getSpecialtyIcon = (specialty: string) => {
    switch (specialty) {
      case 'orthophoniste': return <SpeechIcon />;
      case 'psychologue': return <PsychologyIcon />;
      case 'psychomotricien': return <PhysioIcon />;
      case 'pediatre': return <HospitalIcon />;
      case 'neurologie': return <HospitalIcon />;
      case 'ergotherapie': return <PhysioIcon />;
      default: return <PersonIcon />;
    }
  };

  const getSpecialtyColor = (specialty: string) => {
    switch (specialty) {
      case 'orthophoniste': return '#2196f3';
      case 'psychologue': return '#9c27b0';
      case 'psychomotricien': return '#4caf50';
      case 'pediatre': return '#f44336';
      case 'neurologie': return '#ff9800';
      case 'ergotherapie': return '#00bcd4';
      default: return '#666';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Ressources professionnelles
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Carte interactive" />
        <Tab label="Liste des spécialistes" />
        <Tab label="FAQ" />
      </Tabs>

      {activeTab === 0 && (
        <Box>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Carte interactive des professionnels de santé spécialisés dans le développement de l'enfant en Suisse.
              Centres hospitaliers universitaires, cabinets privés et institutions spécialisées.
            </Typography>
          </Alert>

          {/* Carte interactive suisse fonctionnelle */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 2 
              }}>
                <Typography variant="h6" color="primary">
                  🇨🇭 Base de Données Exhaustive Suisse
                </Typography>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {professionals.length} / {stats.total} professionnels trouvés
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Tous les 26 cantons • {stats.byRegion.romande + stats.byRegion.alemanique + stats.byRegion.italienne} régions
                  </Typography>
                </Box>
              </Box>

              {/* Carte interactive simplifiée mais fonctionnelle */}
              <Box sx={{ 
                width: '100%', 
                height: 500, 
                bgcolor: '#e8f4fd',
                position: 'relative',
                borderRadius: 2,
                border: '2px solid #2196f3',
                overflow: 'hidden',
              }}>
                {/* Fond de carte de la Suisse */}
                <svg
                  viewBox="0 0 400 300"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 1
                  }}
                >
                  {/* Contour de la Suisse */}
                  <path
                    d="M60,180 Q80,120 140,140 Q200,100 280,120 Q340,140 360,200 Q340,280 280,300 Q200,320 140,300 Q80,280 60,180 Z"
                    fill="#f0f7ff"
                    stroke="#2196f3"
                    strokeWidth="2"
                    opacity="0.7"
                  />
                  {/* Lac Léman */}
                  <ellipse cx="100" cy="260" rx="30" ry="15" fill="#2196f3" opacity="0.6" />
                  {/* Lac de Zurich */}
                  <ellipse cx="280" cy="180" rx="25" ry="8" fill="#2196f3" opacity="0.6" />
                  
                  {/* Labels des villes */}
                  <text x="100" y="275" fontSize="12" fill="#1976d2" fontWeight="bold">Genève</text>
                  <text x="140" y="250" fontSize="12" fill="#1976d2" fontWeight="bold">Lausanne</text>
                  <text x="280" y="170" fontSize="12" fill="#1976d2" fontWeight="bold">Zürich</text>
                  <text x="200" y="200" fontSize="12" fill="#1976d2" fontWeight="bold">Bern</text>
                  <text x="240" y="320" fontSize="12" fill="#1976d2" fontWeight="bold">Lugano</text>
                </svg>

                {/* Marqueurs des professionnels - Position fixe mais logique */}
                {professionals.map((professional, index) => {
                  // Positions logiques par canton/ville
                  const getPosition = (professional: any, index: number) => {
                    if (professional.city === 'Genève') return { x: '25%', y: '65%' };
                    if (professional.city === 'Lausanne') return { x: '35%', y: '60%' };
                    if (professional.city === 'Zürich') return { x: '70%', y: '45%' };
                    if (professional.city === 'Bern') return { x: '50%', y: '50%' };
                    if (professional.city === 'Basel') return { x: '45%', y: '35%' };
                    if (professional.city === 'Lugano') return { x: '60%', y: '80%' };
                    // Position par défaut avec légère variation
                    return { x: `${30 + (index * 8)}%`, y: `${40 + (index % 3) * 15}%` };
                  };

                  const position = getPosition(professional, index);
                  
                  return (
                    <Box
                      key={professional.id}
                      onClick={() => {
                        // Afficher les détails dans une alert simple
                        alert(`${professional.name}\n${professional.institution}\n\nSpécialité: ${professional.specialty}\nTéléphone: ${professional.phone}\nEmail: ${professional.email}\n\nAttente: ${professional.waitingTime}\nLangues: ${professional.languages?.join(', ')}`);
                      }}
                      sx={{
                        position: 'absolute',
                        left: position.x,
                        top: position.y,
                        width: 45,
                        height: 45,
                        bgcolor: getSpecialtyColor(professional.specialty),
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        cursor: 'pointer',
                        zIndex: 10,
                        boxShadow: '0 3px 10px rgba(0,0,0,0.3)',
                        border: '3px solid white',
                        transform: 'translate(-50%, -50%)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translate(-50%, -50%) scale(1.3)',
                          zIndex: 20,
                          boxShadow: '0 5px 20px rgba(0,0,0,0.5)',
                        },
                      }}
                      title={`${professional.name} - ${professional.institution}\nCliquez pour plus de détails`}
                    >
                      {getSpecialtyIcon(professional.specialty)}
                    </Box>
                  );
                })}

                {/* Indicateur d'interactivité */}
                <Box sx={{
                  position: 'absolute',
                  bottom: 10,
                  right: 10,
                  bgcolor: 'rgba(255,255,255,0.9)',
                  px: 2,
                  py: 1,
                  borderRadius: 1,
                  fontSize: '0.8rem',
                  color: 'primary.main',
                  fontWeight: 'bold'
                }}>
                  ✨ Cliquez sur les marqueurs !
                </Box>
              </Box>

              {/* Instructions claires */}
              <Alert severity="success" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>🎯 Instructions :</strong> Cliquez sur les marqueurs colorés pour voir les informations détaillées de chaque professionnel. 
                  Chaque couleur représente une spécialité différente.
                </Typography>
              </Alert>
            </CardContent>
          </Card>

          {/* Légende */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {specialties.slice(1).map((specialty) => (
              <Box key={specialty.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: getSpecialtyColor(specialty.id),
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '0.8rem',
                  }}
                >
                  {getSpecialtyIcon(specialty.id)}
                </Box>
                <Typography variant="body2">{specialty.name}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          {/* Statistiques globales */}
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              📊 Base de Données Complète Suisse
            </Typography>
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              <Typography variant="body2">
                <strong>{stats.total}</strong> professionnels au total
              </Typography>
              <Typography variant="body2">
                <strong>{stats.acceptingNew}</strong> acceptent de nouveaux patients
              </Typography>
              <Typography variant="body2">
                <strong>Romande:</strong> {stats.byRegion.romande} • 
                <strong> Alémanique:</strong> {stats.byRegion.alemanique} • 
                <strong> Italienne:</strong> {stats.byRegion.italienne}
              </Typography>
            </Box>
          </Alert>

          {/* Filtres avancés */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Rechercher par nom, institution, ville, canton..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            
            {/* Filtres par canton */}
            <Typography variant="subtitle2" gutterBottom>
              🏔️ Filtrer par canton :
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {cantons.slice(0, 10).map((canton) => (
                <Chip
                  key={canton.code}
                  label={canton.name}
                  onClick={() => setSelectedCanton(canton.code)}
                  color={selectedCanton === canton.code ? 'primary' : 'default'}
                  variant={selectedCanton === canton.code ? 'filled' : 'outlined'}
                  size="small"
                />
              ))}
              {cantons.length > 10 && (
                <Chip
                  label="... + autres cantons"
                  variant="outlined"
                  size="small"
                  color="secondary"
                />
              )}
            </Box>

            {/* Filtres par spécialité */}
            <Typography variant="subtitle2" gutterBottom>
              🏥 Filtrer par spécialité :
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {specialties.map((specialty) => (
                <Chip
                  key={specialty.id}
                  label={specialty.name}
                  onClick={() => setSelectedSpecialty(specialty.id)}
                  color={selectedSpecialty === specialty.id ? 'primary' : 'default'}
                  variant={selectedSpecialty === specialty.id ? 'filled' : 'outlined'}
                />
              ))}
            </Box>

            {/* Filtres supplémentaires */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Chip
                label="✅ Accepte nouveaux patients"
                onClick={() => setAcceptsNewOnly(!acceptsNewOnly)}
                color={acceptsNewOnly ? 'success' : 'default'}
                variant={acceptsNewOnly ? 'filled' : 'outlined'}
              />
              <Typography variant="body2" color="text.secondary">
                {professionals.length} résultats
              </Typography>
            </Box>
          </Box>

          {/* Liste des professionnels */}
          <List>
            {professionals.map((professional, index) => (
              <React.Fragment key={professional.id}>
                <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: getSpecialtyColor(professional.specialty) }}>
                        {getSpecialtyIcon(professional.specialty)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {professional.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {specialties.find(s => s.id === professional.specialty)?.name}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={professional.rating} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary">
                        ({professional.reviews})
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {professional.description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {professional.specialties.map((specialty, idx) => (
                      <Chip key={idx} label={specialty} size="small" variant="outlined" />
                    ))}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon color="action" />
                      <Typography variant="body2">{professional.address}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TimeIcon color="action" />
                      <Typography variant="body2">Attente: {professional.waitingTime}</Typography>
                    </Box>
                  </Box>

                  {/* Informations spécifiques Suisse */}
                  {professional.institution && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <HospitalIcon color="action" />
                      <Typography variant="body2" color="primary">
                        {professional.institution}
                      </Typography>
                    </Box>
                  )}

                  {professional.languages && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LanguageIcon color="action" />
                      <Typography variant="body2">
                        Langues: {professional.languages.join(', ')}
                      </Typography>
                    </Box>
                  )}

                  {professional.insuranceAccepted && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Assurances acceptées:
                      </Typography>
                      {professional.insuranceAccepted.map((insurance, idx) => (
                        <Chip key={idx} label={insurance} size="small" variant="outlined" color="primary" />
                      ))}
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      startIcon={<PhoneIcon />}
                      size="small"
                      variant="outlined"
                      href={`tel:${professional.phone}`}
                    >
                      Appeler
                    </Button>
                    <Button
                      startIcon={<EmailIcon />}
                      size="small"
                      variant="outlined"
                      href={`mailto:${professional.email}`}
                    >
                      Email
                    </Button>
                    {professional.website && (
                      <Button
                        startIcon={<WebsiteIcon />}
                        size="small"
                        variant="outlined"
                        href={professional.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Site web
                      </Button>
                    )}
                    {professional.acceptsNewPatients ? (
                      <Chip label="Nouveaux patients" color="success" size="small" />
                    ) : (
                      <Chip label="Liste d'attente" color="warning" size="small" />
                    )}
                  </Box>
                </ListItem>
                {index < professionals.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Questions fréquentes
          </Typography>
          {faqItems.map((item, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Ressources; 