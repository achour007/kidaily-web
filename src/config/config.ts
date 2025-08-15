// Configuration de l'application Kidaily
export const config = {
  // Configuration de l'API
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:3000',
    timeout: 10000,
  },
  
  // Configuration de l'application
  app: {
    name: 'Kidaily',
    version: '1.0.0',
    description: 'Application de suivi éducatif',
  },
  
  // Configuration de l'authentification
  auth: {
    tokenKey: 'kidaily_token',
    refreshTokenKey: 'kidaily_refresh_token',
  },
  
  // Configuration des routes
  routes: {
    login: '/login',
    register: '/register',
    dashboard: '/',
    evaluation: '/evaluation',
    progress: '/suivi',
    activities: '/activites',
    advice: '/conseils',
    resources: '/ressources',
    proSpace: '/espace-pro',
  },
};

export default config; 