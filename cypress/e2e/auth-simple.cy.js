describe('Authentification Kidaily - Tests Simplifiés', () => {
  beforeEach(() => {
    // Nettoyer complètement avant chaque test
    cy.clearLocalStorage()
    cy.clearCookies()
    // cy.clearSessionStorage() n'existe plus dans Cypress 14
    
    // Attendre que l'application soit prête
    cy.wait(1000)
  })

  describe('Inscription', () => {
    it('devrait permettre l\'inscription d\'un nouvel utilisateur', () => {
      // Utiliser la commande robuste pour visiter en mode test
      cy.visitWithTestMode('/register')

      // Vérifier que nous sommes bien sur la page d'inscription
      cy.url().should('include', '/register')
      cy.url().should('not.include', '/setup')

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
      cy.visitWithTestMode('/register')

      // Vérifier que nous sommes bien sur la page d'inscription
      cy.url().should('include', '/register')
      cy.url().should('not.include', '/setup')

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

      // Vérifier que l'erreur s'affiche (les erreurs sont dans helperText des TextField)
      cy.get('[data-testid="email-input"]').parent().find('.MuiFormHelperText-root').should('be.visible')
    })

    it('devrait valider les champs requis', () => {
      cy.visitWithTestMode('/register')

      // Vérifier que nous sommes bien sur la page d'inscription
      cy.url().should('include', '/register')
      cy.url().should('not.include', '/setup')

      // Attendre que l'application React soit chargée
      cy.get('#root').should('not.be.empty')
      cy.wait(2000)

      // Essayer de soumettre sans remplir les champs
      cy.get('[data-testid="register-submit"]').should('be.visible').click()

      // Vérifier les messages d'erreur Material-UI (les erreurs sont dans helperText des TextField)
      cy.get('[data-testid="firstName-input"]').parent().find('.MuiFormHelperText-root').should('be.visible')
    })
  })

  describe('Connexion', () => {
    it('devrait permettre la connexion d\'un utilisateur existant', () => {
      cy.visitWithTestMode('/login')

      // Vérifier que nous sommes bien sur la page de connexion
      cy.url().should('include', '/login')
      cy.url().should('not.include', '/setup')

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
      cy.visitWithTestMode('/login')

      // Vérifier que nous sommes bien sur la page de connexion
      cy.url().should('include', '/login')
      cy.url().should('not.include', '/setup')

      // Attendre que l'application React soit chargée
      cy.get('#root').should('not.be.empty')
      cy.wait(2000)

      // Remplir le formulaire avec des identifiants invalides
      cy.get('[data-testid="email-input"]').should('be.visible').type('invalid@kidaily.com')
      cy.get('[data-testid="password-input"]').should('be.visible').type('wrongpassword')

      // Soumettre le formulaire
      cy.get('[data-testid="login-submit"]').should('be.visible').click()

      // Vérifier que l'erreur s'affiche (les erreurs sont dans helperText des TextField)
      cy.get('[data-testid="email-input"]').parent().find('.MuiFormHelperText-root').should('be.visible')
    })
  })

  describe('Navigation et redirections', () => {
    it('devrait permettre l\'accès direct aux pages d\'authentification', () => {
      // Tester l'accès à la page d'inscription
      cy.visitWithTestMode('/register')
      cy.url().should('include', '/register')
      cy.url().should('not.include', '/setup')
      
      // Tester l'accès à la page de connexion
      cy.visitWithTestMode('/login')
      cy.url().should('include', '/login')
      cy.url().should('not.include', '/setup')
    })

    it('devrait maintenir le mode test lors de la navigation', () => {
      cy.visitWithTestMode('/register')
      
      // Vérifier que le mode test est maintenu
      cy.window().then((win) => {
        expect(win.__FORCE_TEST_MODE__).to.be.true
        expect(win.__CYPRESS_TEST_MODE__).to.be.true
        expect(win.localStorage.getItem('cypress_mode')).to.eq('true')
      })
      
      // Naviguer vers la page de connexion
      cy.visit('/login')
      cy.wait(2000)
      
      // Vérifier que nous ne sommes pas redirigés
      cy.url().should('include', '/login')
      cy.url().should('not.include', '/setup')
    })
  })
})
