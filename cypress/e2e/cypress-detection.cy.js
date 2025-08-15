describe('Détection Cypress Kidaily', () => {
  it('devrait détecter le mode Cypress et désactiver la redirection', () => {
    // Visiter la page avec le paramètre cypress
    cy.visit('/register?cypress=true')
    
    // Attendre que la page se charge
    cy.wait(3000)
    
    // Vérifier que nous sommes toujours sur /register et non sur /setup
    cy.url().should('include', '/register')
    cy.url().should('not.include', '/setup')
    
    // Vérifier que le composant RegisterScreen est rendu
    cy.get('body').should('contain', 'Inscription')
    
    // Log du contenu pour debug
    cy.get('body').then(($body) => {
      const html = $body.html()
      cy.log('URL actuelle:', window.location.href)
      cy.log('Contenu de la page:', html.substring(0, 2000))
    })
  })

  it('devrait vérifier la console pour les logs de débogage', () => {
    // Spy sur console.log avant de visiter la page
    cy.window().then((win) => {
      cy.spy(win.console, 'log').as('consoleLog')
    })
    
    // Visiter la page pour déclencher nos logs
    cy.visit('/register?cypress=true')
    cy.wait(3000)
    
    // Vérifier que nos logs ont été appelés
    cy.get('@consoleLog').should('have.been.calledWith', '[App] Debug - window.Cypress:', undefined)
    cy.get('@consoleLog').should('have.been.calledWith', '[App] Debug - window.location.search:', '?cypress=true')
    cy.get('@consoleLog').should('have.been.calledWith', '[App] Debug - isCypressTest:', true)
    cy.get('@consoleLog').should('have.been.calledWith', '[App] Mode test Cypress détecté - redirection désactivée')
  })

  it('devrait vérifier que les data-testid sont présents', () => {
    cy.visit('/register?cypress=true')
    cy.wait(3000)
    
    // Vérifier que nos data-testid sont présents
    cy.get('[data-testid="register-form"]').should('exist')
    cy.get('[data-testid="firstName-input"]').should('exist')
    cy.get('[data-testid="lastName-input"]').should('exist')
    cy.get('[data-testid="email-input"]').should('exist')
    cy.get('[data-testid="password-input"]').should('exist')
    cy.get('[data-testid="confirmPassword-input"]').should('exist')
    cy.get('[data-testid="register-submit"]').should('exist')
  })
})
