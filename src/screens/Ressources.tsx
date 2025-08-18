import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Star as StarIcon,
  Map as MapIcon,
  Info as InfoIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import RealMapSection from '../components/RealMapSection';

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
  phone?: string;
  email?: string;
  website?: string;
  description?: string;
  languages?: string[];
  insurance?: string[];
  availability?: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const Ressources: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCanton, setSelectedCanton] = useState('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [professionals, setProfessionals] = useState<ComprehensiveProfessional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<ComprehensiveProfessional[]>([]);
  const [selectedProfessional, setSelectedProfessional] = useState<ComprehensiveProfessional | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const cantons = useMemo(() => [
    { code: 'ge', name: 'Genève', region: 'Suisse romande' },
    { code: 'vd', name: 'Vaud', region: 'Suisse romande' },
    { code: 'zh', name: 'Zurich', region: 'Suisse alémanique' },
    { code: 'be', name: 'Berne', region: 'Suisse alémanique' },
    { code: 'fr', name: 'Fribourg', region: 'Suisse romande' },
    { code: 'ag', name: 'Argovie', region: 'Suisse alémanique' },
    { code: 'bl', name: 'Bâle-Campagne', region: 'Suisse alémanique' },
    { code: 'bs', name: 'Bâle-Ville', region: 'Suisse alémanique' },
    { code: 'gr', name: 'Grisons', region: 'Suisse alémanique' },
    { code: 'ju', name: 'Jura', region: 'Suisse romande' },
    { code: 'lu', name: 'Lucerne', region: 'Suisse alémanique' },
    { code: 'ne', name: 'Neuchâtel', region: 'Suisse romande' },
    { code: 'sg', name: 'Saint-Gall', region: 'Suisse alémanique' },
    { code: 'sh', name: 'Schaffhouse', region: 'Suisse alémanique' },
    { code: 'so', name: 'Soleure', region: 'Suisse alémanique' },
    { code: 'ti', name: 'Tessin', region: 'Suisse italienne' },
    { code: 'tg', name: 'Thurgovie', region: 'Suisse alémanique' },
    { code: 'vs', name: 'Valais', region: 'Suisse romande' },
    { code: 'zg', name: 'Zoug', region: 'Suisse alémanique' },
    { code: 'ar', name: 'Appenzell Rhodes-Extérieures', region: 'Suisse alémanique' },
    { code: 'ai', name: 'Appenzell Rhodes-Intérieures', region: 'Suisse alémanique' },
    { code: 'gl', name: 'Glaris', region: 'Suisse alémanique' },
    { code: 'nw', name: 'Nidwald', region: 'Suisse alémanique' },
    { code: 'ow', name: 'Obwald', region: 'Suisse alémanique' },
    { code: 'sz', name: 'Schwytz', region: 'Suisse alémanique' },
    { code: 'ur', name: 'Uri', region: 'Suisse alémanique' }
  ], []);

  const specialties = useMemo(() => [
    { id: 'pediatrician', name: 'Pédiatre', description: 'Médecin spécialisé dans les soins aux enfants' },
    { id: 'psychologist', name: 'Psychologue', description: 'Spécialiste de la santé mentale et du comportement' },
    { id: 'speech-therapist', name: 'Orthophoniste', description: 'Thérapeute des troubles du langage et de la communication' },
    { id: 'occupational-therapist', name: 'Ergothérapeute', description: 'Spécialiste de la réadaptation fonctionnelle' },
    { id: 'physiotherapist', name: 'Physiothérapeute', description: 'Thérapeute des troubles musculo-squelettiques' },
    { id: 'psychomotor-therapist', name: 'Psychomotricien', description: 'Spécialiste du développement psychomoteur' },
    { id: 'nutritionist', name: 'Nutritionniste', description: 'Expert en alimentation et nutrition' },
    { id: 'dentist', name: 'Dentiste', description: 'Spécialiste de la santé bucco-dentaire' },
    { id: 'ophthalmologist', name: 'Ophtalmologue', description: 'Médecin spécialisé dans les yeux et la vision' },
    { id: 'neurologist', name: 'Neurologue', description: 'Spécialiste du système nerveux' },
    { id: 'cardiologist', name: 'Cardiologue', description: 'Médecin spécialisé dans le cœur' },
    { id: 'dermatologist', name: 'Dermatologue', description: 'Spécialiste de la peau' }
  ], []);

  const stats = useMemo(() => ({
    totalProfessionals: 390,
    cantonsCovered: 26,
    specialtiesAvailable: 12,
    avgPerCanton: 15
  }), []);

  const mockProfessionals = useMemo(() => [
    {
      id: 'ge-001', name: 'Dr. Marie Dubois', specialty: 'Pédiatre', cantonCode: 'ge', canton: 'Genève', city: 'Genève', institution: 'HUG - Hôpital Universitaire de Genève', coordinates: { lat: 46.2044, lng: 6.1432 }, acceptsNewPatients: true, rating: 4.8, reviews: 127, phone: '+41 22 372 33 11', email: 'marie.dubois@hug.ch', website: 'https://www.hug.ch', description: 'Pédiatre spécialisée dans le développement de l\'enfant', languages: ['Français', 'Anglais'], insurance: ['LAMal', 'Swisscare'], availability: 'Lun-Ven 8h-18h'
    },
    {
      id: 'ge-002', name: 'Dr. Jean-Luc Martin', specialty: 'Psychologue', cantonCode: 'ge', canton: 'Genève', city: 'Genève', institution: 'Centre Médical de Genève', coordinates: { lat: 46.2044, lng: 6.1432 }, acceptsNewPatients: false, rating: 4.6, reviews: 89, phone: '+41 22 789 45 67', email: 'jl.martin@cmg.ch', website: 'https://www.cmg.ch', description: 'Psychologue spécialisé dans les troubles du comportement', languages: ['Français', 'Allemand'], insurance: ['LAMal'], availability: 'Mar-Sam 9h-17h'
    },
    {
      id: 'vd-001', name: 'Dr. Sophie Laurent', specialty: 'Orthophoniste', cantonCode: 'vd', canton: 'Vaud', city: 'Lausanne', institution: 'CHUV - Centre Hospitalier Universitaire Vaudois', coordinates: { lat: 46.5197, lng: 6.6323 }, acceptsNewPatients: true, rating: 4.9, reviews: 156, phone: '+41 21 314 11 11', email: 'sophie.laurent@chuv.ch', website: 'https://www.chuv.ch', description: 'Orthophoniste expérimentée dans les troubles du langage', languages: ['Français', 'Anglais', 'Italien'], insurance: ['LAMal', 'Swisscare'], availability: 'Lun-Ven 7h30-19h'
    },
    {
      id: 'zh-001', name: 'Dr. Hans Mueller', specialty: 'Pédiatre', cantonCode: 'zh', canton: 'Zurich', city: 'Zurich', institution: 'Universitäts-Kinderspital Zürich', coordinates: { lat: 47.3769, lng: 8.5417 }, acceptsNewPatients: true, rating: 4.7, reviews: 203, phone: '+41 44 266 71 11', email: 'hans.mueller@kispi.uzh.ch', website: 'https://www.kispi.uzh.ch', description: 'Pédiatre spécialisé dans la néonatologie', languages: ['Allemand', 'Anglais'], insurance: ['LAMal', 'Swisscare'], availability: 'Lun-Dim 24h/24'
    }
  ], []);

  const filterProfessionals = useCallback(() => {
    let filtered = professionals;

    if (searchTerm) {
      filtered = filtered.filter(prof =>
        prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.institution.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCanton !== 'all') {
      filtered = filtered.filter(prof => prof.cantonCode === selectedCanton);
    }

    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter(prof => prof.specialty === selectedSpecialty);
    }

    setFilteredProfessionals(filtered);
  }, [searchTerm, selectedCanton, selectedSpecialty, professionals]);

  useEffect(() => {
    setProfessionals(mockProfessionals);
    setFilteredProfessionals(mockProfessionals);
  }, [mockProfessionals]);

  useEffect(() => {
    filterProfessionals();
  }, [filterProfessionals]);

  const handleProfessionalClick = (professional: ComprehensiveProfessional) => {
    setSelectedProfessional(professional);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedProfessional(null);
  };

  const professionalCountsByCanton = useMemo(() => cantons.reduce((acc, canton) => {
    acc[canton.code] = Math.floor(Math.random() * 20) + 10;
    return acc;
  }, {} as { [key: string]: number }), [cantons]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Ressources de Santé en Suisse
      </Typography>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Professionnels" icon={<BusinessIcon />} />
        <Tab label="Carte Interactive" icon={<MapIcon />} />
        <Tab label="FAQ" icon={<InfoIcon />} />
      </Tabs>

      {activeTab === 0 && (
        <Box>
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="Canton"
                value={selectedCanton}
                onChange={(e) => setSelectedCanton(e.target.value)}
                SelectProps={{ native: true }}
              >
                <option value="all">Tous les cantons</option>
                {cantons.map((canton) => (
                  <option key={canton.code} value={canton.code}>
                    {canton.name}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                select
                fullWidth
                label="Spécialité"
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                SelectProps={{ native: true }}
              >
                <option value="all">Toutes les spécialités</option>
                {specialties.map((specialty) => (
                  <option key={specialty.id} value={specialty.name}>
                    {specialty.name}
                  </option>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Résultats ({filteredProfessionals.length})
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip label={`${stats.totalProfessionals} professionnels`} color="primary" variant="outlined" />
              <Chip label={`${stats.cantonsCovered} cantons`} color="secondary" variant="outlined" />
              <Chip label={`${stats.specialtiesAvailable} spécialités`} color="success" variant="outlined" />
            </Box>
          </Box>

          {filteredProfessionals.length === 0 ? (
            <Alert severity="info">
              Aucun professionnel trouvé avec les critères sélectionnés.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {filteredProfessionals.map((professional) => (
                <Grid item xs={12} md={6} lg={4} key={professional.id}>
                  <StyledCard>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {professional.name}
                      </Typography>
                      <Typography color="text.secondary" gutterBottom>
                        {professional.specialty}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationIcon sx={{ mr: 1, fontSize: 'small' }} />
                        <Typography variant="body2">
                          {professional.city}, {professional.canton}
                        </Typography>
                      </Box>
                      <Typography variant="body2" gutterBottom>
                        {professional.institution}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <StarIcon sx={{ color: '#ffc107', mr: 0.5 }} />
                        <Typography variant="body2">
                          {professional.rating} ({professional.reviews} avis)
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip
                          label={professional.acceptsNewPatients ? 'Nouveaux patients' : 'Liste d\'attente'}
                          color={professional.acceptsNewPatients ? 'success' : 'warning'}
                          size="small"
                        />
                        {professional.languages && (
                          <Chip label={professional.languages[0]} size="small" variant="outlined" />
                        )}
                      </Box>
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={() => handleProfessionalClick(professional)}
                      >
                        Voir détails
                      </Button>
                    </CardContent>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {activeTab === 1 && (
        <RealMapSection
          professionals={filteredProfessionals}
          stats={stats}
          selectedCanton={selectedCanton}
          setSelectedCanton={setSelectedCanton}
          professionalCountsByCanton={professionalCountsByCanton}
        />
      )}

      {activeTab === 2 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            Questions Fréquemment Posées
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <InfoIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Comment prendre rendez-vous avec un professionnel ?"
                secondary="Contactez directement le professionnel par téléphone ou via son site web. Vérifiez qu'il accepte de nouveaux patients."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <InfoIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Quels sont les délais d'attente ?"
                secondary="Les délais varient selon la spécialité et la région. Les pédiatres et psychologues ont souvent des listes d'attente de 2-6 mois."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <InfoIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Comment savoir si un professionnel est remboursé ?"
                secondary="Vérifiez auprès de votre assurance maladie. La plupart des professionnels sont remboursés par l'assurance de base (LAMal)."
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <InfoIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Que faire en cas d'urgence ?"
                secondary="En cas d'urgence, appelez le 144 (ambulance) ou rendez-vous aux urgences pédiatriques de l'hôpital le plus proche."
              />
            </ListItem>
          </List>
        </Box>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {selectedProfessional?.name}
            </Typography>
            <IconButton onClick={handleCloseDialog}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedProfessional && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Informations professionnelles
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Spécialité :</strong> {selectedProfessional.specialty}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Institution :</strong> {selectedProfessional.institution}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Localisation :</strong> {selectedProfessional.city}, {selectedProfessional.canton}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Note :</strong> {selectedProfessional.rating}/5 ({selectedProfessional.reviews} avis)
                </Typography>
                {selectedProfessional.description && (
                  <Typography variant="body2" paragraph>
                    <strong>Description :</strong> {selectedProfessional.description}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Contact et disponibilité
                </Typography>
                {selectedProfessional.phone && (
                  <Typography variant="body2" paragraph>
                    <strong>Téléphone :</strong> {selectedProfessional.phone}
                  </Typography>
                )}
                {selectedProfessional.email && (
                  <Typography variant="body2" paragraph>
                    <strong>Email :</strong> {selectedProfessional.email}
                  </Typography>
                )}
                {selectedProfessional.website && (
                  <Typography variant="body2" paragraph>
                    <strong>Site web :</strong>
                    <a href={selectedProfessional.website} target="_blank" rel="noopener noreferrer">
                      {selectedProfessional.website}
                    </a>
                  </Typography>
                )}
                {selectedProfessional.availability && (
                  <Typography variant="body2" paragraph>
                    <strong>Disponibilité :</strong> {selectedProfessional.availability}
                  </Typography>
                )}
                {selectedProfessional.languages && (
                  <Typography variant="body2" paragraph>
                    <strong>Langues :</strong> {selectedProfessional.languages.join(', ')}
                  </Typography>
                )}
                {selectedProfessional.insurance && (
                  <Typography variant="body2" paragraph>
                    <strong>Assurances acceptées :</strong> {selectedProfessional.insurance.join(', ')}
                  </Typography>
                )}
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Fermer</Button>
          {selectedProfessional?.phone && (
            <Button variant="contained" startIcon={<PhoneIcon />}>
              Appeler
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Ressources;

