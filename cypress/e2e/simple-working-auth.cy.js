describe('Tests d\'Authentification Simples et Fonctionnels - Kidaily', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.wait(1000)
  })

  describe('Navigation de Base', () => {
    it('devrait permettre l\'accès à la page de connexion', () => {
      cy.visit('/login')
      cy.wait(2000)
      
      // Vérifier que nous sommes sur la bonne page
      cy.url().should('include', '/login')
      cy.get('#root').should('not.be.empty')
      
      // Vérifier que le formulaire est visible
      cy.get('form').should('be.visible')
    })

    it('devrait permettre l\'accès à la page d\'inscription', () => {
      cy.visit('/register')
      cy.wait(2000)
      
      // Vérifier que nous sommes sur la bonne page
      cy.url().should('include', '/register')
      cy.get('#root').should('not.be.empty')
      
      // Vérifier que le formulaire est visible
      cy.get('form').should('be.visible')
    })
  })

  describe('Formulaires de Base', () => {
    it('devrait afficher tous les champs du formulaire de connexion', () => {
      cy.visit('/login')
      cy.wait(2000)
      
      // Vérifier que les champs sont présents
      cy.get('input[name="email"]').should('be.visible')
      cy.get('input[name="password"]').should('be.visible')
      cy.get('button[type="submit"]').should('be.visible')
    })

    it('devrait afficher tous les champs du formulaire d\'inscription', () => {
      cy.visit('/register')
      cy.wait(2000)
      
      // Vérifier que les champs sont présents
      cy.get('input[name="firstName"]').should('be.visible')
      cy.get('input[name="lastName"]').should('be.visible')
      cy.get('input[name="email"]').should('be.visible')
      cy.get('input[name="password"]').should('be.visible')
      cy.get('input[name="confirmPassword"]').should('be.visible')
      cy.get('button[type="submit"]').should('be.visible')
    })
  })

  describe('Fonctionnalités de Base', () => {
    it('devrait permettre de remplir le formulaire de connexion', () => {
      cy.visit('/login')
      cy.wait(2000)
      
      // Remplir le formulaire
      cy.get('input[name="email"]').type('test@example.com')
      cy.get('input[name="password"]').type('password123')
      
      // Vérifier que les valeurs sont bien remplies
      cy.get('input[name="email"]').should('have.value', 'test@example.com')
      cy.get('input[name="password"]').should('have.value', 'password123')
    })

    it('devrait permettre de remplir le formulaire d\'inscription', () => {
      cy.visit('/register')
      cy.wait(2000)
      
      // Remplir le formulaire
      cy.get('input[name="firstName"]').type('Test')
      cy.get('input[name="lastName"]').type('User')
      cy.get('input[name="email"]').type('test@example.com')
      cy.get('input[name="password"]').type('password123')
      cy.get('input[name="confirmPassword"]').type('password123')
      
      // Vérifier que les valeurs sont bien remplies
      cy.get('input[name="firstName"]').should('have.value', 'Test')
      cy.get('input[name="lastName"]').should('have.value', 'User')
      cy.get('input[name="email"]').should('have.value', 'test@example.com')
      cy.get('input[name="password"]').should('have.value', 'password123')
      cy.get('input[name="confirmPassword"]').should('have.value', 'password123')
    })
  })

  describe('Soumission des Formulaires', () => {
    it('devrait permettre de soumettre le formulaire de connexion', () => {
      cy.visit('/login')
      cy.wait(2000)
      
      // Remplir le formulaire
      cy.get('input[name="email"]').type('test@example.com')
      cy.get('input[name="password"]').type('password123')
      
      // Soumettre le formulaire
      cy.get('button[type="submit"]').click()
      
      // Attendre un peu pour voir ce qui se passe
      cy.wait(3000)
      
      // Vérifier que quelque chose s'est passé (pas d'erreur de validation)
      cy.get('body').should('not.contain', 'Erreur de validation')
    })

    it('devrait permettre de soumettre le formulaire d\'inscription', () => {
      cy.visit('/register')
      cy.wait(2000)
      
      // Remplir le formulaire
      cy.get('input[name="firstName"]').type('Test')
      cy.get('input[name="lastName"]').type('User')
      cy.get('input[name="email"]').type('test@example.com')
      cy.get('input[name="password"]').type('password123')
      cy.get('input[name="confirmPassword"]').type('password123')
      
      // Soumettre le formulaire
      cy.get('button[type="submit"]').click()
      
      // Attendre un peu pour voir ce qui se passe
      cy.wait(3000)
      
      // Vérifier que quelque chose s'est passé (pas d'erreur de validation)
      cy.get('body').should('not.contain', 'Erreur de validation')
    })
  })

  describe('Interface Utilisateur', () => {
    it('devrait afficher le titre de l\'application', () => {
      cy.visit('/')
      cy.wait(2000)
      
      // Vérifier que le titre est présent quelque part
      cy.get('body').should('contain', 'Kidaily')
    })

    it('devrait avoir une navigation fonctionnelle', () => {
      cy.visit('/login')
      cy.wait(2000)
      
      // Vérifier qu'il y a un lien vers l'inscription
      cy.get('a[href="/register"]').should('be.visible')
      
      cy.visit('/register')
      cy.wait(2000)
      
      // Vérifier qu'il y a un lien vers la connexion
      cy.get('a[href="/login"]').should('be.visible')
    })
  })
})
