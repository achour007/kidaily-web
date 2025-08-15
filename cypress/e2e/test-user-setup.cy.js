describe('Configuration de l\'Utilisateur de Test - Kidaily', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.wait(1000)
  })

  describe('Création d\'un Utilisateur de Test', () => {
    it('devrait créer un utilisateur de test et se connecter avec succès', () => {
      // Générer un email unique pour ce test
      const testEmail = `testuser-${Date.now()}@kidaily.com`
      const testPassword = 'testpass123'
      const testFirstName = 'Test'
      const testLastName = 'User'

      // 1. Créer un nouvel utilisateur
      cy.visit('/register')
      cy.wait(2000)

      // Vérifier que nous sommes sur la page d'inscription
      cy.url().should('include', '/register')
      cy.get('#root').should('not.be.empty')

      // Remplir le formulaire d'inscription
      cy.get('input[name="firstName"]').should('be.visible').type(testFirstName)
      cy.get('input[name="lastName"]').should('be.visible').type(testLastName)
      cy.get('input[name="email"]').should('be.visible').type(testEmail)
      cy.get('input[name="password"]').should('be.visible').type(testPassword)
      cy.get('input[name="confirmPassword"]').should('be.visible').type(testPassword)

      // Soumettre le formulaire
      cy.get('button[type="submit"]').should('be.visible').click()

      // Attendre la redirection (soit vers dashboard, soit vers une autre page)
      cy.wait(5000)

      // Vérifier que nous ne sommes plus sur la page d'inscription
      cy.url().should('not.include', '/register')

      // 2. Se déconnecter pour tester la connexion
      cy.visit('/logout')
      cy.wait(2000)

      // 3. Se connecter avec le nouvel utilisateur
      cy.visit('/login')
      cy.wait(2000)

      // Vérifier que nous sommes sur la page de connexion
      cy.url().should('include', '/login')

      // Remplir le formulaire de connexion
      cy.get('input[name="email"]').should('be.visible').type(testEmail)
      cy.get('input[name="password"]').should('be.visible').type(testPassword)

      // Soumettre le formulaire
      cy.get('button[type="submit"]').should('be.visible').click()

      // Attendre la connexion
      cy.wait(5000)

      // Vérifier que nous sommes connectés (soit sur dashboard, soit sur une autre page)
      cy.url().should('not.include', '/login')

      // 4. Sauvegarder les informations de l'utilisateur de test
      cy.window().then((win) => {
        win.testUserCredentials = {
          email: testEmail,
          password: testPassword,
          firstName: testFirstName,
          lastName: testLastName
        }
        cy.log('Utilisateur de test créé et connecté avec succès:', win.testUserCredentials)
      })
    })
  })

  describe('Test de Connexion avec Utilisateur Existant', () => {
    it('devrait permettre la connexion avec un utilisateur qui existe', () => {
      // Utiliser un email qui a été créé dans un test précédent
      // ou créer un nouvel utilisateur si nécessaire
      const testEmail = `testuser-${Date.now()}@kidaily.com`
      const testPassword = 'testpass123'

      // Créer d'abord l'utilisateur
      cy.visit('/register')
      cy.wait(2000)

      cy.get('input[name="firstName"]').type('Test')
      cy.get('input[name="lastName"]').type('User')
      cy.get('input[name="email"]').type(testEmail)
      cy.get('input[name="password"]').type(testPassword)
      cy.get('input[name="confirmPassword"]').type(testPassword)
      cy.get('button[type="submit"]').click()

      cy.wait(5000)

      // Maintenant se connecter
      cy.visit('/login')
      cy.wait(2000)

      cy.get('input[name="email"]').type(testEmail)
      cy.get('input[name="password"]').type(testPassword)
      cy.get('button[type="submit"]').click()

      cy.wait(5000)

      // Vérifier la connexion
      cy.url().should('not.include', '/login')
      cy.get('body').should('not.contain', 'Se connecter')
    })
  })

  describe('Test de Validation des Formulaires', () => {
    it('devrait valider les champs requis lors de l\'inscription', () => {
      cy.visit('/register')
      cy.wait(2000)

      // Essayer de soumettre sans remplir les champs
      cy.get('button[type="submit"]').should('be.visible').click()

      // Attendre que les erreurs de validation s'affichent
      cy.wait(2000)

      // Vérifier que les messages d'erreur sont présents
      // Utiliser une approche plus flexible pour trouver les erreurs
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

  describe('Test de Gestion des Erreurs', () => {
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

      // Vérifier que l'erreur est affichée
      cy.get('body').should('contain', 'invalides')
    })

    it('devrait afficher une erreur pour un email déjà utilisé', () => {
      // Créer d'abord un utilisateur
      const testEmail = `duplicate-${Date.now()}@kidaily.com`
      const testPassword = 'testpass123'

      cy.visit('/register')
      cy.wait(2000)

      cy.get('input[name="firstName"]').type('Test')
      cy.get('input[name="lastName"]').type('User')
      cy.get('input[name="email"]').type(testEmail)
      cy.get('input[name="password"]').type(testPassword)
      cy.get('input[name="confirmPassword"]').type(testPassword)
      cy.get('button[type="submit"]').click()

      cy.wait(5000)

      // Maintenant essayer de créer un autre utilisateur avec le même email
      cy.visit('/register')
      cy.wait(2000)

      cy.get('input[name="firstName"]').type('Another')
      cy.get('input[name="lastName"]').type('User')
      cy.get('input[name="email"]').type(testEmail)
      cy.get('input[name="password"]').type('differentpass')
      cy.get('input[name="confirmPassword"]').type('differentpass')
      cy.get('button[type="submit"]').click()

      cy.wait(3000)

      // Vérifier que l'erreur est affichée
      cy.get('body').should('contain', 'existe')
    })
  })
})
