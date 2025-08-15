/**
 * Configuration Stripe pour Kidaily
 * 
 * Pour utiliser Stripe, vous devez créer un fichier .env à la racine du projet
 * avec les variables suivantes :
 * 
 * REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
 * REACT_APP_STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here (côté serveur uniquement)
 */

export const STRIPE_CONFIG = {
  // Clé publique Stripe (visible côté client)
  publishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '',
  
  // Configuration des devises supportées
  supportedCurrencies: ['chf', 'eur', 'usd'],
  
  // Devise par défaut
  defaultCurrency: 'chf',
  
  // Configuration des modes de paiement
  paymentMethods: {
    card: true,
    sepa: false, // SEPA pour l'Europe
    ideal: false, // iDEAL pour les Pays-Bas
    sofort: false, // SOFORT pour l'Allemagne
  },
  
  // Configuration des webhooks (côté serveur)
  webhookEndpoints: {
    paymentIntentSucceeded: '/api/webhooks/stripe/payment-intent-succeeded',
    paymentIntentFailed: '/api/webhooks/stripe/payment-intent-failed',
    subscriptionCreated: '/api/webhooks/stripe/subscription-created',
    subscriptionUpdated: '/api/webhooks/stripe/subscription-updated',
    subscriptionDeleted: '/api/webhooks/stripe/subscription-deleted',
  },
  
  // Configuration des plans d'abonnement
  subscriptionPlans: {
    // Plans individuels
    individual: {
      monthly: 'price_premium_monthly',
      yearly: 'price_premium_yearly',
    },
    // Plans famille
    family: {
      monthly: 'price_family_monthly',
      yearly: 'price_family_yearly',
    },
    // Plans professionnels
    professional: {
      crèche: {
        monthly: 'price_pro_crèche_monthly',
        yearly: 'price_pro_crèche_yearly',
      },
      institution: {
        monthly: 'price_pro_institution_monthly',
        yearly: 'price_pro_institution_yearly',
      },
    },
  },
};

/**
 * Vérifie si la configuration Stripe est valide
 */
export const isStripeConfigured = (): boolean => {
  return !!STRIPE_CONFIG.publishableKey && STRIPE_CONFIG.publishableKey.startsWith('pk_');
};

/**
 * Obtient la clé publique Stripe
 */
export const getStripePublishableKey = (): string => {
  if (!isStripeConfigured()) {
    console.warn('⚠️ Clé Stripe non configurée. Vérifiez votre fichier .env');
    return '';
  }
  return STRIPE_CONFIG.publishableKey;
};

/**
 * Configuration des options Stripe
 */
export const STRIPE_OPTIONS = {
  mode: 'payment',
  currency: STRIPE_CONFIG.defaultCurrency,
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#1976d2', // Couleur Material-UI primary
      colorBackground: '#ffffff',
      colorText: '#333333',
      colorDanger: '#d32f2f',
      fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  },
};
