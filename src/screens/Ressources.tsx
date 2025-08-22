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
  SelectChangeEvent,
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
import { SimplePediatricService } from '../services/simplePediatricService';

const Ressources: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCanton, setSelectedCanton] = useState('GE'); // Par défaut Genève

  // Utiliser le service pédiatrique simplifié
  const allProfessionals = useMemo(() => SimplePediatricService.getAllProfessionals(), []);
  const pediatricStats = useMemo(() => SimplePediatricService.getStats(), []);

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

  // Statistiques mises à jour pour le développement infantile
  const stats = {
    totalProfessionals: pediatricStats.totalProfessionals,
    cantonsCovered: pediatricStats.cantonsCovered,
    specialtiesAvailable: pediatricStats.specialtiesAvailable,
    avgPerCanton: Math.round(pediatricStats.totalProfessionals / pediatricStats.cantonsCovered)
  };

  // Cantons disponibles (toute la Suisse) - Codes en MAJUSCULES pour correspondre aux données
  const cantons = [
    { code: 'all', name: 'Toute la Suisse' },
    { code: 'GE', name: 'Genève' },
    { code: 'VD', name: 'Vaud' },
    { code: 'FR', name: 'Fribourg' },
    { code: 'JU', name: 'Jura' },
    { code: 'NE', name: 'Neuchâtel' },
    { code: 'VS', name: 'Valais' },
    { code: 'ZH', name: 'Zurich' },
    { code: 'BE', name: 'Berne' },
    { code: 'AG', name: 'Argovie' },
    { code: 'BL', name: 'Bâle-Campagne' },
    { code: 'BS', name: 'Bâle-Ville' },
    { code: 'LU', name: 'Lucerne' },
    { code: 'SG', name: 'Saint-Gall' },
    { code: 'SH', name: 'Schaffhouse' },
    { code: 'SO', name: 'Soleure' },
    { code: 'TG', name: 'Thurgovie' },
    { code: 'ZG', name: 'Zoug' },
    { code: 'AR', name: 'Appenzell Rhodes-Extérieures' },
    { code: 'AI', name: 'Appenzell Rhodes-Intérieures' },
    { code: 'GL', name: 'Glaris' },
    { code: 'NW', name: 'Nidwald' },
    { code: 'OW', name: 'Obwald' },
    { code: 'SZ', name: 'Schwytz' },
    { code: 'UR', name: 'Uri' },
    { code: 'TI', name: 'Tessin' },
    { code: 'GR', name: 'Grisons' }
  ];

  // Spécialités pédiatriques disponibles
  const specialties = [
    { code: 'all', name: 'Toutes les spécialités' },
    { code: 'ped', name: 'Pédiatrie' },
    { code: 'neu', name: 'Neuropédiatrie' },
    { code: 'ort', name: 'Orthophonie' },
    { code: 'psy', name: 'Psychologie infantile' },
    { code: 'erg', name: 'Ergothérapie pédiatrique' },
    { code: 'phy', name: 'Physiothérapie pédiatrique' }
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleCantonChange = (event: SelectChangeEvent<string>) => {
    setSelectedCanton(event.target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box sx={{ p: isMobile ? 2 : 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
        🏥 Ressources Pédiatriques - Développement Infantile
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        Trouvez les professionnels spécialisés dans le développement de votre enfant. 
        Tous nos spécialistes sont formés exclusivement pour accompagner les enfants de 0 à 18 ans.
      </Typography>

      {/* Statistiques générales */}
      <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'primary.light', color: 'white' }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold">
                {stats.totalProfessionals}
              </Typography>
              <Typography variant="body2">
                Spécialistes Pédiatriques
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold">
                {stats.cantonsCovered}
              </Typography>
              <Typography variant="body2">
                Cantons Couverts
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold">
                {stats.specialtiesAvailable}
              </Typography>
              <Typography variant="body2">
                Spécialités Pédiatriques
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold">
                {stats.avgPerCanton}
              </Typography>
              <Typography variant="body2">
                Moyenne par Canton
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Onglets */}
      <Paper elevation={2} sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          variant={isMobile ? "scrollable" : "fullWidth"}
          scrollButtons={isMobile ? "auto" : false}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="📋 Liste des Professionnels" />
          <Tab label="🗺️ Carte Interactive" />
          <Tab label="❓ Questions Fréquentes" />
        </Tabs>
      </Paper>

      {/* Contenu des onglets */}
      {activeTab === 0 && (
        <Box>
          {/* Filtres de recherche */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  placeholder="Rechercher un professionnel, spécialité, ville..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Canton</InputLabel>
                  <Select
                    value={selectedCanton}
                    onChange={handleCantonChange}
                    label="Canton"
                  >
                    {cantons.map((canton) => (
                      <MenuItem key={canton.code} value={canton.code}>
                        {canton.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth>
                  <InputLabel>Spécialité</InputLabel>
                  <Select
                    value="all"
                    label="Spécialité"
                  >
                    {specialties.map((specialty) => (
                      <MenuItem key={specialty.code} value={specialty.code}>
                        {specialty.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>

          {/* Informations sur le canton sélectionné */}
          {selectedCanton !== 'all' && (
            <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'secondary.light' }}>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <LocationIcon color="primary" />
                <Typography variant="h6">
                  Canton sélectionné: {cantons.find(c => c.code === selectedCanton)?.name}
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Chip 
                    label={`${filteredProfessionals.length} professionnels trouvés`}
                    color="primary"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Chip 
                    label="Spécialisés 0-18 ans"
                    color="secondary"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Chip 
                    label="Développement infantile"
                    color="success"
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </Paper>
          )}

          {/* Liste des professionnels */}
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            Professionnels disponibles:
          </Typography>

          <Grid container spacing={3}>
            {filteredProfessionals.map((professional) => (
              <Grid item xs={12} sm={6} lg={4} key={professional.id}>
                <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <MedicalIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight="bold">
                          {professional.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {professional.specialty} - {professional.canton}
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <LocationIcon color="action" fontSize="small" />
                      <Typography variant="body2">
                        {professional.city}, {professional.canton}
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center" mb={2}>
                      <StarIcon sx={{ color: '#ffc107', mr: 0.5 }} />
                      <Typography variant="body2">
                        {professional.rating} ({professional.reviews} avis)
                      </Typography>
                    </Box>

                    <Typography variant="body2" gutterBottom>
                      {professional.institution}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Institution:</strong> {professional.institution}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Disponibilité:</strong> {professional.availability}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Langues:</strong> {professional.languages.join(', ')}
                      </Typography>
                    </Box>

                    {/* Groupes d'âge et domaines de développement */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        <strong>Groupes d'âge:</strong> {professional.ageGroups.join(', ')}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        <strong>Domaines:</strong> {professional.developmentalAreas.slice(0, 3).join(', ')}...
                      </Typography>
                    </Box>

                    {/* Assurance */}
                    <Box sx={{ mb: 2 }}>
                      {professional.insurance.map((ins) => (
                        <Chip 
                          key={ins} 
                          label={ins} 
                          size="small" 
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </Box>

                    {professional.acceptsNewPatients && (
                      <Chip 
                        label="Nouveaux patients" 
                        color="success" 
                        size="small"
                        sx={{ mb: 2 }}
                      />
                    )}
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                    <Button
                      size="small"
                      startIcon={<PhoneIcon />}
                      onClick={() => window.open(`tel:${professional.phone}`)}
                      fullWidth={isSmallMobile}
                    >
                      Appeler
                    </Button>
                    <Button
                      size="small"
                      startIcon={<EmailIcon />}
                      onClick={() => window.open(`mailto:${professional.email}`)}
                      fullWidth={isSmallMobile}
                    >
                      Email
                    </Button>
                    <Button
                      size="small"
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
                Aucun professionnel pédiatrique trouvé avec les critères sélectionnés.
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
              <Typography variant="h6">Comment prendre rendez-vous avec un professionnel pédiatrique ?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Pour prendre rendez-vous, contactez directement le professionnel par téléphone ou email.
                Tous nos spécialistes sont formés exclusivement pour accompagner les enfants de 0 à 18 ans.
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion>
            <AccordionSummary expandIcon={<Typography>+</Typography>}>
              <Typography variant="h6">Quels sont les délais d'attente pour les spécialistes pédiatriques ?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Les délais varient selon la spécialité et la région. Pour les urgences pédiatriques,
                contactez directement l'hôpital ou appelez le 144.
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
              <Typography variant="h6">Que faire en cas d'urgence pédiatrique ?</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                En cas d'urgence pédiatrique, appelez immédiatement le 144 (ambulance) ou le 117 (police).
                Rendez-vous aux urgences pédiatriques de l'hôpital le plus proche.
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
                La plupart des professionnels pédiatriques parlent plusieurs langues.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>
  );
};

export default Ressources;