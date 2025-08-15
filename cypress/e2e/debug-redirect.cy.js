describe('Diagnostic des redirections Kidaily', () => {
  beforeEach(() => {
    // Nettoyer complètement avant chaque test
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.clearSessionStorage()
    
    // Attendre que l'application soit prête
    cy.wait(1000)
  })

  it('devrait diagnostiquer le problème de redirection', () => {
    // Visiter la page d'inscription
    cy.visit('/register')
    
    // Attendre que la page se charge
    cy.wait(2000)
    
    // Vérifier l'URL actuelle
    cy.url().then((currentUrl) => {
      cy.log(`URL actuelle: ${currentUrl}`)
      
      // Si nous sommes redirigés vers /setup, diagnostiquer
      if (currentUrl.includes('/setup')) {
        cy.log('❌ REDIRECTION VERS /setup DÉTECTÉE')
        
        // Vérifier les variables globales
        cy.window().then((win) => {
          cy.log('Variables globales:', {
            __FORCE_TEST_MODE__: win.__FORCE_TEST_MODE__,
            __CYPRESS_TEST_MODE__: win.__CYPRESS_TEST_MODE__,
            Cypress: win.Cypress,
            cypress: win.cypress
          })
          
          // Vérifier le stockage
          cy.log('Stockage local:', {
            cypress_mode: win.localStorage.getItem('cypress_mode'),
            test_mode: win.localStorage.getItem('test_mode')
          })
          
          // Vérifier l'environnement
          cy.log('Environnement:', {
            hostname: win.location.hostname,
            port: win.location.port,
            search: win.location.search
          })
        })
        
        // Essayer de forcer le mode test
        cy.window().then((win) => {
          win.__FORCE_TEST_MODE__ = true
          win.__CYPRESS_TEST_MODE__ = true
          win.localStorage.setItem('cypress_mode', 'true')
          win.sessionStorage.setItem('cypress_mode', 'true')
          
          cy.log('Mode test forcé manuellement')
        })
        
        // Recharger la page
        cy.reload()
        cy.wait(2000)
        
        // Vérifier à nouveau l'URL
        cy.url().then((newUrl) => {
          cy.log(`URL après forçage du mode test: ${newUrl}`)
          if (newUrl.includes('/setup')) {
            cy.log('❌ REDIRECTION PERSISTE MÊME EN MODE TEST')
          } else {
            cy.log('✅ REDIRECTION RÉSOLUE')
          }
        })
        
      } else {
        cy.log('✅ AUCUNE REDIRECTION DÉTECTÉE')
      }
    })
  })

  it('devrait vérifier l\'activation du mode test', () => {
    // Visiter la page d'inscription
    cy.visit('/register')
    cy.wait(2000)
    
    // Vérifier que le mode test est activé
    cy.window().then((win) => {
      // Forcer le mode test
      win.__FORCE_TEST_MODE__ = true
      win.__CYPRESS_TEST_MODE__ = true
      win.__TEST_MODE__ = true
      win.__CYPRESS_MODE__ = true
      
      win.localStorage.setItem('cypress_mode', 'true')
      win.sessionStorage.setItem('cypress_mode', 'true')
      win.localStorage.setItem('test_mode', 'true')
      win.sessionStorage.setItem('test_mode', 'true')
      
      cy.log('Mode test activé manuellement')
    })
    
    // Vérifier que les variables sont définies
    cy.window().then((win) => {
      expect(win.__FORCE_TEST_MODE__).to.be.true
      expect(win.__CYPRESS_TEST_MODE__).to.be.true
      expect(win.localStorage.getItem('cypress_mode')).to.eq('true')
      expect(win.sessionStorage.getItem('cypress_mode')).to.eq('true')
    })
    
    // Recharger la page pour vérifier la persistance
    cy.reload()
    cy.wait(2000)
    
    // Vérifier que le mode test persiste
    cy.window().then((win) => {
      expect(win.__FORCE_TEST_MODE__).to.be.true
      expect(win.__CYPRESS_TEST_MODE__).to.be.true
      expect(win.localStorage.getItem('cypress_mode')).to.eq('true')
    })
  })

  it('devrait tester la navigation directe vers /register', () => {
    // Forcer le mode test d'abord
    cy.window().then((win) => {
      win.__FORCE_TEST_MODE__ = true
      win.__CYPRESS_TEST_MODE__ = true
      win.localStorage.setItem('cypress_mode', 'true')
      win.sessionStorage.setItem('cypress_mode', 'true')
    })
    
    // Naviguer directement vers /register
    cy.visit('/register')
    cy.wait(3000)
    
    // Vérifier l'URL
    cy.url().should('include', '/register')
    cy.url().should('not.include', '/setup')
    
    // Vérifier que le formulaire est visible
    cy.get('[data-testid="register-form"]').should('be.visible')
  })
})
