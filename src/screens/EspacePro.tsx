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
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from '@mui/material';
import {
  Message as MessageIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  Add as AddIcon,
  VideoCall as VideoCallIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';

interface Patient {
  id: string;
  name: string;
  age: string;
  lastVisit: string;
  nextVisit: string;
  status: 'actif' | 'en_attente' | 'termine';
  progress: number;
  notes: string;
}

interface Message {
  id: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  date: string;
  isRead: boolean;
}

const EspacePro: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [openMessageDialog, setOpenMessageDialog] = useState(false);
  const [newMessage, setNewMessage] = useState({
    to: '',
    subject: '',
    content: '',
  });

  const patients: Patient[] = [
    {
      id: '1',
      name: 'Emma Martin',
      age: '2 ans 3 mois',
      lastVisit: '2024-01-15',
      nextVisit: '2024-02-15',
      status: 'actif',
      progress: 75,
      notes: 'Progrès significatifs en langage. Recommandation : continuer les exercices de prononciation.',
    },
    {
      id: '2',
      name: 'Lucas Dubois',
      age: '3 ans 1 mois',
      lastVisit: '2024-01-10',
      nextVisit: '2024-02-10',
      status: 'actif',
      progress: 60,
      notes: 'Difficultés persistantes en motricité fine. Nouveaux exercices proposés.',
    },
    {
      id: '3',
      name: 'Chloé Bernard',
      age: '2 ans 8 mois',
      lastVisit: '2024-01-05',
      nextVisit: '2024-02-05',
      status: 'en_attente',
      progress: 45,
      notes: 'Évaluation initiale terminée. Plan de suivi établi.',
    },
  ];

  const messages: Message[] = [
    {
      id: '1',
      from: 'Dr. Marie Dubois',
      to: 'Mme Martin',
      subject: 'Suivi Emma - Progrès encourageants',
      content: 'Bonjour, je vous contacte concernant les progrès d\'Emma. Elle fait d\'excellents progrès en langage. Continuez les exercices quotidiens.',
      date: '2024-01-20',
      isRead: true,
    },
    {
      id: '2',
      from: 'Mme Dubois',
      to: 'Dr. Marie Dubois',
      subject: 'Question sur les exercices',
      content: 'Bonjour docteur, j\'ai une question concernant les exercices de prononciation. Pouvez-vous me rappeler ?',
      date: '2024-01-19',
      isRead: false,
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSendMessage = () => {
    // Ici on enverrait le message
    console.log('Nouveau message:', newMessage);
    setOpenMessageDialog(false);
    setNewMessage({ to: '', subject: '', content: '' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'actif': return 'success';
      case 'en_attente': return 'warning';
      case 'termine': return 'default';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'actif': return 'Actif';
      case 'en_attente': return 'En attente';
      case 'termine': return 'Terminé';
      default: return status;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Espace professionnel
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Mes patients" />
        <Tab label="Messages" />
        <Tab label="Évaluations" />
        <Tab label="Calendrier" />
      </Tabs>

      {activeTab === 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Liste des patients ({patients.length})
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />}>
              Nouveau patient
            </Button>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            {patients.map((patient) => (
              <Card key={patient.id} sx={{ cursor: 'pointer' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {patient.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {patient.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {patient.age}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={getStatusLabel(patient.status)}
                      color={getStatusColor(patient.status) as any}
                      size="small"
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Progression globale
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={patient.progress} 
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {patient.progress}% des objectifs atteints
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Dernière visite: {new Date(patient.lastVisit).toLocaleDateString('fr-FR')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Prochaine visite: {new Date(patient.nextVisit).toLocaleDateString('fr-FR')}
                    </Typography>
                  </Box>

                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {patient.notes}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" variant="outlined" startIcon={<MessageIcon />}>
                      Message
                    </Button>
                    <Button size="small" variant="outlined" startIcon={<AssessmentIcon />}>
                      Évaluation
                    </Button>
                    <Button size="small" variant="outlined" startIcon={<TimelineIcon />}>
                      Suivi
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Messages ({messages.length})
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => setOpenMessageDialog(true)}
            >
              Nouveau message
            </Button>
          </Box>

          <List>
            {messages.map((message, index) => (
              <React.Fragment key={message.id}>
                <ListItem sx={{ 
                  bgcolor: message.isRead ? 'transparent' : 'action.hover',
                  borderRadius: 1,
                  mb: 1,
                }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: message.isRead ? 'grey.400' : 'primary.main' }}>
                      {message.from.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: message.isRead ? 400 : 600 }}>
                          {message.subject}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(message.date).toLocaleDateString('fr-FR')}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          De: {message.from} • À: {message.to}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {message.content.substring(0, 100)}...
                        </Typography>
                      </Box>
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" variant="outlined">
                      Répondre
                    </Button>
                  </Box>
                </ListItem>
                {index < messages.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}

      {activeTab === 2 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Évaluations en cours
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Évaluations à effectuer
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Emma Martin - Évaluation langage"
                      secondary="Prévue le 15 février 2024"
                    />
                    <Button size="small" variant="contained">
                      Commencer
                    </Button>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Lucas Dubois - Bilan motricité"
                      secondary="Prévue le 20 février 2024"
                    />
                    <Button size="small" variant="contained">
                      Commencer
                    </Button>
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Rapports récents
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Chloé Bernard - Rapport initial"
                      secondary="Terminé le 5 janvier 2024"
                    />
                    <Button size="small" variant="outlined">
                      Voir
                    </Button>
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Emma Martin - Suivi mensuel"
                      secondary="Terminé le 15 janvier 2024"
                    />
                    <Button size="small" variant="outlined">
                      Voir
                    </Button>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      {activeTab === 3 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Calendrier des rendez-vous
          </Typography>
          
          <Card>
            <CardContent>
              <Box sx={{ 
                width: '100%', 
                height: 400, 
                bgcolor: 'grey.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 1,
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <CalendarIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Calendrier des rendez-vous
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Intégration avec votre agenda professionnel
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Prochains rendez-vous
            </Typography>
            <List>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>E</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Emma Martin - Suivi langage"
                  secondary="15 février 2024 - 14h00"
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" variant="outlined" startIcon={<VideoCallIcon />}>
                    Visio
                  </Button>
                  <Button size="small" variant="outlined" startIcon={<PhoneIcon />}>
                    Téléphone
                  </Button>
                </Box>
              </ListItem>
              <ListItem>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>L</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Lucas Dubois - Bilan motricité"
                  secondary="20 février 2024 - 10h30"
                />
                <Button size="small" variant="outlined">
                  Présentiel
                </Button>
              </ListItem>
            </List>
          </Box>
        </Box>
      )}

      {/* Dialog pour nouveau message */}
      <Dialog open={openMessageDialog} onClose={() => setOpenMessageDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nouveau message</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Destinataire"
              value={newMessage.to}
              onChange={(e) => setNewMessage(prev => ({ ...prev, to: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Sujet"
              value={newMessage.subject}
              onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Message"
              value={newMessage.content}
              onChange={(e) => setNewMessage(prev => ({ ...prev, content: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMessageDialog(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleSendMessage}
            variant="contained"
            disabled={!newMessage.to || !newMessage.subject || !newMessage.content}
          >
            Envoyer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EspacePro; 