/**
 * Configuration de déploiement pour Kidaily
 * Gère les différents environnements et configurations
 */

const deployConfig = {
  // Configuration de production
  production: {
    name: 'Production',
    apiUrl: 'https://api.kidaily.com',
    domain: 'kidaily.com',
    subdomain: 'www',
    ssl: true,
    cdn: true,
    analytics: true,
    monitoring: true,
    backup: true,
    environment: 'production'
  },

  // Configuration de staging
  staging: {
    name: 'Staging',
    apiUrl: 'https://staging-api.kidaily.com',
    domain: 'kidaily.com',
    subdomain: 'staging',
    ssl: true,
    cdn: false,
    analytics: true,
    monitoring: true,
    backup: false,
    environment: 'staging'
  },

  // Configuration de développement
  development: {
    name: 'Development',
    apiUrl: 'http://localhost:3000',
    domain: 'localhost',
    subdomain: '',
    ssl: false,
    cdn: false,
    analytics: false,
    monitoring: false,
    backup: false,
    environment: 'development'
  }
};

// Configuration des plateformes de déploiement
const platforms = {
  // Déploiement sur Vercel
  vercel: {
    name: 'Vercel',
    command: 'vercel --prod',
    configFile: 'vercel.json',
    advantages: ['Déploiement automatique', 'CDN global', 'HTTPS automatique', 'Prévisualisation des PR'],
    pricing: 'Gratuit pour projets personnels'
  },

  // Déploiement sur Netlify
  netlify: {
    name: 'Netlify',
    command: 'netlify deploy --prod',
    configFile: 'netlify.toml',
    advantages: ['Déploiement automatique', 'Formulaires intégrés', 'HTTPS automatique', 'Fonctions serverless'],
    pricing: 'Gratuit pour projets personnels'
  },

  // Déploiement sur GitHub Pages
  githubPages: {
    name: 'GitHub Pages',
    command: 'npm run deploy',
    configFile: 'package.json',
    advantages: ['Intégration Git', 'HTTPS automatique', 'Gratuit', 'Facile à configurer'],
    pricing: 'Gratuit'
  },

  // Déploiement sur AWS S3 + CloudFront
  aws: {
    name: 'AWS S3 + CloudFront',
    command: 'aws s3 sync build/ s3://kidaily-web --delete',
    configFile: 'aws-deploy.yml',
    advantages: ['Très scalable', 'CDN global', 'Haute disponibilité', 'Intégration complète'],
    pricing: 'Pay-per-use (très économique)'
  }
};

// Scripts de déploiement
const deployScripts = {
  // Déploiement complet
  full: {
    steps: [
      'npm run build',
      'npm run test:ci',
      'npm run build:analyze',
      'deploy to production',
      'run health checks',
      'notify team'
    ]
  },

  // Déploiement rapide
  quick: {
    steps: [
      'npm run build',
      'deploy to production',
      'basic health check'
    ]
  },

  // Déploiement avec rollback
  safe: {
    steps: [
      'npm run build',
      'deploy to staging',
      'run full test suite',
      'deploy to production',
      'monitor for 5 minutes',
      'rollback if issues detected'
    ]
  }
};

module.exports = {
  deployConfig,
  platforms,
  deployScripts
};
