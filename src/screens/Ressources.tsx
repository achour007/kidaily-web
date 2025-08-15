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
} from '@mui/icons-material';

interface Professional {
  id: string;
  name: string;
  specialty: string;
  address: string;
  phone: string;
  email: string;
  rating: number;
  reviews: number;
  waitingTime: string;
  acceptsNewPatients: boolean;
  coordinates: { lat: number; lng: number };
  description: string;
  specialties: string[];
}

const Ressources: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  const specialties = [
    { id: 'all', name: 'Toutes les spécialités' },
    { id: 'orthophoniste', name: 'Orthophoniste' },
    { id: 'psychologue', name: 'Psychologue' },
    { id: 'psychomotricien', name: 'Psychomotricien' },
    { id: 'pediatre', name: 'Pédiatre' },
    { id: 'neurologue', name: 'Neurologue pédiatrique' },
  ];

  const professionals: Professional[] = [
    {
      id: '1',
      name: 'Dr. Marie Dubois',
      specialty: 'orthophoniste',
      address: '123 Rue de la Paix, 75001 Paris',
      phone: '01 23 45 67 89',
      email: 'marie.dubois@example.com',
      rating: 4.8,
      reviews: 127,
      waitingTime: '2-3 mois',
      acceptsNewPatients: true,
      coordinates: { lat: 48.8566, lng: 2.3522 },
      description: 'Spécialisée dans les troubles du langage et de la communication chez l\'enfant.',
      specialties: ['Troubles du langage', 'Bégaiement', 'Dyslexie'],
    },
    {
      id: '2',
      name: 'Dr. Jean Martin',
      specialty: 'psychologue',
      address: '456 Avenue des Champs, 75008 Paris',
      phone: '01 98 76 54 32',
      email: 'jean.martin@example.com',
      rating: 4.6,
      reviews: 89,
      waitingTime: '1-2 mois',
      acceptsNewPatients: true,
      coordinates: { lat: 48.8700, lng: 2.3100 },
      description: 'Psychologue spécialisé dans le développement de l\'enfant et les troubles du comportement.',
      specialties: ['Troubles du comportement', 'Autisme', 'TDAH'],
    },
    {
      id: '3',
      name: 'Sophie Bernard',
      specialty: 'psychomotricien',
      address: '789 Boulevard Saint-Germain, 75006 Paris',
      phone: '01 45 67 89 12',
      email: 'sophie.bernard@example.com',
      rating: 4.9,
      reviews: 156,
      waitingTime: '3-4 mois',
      acceptsNewPatients: false,
      coordinates: { lat: 48.8530, lng: 2.3499 },
      description: 'Psychomotricienne expérimentée dans la rééducation motrice et cognitive.',
      specialties: ['Motricité fine', 'Coordination', 'Équilibre'],
    },
  ];

  const faqItems = [
    {
      question: 'Comment obtenir un remboursement ?',
      answer: 'Les consultations peuvent être remboursées par la Sécurité sociale et les mutuelles. Renseignez-vous auprès de votre caisse d\'assurance maladie et de votre mutuelle pour connaître les conditions de remboursement.',
    },
    {
      question: 'Quels documents préparer pour la première consultation ?',
      answer: 'Préparez le carnet de santé de votre enfant, les résultats d\'évaluations précédentes, et une lettre de recommandation de votre pédiatre si possible.',
    },
    {
      question: 'Combien de temps dure une consultation ?',
      answer: 'La première consultation dure généralement 1h à 1h30. Les séances suivantes durent entre 30 minutes et 1h selon le spécialiste et le type de suivi.',
    },
    {
      question: 'Comment choisir le bon spécialiste ?',
      answer: 'Consultez les avis, vérifiez les spécialités, et n\'hésitez pas à appeler pour poser des questions. Une première consultation permet souvent de voir si le courant passe bien.',
    },
  ];

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
      default: return <PersonIcon />;
    }
  };

  const getSpecialtyColor = (specialty: string) => {
    switch (specialty) {
      case 'orthophoniste': return '#2196f3';
      case 'psychologue': return '#9c27b0';
      case 'psychomotricien': return '#4caf50';
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
              Carte interactive des professionnels de santé spécialisés dans le développement de l'enfant.
              Cliquez sur les marqueurs pour voir les détails.
            </Typography>
          </Alert>

          {/* Carte simulée */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ 
                width: '100%', 
                height: 400, 
                bgcolor: 'grey.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
                position: 'relative',
              }}>
                <MapIcon sx={{ fontSize: 60, color: 'grey.400' }} />
                <Typography variant="h6" color="text.secondary" sx={{ ml: 2 }}>
                  Carte interactive
                </Typography>
                
                {/* Marqueurs simulés */}
                {professionals.map((professional, index) => (
                  <Box
                    key={professional.id}
                    sx={{
                      position: 'absolute',
                      left: `${20 + index * 25}%`,
                      top: `${30 + (index % 2) * 20}%`,
                      width: 40,
                      height: 40,
                      bgcolor: getSpecialtyColor(professional.specialty),
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    {getSpecialtyIcon(professional.specialty)}
                  </Box>
                ))}
              </Box>
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

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      startIcon={<PhoneIcon />}
                      size="small"
                      variant="outlined"
                    >
                      Appeler
                    </Button>
                    <Button
                      startIcon={<EmailIcon />}
                      size="small"
                      variant="outlined"
                    >
                      Contacter
                    </Button>
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