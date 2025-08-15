describe('Débogage Console Kidaily', () => {
  it('devrait afficher les logs de débogage dans la console', () => {
    cy.visit('/register?cypress=true')
    
    // Attendre que la page se charge
    cy.wait(3000)
    
    // Vérifier la console pour nos logs
    cy.window().then((win) => {
      // Spy sur console.log pour capturer nos messages
      cy.spy(win.console, 'log').as('consoleLog')
    })
    
    // Recharger la page pour déclencher nos logs
    cy.reload()
    cy.wait(2000)
    
    // Vérifier que nos logs ont été appelés
    cy.get('@consoleLog').should('have.been.calledWith', '[App] Debug - window.Cypress:', undefined)
    cy.get('@consoleLog').should('have.been.calledWith', '[App] Debug - window.location.search:', '?cypress=true')
    cy.get('@consoleLog').should('have.been.calledWith', '[App] Debug - isCypressTest:', true)
    cy.get('@consoleLog').should('have.been.calledWith', '[App] Mode test Cypress détecté - redirection désactivée')
  })

  it('devrait vérifier le contenu de la page après chargement', () => {
    cy.visit('/register?cypress=true')
    cy.wait(3000)
    
    // Vérifier que nous ne sommes pas sur /setup
    cy.url().should('include', '/register')
    cy.url().should('not.include', '/setup')
    
    // Vérifier le contenu de la page
    cy.get('body').then(($body) => {
      const html = $body.html()
      cy.log('URL actuelle:', window.location.href)
      cy.log('Contenu de la page:', html.substring(0, 2000))
      
      // Vérifier si nous sommes sur la bonne page
      if (html.includes('Inscription') || html.includes('S\'inscrire')) {
        cy.log('✅ Page d\'inscription détectée')
      } else {
        cy.log('❌ Page d\'inscription NON détectée')
      }
    })
  })
})
