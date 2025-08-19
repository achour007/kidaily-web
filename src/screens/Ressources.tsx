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
  useTheme,
  useMediaQuery,
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
import InteractiveMap from '../components/InteractiveMap';
import { GenevaDatabase } from '../data/GenevaDatabase';

const Ressources: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCanton, setSelectedCanton] = useState('ge'); // Par défaut Genève

  // Utiliser la vraie base de données Genève
  const allProfessionals = useMemo(() => GenevaDatabase.getAllProfessionals(), []);
  const genevaStats = useMemo(() => GenevaDatabase.getStatistics(), []);

  // Filtrage des professionnels
  const filteredProfessionals = useMemo(() => {
    return allProfessionals.filter(professional => {
      const matchesSearch = professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           professional.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           professional.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCanton = selectedCanton === 'all' || professional.cantonCode === selectedCanton;
      
      return matchesSearch && matchesCanton;
    });
  }, [allProfessionals, searchTerm, selectedCanton]);

  // Statistiques mises à jour
  const stats = {
    totalProfessionals: genevaStats.totalProfessionals,
    cantonsCovered: 1, // Pour l\'instant seulement Genève
    specialtiesAvailable: genevaStats.specialtiesAvailable,
    avgPerCanton: genevaStats.totalProfessionals
  };

  // Cantons disponibles (pour l\'instant seulement Genève)
  const cantons = [
    { code: 'ge', name: 'Genève' }
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      <Typography variant={isMobile ? "h5" : "h4"} gutterBottom sx={{ color: '#1976d2', mb: 3 }}>
        Ressources Médicales Suisses - Genève
      </Typography>

      {/* Statistiques générales - Mises à jour */}
      <Paper elevation={2} sx={{ p: isMobile ? 2 : 3, mb: 3, bgcolor: '#f8f9fa' }}>
        <Typography variant="h6" gutterBottom>
          📊 Aperçu des Ressources - Canton de Genève
        </Typography>
        <Grid container spacing={isMobile ? 1 : 2}>
          <Grid item xs={6} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: isMobile ? 1 : 2 }}>
              <Typography variant={isMobile ? "h5" : "h4"} color="primary">
                {stats.totalProfessionals}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Professionnels
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: isMobile ? 1 : 2 }}>
              <Typography variant={isMobile ? "h5" : "h4"} color="secondary">
                {stats.cantonsCovered}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Canton couvert
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: isMobile ? 1 : 2 }}>
              <Typography variant={isMobile ? "h5" : "h4"} color="success.main">
                {stats.specialtiesAvailable}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Spécialités
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: isMobile ? 1 : 2 }}>
              <Typography variant={isMobile ? "h5" : "h4"} color="warning.main">
                {genevaStats.acceptsNewPatients}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Nouveaux patients
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Onglets */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          aria-label="Ressources médicales"
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : false}
        >
          <Tab label="PROFESSIONNELS" />
          <Tab label="CARTE INTERACTIVE" />
          <Tab label="FAQ & AIDE" />
        </Tabs>
      </Box>

      {/* Contenu des onglets */}
      {activeTab === 0 && (
        <Box>
          {/* Filtres */}
          <Paper elevation={1} sx={{ p: isMobile ? 1.5 : 2, mb: 3 }}>
            <Grid container spacing={isMobile ? 1.5 : 2} alignItems="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Rechercher un professionnel..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size={isMobile ? "small" : "medium"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth size={isMobile ? "small" : "medium"}>
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

          {/* Liste des professionnels */}
          <Grid container spacing={isMobile ? 2 : 3}>
            {filteredProfessionals.map((professional) => (
              <Grid item xs={12} sm={6} lg={4} key={professional.id}>
                <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1, p: isMobile ? 1.5 : 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: isMobile ? 40 : 48, height: isMobile ? 40 : 48 }}>
                        <MedicalIcon />
                      </Avatar>
                      <Box>
                        <Typography variant={isMobile ? "h6" : "h6"} gutterBottom>
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
                        size={isMobile ? "small" : "small"}
                        sx={{ mb: 1, mr: 1 }}
                      />
                      <Chip
                        icon={<StarIcon />}
                        label={`${professional.rating} (${professional.reviews})`}
                        size={isMobile ? "small" : "small"}
                        color="warning"
                        sx={{ mb: 1, mr: 1 }}
                      />
                      <Chip
                        label={professional.acceptsNewPatients ? 'Nouveaux patients' : 'Liste d\'attente'}
                        size={isMobile ? "small" : "small"}
                        color={professional.acceptsNewPatients ? 'success' : 'warning'}
                        sx={{ mb: 1 }}
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {professional.specialty} - {professional.institution}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Institution:</strong> {professional.institution}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Disponibilité:</strong> {professional.availability || 'Non spécifié'}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Langues:</strong> {professional.languages ? professional.languages.join(', ') : 'Non spécifié'}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      {professional.insurance && professional.insurance.map((insurance) => (
                        <Chip
                          key={insurance}
                          label={insurance}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: isMobile ? 1.5 : 2, pt: 0 }}>
                    <Button
                      size={isMobile ? "small" : "small"}
                      startIcon={<PhoneIcon />}
                      onClick={() => window.open(`tel:${professional.phone}`)}
                      fullWidth={isSmallMobile}
                    >
                      Appeler
                    </Button>
                    <Button
                      size={isMobile ? "small" : "small"}
                      startIcon={<EmailIcon />}
                      onClick={() => window.open(`mailto:${professional.email}`)}
                      fullWidth={isSmallMobile}
                    >
                      Email
                    </Button>
                    <Button
                      size={isMobile ? "small" : "small"}
                      startIcon={<SpeechIcon />}
                      onClick={() => window.open(professional.website, '_blank')}
                      fullWidth={isSmallMobile}
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
        <InteractiveMap
          professionals={allProfessionals}
          selectedCanton={selectedCanton}
          setSelectedCanton={setSelectedCanton}
        />
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