describe('Débogage Kidaily', () => {
  it('devrait charger la page de base', () => {
    cy.visit('/')
    cy.get('#root').should('exist')
    cy.log('Root element trouvé')
  })

  it('devrait charger la page de setup', () => {
    cy.visit('/setup')
    cy.get('#root').should('exist')
    cy.log('Setup page - Root element trouvé')
    
    // Attendre un peu pour voir si React se charge
    cy.wait(3000)
    
    // Vérifier si des éléments React sont présents
    cy.get('body').then(($body) => {
      cy.log('Contenu du body:', $body.html().substring(0, 500))
    })
  })

  it('devrait charger la page de register', () => {
    cy.visit('/register?cypress=true')
    cy.get('#root').should('exist')
    cy.log('Register page - Root element trouvé')
    
    // Attendre un peu pour voir si React se charge
    cy.wait(3000)
    
    // Vérifier si des éléments React sont présents
    cy.get('body').then(($body) => {
      cy.log('Contenu du body:', $body.html().substring(0, 500))
    })
    
    // Vérifier spécifiquement nos data-testid
    cy.get('body').then(($body) => {
      const html = $body.html()
      cy.log('Contenu complet du body:', html)
      
      // Vérifier si nos data-testid sont présents
      if (html.includes('data-testid="register-form"')) {
        cy.log('✅ data-testid="register-form" trouvé')
      } else {
        cy.log('❌ data-testid="register-form" NON trouvé')
      }
      
      if (html.includes('data-testid="firstName-input"')) {
        cy.log('✅ data-testid="firstName-input" trouvé')
      } else {
        cy.log('❌ data-testid="firstName-input" NON trouvé')
      }
    })
  })

  it('devrait vérifier la console pour les erreurs', () => {
    cy.visit('/register?cypress=true')
    
    // Écouter les erreurs de console
    cy.window().then((win) => {
      cy.spy(win.console, 'error').as('consoleError')
      cy.spy(win.console, 'warn').as('consoleWarn')
    })
    
    cy.wait(3000)
    
    // Vérifier s'il y a des erreurs
    cy.get('@consoleError').should('not.have.been.called')
    cy.get('@consoleWarn').should('not.have.been.called')
  })
})
