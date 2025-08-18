import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Chip, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  RecordVoiceOver as SpeechIcon,
  Psychology as PsychologyIcon,
  FitnessCenter
} from '@mui/icons-material';
import { UltraMassiveSwissDatabase } from '../data/ultraMassiveSwissDatabase';

interface SimplifiedProfessional {
  id: string;
  name: string;
  canton: string;
  cantonCode: string;
  city: string;
  specialties: string[];
  phone: string;
  email: string;
  website?: string;
  acceptsNewPatients: boolean;
  languages: string[];
  insuranceAccepted: string[];
  address: string;
  postalCode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

const Ressources: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCanton, setSelectedCanton] = useState('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [professionals, setProfessionals] = useState<SimplifiedProfessional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<SimplifiedProfessional[]>([]);

  useEffect(() => {
    try {
      const allProfessionals = UltraMassiveSwissDatabase.getAllProfessionals() as SimplifiedProfessional[];
      setProfessionals(allProfessionals);
      setFilteredProfessionals(allProfessionals);
    } catch (error) {
      console.error('Erreur lors du chargement des professionnels:', error);
      setProfessionals([]);
      setFilteredProfessionals([]);
    }
  }, []);

  useEffect(() => {
    let filtered = professionals;

    if (selectedCanton !== 'all') {
      filtered = filtered.filter(p => p.cantonCode === selectedCanton);
    }

    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter(p => p.specialties && p.specialties.includes(selectedSpecialty));
    }

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.specialties && p.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))) ||
        p.canton.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProfessionals(filtered);
  }, [professionals, selectedCanton, selectedSpecialty, searchTerm]);

  const getSpecialtyIcon = (specialty: string) => {
    switch (specialty.toLowerCase()) {
      case 'pédiatrie développement':
      case 'pediatrie developpement':
        return <PersonIcon />;
      case 'logopédie':
      case 'orthophonie':
        return <SpeechIcon />;
      case 'psychologie infantile':
        return <PsychologyIcon />;
      default:
        return <PersonIcon />;
    }
  };

  const getSpecialtyColor = (specialty: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (specialty.toLowerCase()) {
      case 'pédiatrie développement':
      case 'pediatrie developpement':
        return 'error';
      case 'logopédie':
      case 'orthophonie':
        return 'info';
      case 'psychologie infantile':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const cantons = UltraMassiveSwissDatabase.getCantons();
  const specialties = UltraMassiveSwissDatabase.getSpecialties();
  const stats = UltraMassiveSwissDatabase.getStatistics();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        🏥 Ressources et Professionnels de Santé
      </Typography>

      {/* Statistiques */}
      <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          📊 Statistiques de la Base de Données
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', backgroundColor: '#e3f2fd' }}>
              <CardContent>
                <Typography variant="h4" color="primary">
                  {stats.totalProfessionals}
                </Typography>
                <Typography variant="body2">Professionnels Total</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', backgroundColor: '#fff3e0' }}>
              <CardContent>
                <Typography variant="h4" color="warning.main">
                  {stats.cantonsCovered}
                </Typography>
                <Typography variant="body2">Cantons Couverts</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', backgroundColor: '#e8f5e8' }}>
              <CardContent>
                <Typography variant="h4" color="success.main">
                  {stats.specialtiesAvailable}
                </Typography>
                <Typography variant="body2">Spécialités</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', backgroundColor: '#fce4ec' }}>
              <CardContent>
                <Typography variant="h4" color="secondary.main">
                  {stats.avgPerCanton}
                </Typography>
                <Typography variant="body2">Moyenne/Canton</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Onglets */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label="🗺️ Carte Interactive"
            onClick={() => setActiveTab(0)}
            color={activeTab === 0 ? 'primary' : 'default'}
            variant={activeTab === 0 ? 'filled' : 'outlined'}
          />
          <Chip
            label="👥 Professionnels"
            onClick={() => setActiveTab(1)}
            color={activeTab === 1 ? 'primary' : 'default'}
            variant={activeTab === 1 ? 'filled' : 'outlined'}
          />
          <Chip
            label="❓ FAQ"
            onClick={() => setActiveTab(2)}
            color={activeTab === 2 ? 'primary' : 'default'}
            variant={activeTab === 2 ? 'filled' : 'outlined'}
          />
        </Box>
      </Box>

      {/* Contenu des onglets */}
      {activeTab === 0 && (
        <Box>
          <Typography variant="h5" gutterBottom align="center">
            🗺️ Carte de la Suisse - Professionnels par Canton
          </Typography>
          
          <Box sx={{ 
            width: '100%', 
            height: '500px', 
            border: '2px solid #e0e0e0', 
            borderRadius: '12px', 
            backgroundColor: '#f8f9fa',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <svg width="100%" height="100%" viewBox="0 0 800 600">
              <path
                d="M 50 100 L 150 80 L 250 60 L 350 70 L 450 90 L 550 120 L 650 150 L 700 200 L 720 250 L 700 300 L 650 350 L 550 400 L 450 450 L 350 480 L 250 500 L 150 480 L 50 450 L 30 400 L 20 350 L 30 300 L 50 250 L 70 200 L 50 100 Z"
                fill="#f0f0f0"
                stroke="#cccccc"
                strokeWidth="2"
              />
              
              <g>
                <rect x="80" y="480" width="80" height="80" fill="#4caf50" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }} />
                <text x="120" y="520" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">GE: 16</text>
                
                <rect x="140" y="400" width="120" height="100" fill="#f44336" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }} />
                <text x="200" y="450" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">VD: 7</text>
                
                <rect x="460" y="260" width="40" height="40" fill="#f44336" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }} />
                <text x="480" y="280" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">ZH: 7</text>
                
                <rect x="300" y="300" width="40" height="40" fill="#f44336" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }} />
                <text x="320" y="320" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">BE: 5</text>
              </g>
            </svg>
          </Box>
          
          <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Chip label="✅ 15+ professionnels" sx={{ backgroundColor: '#4caf50', color: 'white' }} size="small" />
            <Chip label="🟡 10-14 professionnels" sx={{ backgroundColor: '#ff9800', color: 'white' }} size="small" />
            <Chip label="🔴 5-9 professionnels" sx={{ backgroundColor: '#f44336', color: 'white' }} size="small" />
            <Chip label="⚫ < 5 professionnels" sx={{ backgroundColor: '#9e9e9e', color: 'white' }} size="small" />
          </Box>
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            👥 Recherche de Professionnels
          </Typography>

          <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{ minWidth: 200 }}
            />
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Canton</InputLabel>
              <Select
                value={selectedCanton}
                onChange={(e) => setSelectedCanton(e.target.value)}
                label="Canton"
              >
                <MenuItem value="all">Tous les cantons</MenuItem>
                {cantons.slice(0, 5).map((canton) => (
                  <MenuItem key={canton.code} value={canton.code}>
                    {canton.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Spécialité</InputLabel>
              <Select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                label="Spécialité"
              >
                <MenuItem value="all">Toutes les spécialités</MenuItem>
                {specialties.slice(0, 5).map((specialty) => (
                  <MenuItem key={specialty.id} value={specialty.id}>
                    {specialty.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredProfessionals.slice(0, 10).map((professional) => (
              <Card key={professional.id} sx={{ backgroundColor: '#fafafa' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {professional.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    📍 {professional.canton} • {professional.city}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    {professional.specialties && professional.specialties.map((specialty) => (
                      <Chip
                        key={specialty}
                        icon={getSpecialtyIcon(specialty)}
                        label={specialty}
                        color={getSpecialtyColor(specialty)}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    📞 {professional.phone} • ✉️ {professional.email}
                  </Typography>
                  <Chip
                    label={professional.acceptsNewPatients ? '✅ Nouveaux patients' : '❌ Liste d\'attente'}
                    color={professional.acceptsNewPatients ? 'success' : 'warning'}
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            ❓ Questions Fréquemment Posées
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {UltraMassiveSwissDatabase.getFAQ().slice(0, 5).map((faq, index) => (
              <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1">{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Ressources;