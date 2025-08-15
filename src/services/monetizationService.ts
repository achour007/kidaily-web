import { loadStripe, Stripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Configuration Stripe
const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '';

// Types pour la monétisation
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  priceCHF: number;
  billingPeriod: 'monthly' | 'yearly' | 'one-time';
  features: string[];
  isPopular: boolean;
  isFamilyPlan: boolean;
  isProfessionalPlan: boolean; // Nouveau: pour les plans professionnels
  maxChildren: number;
  maxUsers?: number; // Nouveau: pour les plans professionnels (nombre d'éducateurs)
  discountPercentage?: string;
  originalPriceCHF?: string;
  stripePriceId?: string;
  targetAudience?: 'individual' | 'family' | 'professional'; // Nouveau: cible du plan
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

export interface SubscriptionStatus {
  isPremium: boolean;
  currentPlan?: SubscriptionPlan;
  expiresAt?: Date;
  canCancel: boolean;
  nextBillingDate?: Date;
}

// Plans d'abonnement par défaut
export const DEFAULT_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'kidaily_free',
    name: 'Gratuit',
    description: 'Accès de base pour un enfant',
    priceCHF: 0,
    billingPeriod: 'one-time',
    features: [
      'Suivi de base du développement',
      'Jusqu\'à 1 enfant',
      'Activités limitées',
      'Rapports basiques',
      'Support communautaire',
    ],
    isPopular: false,
    isFamilyPlan: false,
    isProfessionalPlan: false,
    maxChildren: 1,
    targetAudience: 'individual',
  },
  {
    id: 'kidaily_premium_monthly',
    name: 'Premium Mensuel',
    description: 'Accès complet pour un enfant',
    priceCHF: 9.90,
    billingPeriod: 'monthly',
    features: [
      'Toutes les fonctionnalités gratuites',
      'Rapports détaillés et avancés',
      'Contenu éducatif premium',
      'Activités illimitées',
      'Support prioritaire',
      'Sauvegarde cloud',
      'Export des données',
    ],
    isPopular: false,
    isFamilyPlan: false,
    isProfessionalPlan: false,
    maxChildren: 1,
    targetAudience: 'individual',
    stripePriceId: 'price_premium_monthly',
  },
  {
    id: 'kidaily_premium_yearly',
    name: 'Premium Annuel',
    description: 'Accès complet pour un enfant - Économisez 20%',
    priceCHF: 94.90,
    billingPeriod: 'yearly',
    features: [
      'Toutes les fonctionnalités premium',
      'Rapports détaillés et avancés',
      'Contenu éducatif premium',
      'Activités illimitées',
      'Support prioritaire',
      'Sauvegarde cloud',
      'Export des données',
      'Accès anticipé aux nouvelles fonctionnalités',
    ],
    isPopular: true,
    isFamilyPlan: false,
    isProfessionalPlan: false,
    maxChildren: 1,
    discountPercentage: '20',
    originalPriceCHF: '118.80',
    targetAudience: 'individual',
    stripePriceId: 'price_premium_yearly',
  },
  {
    id: 'kidaily_premium_family',
    name: 'Premium Famille',
    description: 'Accès complet pour toute la famille',
    priceCHF: 19.90,
    billingPeriod: 'monthly',
    features: [
      'Toutes les fonctionnalités premium',
      'Jusqu\'à 5 enfants',
      'Profils personnalisés par enfant',
      'Comparaison entre enfants',
      'Rapports familiaux',
      'Contenu éducatif premium',
      'Activités illimitées',
      'Support prioritaire',
      'Sauvegarde cloud',
      'Export des données',
    ],
    isPopular: true,
    isFamilyPlan: true,
    isProfessionalPlan: false,
    maxChildren: 5,
    targetAudience: 'family',
    stripePriceId: 'price_family_monthly',
  },
  {
    id: 'kidaily_premium_family_yearly',
    name: 'Premium Famille Annuel',
    description: 'Accès complet pour toute la famille - Économisez 25%',
    priceCHF: 179.90,
    billingPeriod: 'yearly',
    features: [
      'Toutes les fonctionnalités premium',
      'Jusqu\'à 5 enfants',
      'Profils personnalisés par enfant',
      'Comparaison entre enfants',
      'Rapports familiaux',
      'Contenu éducatif premium',
      'Activités illimitées',
      'Support prioritaire',
      'Sauvegarde cloud',
      'Export des données',
      'Accès anticipé aux nouvelles fonctionnalités',
      'Consultation pédiatrique incluse (1x/an)',
    ],
    isPopular: true,
    isFamilyPlan: true,
    isProfessionalPlan: false,
    maxChildren: 5,
    discountPercentage: '25',
    originalPriceCHF: '238.80',
    targetAudience: 'family',
    stripePriceId: 'price_family_yearly',
  },
  // NOUVEAUX PLANS PROFESSIONNELS
  {
    id: 'kidaily_pro_crèche_monthly',
    name: 'Pro Crèche Mensuel',
    description: 'Solution complète pour les crèches et garderies',
    priceCHF: 49.90,
    billingPeriod: 'monthly',
    features: [
      'Toutes les fonctionnalités premium',
      'Jusqu\'à 20 enfants',
      'Jusqu\'à 5 éducateurs',
      'Tableau de bord d\'équipe',
      'Rapports de groupe et individuels',
      'Planification d\'activités en équipe',
      'Communication parents-équipe',
      'Suivi des repas et siestes',
      'Gestion des présences',
      'Rapports de conformité',
      'Support prioritaire dédié',
      'Formation de l\'équipe incluse',
      'API d\'intégration',
      'Sauvegarde cloud sécurisée',
      'Export des données avancé',
    ],
    isPopular: false,
    isFamilyPlan: false,
    isProfessionalPlan: true,
    maxChildren: 20,
    maxUsers: 5,
    targetAudience: 'professional',
    stripePriceId: 'price_pro_crèche_monthly',
  },
  {
    id: 'kidaily_pro_crèche_yearly',
    name: 'Pro Crèche Annuel',
    description: 'Solution complète pour les crèches - Économisez 30%',
    priceCHF: 419.90,
    billingPeriod: 'yearly',
    features: [
      'Toutes les fonctionnalités premium',
      'Jusqu\'à 20 enfants',
      'Jusqu\'à 5 éducateurs',
      'Tableau de bord d\'équipe',
      'Rapports de groupe et individuels',
      'Planification d\'activités en équipe',
      'Communication parents-équipe',
      'Suivi des repas et siestes',
      'Gestion des présences',
      'Rapports de conformité',
      'Support prioritaire dédié',
      'Formation de l\'équipe incluse',
      'API d\'intégration',
      'Sauvegarde cloud sécurisée',
      'Export des données avancé',
      'Accès anticipé aux nouvelles fonctionnalités',
      'Consultation pédiatrique incluse (2x/an)',
      'Audit de conformité annuel',
    ],
    isPopular: true,
    isFamilyPlan: false,
    isProfessionalPlan: true,
    maxChildren: 20,
    maxUsers: 5,
    discountPercentage: '30',
    originalPriceCHF: '598.80',
    targetAudience: 'professional',
    stripePriceId: 'price_pro_crèche_yearly',
  },
  {
    id: 'kidaily_pro_institution_monthly',
    name: 'Pro Institution Mensuel',
    description: 'Solution entreprise pour grandes institutions',
    priceCHF: 99.90,
    billingPeriod: 'monthly',
    features: [
      'Toutes les fonctionnalités Pro Crèche',
      'Jusqu\'à 50 enfants',
      'Jusqu\'à 15 éducateurs',
      'Gestion multi-sites',
      'Tableau de bord directionnel',
      'Rapports financiers et budgétaires',
      'Gestion des ressources humaines',
      'Planification stratégique',
      'Analyse des tendances',
      'Intégration ERP/CRM',
      'Support 24/7 dédié',
      'Formation continue incluse',
      'Consultation pédiatrique illimitée',
      'Audit de conformité trimestriel',
      'Certification qualité incluse',
    ],
    isPopular: false,
    isFamilyPlan: false,
    isProfessionalPlan: true,
    maxChildren: 50,
    maxUsers: 15,
    targetAudience: 'professional',
    stripePriceId: 'price_pro_institution_monthly',
  },
  {
    id: 'kidaily_pro_institution_yearly',
    name: 'Pro Institution Annuel',
    description: 'Solution entreprise - Économisez 35%',
    priceCHF: 779.90,
    billingPeriod: 'yearly',
    features: [
      'Toutes les fonctionnalités Pro Institution',
      'Jusqu\'à 50 enfants',
      'Jusqu\'à 15 éducateurs',
      'Gestion multi-sites',
      'Tableau de bord directionnel',
      'Rapports financiers et budgétaires',
      'Gestion des ressources humaines',
      'Planification stratégique',
      'Analyse des tendances',
      'Intégration ERP/CRM',
      'Support 24/7 dédié',
      'Formation continue incluse',
      'Consultation pédiatrique illimitée',
      'Audit de conformité trimestriel',
      'Certification qualité incluse',
      'Accès anticipé aux nouvelles fonctionnalités',
      'Déploiement sur site possible',
      'Support d\'urgence prioritaire',
    ],
    isPopular: true,
    isFamilyPlan: false,
    isProfessionalPlan: true,
    maxChildren: 50,
    maxUsers: 15,
    discountPercentage: '35',
    originalPriceCHF: '1198.80',
    targetAudience: 'professional',
    stripePriceId: 'price_pro_institution_yearly',
  },
];

// Service de monétisation
export class MonetizationService {
  private static instance: MonetizationService;
  private stripe: Stripe | null = null;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): MonetizationService {
    if (!MonetizationService.instance) {
      MonetizationService.instance = new MonetizationService();
    }
    return MonetizationService.instance;
  }

  /**
   * Initialise le service de monétisation
   */
  public async initialize(): Promise<void> {
    try {
      if (this.isInitialized) return;

      // Charger Stripe
      if (STRIPE_PUBLISHABLE_KEY) {
        this.stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);
        console.log('Stripe initialisé avec succès');
      } else {
        console.warn('Clé Stripe non configurée');
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de Stripe:', error);
      throw error;
    }
  }

  /**
   * Obtient l'instance Stripe
   */
  public getStripe(): Stripe | null {
    return this.stripe;
  }

  /**
   * Vérifie si Stripe est disponible
   */
  public isStripeAvailable(): boolean {
    return this.stripe !== null;
  }

  /**
   * Obtient tous les plans d'abonnement
   */
  public getSubscriptionPlans(): SubscriptionPlan[] {
    return DEFAULT_SUBSCRIPTION_PLANS;
  }

  /**
   * Obtient un plan par son ID
   */
  public getPlanById(planId: string): SubscriptionPlan | undefined {
    return DEFAULT_SUBSCRIPTION_PLANS.find(plan => plan.id === planId);
  }

  /**
   * Obtient les plans payants
   */
  public getPaidPlans(): SubscriptionPlan[] {
    return DEFAULT_SUBSCRIPTION_PLANS.filter(plan => plan.priceCHF > 0);
  }

  /**
   * Obtient les plans populaires
   */
  public getPopularPlans(): SubscriptionPlan[] {
    return DEFAULT_SUBSCRIPTION_PLANS.filter(plan => plan.isPopular);
  }

  /**
   * Obtient les plans familiaux
   */
  public getFamilyPlans(): SubscriptionPlan[] {
    return DEFAULT_SUBSCRIPTION_PLANS.filter(plan => plan.isFamilyPlan);
  }

  /**
   * Obtient les plans professionnels
   */
  public getProfessionalPlans(): SubscriptionPlan[] {
    return DEFAULT_SUBSCRIPTION_PLANS.filter(plan => plan.isProfessionalPlan);
  }

  /**
   * Obtient les plans par audience cible
   */
  public getPlansByTargetAudience(targetAudience: 'individual' | 'family' | 'professional'): SubscriptionPlan[] {
    return DEFAULT_SUBSCRIPTION_PLANS.filter(plan => plan.targetAudience === targetAudience);
  }

  /**
   * Obtient le plan gratuit
   */
  public getFreePlan(): SubscriptionPlan | undefined {
    return DEFAULT_SUBSCRIPTION_PLANS.find(plan => plan.priceCHF === 0);
  }

  /**
   * Obtient le plan professionnel recommandé selon la taille de l'institution
   */
  public getRecommendedProfessionalPlan(childrenCount: number, educatorsCount: number, needsAdvancedFeatures: boolean): SubscriptionPlan | undefined {
    const professionalPlans = this.getProfessionalPlans();
    
    if (childrenCount <= 20 && educatorsCount <= 5) {
      return professionalPlans.find(plan => plan.id.includes('crèche'));
    } else if (childrenCount <= 50 && educatorsCount <= 15) {
      return professionalPlans.find(plan => plan.id.includes('institution'));
    } else {
      // Plan sur mesure pour très grandes institutions
      return professionalPlans.find(plan => plan.id.includes('institution'));
    }
  }

  /**
   * Vérifie si un plan peut accueillir le nombre d'enfants et d'éducateurs
   */
  public canPlanAccommodateUsers(plan: SubscriptionPlan, childrenCount: number, educatorsCount: number): boolean {
    if (plan.maxChildren < childrenCount) return false;
    if (plan.maxUsers && plan.maxUsers < educatorsCount) return false;
    return true;
  }

  /**
   * Calcule le coût par enfant pour un plan professionnel
   */
  public getCostPerChild(plan: SubscriptionPlan): number {
    if (plan.maxChildren === 0) return 0;
    return plan.priceCHF / plan.maxChildren;
  }

  /**
   * Calcule le coût par éducateur pour un plan professionnel
   */
  public getCostPerEducator(plan: SubscriptionPlan): number | null {
    if (!plan.maxUsers || plan.maxUsers === 0) return null;
    return plan.priceCHF / plan.maxUsers;
  }

  /**
   * Crée une intention de paiement pour un plan
   */
  public async createPaymentIntent(plan: SubscriptionPlan): Promise<PaymentIntent> {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({
          planId: plan.id,
          amount: plan.priceCHF * 100, // Stripe utilise les centimes
          currency: 'chf',
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'intention de paiement');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de l\'intention de paiement:', error);
      throw error;
    }
  }

  /**
   * Crée un abonnement
   */
  public async createSubscription(plan: SubscriptionPlan, paymentMethodId: string): Promise<any> {
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({
          planId: plan.id,
          paymentMethodId,
          stripePriceId: plan.stripePriceId,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'abonnement');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la création de l\'abonnement:', error);
      throw error;
    }
  }

  /**
   * Annule un abonnement
   */
  public async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      const response = await fetch(`/api/cancel-subscription/${subscriptionId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'annulation de l\'abonnement');
      }
    } catch (error) {
      console.error('Erreur lors de l\'annulation de l\'abonnement:', error);
      throw error;
    }
  }

  /**
   * Obtient le statut de l'abonnement actuel
   */
  public async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    try {
      const response = await fetch('/api/subscription-status', {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du statut');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération du statut:', error);
      // Retourner le statut gratuit par défaut
      return {
        isPremium: false,
        canCancel: false,
      };
    }
  }

  /**
   * Vérifie si l'utilisateur peut accéder à une fonctionnalité
   */
  public canAccessFeature(featureName: string, subscriptionStatus: SubscriptionStatus): boolean {
    if (!subscriptionStatus.isPremium) return false;

    const plan = subscriptionStatus.currentPlan;
    if (!plan) return false;

    switch (featureName) {
      case 'advanced_reports':
        return plan.id !== 'kidaily_free';
      case 'multiple_children':
        return plan.isFamilyPlan;
      case 'educational_content':
        return plan.id !== 'kidaily_free';
      case 'cloud_backup':
        return plan.id !== 'kidaily_free';
      case 'data_export':
        return plan.id !== 'kidaily_free';
      case 'priority_support':
        return plan.id !== 'kidaily_free';
      default:
        return false;
    }
  }

  /**
   * Obtient le nombre maximum d'enfants autorisés
   */
  public getMaxAllowedChildren(subscriptionStatus: SubscriptionStatus): number {
    if (!subscriptionStatus.isPremium) return 1;
    
    const plan = subscriptionStatus.currentPlan;
    return plan?.maxChildren || 1;
  }

  /**
   * Vérifie si l'utilisateur peut ajouter un enfant
   */
  public canAddChild(currentChildrenCount: number, subscriptionStatus: SubscriptionStatus): boolean {
    const maxAllowed = this.getMaxAllowedChildren(subscriptionStatus);
    return currentChildrenCount < maxAllowed;
  }

  /**
   * Obtient le plan recommandé
   */
  public getRecommendedPlan(childrenCount: number, needsAdvancedFeatures: boolean): SubscriptionPlan | undefined {
    if (childrenCount <= 1 && !needsAdvancedFeatures) {
      return this.getPlanById('kidaily_premium_monthly');
    } else if (childrenCount > 1) {
      return this.getPlanById('kidaily_premium_family');
    } else if (needsAdvancedFeatures) {
      return this.getPlanById('kidaily_premium_yearly');
    }
    return undefined;
  }

  /**
   * Calcule l'économie potentielle avec un plan annuel
   */
  public getPotentialAnnualSavings(): number | null {
    const monthlyPlan = this.getPlanById('kidaily_premium_monthly');
    const yearlyPlan = this.getPlanById('kidaily_premium_yearly');
    
    if (monthlyPlan && yearlyPlan) {
      return (monthlyPlan.priceCHF * 12) - yearlyPlan.priceCHF;
    }
    return null;
  }

  /**
   * Obtient le token d'authentification
   */
  private getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Nettoie les ressources
   */
  public dispose(): void {
    this.stripe = null;
    this.isInitialized = false;
  }
}

// Instance singleton
export const monetizationService = MonetizationService.getInstance();

// Hook personnalisé pour utiliser le service
export const useMonetization = () => {
  return monetizationService;
};
