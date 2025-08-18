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
import { ProfessionalSwissDatabase } from '../data/professionalSwissDatabase';
import { UltraMassiveSwissDatabase } from '../data/ultraMassiveSwissDatabase';
import MapSection from '../components/MapSection';

const Ressources: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedCanton, setSelectedCanton] = useState('all');
  const [acceptsNewOnly, setAcceptsNewOnly] = useState(false);

  // Utiliser la base de données ULTRA MASSIVE (390+ spécialistes GARANTIS - 15+ par canton)
  const specialties = ProfessionalSwissDatabase.getSpecialties();
  const cantons = ProfessionalSwissDatabase.getCantons();
  const allProfessionals = UltraMassiveSwissDatabase.getAllProfessionals();
  
  // Filtrage avancé
  let professionals = allProfessionals;
  
  if (selectedCanton !== 'all') {
    professionals = professionals.filter(p => p.cantonCode === selectedCanton);
  }
  
  if (selectedSpecialty !== 'all') {
    professionals = professionals.filter(p => p.specialty === selectedSpecialty);
  }
  
  if (acceptsNewOnly) {
    professionals = professionals.filter(p => p.acceptsNewPatients);
  }
  
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    professionals = professionals.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.institution.toLowerCase().includes(term) ||
      p.city.toLowerCase().includes(term) ||
      p.canton.toLowerCase().includes(term)
    );
  }
  
  // Statistiques de la base ultra massive
  const stats = UltraMassiveSwissDatabase.getStatistics();

  // Utiliser la FAQ suisse
  const faqItems = SwissHealthcareData.getSwissFAQ();

  // Calculer le nombre de professionnels par canton pour la carte
  const professionalCountsByCanton = allProfessionals.reduce((acc, professional) => {
    const canton = professional.cantonCode;
    acc[canton] = (acc[canton] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

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
      case 'physiotherapeute': return <PhysioIcon />;
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
      case 'physiotherapeute': return '#00bcd4';
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

          {/* Section carte interactive complète */}
          <MapSection
            professionals={professionals}
            stats={stats}
            selectedCanton={selectedCanton}
            setSelectedCanton={setSelectedCanton}
            professionalCountsByCanton={professionalCountsByCanton}
          />

          {/* Légende des spécialités */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', mb: 3 }}>
            <Chip icon={<PersonIcon />} label="Pédiatrie développement" color="error" variant="outlined" />
            <Chip icon={<SpeechIcon />} label="Logopédie (Orthophonie)" color="info" variant="outlined" />
            <Chip icon={<PsychologyIcon />} label="Psychologie infantile" color="secondary" variant="outlined" />
            <Chip icon={<HospitalIcon />} label="Neuropédiatrie" color="warning" variant="outlined" />
            <Chip icon={<PhysioIcon />} label="Physiothérapie" color="success" variant="outlined" />
          </Box>
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          {/* Statistiques professionnelles */}
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              🎯 Base de Données ULTRA MASSIVE Suisse - 15+ par Canton GARANTI
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Typography variant="body2">
                <strong>{stats.total}</strong> spécialistes certifiés
              </Typography>
              <Typography variant="body2">
                <strong>{stats.acceptingNew}</strong> acceptent nouveaux patients
              </Typography>
              <Typography variant="body2">
                <strong>{stats.emergency || 0}</strong> services d'urgence
              </Typography>
              <Typography variant="body2">
                <strong>✅ {stats.guaranteedMinimum}+</strong> par canton minimum
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', mt: 1 }}>
              <Typography variant="body2">
                <strong>📍 Régions:</strong> Romande ({stats.byRegion.romande}) • Alémanique ({stats.byRegion.alemanique}) • Italienne ({stats.byRegion.italienne})
              </Typography>
              <Typography variant="body2">
                <strong>🏥 Spécialités:</strong> {stats.bySpecialty.length} domaines couverts
              </Typography>
              <Typography variant="body2">
                <strong>🇨🇭 Cantons:</strong> Tous les {stats.cantons} cantons suisses (moyenne: {stats.averagePerCanton}/canton)
              </Typography>
            </Box>
          </Alert>

          {/* Filtres avancés */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Rechercher par nom, institution, ville..."
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

            <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              🌍 Filtrer par canton :
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              <Chip
                label="Tous"
                onClick={() => setSelectedCanton('all')}
                color={selectedCanton === 'all' ? 'primary' : 'default'}
                variant={selectedCanton === 'all' ? 'filled' : 'outlined'}
              />
              {cantons.slice(0, 10).map((canton) => (
                <Chip
                  key={canton.code}
                  label={canton.name}
                  onClick={() => setSelectedCanton(canton.code)}
                  color={selectedCanton === canton.code ? 'primary' : 'default'}
                  variant={selectedCanton === canton.code ? 'filled' : 'outlined'}
                />
              ))}
            </Box>

            <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              🏥 Filtrer par spécialité :
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              <Chip
                label="Toutes"
                onClick={() => setSelectedSpecialty('all')}
                color={selectedSpecialty === 'all' ? 'primary' : 'default'}
                variant={selectedSpecialty === 'all' ? 'filled' : 'outlined'}
              />
              {specialties.map((specialty) => (
                <Chip
                  key={specialty.code}
                  label={specialty.name}
                  onClick={() => setSelectedSpecialty(specialty.code)}
                  color={selectedSpecialty === specialty.code ? 'primary' : 'default'}
                  variant={selectedSpecialty === specialty.code ? 'filled' : 'outlined'}
                />
              ))}
            </Box>

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
                <ListItem sx={{ flexDirection: 'column', alignItems: 'stretch', py: 3 }}>
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
                          {professional.institution}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={professional.rating} readOnly size="small" />
                      <Typography variant="body2" color="text.secondary">
                        ({professional.reviews} avis)
                      </Typography>
                    </Box>
                  </Box>

                  {/* Spécialités */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {professional.specialties?.map((specialty, idx) => (
                      <Chip key={idx} label={specialty} size="small" variant="outlined" />
                    )) || []}
                  </Box>

                  {/* Informations de contact */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon color="action" />
                      <Typography variant="body2">{professional.address}, {professional.city}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TimeIcon color="action" />
                      <Typography variant="body2">Attente: {professional.waitingTime}</Typography>
                    </Box>
                  </Box>

                  {/* Institution et langues */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <HospitalIcon color="action" />
                      <Typography variant="body2" color="primary">
                        {professional.institution}
                      </Typography>
                      {professional.acceptsNewPatients && (
                        <Chip label="Accepte nouveaux patients" size="small" color="success" />
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LanguageIcon color="action" />
                      <Typography variant="body2">
                        {professional.languages?.join(', ') || 'Non spécifié'}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Assurances */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Assurances acceptées:
                    </Typography>
                    {professional.insuranceAccepted?.map((insurance, idx) => (
                      <Chip key={idx} label={insurance} size="small" variant="outlined" />
                    )) || []}
                  </Box>

                  {/* Actions */}
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      startIcon={<PhoneIcon />}
                      variant="outlined"
                      size="small"
                      href={`tel:${professional.phone}`}
                    >
                      {professional.phone}
                    </Button>
                    <Button
                      startIcon={<EmailIcon />}
                      variant="outlined"
                      size="small"
                      href={`mailto:${professional.email}`}
                    >
                      Email
                    </Button>
                    {professional.website && (
                      <Button
                        startIcon={<WebsiteIcon />}
                        variant="outlined"
                        size="small"
                        href={professional.website}
                        target="_blank"
                      >
                        Site web
                      </Button>
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
