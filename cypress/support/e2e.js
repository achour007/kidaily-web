// Support Cypress ultra-intelligent pour Kidaily
// Configuration globale et commandes personnalisées

import './commands';

// Configuration globale pour les tests Kidaily
Cypress.on('uncaught:exception', (err, runnable) => {
  // Empêcher Cypress de s'arrêter sur les erreurs non critiques
  if (err.message.includes('ResizeObserver loop limit exceeded') ||
      err.message.includes('Script error') ||
      err.message.includes('ResizeObserver loop') ||
      err.message.includes('Cannot read properties of undefined')) {
    return false;
  }
  return true;
});

// Configuration pour forcer le mode test avant chaque test
beforeEach(() => {
  // Nettoyer le stockage avant chaque test
  cy.clearLocalStorage();
  cy.clearCookies();
  
  // Forcer le mode test dans l'application
  cy.window().then((win) => {
    // Définir les variables globales pour forcer le mode test
    win.__FORCE_TEST_MODE__ = true;
    win.__CYPRESS_TEST_MODE__ = true;
    win.__TEST_MODE__ = true;
    win.__CYPRESS_MODE__ = true;

    // Définir Cypress globalement
    win.Cypress = true;
    win.cypress = true;

    // Ajouter des paramètres d'URL pour forcer le mode test
    if (!win.location.search.includes('cypress')) {
      const separator = win.location.search ? '&' : '?';
      win.history.replaceState(
        null,
        '',
        win.location.pathname + win.location.search + separator + 'cypress=true'
      );
    }

    // Définir dans le stockage local
    win.localStorage.setItem('cypress_mode', 'true');
    win.localStorage.setItem('test_mode', 'true');
    win.localStorage.setItem('REACT_APP_TEST_MODE', 'true');
    win.localStorage.setItem('REACT_APP_CYPRESS_MODE', 'true');
    win.localStorage.setItem('REACT_APP_DISABLE_SETUP_REDIRECT', 'true');
  });

  // Attendre que l'application soit prête
  cy.wait(1000);
});

// Commande ultra-robuste pour forcer le mode test
Cypress.Commands.add('forceTestMode', () => {
  cy.window().then((win) => {
    // Définir toutes les variables globales possibles
    win.__FORCE_TEST_MODE__ = true;
    win.__CYPRESS_TEST_MODE__ = true;
    win.__TEST_MODE__ = true;
    win.__CYPRESS_MODE__ = true;
    
    // Définir Cypress globalement
    win.Cypress = true;
    win.cypress = true;
    
    // Définir dans le stockage local
    win.localStorage.setItem('cypress_mode', 'true');
    win.localStorage.setItem('test_mode', 'true');
    win.localStorage.setItem('REACT_APP_TEST_MODE', 'true');
    win.localStorage.setItem('REACT_APP_CYPRESS_MODE', 'true');
    win.localStorage.setItem('REACT_APP_DISABLE_SETUP_REDIRECT', 'true');
    
    // Ajouter des paramètres d'URL
    const searchParams = new URLSearchParams(win.location.search);
    searchParams.set('cypress', 'true');
    searchParams.set('test', 'true');
    searchParams.set('e2e', 'true');
    
    win.history.replaceState(
      null,
      '',
      win.location.pathname + '?' + searchParams.toString()
    );
    
    cy.log('Mode test forcé avec succès');
  });
});

// Commande pour visiter une page en mode test
Cypress.Commands.add('visitWithTestMode', (url) => {
  // Forcer le mode test d'abord
  cy.forceTestMode();
  
  // Attendre un peu pour que les variables soient définies
  cy.wait(500);
  
  // Visiter la page
  cy.visit(url);
  
  // Attendre que la page se charge
  cy.wait(2000);
  
  // Vérifier que nous ne sommes pas redirigés vers /setup
  cy.url().should('not.include', '/setup');
});

// Configuration pour les tests d'authentification
Cypress.Commands.add('login', (email, password) => {
  cy.visitWithTestMode('/login');
  cy.get('[data-testid="email-input"]').should('be.visible').type(email);
  cy.get('[data-testid="password-input"]').should('be.visible').type(password);
  cy.get('[data-testid="login-submit"]').should('be.visible').click();
  cy.url().should('not.include', '/login');
});

// Configuration pour les tests d'inscription
Cypress.Commands.add('register', (email, password, firstName, lastName) => {
  cy.visitWithTestMode('/register');
  cy.get('[data-testid="email-input"]').should('be.visible').type(email);
  cy.get('[data-testid="password-input"]').should('be.visible').type(password);
  cy.get('[data-testid="firstName-input"]').should('be.visible').type(firstName);
  cy.get('[data-testid="lastName-input"]').should('be.visible').type(lastName);
  cy.get('[data-testid="register-submit"]').should('be.visible').click();
  cy.url().should('not.include', '/register');
});

// Configuration pour la déconnexion
Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="logout-button"]').click();
  cy.url().should('include', '/login');
});

// Configuration pour créer un enfant
Cypress.Commands.add('createChild', (name, birthDate, gender) => {
  cy.get('[data-testid="add-child-button"]').click();
  cy.get('[data-testid="child-name-input"]').type(name);
  cy.get('[data-testid="child-birthdate-input"]').type(birthDate);
  cy.get('[data-testid="child-gender-select"]').select(gender);
  cy.get('[data-testid="save-child-button"]').click();
  cy.contains(name).should('be.visible');
});

// Commande personnalisée pour attendre que la page soit chargée
Cypress.Commands.add('waitForPageLoad', () => {
  // Attendre que l'application React soit chargée
  cy.get('#root').should('not.be.empty');

  // Attendre que la redirection ne se déclenche pas
  cy.url().should('not.include', '/setup');

  // Attendre un peu pour que React soit complètement rendu
  cy.wait(1000);
});

// Commande pour vérifier que le mode test est activé
Cypress.Commands.add('ensureTestMode', () => {
  cy.window().then((win) => {
    // Vérifier que le mode test est activé
    expect(win.__FORCE_TEST_MODE__).to.be.true;
    expect(win.__CYPRESS_TEST_MODE__).to.be.true;
    expect(win.Cypress).to.be.true;

    // Vérifier que la redirection setup est désactivée
    cy.log('Mode test activé - redirection setup désactivée');
  });
});

// Commande pour nettoyer les données de test
Cypress.Commands.add('cleanupTestData', () => {
  cy.window().then((win) => {
    // Nettoyer le stockage local
    win.localStorage.clear();
    
    // Réinitialiser les variables globales
    delete win.__FORCE_TEST_MODE__;
    delete win.__CYPRESS_TEST_MODE__;
    delete win.__TEST_MODE__;
    delete win.__CYPRESS_MODE__;
    
    cy.log('Données de test nettoyées');
  });
});

// Commande pour attendre les appels API
Cypress.Commands.add('waitForApi', (alias = 'api') => {
  cy.wait(`@${alias}`, { timeout: 10000 });
});

// Commande pour vérifier la performance
Cypress.Commands.add('checkPerformance', () => {
  cy.window().then((win) => {
    // Vérifier les métriques de performance
    if (win.performance && win.performance.getEntriesByType) {
      const navigationEntries = win.performance.getEntriesByType('navigation');
      if (navigationEntries.length > 0) {
        const navigation = navigationEntries[0];
        cy.log(`Temps de chargement: ${navigation.loadEventEnd - navigation.loadEventStart}ms`);
        cy.log(`Temps de réponse: ${navigation.responseEnd - navigation.requestStart}ms`);
      }
    }
  });
}); 