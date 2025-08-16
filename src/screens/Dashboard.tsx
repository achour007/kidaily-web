import React, { useState, useEffect, useCallback } from 'react';

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Add as AddIcon,
  PhotoCamera as PhotoIcon,
  Restaurant as MealIcon,
  Bedtime as NapIcon,
  SportsEsports as ActivityIcon,
  CalendarToday as CalendarIcon,
  Person as ChildIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

interface Child {
  id: string;
  name: string;
  birthDate: string;
  gender: string;
  photo?: string;
  allergies?: string;
  diet?: string;
  group?: string;
  notes?: string;
  dailyLogs?: any[];
  photos?: any[];
}

interface DashboardData {
  dailyLog?: any;
  meals: any[];
  naps: any[];
  activities: any[];
  photos: any[];
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  // const { } = useSelector((state: RootState) => state.user);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [openAddChild, setOpenAddChild] = useState(false);
  const [openAddActivity, setOpenAddActivity] = useState(false);
  const [openAddMeal, setOpenAddMeal] = useState(false);
  const [openAddNap, setOpenAddNap] = useState(false);

  // États pour les formulaires
  const [newChild, setNewChild] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: '',
  });

  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    duration: '',
    category: '',
  });

  const [newMeal, setNewMeal] = useState({
    name: '',
    type: '',
    time: '',
    notes: '',
  });

  const [newNap, setNewNap] = useState({
    startTime: '',
    endTime: '',
    quality: '',
    notes: '',
  });

  const fetchChildren = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/children', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des enfants');
      }

      const data = await response.json();
      setChildren(data);
      
      if (data.length > 0 && !selectedChild) {
        setSelectedChild(data[0]);
      }
    } catch (error) {
      setError('Erreur lors du chargement des enfants');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedChild]);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  useEffect(() => {
    if (selectedChild) {
      fetchDashboardData(selectedChild.id);
    }
  }, [selectedChild]);

  const fetchDashboardData = async (childId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/children/${childId}/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du dashboard');
      }

      const data = await response.json();
      setDashboardData(data.dashboard);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const getAgeInMonths = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const ageInMonths = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
    return ageInMonths;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'heureux': return 'success';
      case 'fatigué': return 'warning';
      case 'agité': return 'error';
      default: return 'default';
    }
  };

  const getMealQuantityColor = (quantity: string) => {
    switch (quantity) {
      case 'tout': return 'success';
      case 'partiel': return 'warning';
      case 'peu': return 'error';
      default: return 'default';
    }
  };

  const handleAddChild = async () => {
    try {
      // Appel API pour ajouter un enfant
      const response = await fetch('/api/children', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newChild),
      });

      if (response.ok) {
        const addedChild = await response.json();
        // Mettre à jour la liste des enfants
        setChildren([...children, addedChild]);
        setOpenAddChild(false);
        setNewChild({ firstName: '', lastName: '', birthDate: '', gender: '' });
        
        // Afficher un message de succès
        // setSnackbar({
        //   open: true,
        //   message: 'Enfant ajouté avec succès !',
        //   severity: 'success',
        // });
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'enfant:', error);
      // setSnackbar({
      //   open: true,
      //   message: 'Erreur lors de l\'ajout de l\'enfant',
      //   severity: 'error',
      // });
    }
  };

  const handleAddActivity = async () => {
    try {
      // Appel API pour ajouter une activité
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newActivity),
      });

      if (response.ok) {
        await response.json(); // Récupérer la réponse mais ne pas stocker
        // Mettre à jour la liste des activités
        // setActivities([...activities, addedActivity]);
        setOpenAddActivity(false);
        setNewActivity({ title: '', description: '', duration: '', category: '' });
        
        // setSnackbar({
        //   open: true,
        //   message: 'Activité ajoutée avec succès !',
        //   severity: 'success',
        // });
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'activité:', error);
      // setSnackbar({
      //   open: true,
      //   message: 'Erreur lors de l\'ajout de l\'activité',
      //   severity: 'error',
      // });
    }
  };

  const handleAddMeal = async () => {
    try {
      // Appel API pour ajouter un repas
      const response = await fetch('/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMeal),
      });

      if (response.ok) {
        // const addedMeal = await response.json();
        await response.json(); // Récupérer la réponse mais ne pas stocker
        // Mettre à jour la liste des repas
        // setMeals([...meals, addedMeal]);
        setOpenAddMeal(false);
        setNewMeal({ name: '', type: '', time: '', notes: '' });
        
        // setSnackbar({
        //   open: true,
        //   message: 'Repas ajouté avec succès !',
        //   severity: 'success',
        // });
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du repas:', error);
      // setSnackbar({
      //   open: true,
      //   message: 'Erreur lors de l\'ajout du repas',
      //   severity: 'error',
      // });
    }
  };

  const handleAddNap = async () => {
    try {
      // Appel API pour ajouter une sieste
      const response = await fetch('/api/naps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNap),
      });

      if (response.ok) {
        await response.json(); // Récupérer la réponse mais ne pas stocker
        // Mettre à jour la liste des siestes
        // setNaps([...naps, addedNap]);
        setOpenAddNap(false);
        setNewNap({ startTime: '', endTime: '', quality: '', notes: '' });
        
        // setSnackbar({
        //   open: true,
        //   message: 'Sieste ajoutée avec succès !',
        //   severity: 'success',
        // });
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la sieste:', error);
      // setSnackbar({
      //   open: true,
      //   message: 'Erreur lors de l\'ajout de la sieste',
      //   severity: 'error',
      // });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box className="dashboard-container">
      {/* Header avec sélection d'enfant */}
      <Box className="dashboard-header">
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h4" component="h1">
            Tableau de bord
          </Typography>
          {children.length > 0 && (
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Enfant</InputLabel>
              <Select
                value={selectedChild?.id || ''}
                onChange={(e) => {
                  const child = children.find(c => c.id === e.target.value);
                  setSelectedChild(child || null);
                }}
                label="Enfant"
              >
                {children.map((child) => (
                  <MenuItem key={child.id} value={child.id}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar src={child.photo} sx={{ width: 24, height: 24 }}>
                        <ChildIcon />
                      </Avatar>
                      {child.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
        
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => navigate('/children/add')}
          >
            Nouvel enfant
          </Button>
          <Button
            variant="contained"
            startIcon={<CalendarIcon />}
            onClick={() => navigate('/calendar')}
          >
            Agenda
          </Button>
        </Box>
      </Box>

      {selectedChild ? (
        <Grid container spacing={3}>
          {/* Profil de l'enfant */}
          <Grid item xs={12} md={4}>
            <Card className="child-profile-card">
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar 
                    src={selectedChild.photo} 
                    sx={{ width: 80, height: 80 }}
                  >
                    <ChildIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" component="h2">
                      {selectedChild.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getAgeInMonths(selectedChild.birthDate)} mois • {selectedChild.gender}
                    </Typography>
                    {selectedChild.group && (
                      <Chip 
                        label={selectedChild.group} 
                        size="small" 
                        color="primary" 
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>
                  <IconButton 
                    size="small" 
                    onClick={() => navigate(`/children/${selectedChild.id}/edit`)}
                  >
                    <EditIcon />
                  </IconButton>
                </Box>

                {(selectedChild.allergies || selectedChild.diet) && (
                  <Box mb={2}>
                    {selectedChild.allergies && (
                      <Alert severity="warning" sx={{ mb: 1 }}>
                        Allergies: {selectedChild.allergies}
                      </Alert>
                    )}
                    {selectedChild.diet && (
                      <Alert severity="info" sx={{ mb: 1 }}>
                        Régime: {selectedChild.diet}
                      </Alert>
                    )}
                  </Box>
                )}

                {dashboardData?.dailyLog && (
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Humeur du jour
                    </Typography>
                    <Chip 
                      label={dashboardData.dailyLog.mood} 
                      color={getMoodColor(dashboardData.dailyLog.mood) as any}
                      size="small"
                    />
                    {dashboardData.dailyLog.notes && (
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        {dashboardData.dailyLog.notes}
                      </Typography>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Activités du jour */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    Activités du jour
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/activities/add')}
                  >
                    Ajouter
                  </Button>
                </Box>
                
                {dashboardData?.activities && dashboardData.activities.length > 0 ? (
                  <List>
                    {dashboardData.activities.map((activity, index) => (
                      <ListItem key={index} divider={index < dashboardData.activities.length - 1}>
                        <ListItemAvatar>
                          <Avatar>
                            <ActivityIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={activity.activity.title}
                          secondary={`${formatTime(activity.date)} • ${activity.duration || 0} min`}
                        />
                        {activity.notes && (
                          <Typography variant="body2" color="text.secondary">
                            {activity.notes}
                          </Typography>
                        )}
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                    Aucune activité enregistrée aujourd'hui
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Repas */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    Repas
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/meals/add')}
                  >
                    Ajouter
                  </Button>
                </Box>
                
                {dashboardData?.meals && dashboardData.meals.length > 0 ? (
                  <List>
                    {dashboardData.meals.map((meal, index) => (
                      <ListItem key={index} divider={index < dashboardData.meals.length - 1}>
                        <ListItemAvatar>
                          <Avatar>
                            <MealIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={meal.mealType}
                          secondary={meal.menu}
                        />
                        <Box display="flex" gap={1}>
                          <Chip 
                            label={meal.quantity} 
                            color={getMealQuantityColor(meal.quantity) as any}
                            size="small"
                          />
                          {meal.reaction && (
                            <Chip 
                              label={meal.reaction} 
                              variant="outlined"
                              size="small"
                            />
                          )}
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                    Aucun repas enregistré aujourd'hui
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Siestes */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    Siestes
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/naps/add')}
                  >
                    Ajouter
                  </Button>
                </Box>
                
                {dashboardData?.naps && dashboardData.naps.length > 0 ? (
                  <List>
                    {dashboardData.naps.map((nap, index) => (
                      <ListItem key={index} divider={index < dashboardData.naps.length - 1}>
                        <ListItemAvatar>
                          <Avatar>
                            <NapIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${formatTime(nap.startTime)} - ${nap.endTime ? formatTime(nap.endTime) : 'En cours'}`}
                          secondary={nap.quality && `Sommeil: ${nap.quality}`}
                        />
                        {nap.notes && (
                          <Typography variant="body2" color="text.secondary">
                            {nap.notes}
                          </Typography>
                        )}
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                    Aucune sieste enregistrée aujourd'hui
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Photos récentes */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    Photos récentes
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<PhotoIcon />}
                    onClick={() => navigate(`/children/${selectedChild.id}/photos`)}
                  >
                    Voir toutes
                  </Button>
                </Box>
                
                {dashboardData?.photos && dashboardData.photos.length > 0 ? (
                  <Grid container spacing={2}>
                    {dashboardData.photos.map((photo, index) => (
                      <Grid item xs={6} sm={4} md={3} key={index}>
                        <Card variant="outlined" sx={{ cursor: 'pointer' }}>
                          <Box
                            component="img"
                            src={photo.url}
                            alt={photo.caption || 'Photo'}
                            sx={{
                              width: '100%',
                              height: 150,
                              objectFit: 'cover'
                            }}
                          />
                          {photo.caption && (
                            <CardContent sx={{ py: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                {photo.caption}
                              </Typography>
                            </CardContent>
                          )}
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                    Aucune photo aujourd'hui
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Box textAlign="center" py={8}>
          <ChildIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Aucun enfant enregistré
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Commencez par ajouter votre premier enfant pour voir son tableau de bord
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate('/children/add')}
          >
            Ajouter un enfant
          </Button>
        </Box>
      )}



      {/* TODO: Ajouter les dialogs pour ajouter enfant, activité, repas, sieste */}
      
      {/* Dialog Ajouter Enfant */}
      <Dialog open={openAddChild} onClose={() => setOpenAddChild(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter un Enfant</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Prénom"
                value={newChild.firstName}
                onChange={(e) => setNewChild({ ...newChild, firstName: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Nom"
                value={newChild.lastName}
                onChange={(e) => setNewChild({ ...newChild, lastName: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Date de naissance"
                type="date"
                value={newChild.birthDate}
                onChange={(e) => setNewChild({ ...newChild, birthDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Genre</InputLabel>
                <Select
                  value={newChild.gender}
                  onChange={(e) => setNewChild({ ...newChild, gender: e.target.value })}
                  label="Genre"
                >
                  <MenuItem value="boy">Garçon</MenuItem>
                  <MenuItem value="girl">Fille</MenuItem>
                  <MenuItem value="other">Autre</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddChild(false)}>Annuler</Button>
          <Button onClick={handleAddChild} variant="contained">Ajouter</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Ajouter Activité */}
      <Dialog open={openAddActivity} onClose={() => setOpenAddActivity(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter une Activité</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Titre de l'activité"
                value={newActivity.title}
                onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={newActivity.description}
                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Durée (minutes)"
                type="number"
                value={newActivity.duration}
                onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  value={newActivity.category}
                  onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value })}
                  label="Catégorie"
                >
                  <MenuItem value="educational">Éducatif</MenuItem>
                  <MenuItem value="physical">Physique</MenuItem>
                  <MenuItem value="creative">Créatif</MenuItem>
                  <MenuItem value="social">Social</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddActivity(false)}>Annuler</Button>
          <Button onClick={handleAddActivity} variant="contained">Ajouter</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Ajouter Repas */}
      <Dialog open={openAddMeal} onClose={() => setOpenAddMeal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter un Repas</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom du repas"
                value={newMeal.name}
                onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Type de repas</InputLabel>
                <Select
                  value={newMeal.type}
                  onChange={(e) => setNewMeal({ ...newMeal, type: e.target.value })}
                  label="Type de repas"
                >
                  <MenuItem value="breakfast">Petit-déjeuner</MenuItem>
                  <MenuItem value="lunch">Déjeuner</MenuItem>
                  <MenuItem value="dinner">Dîner</MenuItem>
                  <MenuItem value="snack">Goûter</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Heure"
                type="time"
                value={newMeal.time}
                onChange={(e) => setNewMeal({ ...newMeal, time: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={2}
                value={newMeal.notes}
                onChange={(e) => setNewMeal({ ...newMeal, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddMeal(false)}>Annuler</Button>
          <Button onClick={handleAddMeal} variant="contained">Ajouter</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Ajouter Sieste */}
      <Dialog open={openAddNap} onClose={() => setOpenAddNap(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter une Sieste</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Heure de début"
                type="time"
                value={newNap.startTime}
                onChange={(e) => setNewNap({ ...newNap, startTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Heure de fin"
                type="time"
                value={newNap.endTime}
                onChange={(e) => setNewNap({ ...newNap, endTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Qualité de la sieste</InputLabel>
                <Select
                  value={newNap.quality}
                  onChange={(e) => setNewNap({ ...newNap, quality: e.target.value })}
                  label="Qualité de la sieste"
                >
                  <MenuItem value="excellent">Excellente</MenuItem>
                  <MenuItem value="good">Bonne</MenuItem>
                  <MenuItem value="average">Moyenne</MenuItem>
                  <MenuItem value="poor">Mauvaise</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                multiline
                rows={2}
                value={newNap.notes}
                onChange={(e) => setNewNap({ ...newNap, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddNap(false)}>Annuler</Button>
          <Button onClick={handleAddNap} variant="contained">Ajouter</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard; 