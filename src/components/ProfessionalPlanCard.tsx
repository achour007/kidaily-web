import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Business as BusinessIcon,
  ChildCare as ChildIcon,
  People as PeopleIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { SubscriptionPlan } from '../services/monetizationService';

interface ProfessionalPlanCardProps {
  plan: SubscriptionPlan;
  onSelect: (plan: SubscriptionPlan) => void;
  isSelected: boolean;
  showCostAnalysis?: boolean;
}

const ProfessionalPlanCard: React.FC<ProfessionalPlanCardProps> = ({
  plan,
  onSelect,
  isSelected,
  showCostAnalysis = true,
}) => {
  const theme = useTheme();

  const getBillingPeriodText = () => {
    switch (plan.billingPeriod) {
      case 'monthly':
        return 'par mois';
      case 'yearly':
        return 'par an (facturé annuellement)';
      case 'one-time':
        return 'paiement unique';
      default:
        return '';
    }
  };

  const getCostPerChild = () => {
    if (plan.maxChildren === 0) return null;
    return plan.priceCHF / plan.maxChildren;
  };

  const getCostPerEducator = () => {
    if (!plan.maxUsers || plan.maxUsers === 0) return null;
    return plan.priceCHF / plan.maxUsers;
  };

  return (
    <Card
      elevation={isSelected ? 8 : 4}
      sx={{
        margin: 2,
        border: isSelected ? `3px solid ${theme.palette.primary.main}` : 'none',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 8,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* En-tête avec badge "Pro" */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Chip
            label="PRO"
            color="primary"
            sx={{ fontWeight: 'bold', mr: 2 }}
          />
          <Typography variant="h5" component="h2" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            {plan.name}
          </Typography>
          {plan.isPopular && (
            <Chip
              label="POPULAIRE"
              color="warning"
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          )}
        </Box>

        {/* Description */}
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {plan.description}
        </Typography>

        {/* Prix et réduction */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h3" component="span" color="success.main" sx={{ fontWeight: 'bold' }}>
            CHF {plan.priceCHF.toFixed(2)}
          </Typography>
          {plan.discountPercentage && (
            <>
              <Typography
                variant="h5"
                component="span"
                sx={{
                  textDecoration: 'line-through',
                  color: 'text.disabled',
                  ml: 2,
                }}
              >
                CHF {plan.originalPriceCHF}
              </Typography>
              <Chip
                label={`-${plan.discountPercentage}%`}
                color="error"
                size="small"
                sx={{ ml: 1, fontWeight: 'bold' }}
              />
            </>
          )}
        </Box>

        {/* Période de facturation */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {getBillingPeriodText()}
        </Typography>

        {/* Capacités */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Box
              sx={{
                p: 2,
                bgcolor: 'primary.50',
                borderRadius: 2,
                border: `1px solid ${theme.palette.primary.light}`,
                textAlign: 'center',
              }}
            >
              <ChildIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h4" component="div" color="primary" sx={{ fontWeight: 'bold' }}>
                {plan.maxChildren}
              </Typography>
              <Typography variant="body2" color="primary">
                Enfants
              </Typography>
            </Box>
          </Grid>
          {plan.maxUsers && (
            <Grid item xs={6}>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'success.50',
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.success.light}`,
                  textAlign: 'center',
                }}
              >
                <PeopleIcon color="success" sx={{ fontSize: 32, mb: 1 }} />
                <Typography variant="h4" component="div" color="success.main" sx={{ fontWeight: 'bold' }}>
                  {plan.maxUsers}
                </Typography>
                <Typography variant="body2" color="success.main">
                  Éducateurs
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        {/* Analyse des coûts */}
        {showCostAnalysis && plan.isProfessionalPlan && (
          <Box
            sx={{
              p: 2,
              bgcolor: 'grey.100',
              borderRadius: 2,
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Analyse des coûts
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Par enfant
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    CHF {getCostPerChild()?.toFixed(2) || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              {plan.maxUsers && (
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Par éducateur
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      CHF {getCostPerEducator()?.toFixed(2) || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Fonctionnalités */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          Fonctionnalités incluses:
        </Typography>
        <List dense>
          {plan.features.map((feature, index) => (
            <ListItem key={index} sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={feature} />
            </ListItem>
          ))}
        </List>

        {/* Bouton de sélection */}
        <Button
          variant={isSelected ? 'outlined' : 'contained'}
          fullWidth
          size="large"
          onClick={() => onSelect(plan)}
          sx={{
            mt: 3,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1.1rem',
            fontWeight: 'bold',
          }}
        >
          {isSelected ? 'Plan sélectionné' : 'Choisir ce plan'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfessionalPlanCard;
