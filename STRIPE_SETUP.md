# Configuration Stripe pour Kidaily Web

## Vue d'ensemble

Ce guide explique comment configurer Stripe pour les paiements et abonnements dans l'application web Kidaily.

## Prérequis

1. **Compte Stripe** : Créez un compte sur [stripe.com](https://stripe.com)
2. **Clés API** : Obtenez vos clés de test et de production depuis le dashboard Stripe

## Configuration

### 1. Variables d'environnement

Créez un fichier `.env` à la racine du projet web avec les variables suivantes :

```bash
# Clé publique Stripe (visible côté client)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Configuration de l'API
REACT_APP_API_URL=http://localhost:3000/api

# Mode de développement
REACT_APP_NODE_ENV=development
```

### 2. Clés Stripe

#### Clés de test (développement)
- **Clé publique** : Commence par `pk_test_`
- **Clé secrète** : Commence par `sk_test_` (côté serveur uniquement)

#### Clés de production
- **Clé publique** : Commence par `pk_live_`
- **Clé secrète** : Commence par `sk_live_` (côté serveur uniquement)

### 3. Configuration des produits dans Stripe

#### Plans d'abonnement individuels
- `price_premium_monthly` : 9.90 CHF/mois
- `price_premium_yearly` : 94.90 CHF/an

#### Plans d'abonnement famille
- `price_family_monthly` : 19.90 CHF/mois
- `price_family_yearly` : 189.90 CHF/an

#### Plans d'abonnement professionnels
- `price_pro_crèche_monthly` : 49.90 CHF/mois
- `price_pro_crèche_yearly` : 499.90 CHF/an
- `price_pro_institution_monthly` : 99.90 CHF/mois
- `price_pro_institution_yearly` : 999.90 CHF/an

## Structure des fichiers

```
web/
├── src/
│   ├── config/
│   │   └── stripe.ts          # Configuration Stripe
│   ├── services/
│   │   └── monetizationService.ts  # Service de monétisation
│   └── components/
│       └── ProfessionalPlanCard.tsx # Composant des plans pro
├── .env                       # Variables d'environnement (à créer)
└── STRIPE_SETUP.md           # Ce fichier
```

## Utilisation

### 1. Initialisation du service

```typescript
import { MonetizationService } from './services/monetizationService';

const monetizationService = MonetizationService.getInstance();
await monetizationService.initialize();
```

### 2. Création d'un paiement

```typescript
const plan = monetizationService.getPlanById('kidaily_premium_monthly');
const paymentIntent = await monetizationService.createPaymentIntent(plan);
```

### 3. Création d'un abonnement

```typescript
const subscription = await monetizationService.createSubscription(plan, paymentMethodId);
```

## Sécurité

### ⚠️ Important
- **Ne jamais** exposer la clé secrète côté client
- **Toujours** valider les paiements côté serveur
- **Utiliser** les webhooks Stripe pour les mises à jour en temps réel

### Webhooks recommandés
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## Test

### 1. Cartes de test Stripe
- **Succès** : `4242 4242 4242 4242`
- **Échec** : `4000 0000 0000 0002`
- **3D Secure** : `4000 0025 0000 3155`

### 2. Mode test
```bash
npm run start:test
```

## Déploiement

### 1. Variables de production
```bash
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_your_production_key
REACT_APP_NODE_ENV=production
```

### 2. Vérification
```bash
npm run build
npm run deploy:check
```

## Support

- **Documentation Stripe** : [stripe.com/docs](https://stripe.com/docs)
- **Support Stripe** : [support.stripe.com](https://support.stripe.com)
- **Dashboard Stripe** : [dashboard.stripe.com](https://dashboard.stripe.com)

## Dépannage

### Erreur : "Cannot find module '@stripe/stripe-js'"
```bash
npm install
```

### Erreur : "Invalid API key provided"
- Vérifiez que votre clé commence par `pk_test_` ou `pk_live_`
- Vérifiez que la clé est correctement copiée dans le fichier `.env`

### Erreur : "Stripe has not been initialized"
- Appelez `monetizationService.initialize()` avant d'utiliser le service
- Vérifiez que la clé publique est configurée
