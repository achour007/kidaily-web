import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Person as PersonIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { SubscriptionPlan } from '../services/monetizationService';

interface IndividualPlanCardProps {
  plan: SubscriptionPlan;
  onSelect: (plan: SubscriptionPlan) => void;
  isSelected?: boolean;
  isPopular?: boolean;
}

const IndividualPlanCard: React.FC<IndividualPlanCardProps> = ({
  plan,
  onSelect,
  isSelected = false,
  isPopular = false,
}) => {
  const features = [
    'Accès complet à l\'application',
    'Suivi illimité d\'un enfant',
    'Évaluations personnalisées',
    'Rapports détaillés',
    'Support par email',
    'Mises à jour régulières',
  ];

  return (
    <Card
      sx={{
        position: 'relative',
        border: isSelected ? '2px solid #1976d2' : '1px solid #e0e0e0',
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
        maxWidth: 350,
        width: '100%',
      }}
    >
      {isPopular && (
        <Box
          sx={{
            position: 'absolute',
            top: -12,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1,
          }}
        >
          <Chip
            icon={<StarIcon />}
            label="Populaire"
            color="primary"
            sx={{ fontWeight: 'bold' }}
          />
        </Box>
      )}

      <CardContent sx={{ pt: isPopular ? 4 : 2 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <PersonIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h5" component="h3" gutterBottom>
            {plan.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Plan individuel parfait pour les parents
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" component="div" color="primary" gutterBottom>
            CHF {plan.priceCHF}
          </Typography>
          {plan.originalPriceCHF && parseFloat(plan.originalPriceCHF) !== plan.priceCHF && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: 'line-through' }}
            >
              CHF {plan.originalPriceCHF}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            par {plan.billingPeriod === 'monthly' ? 'mois' : 'an'}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <List sx={{ mb: 3 }}>
          {features.map((feature, index) => (
            <ListItem key={index} sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={feature}
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          ))}
        </List>

        <Button
          variant={isSelected ? 'outlined' : 'contained'}
          fullWidth
          size="large"
          onClick={() => onSelect(plan)}
          sx={{
            py: 1.5,
            fontWeight: 'bold',
            borderRadius: 2,
          }}
        >
          {isSelected ? 'Plan Sélectionné' : 'Choisir ce Plan'}
        </Button>

        {plan.description && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', textAlign: 'center', mt: 2 }}
          >
            {plan.description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default IndividualPlanCard;
