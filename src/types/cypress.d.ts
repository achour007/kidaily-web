// Déclarations de types pour Cypress et les propriétés de test
declare global {
  interface Window {
    // Propriété Cypress officielle
    Cypress?: any;
    
    // Propriété cypress en minuscules (pour compatibilité)
    cypress?: any;
    
    // Propriétés personnalisées pour le mode test
    __FORCE_TEST_MODE__?: boolean;
    __CYPRESS_TEST_MODE__?: boolean;
    __TEST_MODE__?: boolean;
    __CYPRESS_MODE__?: boolean;
  }
}

export {};
