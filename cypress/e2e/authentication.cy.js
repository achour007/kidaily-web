describe('Authentification Kidaily', () => {
  beforeEach(() => {
    // Nettoyer les données avant chaque test
    cy.cleanupTestData()
    cy.waitForApi()
    
    // Vérifier que le mode test est activé
    cy.ensureTestMode()
  })

  describe('Inscription', () => {
    it('devrait permettre l\'inscription d\'un nouvel utilisateur', () => {
      cy.visit('/register')
      cy.waitForPageLoad()

      // Vérifier que nous ne sommes pas redirigés vers /setup
      cy.url().should('not.include', '/setup')
      cy.url().should('include', '/register')

      // Attendre que l'application React soit chargée
      cy.get('#root').should('not.be.empty')
      cy.wait(2000) // Attendre que React soit complètement rendu

      // Vérifier que le formulaire s'affiche avec fallback
      cy.get('[data-testid="register-form"], form, [role="form"]').should('be.visible')
      
      // Remplir le formulaire d'inscription avec fallback
      cy.get('[data-testid="firstName-input"], input[name="firstName"], #firstName').should('be.visible').type('Test')
      cy.get('[data-testid="lastName-input"], input[name="lastName"], #lastName').should('be.visible').type('User')
      cy.get('[data-testid="email-input"], input[name="email"], #email').should('be.visible').type('test@kidaily.com')
      cy.get('[data-testid="password-input"], input[name="password"], #password').should('be.visible').type('password123')
      cy.get('[data-testid="confirmPassword-input"], input[name="confirmPassword"], #confirmPassword').should('be.visible').type('password123')

      // Soumettre le formulaire avec fallback
      cy.get('[data-testid="register-submit"], button[type="submit"], button:contains("S\'inscrire")').should('be.visible').click()

      // Vérifier la redirection vers le dashboard
      cy.url().should('include', '/dashboard')
    })

    it('devrait afficher une erreur pour un email déjà utilisé', () => {
      cy.visit('/register')
      cy.waitForPageLoad()

      // Vérifier que nous ne sommes pas redirigés vers /setup
      cy.url().should('not.include', '/setup')
      cy.url().should('include', '/register')

      // Attendre que l'application React soit chargée
      cy.get('#root').should('not.be.empty')
      cy.wait(2000) // Attendre que React soit complètement rendu

      // Remplir le formulaire avec un email existant avec fallback
      cy.get('[data-testid="firstName-input"], input[name="firstName"], #firstName').should('be.visible').type('Test')
      cy.get('[data-testid="lastName-input"], input[name="lastName"], #lastName').should('be.visible').type('User')
      cy.get('[data-testid="email-input"], input[name="email"], #email').should('be.visible').type('existing@kidaily.com')
      cy.get('[data-testid="password-input"], input[name="password"], #password').should('be.visible').type('password123')
      cy.get('[data-testid="confirmPassword-input"], input[name="confirmPassword"], #confirmPassword').should('be.visible').type('password123')

      // Soumettre le formulaire avec fallback
      cy.get('[data-testid="register-submit"], button[type="submit"], button:contains("S\'inscrire")').should('be.visible').click()

      // Vérifier que l'erreur s'affiche (utiliser le sélecteur Material-UI Alert)
      cy.get('.MuiAlert-message, .MuiFormHelperText-root').should('contain', 'existe')
    })

    it('devrait valider les champs requis', () => {
      cy.visit('/register')
      cy.waitForPageLoad()

      // Vérifier que nous ne sommes pas redirigés vers /setup
      cy.url().should('not.include', '/setup')
      cy.url().should('include', '/register')

      // Attendre que l'application React soit chargée
      cy.get('#root').should('not.be.empty')
      cy.wait(2000) // Attendre que React soit complètement rendu

      // Essayer de soumettre sans remplir les champs avec fallback
      cy.get('[data-testid="register-submit"], button[type="submit"], button:contains("S\'inscrire")').should('be.visible').click()

      // Vérifier les messages d'erreur Material-UI
      cy.get('.MuiFormHelperText-root').should('contain', 'requis')
    })
  })

  describe('Connexion', () => {
    it('devrait permettre la connexion d\'un utilisateur existant', () => {
      cy.visit('/login')
      cy.waitForPageLoad()

      // Vérifier que nous ne sommes pas redirigés vers /setup
      cy.url().should('not.include', '/setup')
      cy.url().should('include', '/login')

      // Attendre que l'application React soit chargée
      cy.get('#root').should('not.be.empty')
      cy.wait(2000) // Attendre que React soit complètement rendu

      // Remplir le formulaire de connexion avec fallback
      cy.get('[data-testid="email-input"], input[name="email"], #email').should('be.visible').type('test@kidaily.com')
      cy.get('[data-testid="password-input"], input[name="password"], #password').should('be.visible').type('password123')

      // Soumettre le formulaire avec fallback
      cy.get('[data-testid="login-submit"], button[type="submit"], button:contains("Se connecter")').should('be.visible').click()

      // Vérifier la redirection vers le dashboard
      cy.url().should('include', '/dashboard')
    })

    it('devrait afficher une erreur pour des identifiants invalides', () => {
      cy.visit('/login')
      cy.waitForPageLoad()

      // Vérifier que nous ne sommes pas redirigés vers /setup
      cy.url().should('not.include', '/setup')
      cy.url().should('include', '/login')

      // Attendre que l'application React soit chargée
      cy.get('#root').should('not.be.empty')
      cy.wait(2000) // Attendre que React soit complètement rendu

      // Remplir le formulaire avec des identifiants invalides avec fallback
      cy.get('[data-testid="email-input"], input[name="email"], #email').should('be.visible').type('invalid@kidaily.com')
      cy.get('[data-testid="password-input"], input[name="password"], #password').should('be.visible').type('wrongpassword')

      // Soumettre le formulaire avec fallback
      cy.get('[data-testid="login-submit"], button[type="submit"], button:contains("Se connecter")').should('be.visible').click()

      // Vérifier que l'erreur s'affiche
      cy.get('.MuiAlert-message, .MuiFormHelperText-root').should('contain', 'invalides')
    })
  })

  describe('Déconnexion', () => {
    beforeEach(() => {
      // Se connecter avant chaque test
      cy.login('test@kidaily.com', 'password123')
    })

    it('devrait permettre la déconnexion', () => {
      cy.visit('/dashboard')
      cy.waitForPageLoad()

      // Cliquer sur le bouton de déconnexion
      cy.get('button').contains('Déconnexion').click()

      // Vérifier la redirection vers la page de connexion
      cy.url().should('include', '/login')
    })
  })

  describe('Persistance de session', () => {
    beforeEach(() => {
      // Se connecter avant chaque test
      cy.login('test@kidaily.com', 'password123')
    })

    it('devrait maintenir la session après rechargement de page', () => {
      cy.visit('/dashboard')
      cy.waitForPageLoad()

      // Recharger la page
      cy.reload()

      // Vérifier que l'utilisateur est toujours connecté
      cy.url().should('include', '/dashboard')
    })
  })

  describe('Navigation', () => {
    it('devrait rediriger vers le dashboard si déjà connecté', () => {
      // Se connecter d'abord
      cy.login('test@kidaily.com', 'password123')
      
      // Essayer d'accéder à la page de connexion
      cy.visit('/login')
      cy.waitForPageLoad()

      // Vérifier la redirection vers le dashboard
      cy.url().should('include', '/dashboard')
    })

    it('devrait rediriger vers la connexion si non connecté', () => {
      // Visiter une page protégée sans être connecté
      cy.visit('/dashboard')
      cy.waitForPageLoad()

      // Vérifier la redirection vers la page de connexion
      cy.url().should('match', /(\/login|\/setup)/)
    })
  })
}) 