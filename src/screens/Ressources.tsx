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
  Map as MapIcon,
  Person as PersonIcon,
  Psychology as PsychologyIcon,
  RecordVoiceOver as SpeechIcon,
  FitnessCenter as PhysioIcon,
  Language as LanguageIcon,
  Public as WebsiteIcon,
  LocalHospital as HospitalIcon,
} from '@mui/icons-material';
import { SwissHealthcareData } from '../data/swissHealthcareProfessionals';
import SwissMap from '../components/SwissMap';

const Ressources: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  // Utiliser les données suisses réelles
  const specialties = SwissHealthcareData.getSpecialties();
  const professionals = SwissHealthcareData.getProfessionals();

  // Utiliser la FAQ suisse
  const faqItems = SwissHealthcareData.getSwissFAQ();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const filteredProfessionals = professionals.filter(professional => {
    const matchesSearch = professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         professional.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || professional.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

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

          {/* Vraie carte interactive suisse */}
          <SwissMap 
            professionals={professionals}
            getSpecialtyColor={getSpecialtyColor}
            getSpecialtyIcon={getSpecialtyIcon}
          />

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
          {/* Filtres */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Rechercher par nom ou adresse..."
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
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
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
          </Box>

          {/* Liste des professionnels */}
          <List>
            {filteredProfessionals.map((professional, index) => (
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
                {index < filteredProfessionals.length - 1 && <Divider />}
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