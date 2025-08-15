import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Tabs,
  Tab,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  PhotoCamera as PhotoIcon,
  VideoLibrary as VideoIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

interface ProgressEntry {
  id: string;
  date: string;
  category: string;
  description: string;
  type: 'note' | 'photo' | 'video';
  mediaUrl?: string;
}

interface ProgressData {
  date: string;
  langage: number;
  motricite: number;
  cognitif: number;
  communication: number;
  autonomie: number;
}

const SuiviProgres: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [newEntry, setNewEntry] = useState<{
    category: string;
    description: string;
    type: 'note' | 'photo' | 'video';
  }>({
    category: '',
    description: '',
    type: 'note',
  });

  // Données fictives pour les graphiques
  const progressData: ProgressData[] = [
    { date: 'Jan', langage: 65, motricite: 70, cognitif: 60, communication: 75, autonomie: 55 },
    { date: 'Fév', langage: 70, motricite: 75, cognitif: 65, communication: 80, autonomie: 60 },
    { date: 'Mar', langage: 75, motricite: 80, cognitif: 70, communication: 85, autonomie: 65 },
    { date: 'Avr', langage: 80, motricite: 85, cognitif: 75, communication: 90, autonomie: 70 },
    { date: 'Mai', langage: 85, motricite: 90, cognitif: 80, communication: 95, autonomie: 75 },
  ];

  const categories = [
    { id: 'langage', name: 'Langage', color: '#2196f3' },
    { id: 'motricite', name: 'Motricité', color: '#4caf50' },
    { id: 'cognitif', name: 'Cognitif', color: '#ff9800' },
    { id: 'communication', name: 'Communication', color: '#9c27b0' },
    { id: 'autonomie', name: 'Autonomie', color: '#f44336' },
  ];

  const progressEntries: ProgressEntry[] = [
    {
      id: '1',
      date: '2024-01-15',
      category: 'langage',
      description: 'Emma a dit son premier mot de 3 syllabes : "banane" !',
      type: 'note',
    },
    {
      id: '2',
      date: '2024-01-10',
      category: 'motricite',
      description: 'Première fois qu\'Emma monte les escaliers seule',
      type: 'photo',
      mediaUrl: '/placeholder-photo.jpg',
    },
    {
      id: '3',
      date: '2024-01-05',
      category: 'cognitif',
      description: 'Reconnaît maintenant 5 couleurs différentes',
      type: 'note',
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAddEntry = () => {
    setOpenDialog(true);
  };

  const handleSaveEntry = () => {
    // Ici on ajouterait l'entrée à la base de données
    console.log('Nouvelle entrée:', newEntry);
    setOpenDialog(false);
    setNewEntry({ category: '', description: '', type: 'note' });
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.color || '#666';
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || categoryId;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Suivi des progrès
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddEntry}
        >
          Ajouter une observation
        </Button>
      </Box>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Graphiques d'évolution" />
        <Tab label="Journal de progrès" />
        <Tab label="Alertes" />
      </Tabs>

      {activeTab === 0 && (
        <Box>
          {/* Graphique linéaire */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Évolution globale
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  {categories.map((category) => (
                    <Line
                      key={category.id}
                      type="monotone"
                      dataKey={category.id}
                      stroke={category.color}
                      strokeWidth={2}
                      dot={{ fill: category.color }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Graphique en barres par catégorie */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Comparaison par domaine
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  {categories.map((category) => (
                    <Bar
                      key={category.id}
                      dataKey={category.id}
                      fill={category.color}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          {progressEntries.map((entry) => (
            <Card key={entry.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {getCategoryName(entry.category)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(entry.date).toLocaleDateString('fr-FR')}
                    </Typography>
                  </Box>
                  <Chip
                    label={entry.type === 'note' ? 'Note' : entry.type === 'photo' ? 'Photo' : 'Vidéo'}
                    size="small"
                    icon={entry.type === 'note' ? undefined : entry.type === 'photo' ? <PhotoIcon /> : <VideoIcon />}
                  />
                </Box>
                
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {entry.description}
                </Typography>

                {entry.mediaUrl && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 40, height: 40, bgcolor: getCategoryColor(entry.category) }}>
                      {entry.type === 'photo' ? <PhotoIcon /> : <VideoIcon />}
                    </Avatar>
                    <Typography variant="body2" color="text.secondary">
                      Média joint
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingUpIcon color="success" />
                <Box>
                  <Typography variant="h6" color="success.main">
                    Progrès positif
                  </Typography>
                  <Typography variant="body2">
                    Le langage d'Emma s'améliore régulièrement depuis 3 mois
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TrendingDownIcon color="warning" />
                <Box>
                  <Typography variant="h6" color="warning.main">
                    Attention requise
                  </Typography>
                  <Typography variant="body2">
                    La motricité fine stagne depuis 2 semaines
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Dialog pour ajouter une observation */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ajouter une observation</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Domaine
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {categories.map((category) => (
                <Chip
                  key={category.id}
                  label={category.name}
                  onClick={() => setNewEntry(prev => ({ ...prev, category: category.id }))}
                  color={newEntry.category === category.id ? 'primary' : 'default'}
                  variant={newEntry.category === category.id ? 'filled' : 'outlined'}
                />
              ))}
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              Type d'observation
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip
                label="Note"
                onClick={() => setNewEntry(prev => ({ ...prev, type: 'note' }))}
                color={newEntry.type === 'note' ? 'primary' : 'default'}
                variant={newEntry.type === 'note' ? 'filled' : 'outlined'}
              />
              <Chip
                label="Photo"
                icon={<PhotoIcon />}
                onClick={() => setNewEntry(prev => ({ ...prev, type: 'photo' }))}
                color={newEntry.type === 'photo' ? 'primary' : 'default'}
                variant={newEntry.type === 'photo' ? 'filled' : 'outlined'}
              />
              <Chip
                label="Vidéo"
                icon={<VideoIcon />}
                onClick={() => setNewEntry(prev => ({ ...prev, type: 'video' }))}
                color={newEntry.type === 'video' ? 'primary' : 'default'}
                variant={newEntry.type === 'video' ? 'filled' : 'outlined'}
              />
            </Box>

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={newEntry.description}
              onChange={(e) => setNewEntry(prev => ({ ...prev, description: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button 
            onClick={handleSaveEntry}
            variant="contained"
            disabled={!newEntry.category || !newEntry.description}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SuiviProgres; 