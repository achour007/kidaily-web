import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  IconButton,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Timer as TimerIcon,
  Group as GroupIcon,
  VideoLibrary as VideoIcon,
} from '@mui/icons-material';

interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  ageGroup: string;
  duration: string;
  difficulty: 'facile' | 'moyen' | 'difficile';
  materials: string[];
  instructions: string[];
  videoUrl?: string;
  isFavorite: boolean;
  isCompleted: boolean;
}

const Activites: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const categories = [
    { id: 'langage', name: 'Langage', color: '#2196f3' },
    { id: 'motricite', name: 'Motricité', color: '#4caf50' },
    { id: 'cognitif', name: 'Cognitif', color: '#ff9800' },
    { id: 'communication', name: 'Communication', color: '#9c27b0' },
    { id: 'autonomie', name: 'Autonomie', color: '#f44336' },
  ];

  const activities: Activity[] = [
    {
      id: '1',
      title: 'Jeu des couleurs',
      description: 'Apprendre les couleurs en s\'amusant avec des objets du quotidien',
      category: 'cognitif',
      ageGroup: '2-3',
      duration: '15 min',
      difficulty: 'facile',
      materials: ['Objets colorés', 'Cartes de couleurs'],
      instructions: [
        'Présentez des objets de couleurs différentes',
        'Nommez chaque couleur en montrant l\'objet',
        'Demandez à l\'enfant de pointer la couleur nommée',
        'Félicitez chaque bonne réponse'
      ],
      isFavorite: true,
      isCompleted: false,
    },
    {
      id: '2',
      title: 'Construction de tours',
      description: 'Développer la motricité fine en empilant des cubes',
      category: 'motricite',
      ageGroup: '2-3',
      duration: '20 min',
      difficulty: 'moyen',
      materials: ['Cubes de construction', 'Espace de jeu'],
      instructions: [
        'Montrez comment empiler les cubes',
        'Encouragez l\'enfant à construire une tour',
        'Comptez les cubes ensemble',
        'Faites tomber la tour et recommencez'
      ],
      isFavorite: false,
      isCompleted: true,
    },
    {
      id: '3',
      title: 'Histoires avec images',
      description: 'Stimuler le langage en racontant des histoires',
      category: 'langage',
      ageGroup: '2-3',
      duration: '10 min',
      difficulty: 'facile',
      materials: ['Livre d\'images', 'Espace confortable'],
      instructions: [
        'Choisissez un livre avec des images simples',
        'Pointez les images en les nommant',
        'Posez des questions sur les images',
        'Encouragez l\'enfant à répéter les mots'
      ],
      isFavorite: true,
      isCompleted: false,
    },
    {
      id: '4',
      title: 'Jeu des émotions',
      description: 'Apprendre à reconnaître et exprimer les émotions',
      category: 'communication',
      ageGroup: '2-3',
      duration: '15 min',
      difficulty: 'moyen',
      materials: ['Miroir', 'Images d\'émotions'],
      instructions: [
        'Montrez différentes expressions faciales',
        'Nommez chaque émotion',
        'Demandez à l\'enfant de reproduire l\'expression',
        'Parlez des situations qui causent ces émotions'
      ],
      isFavorite: false,
      isCompleted: false,
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity);
    setOpenDialog(true);
  };

  const handleToggleFavorite = (activityId: string) => {
    // Ici on mettrait à jour la base de données
    console.log('Toggle favorite:', activityId);
  };

  const handleCompleteActivity = (activityId: string) => {
    // Ici on mettrait à jour la base de données
    console.log('Complete activity:', activityId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facile': return 'success';
      case 'moyen': return 'warning';
      case 'difficile': return 'error';
      default: return 'default';
    }
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.color || '#666';
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || categoryId;
  };

  const filteredActivities = activeTab === 0 
    ? activities 
    : activeTab === 1 
    ? activities.filter(a => a.isFavorite)
    : activities.filter(a => a.isCompleted);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Activités personnalisées
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Toutes les activités" />
        <Tab label="Favoris" />
        <Tab label="Terminées" />
      </Tabs>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 3 
      }}>
        {filteredActivities.map((activity) => (
          <Card 
            key={activity.id}
            sx={{ 
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 3,
              },
            }}
            onClick={() => handleActivityClick(activity)}
          >
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Chip
                  label={getCategoryName(activity.category)}
                  size="small"
                  sx={{ 
                    backgroundColor: getCategoryColor(activity.category),
                    color: 'white',
                  }}
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(activity.id);
                    }}
                  >
                    {activity.isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                  </IconButton>
                </Box>
              </Box>

              <Typography variant="h6" gutterBottom>
                {activity.title}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {activity.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip
                  icon={<TimerIcon />}
                  label={activity.duration}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={activity.difficulty}
                  size="small"
                  color={getDifficultyColor(activity.difficulty) as any}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Matériaux :
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                  {activity.materials.slice(0, 2).join(', ')}
                  {activity.materials.length > 2 && '...'}
                </Typography>
              </Box>

              {activity.isCompleted && (
                <Box sx={{ mt: 2 }}>
                  <Chip
                    label="Terminée"
                    color="success"
                    size="small"
                    icon={<PlayIcon />}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Dialog pour afficher les détails de l'activité */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="md" 
        fullWidth
      >
        {selectedActivity && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                  {selectedActivity.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    onClick={() => handleToggleFavorite(selectedActivity.id)}
                  >
                    {selectedActivity.isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                  </IconButton>
                  <Button
                    variant={selectedActivity.isCompleted ? "outlined" : "contained"}
                    startIcon={<PlayIcon />}
                    onClick={() => handleCompleteActivity(selectedActivity.id)}
                  >
                    {selectedActivity.isCompleted ? 'Terminée' : 'Commencer'}
                  </Button>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {selectedActivity.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Chip
                    icon={<TimerIcon />}
                    label={selectedActivity.duration}
                    variant="outlined"
                  />
                  <Chip
                    label={selectedActivity.difficulty}
                    color={getDifficultyColor(selectedActivity.difficulty) as any}
                  />
                  <Chip
                    icon={<GroupIcon />}
                    label={selectedActivity.ageGroup}
                    variant="outlined"
                  />
                </Box>

                <Typography variant="h6" gutterBottom>
                  Matériaux nécessaires
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
                  {selectedActivity.materials.map((material, index) => (
                    <Chip key={index} label={material} variant="outlined" />
                  ))}
                </Box>

                <Typography variant="h6" gutterBottom>
                  Instructions
                </Typography>
                <Box component="ol" sx={{ pl: 2 }}>
                  {selectedActivity.instructions.map((instruction, index) => (
                    <Typography key={index} component="li" sx={{ mb: 1 }}>
                      {instruction}
                    </Typography>
                  ))}
                </Box>

                {selectedActivity.videoUrl && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Vidéo explicative
                    </Typography>
                    <Box sx={{ 
                      width: '100%', 
                      height: 200, 
                      bgcolor: 'grey.200',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 1,
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <VideoIcon />
                        <Typography>Vidéo disponible</Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>
                Fermer
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Activites; 