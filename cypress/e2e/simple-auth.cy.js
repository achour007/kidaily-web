describe('Authentification Simple Kidaily', () => {
  beforeEach(() => {
    cy.cleanupTestData()
  })

  it('devrait afficher la page de register', () => {
    cy.visit('/register?cypress=true')
    
    // Attendre que la page se charge
    cy.wait(2000)
    
    // Vérifier que l'élément root existe
    cy.get('#root').should('exist')
    
    // Vérifier que le body contient du contenu
    cy.get('body').should('contain', 'Kidaily')
    
    // Log du contenu pour debug
    cy.get('body').then(($body) => {
      const html = $body.html()
      cy.log('Contenu de la page:', html.substring(0, 1000))
    })
  })

  it('devrait trouver le formulaire d\'inscription', () => {
    cy.visit('/register?cypress=true')
    cy.wait(2000)
    
    // Essayer plusieurs sélecteurs
    cy.get('body').then(($body) => {
      const html = $body.html()
      
      // Vérifier si nos data-testid sont dans le HTML
      if (html.includes('data-testid="register-form"')) {
        cy.log('✅ data-testid="register-form" trouvé dans le HTML')
      } else {
        cy.log('❌ data-testid="register-form" NON trouvé dans le HTML')
      }
      
      if (html.includes('data-testid="firstName-input"')) {
        cy.log('✅ data-testid="firstName-input" trouvé dans le HTML')
      } else {
        cy.log('❌ data-testid="firstName-input" NON trouvé dans le HTML')
      }
    })
    
    // Essayer de trouver le formulaire avec différents sélecteurs
    cy.get('form').should('exist').then(($form) => {
      cy.log('Formulaire trouvé avec selecteur "form"')
      cy.log('Contenu du formulaire:', $form.html().substring(0, 500))
    })
  })

  it('devrait pouvoir remplir le formulaire', () => {
    cy.visit('/register?cypress=true')
    cy.wait(2000)
    
    // Essayer de trouver les champs avec des sélecteurs génériques
    cy.get('input[name="firstName"]').should('exist').type('Test')
    cy.get('input[name="lastName"]').should('exist').type('User')
    cy.get('input[name="email"]').should('exist').type('test@kidaily.com')
    cy.get('input[name="password"]').should('exist').type('password123')
    cy.get('input[name="confirmPassword"]').should('exist').type('password123')
    
    // Essayer de soumettre le formulaire
    cy.get('button[type="submit"]').should('exist').click()
  })
})
