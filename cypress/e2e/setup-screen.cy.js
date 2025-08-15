describe('SetupScreen Kidaily', () => {
  beforeEach(() => {
    cy.cleanupTestData()
    cy.waitForApi()
  })

  it('devrait afficher l\'écran de configuration initiale', () => {
    cy.visit('/setup')
    cy.waitForPageLoad()

    // Vérifier que le titre s'affiche
    cy.get('h1, h2, h3, h4, h5, h6').should('contain', 'Kidaily')
    
    // Vérifier que le stepper s'affiche
    cy.get('.MuiStepper-root').should('be.visible')
  })

  it('devrait permettre la sélection de langue', () => {
    cy.visit('/setup')
    cy.waitForPageLoad()

    // Vérifier que le sélecteur de langue s'affiche
    cy.get('.MuiSelect-select').should('be.visible')
    
    // Ouvrir le menu de sélection
    cy.get('.MuiSelect-select').click()
    
    // Sélectionner une langue
    cy.get('.MuiMenuItem-root').contains('Français').click()
    
    // Vérifier que la langue est sélectionnée
    cy.get('.MuiSelect-select').should('contain', 'Français')
  })

  it('devrait permettre la sélection de version', () => {
    cy.visit('/setup')
    cy.waitForPageLoad()

    // Vérifier que les options de version s'affichent
    cy.get('input[type="radio"]').should('be.visible')
    
    // Sélectionner la version cloud en cliquant sur le label
    cy.get('label').contains('Cloud').click()
    
    // Vérifier que la version est sélectionnée
    cy.get('input[value="cloud"]').should('be.checked')
  })

  it('devrait naviguer vers login après configuration', () => {
    cy.visit('/setup')
    cy.waitForPageLoad()

    // Sélectionner une langue
    cy.get('.MuiSelect-select').click()
    cy.get('.MuiMenuItem-root').contains('Français').click()
    
    // Sélectionner une version
    cy.get('label').contains('Locale').click()
    
    // Cliquer sur continuer
    cy.get('button').contains('Continuer').click()
    
    // Vérifier la redirection vers login
    cy.url().should('include', '/login')
  })

  it('devrait afficher les informations de version', () => {
    cy.visit('/setup')
    cy.waitForPageLoad()

    // Sélectionner la version locale
    cy.get('label').contains('Locale').click()
    
    // Vérifier que les informations s'affichent
    cy.get('.MuiAlert-root').should('contain', 'locale')
    
    // Sélectionner la version cloud
    cy.get('label').contains('Cloud').click()
    
    // Vérifier que les informations s'affichent
    cy.get('.MuiAlert-root').should('contain', 'cloud')
  })
})
