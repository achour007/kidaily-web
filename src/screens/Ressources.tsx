import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  TextField,
  InputAdornment,
  Grid,
  Avatar,
  Rating,
  Button,
  Alert,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CardActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  MedicalServices as MedicalIcon,
  Star as StarIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  AccessTime as AccessTimeIcon,
  RecordVoiceOver as SpeechIcon,
} from '@mui/icons-material';

interface ComprehensiveProfessional {
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
  phone: string;
  email: string;
  website: string;
  description: string;
  languages: string[];
  insuranceAccepted: string[];
  openingHours: string;
  emergencyContact: boolean;
}

const Ressources: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCanton, setSelectedCanton] = useState('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  // Données simulées pour les professionnels
  const mockProfessionals = useMemo(() => [
    {
      id: 'ge-hug-001',
      name: 'Dr. Marie Dubois',
      specialty: 'Pédiatrie',
      cantonCode: 'ge',
      canton: 'Genève',
      city: 'Genève',
      institution: 'HUG - Hôpital Universitaire de Genève',
      coordinates: { lat: 46.2044, lng: 6.1432 },
      acceptsNewPatients: true,
      rating: 4.8,
      reviews: 127,
      phone: '+41 22 372 33 11',
      email: 'marie.dubois@hug.ch',
      website: 'https://www.hug.ch',
      description: 'Pédiatre spécialisée en développement de l\'enfant',
      languages: ['Français', 'Anglais'],
      insuranceAccepted: ['CSS', 'Swica', 'Concordia'],
      openingHours: 'Lun-Ven: 8h-18h',
      emergencyContact: true
    },
    {
      id: 'vd-chuv-001',
      name: 'Dr. Pierre Martin',
      specialty: 'Orthopédie',
      cantonCode: 'vd',
      canton: 'Vaud',
      city: 'Lausanne',
      institution: 'CHUV - Centre Hospitalier Universitaire Vaudois',
      coordinates: { lat: 46.5197, lng: 6.6323 },
      acceptsNewPatients: false,
      rating: 4.6,
      reviews: 89,
      phone: '+41 21 314 11 11',
      email: 'pierre.martin@chuv.ch',
      website: 'https://www.chuv.ch',
      description: 'Orthopédiste spécialisé en traumatologie pédiatrique',
      languages: ['Français', 'Allemand'],
      insuranceAccepted: ['CSS', 'Swica', 'Concordia'],
      openingHours: 'Lun-Ven: 9h-17h',
      emergencyContact: true
    },
    {
      id: 'zh-usz-001',
      name: 'Dr. Anna Schmidt',
      specialty: 'Neurologie',
      cantonCode: 'zh',
      canton: 'Zurich',
      city: 'Zurich',
      institution: 'USZ - Universitätsspital Zürich',
      coordinates: { lat: 47.3769, lng: 8.5417 },
      acceptsNewPatients: true,
      rating: 4.9,
      reviews: 156,
      phone: '+41 44 255 11 11',
      email: 'anna.schmidt@usz.ch',
      website: 'https://www.usz.ch',
      description: 'Neurologue pédiatrique spécialisée en troubles du développement',
      languages: ['Allemand', 'Anglais', 'Français'],
      insuranceAccepted: ['CSS', 'Swica', 'Concordia'],
      openingHours: 'Lun-Ven: 8h-17h',
      emergencyContact: true
    },
    {
      id: 'be-insel-001',
      name: 'Dr. Hans Müller',
      specialty: 'Cardiologie',
      cantonCode: 'be',
      canton: 'Berne',
      city: 'Berne',
      institution: 'Inselspital Bern',
      coordinates: { lat: 46.9479, lng: 7.4474 },
      acceptsNewPatients: true,
      rating: 4.7,
      reviews: 98,
      phone: '+41 31 632 21 11',
      email: 'hans.mueller@insel.ch',
      website: 'https://www.insel.ch',
      description: 'Cardiologue pédiatrique spécialisé en cardiopathies congénitales',
      languages: ['Allemand', 'Français', 'Anglais'],
      insuranceAccepted: ['CSS', 'Swica', 'Concordia'],
      openingHours: 'Lun-Ven: 8h-18h',
      emergencyContact: true
    }
  ], []);

  // Filtrage des professionnels
  const filteredProfessionals = useMemo(() => {
    return mockProfessionals.filter(professional => {
      const matchesSearch = professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           professional.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           professional.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCanton = selectedCanton === 'all' || professional.cantonCode === selectedCanton;
      const matchesSpecialty = selectedSpecialty === 'all' || professional.specialty === selectedSpecialty;
      
      return matchesSearch && matchesCanton && matchesSpecialty;
    });
  }, [mockProfessionals, searchTerm, selectedCanton, selectedSpecialty]);

  // Statistiques
  const stats = {
    totalProfessionals: 390,
    cantonsCovered: 26,
    specialtiesAvailable: 12,
    avgPerCanton: 15
  };

  // Comptage par canton
  const professionalCountsByCanton = useMemo(() => {
    const counts: { [key: string]: number } = {};
    mockProfessionals.forEach(professional => {
      counts[professional.cantonCode] = (counts[professional.cantonCode] || 0) + 1;
    });
    return counts;
  }, [mockProfessionals]);

  // Cantons disponibles
  const cantons = [
    { code: 'ge', name: 'Genève' },
    { code: 'vd', name: 'Vaud' },
    { code: 'zh', name: 'Zurich' },
    { code: 'be', name: 'Berne' },
    { code: 'fr', name: 'Fribourg' },
    { code: 'ag', name: 'Argovie' },
    { code: 'bl', name: 'Bâle-Campagne' },
    { code: 'bs', name: 'Bâle-Ville' },
    { code: 'gr', name: 'Grisons' },
    { code: 'ju', name: 'Jura' },
    { code: 'lu', name: 'Lucerne' },
    { code: 'ne', name: 'Neuchâtel' },
    { code: 'sg', name: 'Saint-Gall' },
    { code: 'sh', name: 'Schaffhouse' },
    { code: 'so', name: 'Soleure' },
    { code: 'ti', name: 'Tessin' },
    { code: 'tg', name: 'Thurgovie' },
    { code: 'vs', name: 'Valais' },
    { code: 'zg', name: 'Zoug' },
    { code: 'ar', name: 'Appenzell Rhodes-Extérieures' },
    { code: 'ai', name: 'Appenzell Rhodes-Intérieures' },
    { code: 'gl', name: 'Glaris' },
    { code: 'nw', name: 'Nidwald' },
    { code: 'ow', name: 'Obwald' },
    { code: 'sz', name: 'Schwytz' },
    { code: 'ur', name: 'Uri' }
  ];

  // Spécialités disponibles
  const specialties = [
    { id: 'pediatrie', name: 'Pédiatrie', count: 45 },
    { id: 'orthopedie', name: 'Orthopédie', count: 38 },
    { id: 'neurologie', name: 'Neurologie', count: 32 },
    { id: 'cardiologie', name: 'Cardiologie', count: 28 },
    { id: 'dermatologie', name: 'Dermatologie', count: 25 },
    { id: 'ophtalmologie', name: 'Ophtalmologie', count: 22 },
    { id: 'psychiatrie', name: 'Psychiatrie', count: 35 },
    { id: 'chirurgie', name: 'Chirurgie', count: 30 },
    { id: 'rehabilitation', name: 'Rééducation', count: 20 },
    { id: 'nutrition', name: 'Nutrition', count: 18 },
    { id: 'allergologie', name: 'Allergologie', count: 15 },
    { id: 'endocrinologie', name: 'Endocrinologie', count: 12 }
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', mb: 3 }}>
        Ressources Médicales Suisses
      </Typography>

      {/* Statistiques générales */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: '#f8f9fa' }}>
        <Typography variant="h6" gutterBottom>
          📊 Aperçu des Ressources
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" color="primary">
                {stats.totalProfessionals}+
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Professionnels
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" color="secondary">
                {stats.cantonsCovered}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Cantons couverts
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" color="success.main">
                {stats.specialtiesAvailable}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Spécialités
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h4" color="warning.main">
                {stats.avgPerCanton}+
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Par canton
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Onglets */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="Ressources médicales">
          <Tab label="PROFESSIONNELS" />
          <Tab label="CARTE INTERACTIVE" />
          <Tab label="FAQ & AIDE" />
        </Tabs>
      </Box>

      {/* Contenu des onglets */}
      {activeTab === 0 && (
        <Box>
          {/* Filtres */}
          <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Rechercher un professionnel..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Canton</InputLabel>
                  <Select
                    value={selectedCanton}
                    onChange={(e) => setSelectedCanton(e.target.value)}
                    label="Canton"
                  >
                    <MenuItem value="all">Tous les cantons</MenuItem>
                    {cantons.map((canton) => (
                      <MenuItem key={canton.code} value={canton.code}>
                        {canton.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Spécialité</InputLabel>
                  <Select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    label="Spécialité"
                  >
                    <MenuItem value="all">Toutes les spécialités</MenuItem>
                    {specialties.map((specialty) => (
                      <MenuItem key={specialty.id} value={specialty.name}>
                        {specialty.name} ({specialty.count})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Liste des professionnels */}
          <Grid container spacing={3}>
            {filteredProfessionals.map((professional) => (
              <Grid item xs={12} md={6} lg={4} key={professional.id}>
                <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                        <MedicalIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {professional.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {professional.specialty}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Chip
                        icon={<LocationIcon />}
                        label={`${professional.city}, ${professional.canton}`}
                        size="small"
                        sx={{ mb: 1, mr: 1 }}
                      />
                      <Chip
                        icon={<StarIcon />}
                        label={`${professional.rating} (${professional.reviews})`}
                        size="small"
                        color="warning"
                        sx={{ mb: 1, mr: 1 }}
                      />
                      <Chip
                        label={professional.acceptsNewPatients ? 'Nouveaux patients' : 'Liste d\'attente'}
                        size="small"
                        color={professional.acceptsNewPatients ? 'success' : 'warning'}
                        sx={{ mb: 1 }}
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {professional.description}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Institution:</strong> {professional.institution}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Horaires:</strong> {professional.openingHours}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Langues:</strong> {professional.languages.join(', ')}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      {professional.insuranceAccepted.map((insurance) => (
                        <Chip
                          key={insurance}
                          label={insurance}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      size="small"
                      startIcon={<PhoneIcon />}
                      onClick={() => window.open(`tel:${professional.phone}`)}
                    >
                      Appeler
                    </Button>
                    <Button
                      size="small"
                      startIcon={<EmailIcon />}
                      onClick={() => window.open(`mailto:${professional.email}`)}
                    >
                      Email
                    </Button>
                    <Button
                      size="small"
                      startIcon={<SpeechIcon />}
                      onClick={() => window.open(professional.website, '_blank')}
                    >
                      Site web
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {filteredProfessionals.length === 0 && (
            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body1">
                Aucun professionnel trouvé avec les critères sélectionnés.
                Essayez de modifier vos filtres de recherche.
              </Typography>
            </Alert>
          )}
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body1">
              🗺️ <strong>Carte Interactive en Développement</strong><br />
              La carte interactive avec géolocalisation des professionnels sera bientôt disponible.
              Elle permettra de visualiser tous les professionnels sur une carte de la Suisse.
            </Typography>
          </Alert>

          <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              🚧 Fonctionnalité en Cours de Développement
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Notre équipe travaille actuellement sur l\'implémentation d\'une carte interactive
              qui affichera tous les professionnels de santé avec leur géolocalisation précise.
            </Typography>
          </Paper>
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            ❓ Questions Fréquemment Posées
          </Typography>

          <Accordion>
            <AccordionSummary expandIcon={<Typography>+</Typography>}>
              <Typography variant="h6">Comment prendre rendez-vous avec un professionnel ?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Pour prendre rendez-vous, contactez directement le professionnel par téléphone ou email.
                Certains acceptent les réservations en ligne via leur site web.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<Typography>+</Typography>}>
              <Typography variant="h6">Quels sont les délais d\'attente ?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Les délais varient selon la spécialité et la région. Pour les urgences,
                contactez directement l\'hôpital ou appelez le 144.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<Typography>+</Typography>}>
              <Typography variant="h6">Comment savoir si un professionnel accepte ma caisse maladie ?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Chaque professionnel affiche les caisses maladie acceptées.
                Vous pouvez également contacter directement votre caisse maladie pour vérifier.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<Typography>+</Typography>}>
              <Typography variant="h6">Que faire en cas d\'urgence ?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                En cas d\'urgence, appelez immédiatement le 144 (ambulance) ou le 117 (police).
                Rendez-vous aux urgences de l\'hôpital le plus proche.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<Typography>+</Typography>}>
              <Typography variant="h6">Comment trouver un professionnel parlant ma langue ?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Utilisez les filtres de recherche pour trouver des professionnels parlant votre langue.
                La plupart des professionnels parlent plusieurs langues.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>
  );
};

export default Ressources;
