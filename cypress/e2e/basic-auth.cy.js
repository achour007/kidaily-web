describe('Authentification Kidaily - Tests Basiques', () => {
  beforeEach(() => {
    // Nettoyer le stockage avant chaque test
    cy.clearLocalStorage();
    cy.clearCookies();
    
    // Forcer le mode test
    cy.window().then((win) => {
      win.__FORCE_TEST_MODE__ = true;
      win.__CYPRESS_TEST_MODE__ = true;
      win.Cypress = true;
      win.localStorage.setItem('REACT_APP_TEST_MODE', 'true');
      win.localStorage.setItem('REACT_APP_DISABLE_SETUP_REDIRECT', 'true');
    });
  });

  describe('Page de connexion', () => {
    it('devrait afficher la page de connexion', () => {
      cy.visit('/login');
      
      // Attendre que la page se charge
      cy.get('#root').should('not.be.empty');
      cy.wait(2000);
      
      // Vérifier que nous sommes sur la page de connexion
      cy.url().should('include', '/login');
      
      // Vérifier que le formulaire s'affiche
      cy.get('[data-testid="login-form"]').should('be.visible');
      cy.get('[data-testid="email-input"]').should('be.visible');
      cy.get('[data-testid="password-input"]').should('be.visible');
      cy.get('[data-testid="login-submit"]').should('be.visible');
    });

    it('devrait permettre de remplir le formulaire de connexion', () => {
      cy.visit('/login');
      cy.wait(2000);
      
      // Attendre que les champs soient complètement chargés et cibler les input
      cy.get('[data-testid="email-input"] input').should('be.visible').should('not.be.disabled');
      cy.get('[data-testid="password-input"] input').should('be.visible').should('not.be.disabled');
      
      // Remplir le formulaire avec des attentes
      cy.get('[data-testid="email-input"] input').clear().type('test@kidaily.com', { force: true });
      cy.get('[data-testid="password-input"] input').clear().type('password123', { force: true });
      
      // Attendre un peu pour que la saisie soit traitée
      cy.wait(500);
      
      // Vérifier que les champs sont remplis
      cy.get('[data-testid="email-input"] input').should('have.value', 'test@kidaily.com');
      cy.get('[data-testid="password-input"] input').should('have.value', 'password123');
    });
  });

  describe('Page d\'inscription', () => {
    it('devrait afficher la page d\'inscription', () => {
      cy.visit('/register');
      
      // Attendre que la page se charge
      cy.get('#root').should('not.be.empty');
      cy.wait(2000);
      
      // Vérifier que nous sommes sur la page d'inscription
      cy.url().should('include', '/register');
      
      // Vérifier que le formulaire s'affiche
      cy.get('[data-testid="register-form"]').should('be.visible');
      cy.get('[data-testid="firstName-input"]').should('be.visible');
      cy.get('[data-testid="lastName-input"]').should('be.visible');
      cy.get('[data-testid="email-input"]').should('be.visible');
      cy.get('[data-testid="password-input"]').should('be.visible');
      cy.get('[data-testid="confirmPassword-input"]').should('be.visible');
      cy.get('[data-testid="register-submit"]').should('be.visible');
    });

    it('devrait permettre de remplir le formulaire d\'inscription', () => {
      cy.visit('/register');
      cy.wait(2000);
      
      // Attendre que tous les champs soient complètement chargés et cibler les input
      cy.get('[data-testid="firstName-input"] input').should('be.visible').should('not.be.disabled');
      cy.get('[data-testid="lastName-input"] input').should('be.visible').should('not.be.disabled');
      cy.get('[data-testid="email-input"] input').should('be.visible').should('not.be.disabled');
      cy.get('[data-testid="password-input"] input').should('be.visible').should('not.be.disabled');
      cy.get('[data-testid="confirmPassword-input"] input').should('be.visible').should('not.be.disabled');
      
      // Remplir le formulaire étape par étape
      cy.get('[data-testid="firstName-input"] input').clear().type('Test', { force: true });
      cy.wait(200);
      cy.get('[data-testid="lastName-input"] input').clear().type('User', { force: true });
      cy.wait(200);
      cy.get('[data-testid="email-input"] input').clear().type('test@kidaily.com', { force: true });
      cy.wait(200);
      cy.get('[data-testid="password-input"] input').clear().type('password123', { force: true });
      cy.wait(200);
      cy.get('[data-testid="confirmPassword-input"] input').clear().type('password123', { force: true });
      
      // Attendre un peu pour que la saisie soit traitée
      cy.wait(500);
      
      // Vérifier que les champs sont remplis
      cy.get('[data-testid="firstName-input"] input').should('have.value', 'Test');
      cy.get('[data-testid="lastName-input"] input').should('have.value', 'User');
      cy.get('[data-testid="email-input"] input').should('have.value', 'test@kidaily.com');
      cy.get('[data-testid="password-input"] input').should('have.value', 'password123');
      cy.get('[data-testid="confirmPassword-input"] input').should('have.value', 'password123');
    });
  });

  describe('Navigation', () => {
    it('devrait permettre la navigation entre login et register', () => {
      // Aller sur la page de connexion
      cy.visit('/login');
      cy.wait(2000);
      cy.url().should('include', '/login');
      
      // Cliquer sur le lien d'inscription
      cy.contains('Créer un compte').click();
      cy.wait(2000);
      cy.url().should('include', '/register');
      
      // Retourner sur la page de connexion
      cy.contains('Se connecter').click();
      cy.wait(2000);
      cy.url().should('include', '/login');
    });
  });
});
