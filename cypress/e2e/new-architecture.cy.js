describe('Nouvelle Architecture Kidaily', () => {
  it('devrait permettre l\'accès à /register sans redirection', () => {
    cy.visit('/register');
    
    // Attendre que la page se charge
    cy.wait(2000);
    
    // Vérifier que nous sommes toujours sur /register
    cy.url().should('include', '/register');
    cy.url().should('not.include', '/setup');
    
    // Vérifier que le composant RegisterScreen est rendu
    cy.get('body').should('contain', 'Inscription');
    
    // Vérifier que nos data-testid sont présents
    cy.get('[data-testid="register-form"]').should('exist');
    cy.get('[data-testid="firstName-input"]').should('exist');
    cy.get('[data-testid="email-input"]').should('exist');
  });

  it('devrait permettre l\'accès à /login sans redirection', () => {
    cy.visit('/login');
    
    // Attendre que la page se charge
    cy.wait(2000);
    
    // Vérifier que nous sommes toujours sur /login
    cy.url().should('include', '/login');
    cy.url().should('not.include', '/setup');
    
    // Vérifier que le composant LoginScreen est rendu
    cy.get('body').should('contain', 'Connexion');
    
    // Vérifier que nos data-testid sont présents
    cy.get('[data-testid="login-form"]').should('exist');
    cy.get('[data-testid="email-input"]').should('exist');
    cy.get('[data-testid="password-input"]').should('exist');
  });

  it('devrait toujours permettre l\'accès à /setup', () => {
    cy.visit('/setup');
    
    // Attendre que la page se charge
    cy.wait(2000);
    
    // Vérifier que nous sommes sur /setup
    cy.url().should('include', '/setup');
    
    // Vérifier que le composant SetupScreen est rendu
    cy.get('body').should('contain', 'Configuration');
  });

  it('devrait détecter le mode test et désactiver la redirection', () => {
    // Visiter une route qui n'existe pas pour tester la redirection par défaut
    cy.visit('/route-inexistante');
    
    // Attendre que la page se charge
    cy.wait(2000);
    
    // En mode test, la redirection vers /setup devrait être désactivée
    // Donc nous devrions rester sur la route demandée ou avoir une erreur 404
    cy.url().should('not.include', '/setup');
  });
});
