describe('Authentification Kidaily - Version Corrigée', () => {
  beforeEach(() => {
    // Nettoyer complètement avant chaque test
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.clearSessionStorage()
    
    // Attendre que l'application soit prête
    cy.wait(1000)
  })

  describe('Inscription', () => {
    it('devrait permettre l\'inscription d\'un nouvel utilisateur', () => {
      // Forcer le mode test AVANT de visiter la page
      cy.window().then((win) => {
        win.__FORCE_TEST_MODE__ = true
        win.__CYPRESS_TEST_MODE__ = true
        win.__TEST_MODE__ = true
        win.__CYPRESS_MODE__ = true
        
        win.localStorage.setItem('cypress_mode', 'true')
        win.sessionStorage.setItem('cypress_mode', 'true')
        win.localStorage.setItem('test_mode', 'true')
        win.sessionStorage.setItem('test_mode', 'true')
        
        cy.log('Mode test activé avant navigation')
      })
      
      // Maintenant visiter la page
      cy.visit('/register')
      cy.wait(3000) // Attendre plus longtemps pour le rendu complet

      // Vérifier que nous ne sommes PAS redirigés vers /setup
      cy.url().should('not.include', '/setup')
      cy.url().should('include', '/register')

      // Attendre que l'application React soit chargée
      cy.get('#root').should('not.be.empty')
      cy.wait(2000)

      // Vérifier que le formulaire s'affiche
      cy.get('[data-testid="register-form"]').should('be.visible')
      
      // Remplir le formulaire d'inscription
      cy.get('[data-testid="firstName-input"]').should('be.visible').type('Test')
      cy.get('[data-testid="lastName-input"]').should('be.visible').type('User')
      cy.get('[data-testid="email-input"]').should('be.visible').type('test@kidaily.com')
      cy.get('[data-testid="password-input"]').should('be.visible').type('password123')
      cy.get('[data-testid="confirmPassword-input"]').should('be.visible').type('password123')

      // Soumettre le formulaire
      cy.get('[data-testid="register-submit"]').should('be.visible').click()

      // Attendre la redirection vers le dashboard
      cy.url({ timeout: 15000 }).should('include', '/dashboard')
    })

    it('devrait afficher une erreur pour un email déjà utilisé', () => {
      // Forcer le mode test AVANT de visiter la page
      cy.window().then((win) => {
        win.__FORCE_TEST_MODE__ = true
        win.__CYPRESS_TEST_MODE__ = true
        win.localStorage.setItem('cypress_mode', 'true')
        win.sessionStorage.setItem('cypress_mode', 'true')
      })
      
      cy.visit('/register')
      cy.wait(3000)

      // Vérifier que nous ne sommes pas redirigés vers /setup
      cy.url().should('not.include', '/setup')
      cy.url().should('include', '/register')

      // Attendre que l'application React soit chargée
      cy.get('#root').should('not.be.empty')
      cy.wait(2000)

      // Remplir le formulaire avec un email existant
      cy.get('[data-testid="firstName-input"]').should('be.visible').type('Test')
      cy.get('[data-testid="lastName-input"]').should('be.visible').type('User')
      cy.get('[data-testid="email-input"]').should('be.visible').type('existing@kidaily.com')
      cy.get('[data-testid="password-input"]').should('be.visible').type('password123')
      cy.get('[data-testid="confirmPassword-input"]').should('be.visible').type('password123')

      // Soumettre le formulaire
      cy.get('[data-testid="register-submit"]').should('be.visible').click()

      // Vérifier que l'erreur s'affiche
      cy.get('.MuiAlert-message, .MuiFormHelperText-root').should('contain', 'existe')
    })

    it('devrait valider les champs requis', () => {
      // Forcer le mode test AVANT de visiter la page
      cy.window().then((win) => {
        win.__FORCE_TEST_MODE__ = true
        win.__CYPRESS_TEST_MODE__ = true
        win.localStorage.setItem('cypress_mode', 'true')
        win.sessionStorage.setItem('cypress_mode', 'true')
      })
      
      cy.visit('/register')
      cy.wait(3000)

      // Vérifier que nous ne sommes pas redirigés vers /setup
      cy.url().should('not.include', '/setup')
      cy.url().should('include', '/register')

      // Attendre que l'application React soit chargée
      cy.get('#root').should('not.be.empty')
      cy.wait(2000)

      // Essayer de soumettre sans remplir les champs
      cy.get('[data-testid="register-submit"]').should('be.visible').click()

      // Vérifier les messages d'erreur Material-UI
      cy.get('.MuiFormHelperText-root').should('contain', 'requis')
    })
  })

  describe('Connexion', () => {
    it('devrait permettre la connexion d\'un utilisateur existant', () => {
      // Forcer le mode test AVANT de visiter la page
      cy.window().then((win) => {
        win.__FORCE_TEST_MODE__ = true
        win.__CYPRESS_TEST_MODE__ = true
        win.localStorage.setItem('cypress_mode', 'true')
        win.sessionStorage.setItem('cypress_mode', 'true')
      })
      
      cy.visit('/login')
      cy.wait(3000)

      // Vérifier que nous ne sommes pas redirigés vers /setup
      cy.url().should('not.include', '/setup')
      cy.url().should('include', '/login')

      // Attendre que l'application React soit chargée
      cy.get('#root').should('not.be.empty')
      cy.wait(2000)

      // Remplir le formulaire de connexion
      cy.get('[data-testid="email-input"]').should('be.visible').type('test@kidaily.com')
      cy.get('[data-testid="password-input"]').should('be.visible').type('password123')

      // Soumettre le formulaire
      cy.get('[data-testid="login-submit"]').should('be.visible').click()

      // Vérifier la redirection vers le dashboard
      cy.url({ timeout: 15000 }).should('include', '/dashboard')
    })

    it('devrait afficher une erreur pour des identifiants invalides', () => {
      // Forcer le mode test AVANT de visiter la page
      cy.window().then((win) => {
        win.__FORCE_TEST_MODE__ = true
        win.__CYPRESS_TEST_MODE__ = true
        win.localStorage.setItem('cypress_mode', 'true')
        win.sessionStorage.setItem('cypress_mode', 'true')
      })
      
      cy.visit('/login')
      cy.wait(3000)

      // Vérifier que nous ne sommes pas redirigés vers /setup
      cy.url().should('not.include', '/setup')
      cy.url().should('include', '/login')

      // Attendre que l'application React soit chargée
      cy.get('#root').should('not.be.empty')
      cy.wait(2000)

      // Remplir le formulaire avec des identifiants invalides
      cy.get('[data-testid="email-input"]').should('be.visible').type('invalid@kidaily.com')
      cy.get('[data-testid="password-input"]').should('be.visible').type('wrongpassword')

      // Soumettre le formulaire
      cy.get('[data-testid="login-submit"]').should('be.visible').click()

      // Vérifier que l'erreur s'affiche
      cy.get('.MuiAlert-message, .MuiFormHelperText-root').should('contain', 'invalides')
    })
  })
})
