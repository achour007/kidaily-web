describe('Tests d\'Authentification Réels - Kidaily', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.wait(1000)
  })

  describe('Connexion avec Utilisateur Existant', () => {
    it('devrait permettre la connexion avec un utilisateur existant', () => {
      // Utiliser un utilisateur qui existe déjà
      const email = 'admin@kidaily.com'
      const password = 'admin123'

      // Visiter la page de connexion
      cy.visit('/login')
      cy.wait(2000)

      // Vérifier que nous sommes sur la page de connexion
      cy.url().should('include', '/login')
      cy.get('#root').should('not.be.empty')

      // Remplir le formulaire de connexion
      cy.get('input[name="email"]').should('be.visible').type(email)
      cy.get('input[name="password"]').should('be.visible').type(password)

      // Soumettre le formulaire
      cy.get('button[type="submit"]').should('be.visible').click()

      // Attendre que quelque chose se passe
      cy.wait(5000)

      // Vérifier que nous ne sommes plus sur la page de connexion
      cy.url().should('not.include', '/login')
      
      // Vérifier que nous sommes connectés (soit sur dashboard, soit sur une autre page)
      cy.get('body').should('not.contain', 'Se connecter')
    })
  })

  describe('Inscription avec Email Unique', () => {
    it('devrait permettre l\'inscription d\'un nouvel utilisateur', () => {
      // Générer un email unique pour ce test
      const uniqueEmail = `test-${Date.now()}@kidaily.com`
      const password = 'password123'
      const firstName = 'Test'
      const lastName = 'User'

      // Visiter la page d'inscription
      cy.visit('/register')
      cy.wait(2000)

      // Vérifier que nous sommes sur la page d'inscription
      cy.url().should('include', '/register')
      cy.get('#root').should('not.be.empty')

      // Remplir le formulaire d'inscription
      cy.get('input[name="firstName"]').should('be.visible').type(firstName)
      cy.get('input[name="lastName"]').should('be.visible').type(lastName)
      cy.get('input[name="email"]').should('be.visible').type(uniqueEmail)
      cy.get('input[name="password"]').should('be.visible').type(password)
      cy.get('input[name="confirmPassword"]').should('be.visible').type(password)

      // Soumettre le formulaire
      cy.get('button[type="submit"]').should('be.visible').click()

      // Attendre que quelque chose se passe
      cy.wait(5000)

      // Vérifier que nous ne sommes plus sur la page d'inscription
      cy.url().should('not.include', '/register')
      
      // Vérifier que nous sommes connectés (soit sur dashboard, soit sur une autre page)
      cy.get('body').should('not.contain', 'Créer un compte')
    })
  })

  describe('Gestion des Erreurs', () => {
    it('devrait afficher une erreur pour des identifiants invalides', () => {
      cy.visit('/login')
      cy.wait(2000)

      // Remplir le formulaire avec des identifiants invalides
      cy.get('input[name="email"]').should('be.visible').type('invalid@kidaily.com')
      cy.get('input[name="password"]').should('be.visible').type('wrongpassword')

      // Soumettre le formulaire
      cy.get('button[type="submit"]').should('be.visible').click()

      // Attendre que l'erreur s'affiche
      cy.wait(3000)

      // Vérifier que l'erreur est affichée (soit dans le body, soit dans un élément spécifique)
      cy.get('body').should('contain', 'invalides')
    })

    it('devrait afficher une erreur pour un email déjà utilisé', () => {
      cy.visit('/register')
      cy.wait(2000)

      // Remplir le formulaire avec un email qui existe déjà
      cy.get('input[name="firstName"]').should('be.visible').type('Test')
      cy.get('input[name="lastName"]').should('be.visible').type('User')
      cy.get('input[name="email"]').should('be.visible').type('admin@kidaily.com')
      cy.get('input[name="password"]').should('be.visible').type('password123')
      cy.get('input[name="confirmPassword"]').should('be.visible').type('password123')

      // Soumettre le formulaire
      cy.get('button[type="submit"]').should('be.visible').click()

      // Attendre que l'erreur s'affiche
      cy.wait(3000)

      // Vérifier que l'erreur est affichée
      cy.get('body').should('contain', 'existe')
    })
  })

  describe('Validation des Formulaires', () => {
    it('devrait valider les champs requis lors de l\'inscription', () => {
      cy.visit('/register')
      cy.wait(2000)

      // Essayer de soumettre sans remplir les champs
      cy.get('button[type="submit"]').should('be.visible').click()

      // Attendre que les erreurs de validation s'affichent
      cy.wait(2000)

      // Vérifier que les messages d'erreur sont présents
      cy.get('body').should('contain', 'requis')
    })

    it('devrait valider les champs requis lors de la connexion', () => {
      cy.visit('/login')
      cy.wait(2000)

      // Essayer de soumettre sans remplir les champs
      cy.get('button[type="submit"]').should('be.visible').click()

      // Attendre que les erreurs de validation s'affichent
      cy.wait(2000)

      // Vérifier que les messages d'erreur sont présents
      cy.get('body').should('contain', 'requis')
    })
  })

  describe('Persistance de Session', () => {
    it('devrait maintenir la session après connexion', () => {
      // Se connecter
      cy.visit('/login')
      cy.wait(2000)
      
      cy.get('input[name="email"]').type('admin@kidaily.com')
      cy.get('input[name="password"]').type('admin123')
      cy.get('button[type="submit"]').click()

      // Attendre la connexion
      cy.wait(5000)
      
      // Vérifier que nous sommes connectés
      cy.url().should('not.include', '/login')
      
      // Rafraîchir la page
      cy.reload()
      cy.wait(3000)
      
      // Vérifier que nous sommes toujours connectés
      cy.url().should('not.include', '/login')
    })
  })
})
