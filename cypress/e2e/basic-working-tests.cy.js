describe('Tests de Base Fonctionnels - Kidaily', () => {
  beforeEach(() => {
    // Nettoyer avant chaque test
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.wait(1000)
  })

  describe('Navigation de Base', () => {
    it('devrait charger la page d\'accueil', () => {
      cy.visit('/')
      cy.get('#root').should('not.be.empty')
      cy.wait(2000)
    })

    it('devrait permettre l\'accès à la page de connexion', () => {
      cy.visit('/login')
      cy.get('#root').should('not.be.empty')
      cy.url().should('include', '/login')
      cy.wait(2000)
    })

    it('devrait permettre l\'accès à la page d\'inscription', () => {
      cy.visit('/register')
      cy.get('#root').should('not.be.empty')
      cy.url().should('include', '/register')
      cy.wait(2000)
    })
  })

  describe('Formulaires de Base', () => {
    it('devrait afficher le formulaire de connexion', () => {
      cy.visit('/login')
      cy.wait(2000)
      
      // Vérifier que les champs sont présents
      cy.get('input[name="email"]').should('be.visible')
      cy.get('input[name="password"]').should('be.visible')
      cy.get('button[type="submit"]').should('be.visible')
    })

    it('devrait afficher le formulaire d\'inscription', () => {
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

  describe('Interface Utilisateur', () => {
    it('devrait afficher le titre de l\'application', () => {
      cy.visit('/')
      cy.wait(2000)
      
      // Vérifier que le titre est présent
      cy.get('h1, h2, h3, h4, h5, h6').should('contain', 'Kidaily')
    })

    it('devrait avoir une navigation fonctionnelle', () => {
      cy.visit('/login')
      cy.wait(2000)
      
      // Vérifier qu'il y a un lien vers l'inscription
      cy.get('a[href="/register"], a:contains("S\'inscrire")').should('be.visible')
      
      cy.visit('/register')
      cy.wait(2000)
      
      // Vérifier qu'il y a un lien vers la connexion
      cy.get('a[href="/login"], a:contains("Se connecter")').should('be.visible')
    })
  })
})
