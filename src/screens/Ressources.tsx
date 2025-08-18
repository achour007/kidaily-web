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
  FitnessCenter,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as LanguageIcon
} from '@mui/icons-material';
import { UltraMassiveSwissDatabase } from '../data/ultraMassiveSwissDatabase';

interface ComprehensiveProfessional {
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
  experience: number;
  education: string[];
  certifications: string[];
  insuranceAccepted: string[];
  consultationFee: number;
  availability: string[];
  address: string;
  postalCode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

const Ressources = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCanton, setSelectedCanton] = useState('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [acceptsNewOnly, setAcceptsNewOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [professionals, setProfessionals] = useState<ComprehensiveProfessional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<ComprehensiveProfessional[]>([]);

  useEffect(() => {
    const allProfessionals = UltraMassiveSwissDatabase.getAllProfessionals();
    setProfessionals(allProfessionals);
    setFilteredProfessionals(allProfessionals);
  }, []);

  useEffect(() => {
    let filtered = professionals;

    if (selectedCanton !== 'all') {
      filtered = filtered.filter(p => p.cantonCode === selectedCanton);
    }

    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter(p => p.specialties.includes(selectedSpecialty));
    }

    if (acceptsNewOnly) {
      filtered = filtered.filter(p => p.acceptsNewPatients);
    }

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        p.canton.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProfessionals(filtered);
  }, [professionals, selectedCanton, selectedSpecialty, acceptsNewOnly, searchTerm]);

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
      case 'neuropédiatrie':
      case 'neuropediatrie':
        return <FitnessCenter />;
      case 'psychomotricité':
      case 'psychomotricite':
        return <FitnessCenter />;
      default:
        return <PersonIcon />;
    }
  };

  const getSpecialtyColor = (specialty: string) => {
    switch (specialty.toLowerCase()) {
      case 'pédiatrie développement':
      case 'pediatrie developpement':
        return 'error';
      case 'logopédie':
      case 'orthophonie':
        return 'info';
      case 'psychologie infantile':
        return 'secondary';
      case 'neuropédiatrie':
      case 'neuropediatrie':
        return 'warning';
      case 'psychomotricité':
      case 'psychomotricite':
        return 'success';
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
          �� Statistiques de la Base de Données
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
            label="��️ Carte Interactive"
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
              {/* Contour de la Suisse */}
              <path
                d="M 50 100 L 150 80 L 250 60 L 350 70 L 450 90 L 550 120 L 650 150 L 700 200 L 720 250 L 700 300 L 650 350 L 550 400 L 450 450 L 350 480 L 250 500 L 150 480 L 50 450 L 30 400 L 20 350 L 30 300 L 50 250 L 70 200 L 50 100 Z"
                fill="#f0f0f0"
                stroke="#cccccc"
                strokeWidth="2"
              />
              
              {/* Cantons simplifiés */}
              <g>
                {/* Genève */}
                <rect x="80" y="480" width="80" height="80" fill="#4caf50" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }} />
                <text x="120" y="520" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">GE: 16</text>
                
                {/* Vaud */}
                <rect x="140" y="400" width="120" height="100" fill="#f44336" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }} />
                <text x="200" y="450" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">VD: 7</text>
                
                {/* Zurich */}
                <rect x="460" y="260" width="40" height="40" fill="#f44336" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }} />
                <text x="480" y="280" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">ZH: 7</text>
                
                {/* Berne */}
                <rect x="300" y="300" width="40" height="40" fill="#f44336" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }} />
                <text x="320" y="320" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">BE: 5</text>
                
                {/* Fribourg */}
                <rect x="200" y="320" width="40" height="60" fill="#f44336" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }} />
                <text x="220" y="350" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">FR: 2</text>
                
                {/* Neuchâtel */}
                <rect x="180" y="260" width="40" height="40" fill="#f44336" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }} />
                <text x="200" y="280" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">NE: 2</text>
                
                {/* Jura */}
                <rect x="220" y="200" width="40" height="40" fill="#f44336" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }} />
                <text x="240" y="220" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">JU: 2</text>
                
                {/* Bâle-Ville */}
                <rect x="260" y="160" width="40" height="40" fill="#f44336" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }} />
                <text x="280" y="180" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">BS: 3</text>
                
                {/* Bâle-Campagne */}
                <rect x="300" y="180" width="40" height="40" fill="#f44336" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }} />
                <text x="320" y="200" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">BL: 1</text>
                
                {/* Soleure */}
                <rect x="260" y="220" width="40" height="40" fill="#f44336" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }} />
                <text x="280" y="240" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">SO: 1</text>
                
                {/* Argovie */}
                <rect x="360" y="220" width="40" height="40" fill="#f44336" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }} />
                <text x="380" y="240" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">AG: 1</text>
                
                {/* Schaffhouse */}
                <rect x="460" y="160" width="40" height="40" fill="#f44336" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }} />
                <text x="480" y="180" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">SH: 1</text>
                
                {/* Thurgovie */}
                <rect x="500" y="180" width="40" height="40" fill="#f44336" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }} />
                <text x="520" y="200" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">TG: 1</text>
                
                {/* Appenzell R.-E. */}
                <rect x="560" y="200" width="40" height="40" fill="#9e9e9e" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }} />
                <text x="580" y="220" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">AR: 0</text>
                
                {/* Appenzell R.-I. */}
                <rect x="580" y="220" width="40" height="40" fill="#9e9e9e" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }} />
                <text x="600" y="240" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">AI: 0</text>
                
                {/* Saint-Gall */}
                <rect x="540" y="260" width="40" height="40" fill="#f44336" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }} />
                <text x="560" y="280" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">SG: 2</text>
                
                {/* Grisons */}
                <rect x="620" y="380" width="40" height="40" fill="#f44336" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }} />
                <text x="640" y="400" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">GR: 1</text>
                
                {/* Tessin */}
                <rect x="560" y="500" width="40" height="40" fill="#f44336" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }} />
                <text x="580" y="520" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">TI: 4</text>
                
                {/* Valais */}
                <rect x="260" y="400" width="80" height="160" fill="#f44336" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }} />
                <text x="300" y="480" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">VS: 2</text>
                
                {/* Zoug */}
                <rect x="400" y="280" width="40" height="40" fill="#f44336" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }} />
                <text x="420" y="300" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">ZG: 1</text>
                
                {/* Glaris */}
                <rect x="500" y="300" width="40" height="40" fill="#9e9e9e" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }} />
                <text x="520" y="320" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">GL: 0</text>
                
                {/* Nidwald */}
                <rect x="380" y="320" width="40" height="40" fill="#f44336" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }} />
                <text x="400" y="340" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">NW: 2</text>
                
                {/* Obwald */}
                <rect x="360" y="340" width="40" height="40" fill="#9e9e9e" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }} />
                <text x="380" y="360" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">OW: 0</text>
                
                {/* Uri */}
                <rect x="380" y="360" width="40" height="40" fill="#9e9e9e" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }} />
                <text x="400" y="380" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">UR: 0</text>
                
                {/* Schwytz */}
                <rect x="420" y="340" width="40" height="40" fill="#9e9e9e" stroke="#ffffff" strokeWidth="2" style={{ cursor: 'pointer' }} />
                <text x="440" y="360" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">SZ: 0</text>
              </g>
            </svg>
          </Box>
          
          {/* Légende */}
          <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Chip label="✅ 15+ professionnels" sx={{ backgroundColor: '#4caf50', color: 'white' }} size="small" />
            <Chip label="🟡 10-14 professionnels" sx={{ backgroundColor: '#ff9800', color: 'white' }} size="small" />
            <Chip label=" 5-9 professionnels" sx={{ backgroundColor: '#f44336', color: 'white' }} size="small" />
            <Chip label="⚫ < 5 professionnels" sx={{ backgroundColor: '#9e9e9e', color: 'white' }} size="small" />
          </Box>
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Typography variant="h5" gutterBottom>
            👥 Recherche de Professionnels
          </Typography>

          {/* Filtres */}
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
                {cantons.slice(0, 10).map((canton) => (
                  <Chip
                    key={canton.code}
                    label={canton.name}
                    onClick={() => setSelectedCanton(canton.code)}
                    color={selectedCanton === canton.code ? 'primary' : 'default'}
                  />
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
                {specialties.map((specialty) => (
                  <Chip
                    key={specialty.id}
                    label={specialty.name}
                    onClick={() => setSelectedSpecialty(specialty.id)}
                    color={selectedSpecialty === specialty.id ? 'primary' : 'default'}
                  />
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Liste des professionnels */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredProfessionals.slice(0, 20).map((professional) => (
              <Card key={professional.id} sx={{ backgroundColor: '#fafafa' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        {professional.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        📍 {professional.canton} • {professional.city}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                        {professional.specialties.map((specialty) => (
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
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Chip
                        label={professional.acceptsNewPatients ? '✅ Nouveaux patients' : '❌ Liste d\'attente'}
                        color={professional.acceptsNewPatients ? 'success' : 'warning'}
                        size="small"
                      />
                      {professional.website && (
                        <Chip
                          label="🌐 Site web"
                          color="info"
                          size="small"
                          onClick={() => window.open(professional.website, '_blank')}
                          style={{ cursor: 'pointer' }}
                        />
                      )}
                    </Box>
                  </Box>
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
            {UltraMassiveSwissDatabase.getFAQ().map((faq, index) => (
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