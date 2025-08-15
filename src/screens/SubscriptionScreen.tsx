import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
} from '@mui/material';
import {
  Business as BusinessIcon,
  ContactSupport as ContactSupportIcon,
} from '@mui/icons-material';
import { useMonetization } from '../services/monetizationService';
import { SubscriptionPlan } from '../services/monetizationService';
import ProfessionalPlanCard from '../components/ProfessionalPlanCard';
import IndividualPlanCard from '../components/IndividualPlanCard';
import FamilyPlanCard from '../components/FamilyPlanCard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`subscription-tabpanel-${index}`}
      aria-labelledby={`subscription-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `subscription-tab-${index}`,
    'aria-controls': `subscription-tabpanel-${index}`,
  };
}

const SubscriptionScreen: React.FC = () => {
  const theme = useTheme();
  const monetizationService = useMonetization();
  const [tabValue, setTabValue] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  useEffect(() => {
    monetizationService.initialize();
  }, [monetizationService]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setSelectedPlan(null);
  };

  const handlePlanSelect = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    
    // TODO: Implémenter la logique de souscription
    if (plan.isProfessionalPlan) {
      // Pour les plans professionnels, rediriger vers l'équipe commerciale
      handleCommercialRedirect(plan);
    } else {
      // Pour les plans individuels/familiaux, procéder au paiement
      handleSubscriptionPayment(plan);
    }
  };

  const handleCommercialRedirect = (plan: SubscriptionPlan) => {
    // TODO: Implémenter la redirection vers l'équipe commerciale
    const subject = encodeURIComponent(`Demande d'information - Plan ${plan.name}`);
    const body = encodeURIComponent(`
Bonjour,

Je suis intéressé(e) par le plan ${plan.name} de Kidaily.

Détails du plan :
- Nom : ${plan.name}
- Prix : CHF ${plan.priceCHF}
- Cycle de facturation : ${plan.billingPeriod === 'monthly' ? 'Mensuel' : 'Annuel'}
- Utilisateurs maximum : ${plan.maxUsers || 'Illimité'}
- Public cible : ${plan.targetAudience || 'Professionnel'}

Pouvez-vous me contacter pour plus d'informations ?

Cordialement,
[Votre nom]
    `);
    
    // Ouvrir l'email client
    window.open(`mailto:commercial@kidaily.ch?subject=${subject}&body=${body}`);
    
    // Afficher un message de confirmation
    setSnackbar({
      open: true,
      message: `Demande envoyée pour le plan ${plan.name}. Notre équipe vous contactera dans les 24h.`,
      severity: 'success',
    });
  };

  const handleSubscriptionPayment = async (plan: SubscriptionPlan) => {
    try {
      // Simuler un appel API pour créer la session de paiement
      const response = await fetch('/api/subscriptions/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          planName: plan.name,
          priceCHF: plan.priceCHF,
          billingPeriod: plan.billingPeriod,
        }),
      });

      if (response.ok) {
        const { sessionUrl } = await response.json();
        // Rediriger vers la page de paiement
        window.location.href = sessionUrl;
      } else {
        throw new Error('Erreur lors de la création de la session de paiement');
      }
    } catch (error) {
      console.error('Erreur de paiement:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la création de la session de paiement. Veuillez réessayer.',
        severity: 'error',
      });
    }
  };

  const handleConfirmPlan = () => {
    setShowConfirmation(false);
    // TODO: Implémenter la logique de souscription
    console.log('Plan sélectionné:', selectedPlan);
  };

  const handleContactSales = () => {
    // TODO: Implémenter la redirection vers l'équipe commerciale
    console.log('Contacter l\'équipe commerciale');
  };

  const getPlansByTargetAudience = (targetAudience: 'individual' | 'family' | 'professional') => {
    return monetizationService.getSubscriptionPlans().filter(
      plan => plan.targetAudience === targetAudience
    );
  };

  const individualPlans = getPlansByTargetAudience('individual');
  const familyPlans = getPlansByTargetAudience('family');
  const professionalPlans = getPlansByTargetAudience('professional');

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* En-tête */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Choisissez votre plan Kidaily
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Des solutions adaptées à tous les besoins, des familles aux institutions professionnelles
        </Typography>
      </Box>

      {/* Onglets */}
      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="subscription tabs"
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 'bold',
            },
          }}
        >
          <Tab label="Individuel" {...a11yProps(0)} />
          <Tab label="Famille" {...a11yProps(1)} />
          <Tab 
            label="Professionnel" 
            {...a11yProps(2)}
            icon={<BusinessIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Contenu des onglets */}
      <TabPanel value={tabValue} index={0}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
          Plans pour particuliers
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 3 }}>
          {individualPlans.map((plan) => (
            <Box key={plan.id} sx={{ minWidth: 300, maxWidth: 400 }}>
              {/* TODO: Créer un composant IndividualPlanCard */}
              <IndividualPlanCard
                plan={plan}
                onSelect={handlePlanSelect}
                isSelected={selectedPlan?.id === plan.id}
                isPopular={true}
              />
            </Box>
          ))}
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
          Plans pour familles
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 3 }}>
          {familyPlans.map((plan) => (
            <Box key={plan.id} sx={{ minWidth: 300, maxWidth: 400 }}>
              {/* TODO: Créer un composant FamilyPlanCard */}
              <FamilyPlanCard
                plan={plan}
                onSelect={handlePlanSelect}
                isSelected={selectedPlan?.id === plan.id}
                isPopular={true}
              />
            </Box>
          ))}
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
          Plans professionnels
        </Typography>
        
        {/* En-tête informatif */}
        <Alert 
          severity="info" 
          icon={<BusinessIcon />}
          sx={{ mb: 4, p: 3 }}
        >
          <Typography variant="h6" gutterBottom>
            Solutions complètes pour les crèches, garderies et institutions éducatives
          </Typography>
          <Typography variant="body2">
            Gérez vos équipes, suivez le développement des enfants et respectez les normes de conformité.
          </Typography>
        </Alert>

        {/* Plans professionnels */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {professionalPlans.map((plan) => (
            <ProfessionalPlanCard
              key={plan.id}
              plan={plan}
              onSelect={handlePlanSelect}
              isSelected={selectedPlan?.id === plan.id}
              showCostAnalysis={true}
            />
          ))}
        </Box>

        {/* Section d'aide */}
        <Paper sx={{ p: 3, mt: 4, bgcolor: 'grey.50' }}>
          <Typography variant="h6" gutterBottom>
            Besoin d'aide pour choisir ?
          </Typography>
          <Typography variant="body2" paragraph>
            • Crèche (≤20 enfants, ≤5 éducateurs) : Plan Pro Crèche<br />
            • Institution (≤50 enfants, ≤15 éducateurs) : Plan Pro Institution<br />
            • Plus de 50 enfants : Contactez-nous pour un plan sur mesure
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ContactSupportIcon />}
            onClick={handleContactSales}
            sx={{ mt: 2 }}
          >
            Contacter l'équipe commerciale
          </Button>
        </Paper>
      </TabPanel>

      {/* Dialogue de confirmation */}
      <Dialog open={showConfirmation} onClose={() => setShowConfirmation(false)}>
        <DialogTitle>Confirmer la sélection</DialogTitle>
        <DialogContent>
          {selectedPlan && (
            <Box>
              <Typography variant="body1" paragraph>
                Vous avez sélectionné :
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                {selectedPlan.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Prix : CHF {selectedPlan.priceCHF.toFixed(2)}
              </Typography>
              {selectedPlan.billingPeriod !== 'one-time' && (
                <Typography variant="body2" color="text.secondary">
                  Période : {selectedPlan.billingPeriod === 'monthly' ? 'Mensuel' : 'Annuel'}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmation(false)}>
            Annuler
          </Button>
          <Button onClick={handleConfirmPlan} variant="contained">
            Continuer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SubscriptionScreen;
