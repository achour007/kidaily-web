import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box, 
  Chip, 
  List, 
  ListItem, 
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  LocationOn as LocationIcon,
  LocalHospital as HospitalIcon,
  Star as StarIcon,
  People as PeopleIcon,
  Language as LanguageIcon,
  Euro as EuroIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { UnifiedPediatricService, UnifiedPediatricProfessional } from '../services/unifiedPediatricService';

interface PediatricDatabaseStatsProps {
  className?: string;
}

const PediatricDatabaseStats: React.FC<PediatricDatabaseStatsProps> = ({ className }) => {
  const [stats, setStats] = useState<any>(null);
  const [cantonStats, setCantonStats] = useState<any[]>([]);
  const [specialtyStats, setSpecialtyStats] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCanton, setSelectedCanton] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [filteredProfessionals, setFilteredProfessionals] = useState<UnifiedPediatricProfessional[]>([]);

  useEffect(() => {
    // Charger les statistiques globales
    const globalStats = UnifiedPediatricService.getGlobalStats();
    setStats(globalStats);

    // Charger les statistiques par canton
    const cantons = UnifiedPediatricService.getAllCantons();
    const cantonStatsData = cantons.map(canton => {
      const cantonCode = UnifiedPediatricService.getAllProfessionals()
        .find(p => p.canton === canton)?.cantonCode || '';
      return UnifiedPediatricService.getCantonStats(cantonCode);
    }).filter(Boolean);
    setCantonStats(cantonStatsData);

    // Charger les statistiques par spécialité
    const specialties = UnifiedPediatricService.getAllSpecialties();
    const specialtyStatsData = specialties.map(specialty => 
      UnifiedPediatricService.getSpecialtyStats(specialty)
    ).filter(Boolean);
    setSpecialtyStats(specialtyStatsData);

    // Charger tous les professionnels
    setFilteredProfessionals(UnifiedPediatricService.getAllProfessionals());
  }, []);

  const handleSearch = () => {
    let filtered = UnifiedPediatricService.getAllProfessionals();

    if (searchQuery) {
      filtered = UnifiedPediatricService.searchProfessionals(searchQuery);
    }

    if (selectedCanton) {
      filtered = filtered.filter(p => p.canton === selectedCanton);
    }

    if (selectedSpecialty) {
      filtered = filtered.filter(p => p.specialty === selectedSpecialty);
    }

    setFilteredProfessionals(filtered);
  };

  const handleReset = () => {
    setSearchQuery('');
    setSelectedCanton('');
    setSelectedSpecialty('');
    setFilteredProfessionals(UnifiedPediatricService.getAllProfessionals());
  };

  if (!stats) {
    return (
      <Card className={className}>
        <CardContent>
          <Typography variant="h6">Chargement des statistiques...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box className={className}>
      {/* En-tête avec statistiques globales */}
      <Card sx={{ mb: 3, backgroundColor: '#f8f9fa' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom color="primary">
            🏥 Base de Données Pédiatrique Suisse - Statistiques Complètes
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            Couverture nationale : {stats.cantonsCovered}/26 cantons • {stats.totalProfessionals} spécialistes
          </Typography>
        </CardContent>
      </Card>

      {/* Statistiques principales */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" color="primary">
                {stats.totalProfessionals}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Spécialistes Pédiatriques
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <LocationIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" color="success.main">
                {stats.cantonsCovered}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Cantons Couverts
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <HospitalIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" color="info.main">
                {stats.totalInstitutions}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Institutions Médicales
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <StarIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" color="warning.main">
                {stats.avgRating.toFixed(1)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Note Moyenne
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filtres de recherche */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🔍 Recherche et Filtres
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Recherche libre"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nom, spécialité, ville..."
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Canton</InputLabel>
                <Select
                  value={selectedCanton}
                  onChange={(e) => setSelectedCanton(e.target.value)}
                  label="Canton"
                >
                  <MenuItem value="">Tous les cantons</MenuItem>
                  {UnifiedPediatricService.getAllCantons().map((canton) => (
                    <MenuItem key={canton} value={canton}>{canton}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Spécialité</InputLabel>
                <Select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  label="Spécialité"
                >
                  <MenuItem value="">Toutes les spécialités</MenuItem>
                  {UnifiedPediatricService.getAllSpecialties().map((specialty) => (
                    <MenuItem key={specialty} value={specialty}>{specialty}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSearch}
                sx={{ height: 56 }}
              >
                Rechercher
              </Button>
            </Grid>
          </Grid>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button variant="outlined" onClick={handleReset}>
              Réinitialiser les filtres
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Résultats de recherche */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📊 Résultats de la recherche ({filteredProfessionals.length} spécialistes)
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nom</TableCell>
                  <TableCell>Spécialité</TableCell>
                  <TableCell>Canton</TableCell>
                  <TableCell>Ville</TableCell>
                  <TableCell>Institution</TableCell>
                  <TableCell>Note</TableCell>
                  <TableCell>Nouveaux patients</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProfessionals.slice(0, 20).map((professional) => (
                  <TableRow key={professional.id}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {professional.name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {professional.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={professional.specialty} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={professional.canton} 
                        size="small" 
                        color="secondary"
                      />
                    </TableCell>
                    <TableCell>{professional.city}</TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {professional.institution}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <StarIcon sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                        {professional.rating}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={professional.acceptsNewPatients ? 'Oui' : 'Non'} 
                        size="small" 
                        color={professional.acceptsNewPatients ? 'success' : 'default'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {filteredProfessionals.length > 20 && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">
                Affichage des 20 premiers résultats sur {filteredProfessionals.length}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Statistiques détaillées */}
      <Grid container spacing={3}>
        {/* Statistiques par canton */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📍 Répartition par Canton
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Canton</TableCell>
                      <TableCell align="right">Spécialistes</TableCell>
                      <TableCell align="right">Note moy.</TableCell>
                      <TableCell align="right">Nouveaux patients</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cantonStats.slice(0, 10).map((cantonStat, index) => (
                      <TableRow key={index}>
                        <TableCell>{cantonStat.cantons[0]}</TableCell>
                        <TableCell align="right">{cantonStat.total}</TableCell>
                        <TableCell align="right">{cantonStat.avgRating.toFixed(1)}</TableCell>
                        <TableCell align="right">{cantonStat.newPatients}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Statistiques par spécialité */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🎯 Répartition par Spécialité
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Spécialité</TableCell>
                      <TableCell align="right">Spécialistes</TableCell>
                      <TableCell align="right">Note moy.</TableCell>
                      <TableCell align="right">Cantons</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {specialtyStats.slice(0, 10).map((specialtyStat, index) => (
                      <TableRow key={index}>
                        <TableCell>{specialtyStat.specialties[0]}</TableCell>
                        <TableCell align="right">{specialtyStat.total}</TableCell>
                        <TableCell align="right">{specialtyStat.avgRating.toFixed(1)}</TableCell>
                        <TableCell align="right">{specialtyStat.cantons.length}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sources des données */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📚 Sources des Données
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="primary">
                  {stats.dataSources.original}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Base originale
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="success.main">
                  {stats.dataSources.collected}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Collecte automatique
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 2 }}>
                <Typography variant="h4" color="info.main">
                  {stats.dataSources.extended}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Base étendue
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PediatricDatabaseStats;
