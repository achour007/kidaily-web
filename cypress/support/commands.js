// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Commande d'attente pour le chargement de page
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('#root').should('exist')
  cy.wait(1000) // Attendre que React soit rendu
})

// Commande d'attente pour l'API
Cypress.Commands.add('waitForApi', () => {
  cy.wait(500) // Délai pour l'API
})

// Commande de nettoyage des données de test
Cypress.Commands.add('cleanupTestData', () => {
  // Nettoyer localStorage
  cy.clearLocalStorage()
  cy.clearCookies()
})

// Commande de vérification de performance de page
Cypress.Commands.add('checkPagePerformance', () => {
  cy.window().then((win) => {
    const performance = win.performance
    expect(performance.timing.loadEventEnd - performance.timing.navigationStart).to.be.lessThan(3000)
  })
})

// Commande de connexion avec retry et fallback
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.waitForPageLoad()
  
  // Attendre que le formulaire soit visible avec plusieurs stratégies
  cy.get('[data-testid="login-form"], form, [role="form"]', { timeout: 15000 }).should('be.visible')
  
  // Remplir le formulaire avec fallback
  cy.get('[data-testid="email-input"], input[name="email"], #email', { timeout: 10000 })
    .should('be.visible')
    .clear()
    .type(email)
  
  cy.get('[data-testid="password-input"], input[name="password"], #password', { timeout: 10000 })
    .should('be.visible')
    .clear()
    .type(password)
  
  // Soumettre le formulaire avec fallback
  cy.get('[data-testid="login-submit"], button[type="submit"], button:contains("Se connecter")', { timeout: 10000 })
    .should('be.visible')
    .click()
  
  // Attendre la redirection
  cy.url({ timeout: 15000 }).should('not.include', '/login')
})

// Commande d'inscription avec retry et fallback
Cypress.Commands.add('register', (email, password, firstName, lastName) => {
  cy.visit('/register')
  cy.waitForPageLoad()
  
  // Attendre que le formulaire soit visible
  cy.get('[data-testid="register-form"], form, [role="form"]', { timeout: 15000 }).should('be.visible')
  
  // Remplir le formulaire avec fallback
  cy.get('[data-testid="firstName-input"], input[name="firstName"], #firstName', { timeout: 10000 })
    .should('be.visible')
    .clear()
    .type(firstName)
  
  cy.get('[data-testid="lastName-input"], input[name="lastName"], #lastName', { timeout: 10000 })
    .should('be.visible')
    .clear()
    .type(lastName)
  
  cy.get('[data-testid="email-input"], input[name="email"], #email', { timeout: 10000 })
    .should('be.visible')
    .clear()
    .type(email)
  
  cy.get('[data-testid="password-input"], input[name="password"], #password', { timeout: 10000 })
    .should('be.visible')
    .clear()
    .type(password)
  
  cy.get('[data-testid="confirmPassword-input"], input[name="confirmPassword"], #confirmPassword', { timeout: 10000 })
    .should('be.visible')
    .clear()
    .type(password)
  
  // Soumettre le formulaire
  cy.get('[data-testid="register-submit"], button[type="submit"], button:contains("S\'inscrire")', { timeout: 10000 })
    .should('be.visible')
    .click()
  
  // Attendre la redirection
  cy.url({ timeout: 15000 }).should('not.include', '/register')
})

// Commande de déconnexion
Cypress.Commands.add('logout', () => {
  cy.get('button:contains("Déconnexion"), [data-testid="logout-button"]', { timeout: 10000 })
    .should('be.visible')
    .click()
  cy.url().should('include', '/login')
})

// Commande de création d'enfant
Cypress.Commands.add('createChild', (name, birthDate, gender) => {
  cy.get('button:contains("Nouvel enfant"), [data-testid="add-child-button"]', { timeout: 10000 })
    .should('be.visible')
    .click()
  
  cy.get('.MuiDialog-root, .MuiModal-root', { timeout: 10000 }).should('be.visible')
  
  cy.get('input[name="name"], [data-testid="child-name-input"]', { timeout: 10000 })
    .should('be.visible')
    .clear()
    .type(name)
  
  cy.get('input[name="birthDate"], [data-testid="child-birthdate-input"]', { timeout: 10000 })
    .should('be.visible')
    .clear()
    .type(birthDate)
  
  cy.get('select[name="gender"], [data-testid="child-gender-select"]', { timeout: 10000 })
    .should('be.visible')
    .select(gender)
  
  cy.get('button[type="submit"], [data-testid="save-child-button"]', { timeout: 10000 })
    .should('be.visible')
    .click()
  
  cy.get('.MuiDialog-root, .MuiModal-root').should('not.exist')
}) 