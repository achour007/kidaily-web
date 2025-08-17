import React, { useState, useEffect } from 'react';

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as ChildIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './ChildManagement.css';

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
  documents?: any[];
}



const ChildManagement: React.FC = () => {
  const navigate = useNavigate();
  // const { } = useSelector((state: RootState) => state.user);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [addChildDialog, setAddChildDialog] = useState(false);
  const [editChildDialog, setEditChildDialog] = useState(false);
  const [deleteChildDialog, setDeleteChildDialog] = useState(false);
  const [childToDelete, setChildToDelete] = useState<Child | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    gender: '',
    allergies: '',
    diet: '',
    group: '',
    notes: '',
    photo: ''
  });

  useEffect(() => {
    fetchChildren();
  }, []);

  const fetchChildren = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://kidaily-backend-cb9a147c3208.herokuapp.com/api/children', {
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
    } catch (error) {
      setError('Erreur lors du chargement des enfants');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChild = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://kidaily-backend-cb9a147c3208.herokuapp.com/api/children', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'enfant');
      }

      await fetchChildren();
      setAddChildDialog(false);
      resetForm();
    } catch (error) {
      setError('Erreur lors de la création de l\'enfant');
      console.error('Erreur:', error);
    }
  };

  const handleEditChild = async () => {
    if (!selectedChild) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://kidaily-backend-cb9a147c3208.herokuapp.com/api/children/${selectedChild.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de l\'enfant');
      }

      await fetchChildren();
      setEditChildDialog(false);
      resetForm();
    } catch (error) {
      setError('Erreur lors de la mise à jour de l\'enfant');
      console.error('Erreur:', error);
    }
  };

  const handleDeleteChild = async () => {
    if (!childToDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://kidaily-backend-cb9a147c3208.herokuapp.com/api/children/${childToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'enfant');
      }

      await fetchChildren();
      setDeleteChildDialog(false);
      setChildToDelete(null);
    } catch (error) {
      setError('Erreur lors de la suppression de l\'enfant');
      console.error('Erreur:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      birthDate: '',
      gender: '',
      allergies: '',
      diet: '',
      group: '',
      notes: '',
      photo: ''
    });
  };

  const openEditDialog = (child: Child) => {
    setSelectedChild(child);
    setFormData({
      name: child.name,
      birthDate: child.birthDate.split('T')[0],
      gender: child.gender,
      allergies: child.allergies || '',
      diet: child.diet || '',
      group: child.group || '',
      notes: child.notes || '',
      photo: child.photo || ''
    });
    setEditChildDialog(true);
  };

  const openDeleteDialog = (child: Child) => {
    setChildToDelete(child);
    setDeleteChildDialog(true);
  };

  const getAgeInMonths = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const ageInMonths = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 30.44));
    return ageInMonths;
  };

  const getGroupColor = (group: string) => {
    switch (group) {
      case 'petits': return 'primary';
      case 'moyens': return 'secondary';
      case 'grands': return 'success';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="child-management-container">
      {/* Header */}
      <Box className="page-header">
        <Typography variant="h4" component="h1">
          Gestion des enfants
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setAddChildDialog(true)}
        >
          Nouvel enfant
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Liste des enfants */}
      <Grid container spacing={3}>
        {children.map((child) => (
          <Grid item xs={12} md={6} lg={4} key={child.id}>
            <Card className="child-card">
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar 
                    src={child.photo} 
                    sx={{ width: 60, height: 60 }}
                  >
                    <ChildIcon sx={{ fontSize: 30 }} />
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="h6" component="h2">
                      {child.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getAgeInMonths(child.birthDate)} mois • {child.gender}
                    </Typography>
                    {child.group && (
                      <Chip 
                        label={child.group} 
                        size="small" 
                        color={getGroupColor(child.group) as any}
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>
                  <Box>
                    <IconButton 
                      size="small" 
                      onClick={() => openEditDialog(child)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => openDeleteDialog(child)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                {(child.allergies || child.diet) && (
                  <Box mb={2}>
                    {child.allergies && (
                      <Alert severity="warning" sx={{ mb: 1 }}>
                        Allergies: {child.allergies}
                      </Alert>
                    )}
                    {child.diet && (
                      <Alert severity="info" sx={{ mb: 1 }}>
                        Régime: {child.diet}
                      </Alert>
                    )}
                  </Box>
                )}

                <Box display="flex" gap={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => navigate(`/children/${child.id}/dashboard`)}
                  >
                    Tableau de bord
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => navigate(`/children/${child.id}/documents`)}
                  >
                    Documents
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {children.length === 0 && (
        <Box textAlign="center" py={8}>
          <ChildIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Aucun enfant enregistré
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Commencez par ajouter votre premier enfant
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => setAddChildDialog(true)}
          >
            Ajouter un enfant
          </Button>
        </Box>
      )}

      {/* Dialog Ajouter enfant */}
      <Dialog open={addChildDialog} onClose={() => setAddChildDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter un nouvel enfant</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prénom"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date de naissance"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Genre</InputLabel>
                <Select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  label="Genre"
                  required
                >
                  <MenuItem value="garçon">Garçon</MenuItem>
                  <MenuItem value="fille">Fille</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Groupe</InputLabel>
                <Select
                  value={formData.group}
                  onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                  label="Groupe"
                >
                  <MenuItem value="petits">Petits</MenuItem>
                  <MenuItem value="moyens">Moyens</MenuItem>
                  <MenuItem value="grands">Grands</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Allergies"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Régime alimentaire"
                value={formData.diet}
                onChange={(e) => setFormData({ ...formData, diet: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddChildDialog(false)}>Annuler</Button>
          <Button onClick={handleAddChild} variant="contained">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Modifier enfant */}
      <Dialog open={editChildDialog} onClose={() => setEditChildDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Modifier l'enfant</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prénom"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Date de naissance"
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Genre</InputLabel>
                <Select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  label="Genre"
                  required
                >
                  <MenuItem value="garçon">Garçon</MenuItem>
                  <MenuItem value="fille">Fille</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Groupe</InputLabel>
                <Select
                  value={formData.group}
                  onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                  label="Groupe"
                >
                  <MenuItem value="petits">Petits</MenuItem>
                  <MenuItem value="moyens">Moyens</MenuItem>
                  <MenuItem value="grands">Grands</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Allergies"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Régime alimentaire"
                value={formData.diet}
                onChange={(e) => setFormData({ ...formData, diet: e.target.value })}
                multiline
                rows={2}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditChildDialog(false)}>Annuler</Button>
          <Button onClick={handleEditChild} variant="contained">
            Modifier
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog Supprimer enfant */}
      <Dialog open={deleteChildDialog} onClose={() => setDeleteChildDialog(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer {childToDelete?.name} ? 
            Cette action est irréversible et supprimera toutes les données associées.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteChildDialog(false)}>Annuler</Button>
          <Button onClick={handleDeleteChild} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChildManagement; 