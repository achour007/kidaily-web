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
  RecordVoiceOver as SpeechIcon,
} from '@mui/icons-material';

const Ressources: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCanton, setSelectedCanton] = useState('all');

  const mockProfessionals = useMemo(() => [
    {
      id: 'ge-hug-001',
      name: 'Dr. Marie Dubois',
      specialty: 'Pédiatrie',
      cantonCode: 'ge',
      canton: 'Genève',
      city: 'Genève',
      institution: 'HUG - Hôpital Universitaire de Genève',
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
    }
  ], []);

  const filteredProfessionals = useMemo(() => {
    return mockProfessionals.filter(professional => {
      const matchesSearch = professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           professional.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           professional.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCanton = selectedCanton === 'all' || professional.cantonCode === selectedCanton;
      
      return matchesSearch && matchesCanton;
    });
  }, [mockProfessionals, searchTerm, selectedCanton]);

  const stats = {
    totalProfessionals: 390,
    cantonsCovered: 26,
    specialtiesAvailable: 12,
    avgPerCanton: 15
  };

  const cantons = [
    { code: 'ge', name: 'Genève' },
    { code: 'vd', name: 'Vaud' },
    { code: 'zh', name: 'Zurich' },
    { code: 'be', name: 'Berne' }
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', mb: 3 }}>
        Ressources Médicales Suisses
      </Typography>

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
        </Grid>
      </Paper>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="Ressources médicales">
          <Tab label="PROFESSIONNELS" />
          <Tab label="CARTE INTERACTIVE" />
          <Tab label="FAQ & AIDE" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Box>
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
            </Grid>
          </Paper>

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
        </Box>
      )}
    </Box>
  );
};

export default Ressources;