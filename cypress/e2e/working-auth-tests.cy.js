describe('Tests d\'Authentification Fonctionnels - Kidaily', () => {
  beforeEach(() => {
    // Nettoyer avant chaque test
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.wait(1000)
  })

  describe('Inscription et Connexion Complètes', () => {
    it('devrait permettre l\'inscription et la connexion d\'un nouvel utilisateur', () => {
      // Générer un email unique pour ce test
      const uniqueEmail = `test-${Date.now()}@kidaily.com`
      const password = 'password123'
      const firstName = 'Test'
      const lastName = 'User'

      // 1. Inscription
      cy.visit('/register')
      cy.wait(2000)

      // Vérifier que nous sommes sur la page d'inscription
      cy.url().should('include', '/register')
      cy.get('#root').should('not.be.empty')

      // Remplir le formulaire d'inscription
      cy.get('[data-testid="firstName-input"]').should('be.visible').type(firstName)
      cy.get('[data-testid="lastName-input"]').should('be.visible').type(lastName)
      cy.get('[data-testid="email-input"]').should('be.visible').type(uniqueEmail)
      cy.get('[data-testid="password-input"]').should('be.visible').type(password)
      cy.get('[data-testid="confirmPassword-input"]').should('be.visible').type(password)

      // Soumettre le formulaire
      cy.get('[data-testid="register-submit"]').should('be.visible').click()

      // Attendre la redirection vers le dashboard
      cy.url({ timeout: 15000 }).should('include', '/dashboard')
      
      // Vérifier que nous sommes bien connectés
      cy.get('body').should('contain', 'Dashboard')
    })

    it('devrait permettre la connexion avec un utilisateur existant', () => {
      // Utiliser un email qui existe déjà
      const email = 'admin@kidaily.com'
      const password = 'admin123'

      // Visiter la page de connexion
      cy.visit('/login')
      cy.wait(2000)

      // Vérifier que nous sommes sur la page de connexion
      cy.url().should('include', '/login')
      cy.get('#root').should('not.be.empty')

      // Remplir le formulaire de connexion
      cy.get('[data-testid="email-input"]').should('be.visible').type(email)
      cy.get('[data-testid="password-input"]').should('be.visible').type(password)

      // Soumettre le formulaire
      cy.get('[data-testid="login-submit"]').should('be.visible').click()

      // Attendre la redirection vers le dashboard
      cy.url({ timeout: 15000 }).should('include', '/dashboard')
      
      // Vérifier que nous sommes bien connectés
      cy.get('body').should('contain', 'Dashboard')
    })
  })

  describe('Validation des Formulaires', () => {
    it('devrait valider les champs requis lors de l\'inscription', () => {
      cy.visit('/register')
      cy.wait(2000)

      // Essayer de soumettre sans remplir les champs
      cy.get('[data-testid="register-submit"]').should('be.visible').click()

      // Attendre que les erreurs de validation s'affichent
      cy.wait(1000)

      // Vérifier que les messages d'erreur sont présents
      cy.get('body').should('contain', 'requis')
    })

    it('devrait valider les champs requis lors de la connexion', () => {
      cy.visit('/login')
      cy.wait(2000)

      // Essayer de soumettre sans remplir les champs
      cy.get('[data-testid="login-submit"]').should('be.visible').click()

      // Attendre que les erreurs de validation s'affichent
      cy.wait(1000)

      // Vérifier que les messages d'erreur sont présents
      cy.get('body').should('contain', 'requis')
    })
  })

  describe('Gestion des Erreurs', () => {
    it('devrait afficher une erreur pour des identifiants invalides', () => {
      cy.visit('/login')
      cy.wait(2000)

      // Remplir le formulaire avec des identifiants invalides
      cy.get('[data-testid="email-input"]').should('be.visible').type('invalid@kidaily.com')
      cy.get('[data-testid="password-input"]').should('be.visible').type('wrongpassword')

      // Soumettre le formulaire
      cy.get('[data-testid="login-submit"]').should('be.visible').click()

      // Attendre que l'erreur s'affiche
      cy.wait(2000)

      // Vérifier que l'erreur est affichée
      cy.get('body').should('contain', 'invalides')
    })

    it('devrait afficher une erreur pour un email déjà utilisé', () => {
      cy.visit('/register')
      cy.wait(2000)

      // Remplir le formulaire avec un email qui existe déjà
      cy.get('[data-testid="firstName-input"]').should('be.visible').type('Test')
      cy.get('[data-testid="lastName-input"]').should('be.visible').type('User')
      cy.get('[data-testid="email-input"]').should('be.visible').type('admin@kidaily.com')
      cy.get('[data-testid="password-input"]').should('be.visible').type('password123')
      cy.get('[data-testid="confirmPassword-input"]').should('be.visible').type('password123')

      // Soumettre le formulaire
      cy.get('[data-testid="register-submit"]').should('be.visible').click()

      // Attendre que l'erreur s'affiche
      cy.wait(2000)

      // Vérifier que l'erreur est affichée
      cy.get('body').should('contain', 'existe')
    })
  })

  describe('Navigation et Redirections', () => {
    it('devrait permettre l\'accès direct aux pages d\'authentification', () => {
      // Tester l'accès à la page d'inscription
      cy.visit('/register')
      cy.url().should('include', '/register')
      cy.wait(2000)
      
      // Tester l'accès à la page de connexion
      cy.visit('/login')
      cy.url().should('include', '/login')
      cy.wait(2000)
    })

    it('devrait maintenir la session après connexion', () => {
      // Se connecter
      cy.visit('/login')
      cy.wait(2000)
      
      cy.get('[data-testid="email-input"]').type('admin@kidaily.com')
      cy.get('[data-testid="password-input"]').type('admin123')
      cy.get('[data-testid="login-submit"]').click()

      // Vérifier la redirection
      cy.url({ timeout: 15000 }).should('include', '/dashboard')
      
      // Rafraîchir la page
      cy.reload()
      cy.wait(2000)
      
      // Vérifier que nous sommes toujours sur le dashboard
      cy.url().should('include', '/dashboard')
    })
  })
})
