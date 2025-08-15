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
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Lightbulb as LightbulbIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  PlayArrow as PlayIcon,
  ExpandMore as ExpandMoreIcon,
  Notifications as NotificationsIcon,
  VideoLibrary as VideoIcon,
  Psychology as PsychologyIcon,
  Restaurant as RestaurantIcon,
  Bed as BedIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';

interface Advice {
  id: string;
  title: string;
  content: string;
  category: string;
  ageGroup: string;
  difficulty: 'facile' | 'moyen' | 'avancé';
  hasVideo: boolean;
  isFavorite: boolean;
  tags: string[];
}

const Conseils: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Tous', icon: <LightbulbIcon /> },
    { id: 'comportement', name: 'Comportement', icon: <PsychologyIcon /> },
    { id: 'alimentation', name: 'Alimentation', icon: <RestaurantIcon /> },
    { id: 'sommeil', name: 'Sommeil', icon: <BedIcon /> },
    { id: 'langage', name: 'Langage', icon: <ChatIcon /> },
  ];

  const adviceList: Advice[] = [
    {
      id: '1',
      title: 'Encourager l\'autonomie à table',
      content: 'Laissez votre enfant manger seul, même s\'il en met partout. Utilisez des couverts adaptés à sa taille et félicitez ses efforts. L\'autonomie se développe par la pratique.',
      category: 'alimentation',
      ageGroup: '2-3',
      difficulty: 'facile',
      hasVideo: true,
      isFavorite: true,
      tags: ['autonomie', 'repas', 'développement'],
    },
    {
      id: '2',
      title: 'Rituel du coucher apaisant',
      content: 'Créez une routine du soir : bain, histoire, câlin, extinction des lumières. La régularité aide l\'enfant à se sentir en sécurité et favorise l\'endormissement.',
      category: 'sommeil',
      ageGroup: '2-3',
      difficulty: 'facile',
      hasVideo: false,
      isFavorite: false,
      tags: ['sommeil', 'routine', 'sécurité'],
    },
    {
      id: '3',
      title: 'Gestion des crises de colère',
      content: 'Restez calme et reconnaissez l\'émotion de votre enfant. Proposez des alternatives et aidez-le à nommer ses sentiments. La colère est normale à cet âge.',
      category: 'comportement',
      ageGroup: '2-3',
      difficulty: 'moyen',
      hasVideo: true,
      isFavorite: true,
      tags: ['émotions', 'colère', 'gestion'],
    },
    {
      id: '4',
      title: 'Stimuler le langage au quotidien',
      content: 'Parlez constamment à votre enfant, nommez les objets, posez des questions ouvertes. Lisez des livres ensemble et chantez des comptines.',
      category: 'langage',
      ageGroup: '2-3',
      difficulty: 'facile',
      hasVideo: false,
      isFavorite: false,
      tags: ['langage', 'communication', 'lecture'],
    },
    {
      id: '5',
      title: 'Limiter les écrans',
      content: 'Pas d\'écran avant 3 ans, puis maximum 1h par jour. Privilégiez les activités manuelles et les jeux d\'imagination pour le développement.',
      category: 'comportement',
      ageGroup: '2-3',
      difficulty: 'moyen',
      hasVideo: true,
      isFavorite: false,
      tags: ['écrans', 'développement', 'activités'],
    },
  ];

  const dailyTips = [
    'Félicitez votre enfant pour ses efforts, pas seulement ses réussites',
    'Laissez-le explorer et faire des erreurs, c\'est ainsi qu\'il apprend',
    'Passez du temps de qualité ensemble chaque jour',
    'Soyez patient, chaque enfant se développe à son rythme',
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleToggleFavorite = (adviceId: string) => {
    // Ici on mettrait à jour la base de données
    console.log('Toggle favorite:', adviceId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facile': return 'success';
      case 'moyen': return 'warning';
      case 'avancé': return 'error';
      default: return 'default';
    }
  };

  const filteredAdvice = selectedCategory === 'all' 
    ? adviceList 
    : adviceList.filter(advice => advice.category === selectedCategory);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Conseils pour les parents
      </Typography>

      {/* Conseil du jour */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NotificationsIcon />
          <Typography variant="h6">Conseil du jour</Typography>
        </Box>
        <Typography variant="body1" sx={{ mt: 1 }}>
          {dailyTips[Math.floor(Math.random() * dailyTips.length)]}
        </Typography>
      </Alert>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Bibliothèque de conseils" />
        <Tab label="Vidéos explicatives" />
        <Tab label="Favoris" />
      </Tabs>

      {activeTab === 0 && (
        <Box>
          {/* Filtres par catégorie */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
            {categories.map((category) => (
              <Chip
                key={category.id}
                icon={category.icon}
                label={category.name}
                onClick={() => setSelectedCategory(category.id)}
                color={selectedCategory === category.id ? 'primary' : 'default'}
                variant={selectedCategory === category.id ? 'filled' : 'outlined'}
              />
            ))}
          </Box>

          {/* Liste des conseils */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredAdvice.map((advice) => (
              <Card key={advice.id}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {advice.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {advice.content}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                      {advice.hasVideo && (
                        <Chip
                          icon={<VideoIcon />}
                          label="Vidéo"
                          size="small"
                          variant="outlined"
                        />
                      )}
                      <Chip
                        label={advice.difficulty}
                        size="small"
                        color={getDifficultyColor(advice.difficulty) as any}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {advice.tags.map((tag, index) => (
                        <Chip key={index} label={tag} size="small" variant="outlined" />
                      ))}
                    </Box>
                    <Button
                      startIcon={advice.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      onClick={() => handleToggleFavorite(advice.id)}
                      size="small"
                    >
                      {advice.isFavorite ? 'Favori' : 'Ajouter'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Vidéos explicatives
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 3 }}>
            {adviceList.filter(advice => advice.hasVideo).map((advice) => (
              <Card key={advice.id}>
                <CardContent>
                  <Box sx={{ 
                    width: '100%', 
                    height: 150, 
                    bgcolor: 'grey.200',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1,
                    mb: 2,
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PlayIcon />
                      <Typography>Vidéo disponible</Typography>
                    </Box>
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {advice.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {advice.content.substring(0, 100)}...
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Mes conseils favoris
          </Typography>
          <List>
            {adviceList.filter(advice => advice.isFavorite).map((advice, index) => (
              <React.Fragment key={advice.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <LightbulbIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={advice.title}
                    secondary={advice.content.substring(0, 150) + '...'}
                  />
                  <Button
                    startIcon={<FavoriteIcon />}
                    onClick={() => handleToggleFavorite(advice.id)}
                    size="small"
                  >
                    Retirer
                  </Button>
                </ListItem>
                {index < adviceList.filter(a => a.isFavorite).length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}

      {/* FAQ */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Questions fréquentes
        </Typography>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Mon enfant ne parle pas encore, est-ce normal ?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Chaque enfant se développe à son rythme. Si votre enfant ne parle pas encore à 2 ans, 
              consultez un pédiatre ou un orthophoniste pour une évaluation. En attendant, 
              continuez à lui parler et à stimuler son langage.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Comment gérer les crises de colère ?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Les crises de colère sont normales à cet âge. Restez calme, reconnaissez l'émotion 
              de votre enfant et proposez des alternatives. Évitez de céder à toutes ses demandes 
              pour ne pas renforcer ce comportement.
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Quand consulter un spécialiste ?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Consultez si vous observez des retards significatifs dans plusieurs domaines, 
              des comportements inhabituels, ou si vous avez des inquiétudes. Mieux vaut 
              consulter tôt pour un suivi optimal.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

export default Conseils; 