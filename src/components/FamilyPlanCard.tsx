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
  Avatar,
  AvatarGroup,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  FamilyRestroom as FamilyIcon,
  Star as StarIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import { SubscriptionPlan } from '../services/monetizationService';

interface FamilyPlanCardProps {
  plan: SubscriptionPlan;
  onSelect: (plan: SubscriptionPlan) => void;
  isSelected?: boolean;
  isPopular?: boolean;
}

const FamilyPlanCard: React.FC<FamilyPlanCardProps> = ({
  plan,
  onSelect,
  isSelected = false,
  isPopular = false,
}) => {
  const features = [
    'Accès complet à l\'application',
    `Suivi de jusqu'à ${plan.maxChildren || 5} enfants`,
    'Profils familiaux séparés',
    'Évaluations personnalisées pour chaque enfant',
    'Rapports familiaux consolidés',
    'Support prioritaire',
    'Synchronisation multi-appareils',
    'Sauvegarde cloud automatique',
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
            label="Recommandé"
            color="secondary"
            sx={{ fontWeight: 'bold' }}
          />
        </Box>
      )}

      <CardContent sx={{ pt: isPopular ? 4 : 2 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <FamilyIcon sx={{ fontSize: 48, color: 'secondary.main', mb: 1 }} />
          <Typography variant="h5" component="h3" gutterBottom>
            {plan.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Plan familial pour plusieurs enfants
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <AvatarGroup max={4}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>👶</Avatar>
              <Avatar sx={{ bgcolor: 'secondary.main' }}>👧</Avatar>
              <Avatar sx={{ bgcolor: 'success.main' }}>👦</Avatar>
              <Avatar sx={{ bgcolor: 'info.main' }}>👶</Avatar>
            </AvatarGroup>
          </Box>
        </Box>

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" component="div" color="secondary" gutterBottom>
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
          
          {plan.maxChildren && (
            <Box sx={{ mt: 1 }}>
              <Chip
                icon={<GroupIcon />}
                label={`Jusqu'à ${plan.maxChildren} enfants`}
                variant="outlined"
                size="small"
              />
            </Box>
          )}
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
            bgcolor: isSelected ? 'transparent' : 'secondary.main',
            '&:hover': {
              bgcolor: isSelected ? 'transparent' : 'secondary.dark',
            },
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

        {plan.maxChildren && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Économisez CHF {((parseFloat(plan.originalPriceCHF || '0') - parseFloat(plan.priceCHF.toString())) / (plan.maxChildren || 1)).toFixed(2)} par enfant
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default FamilyPlanCard;
