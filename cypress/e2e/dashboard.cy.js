describe('Dashboard Kidaily', () => {
  beforeEach(() => {
    // Se connecter avant chaque test
    cy.login('test@kidaily.com', 'password123')
    cy.visit('/dashboard')
    cy.waitForPageLoad()
  })

  it('devrait afficher le dashboard après connexion', () => {
    // Vérifier que le dashboard s'affiche
    cy.get('h1, h2, h3, h4, h5, h6').should('contain', 'Dashboard')
    
    // Vérifier que la navigation s'affiche
    cy.get('nav').should('be.visible')
  })

  it('devrait permettre d\'ajouter un nouvel enfant', () => {
    // Cliquer sur le bouton d'ajout d'enfant
    cy.get('button').contains('Nouvel enfant').click()
    
    // Vérifier que le dialogue s'ouvre
    cy.get('.MuiDialog-root, .MuiModal-root').should('be.visible')
    
    // Remplir le formulaire
    cy.get('input[name="name"]').type('Test Child')
    cy.get('input[name="birthDate"]').type('2020-01-01')
    cy.get('select[name="gender"]').select('M')
    
    // Soumettre le formulaire
    cy.get('button[type="submit"]').click()
    
    // Vérifier que l'enfant est ajouté
    cy.get('body').should('contain', 'Test Child')
  })

  it('devrait afficher la liste des enfants', () => {
    // Vérifier que la liste des enfants s'affiche
    cy.get('.MuiList-root, .MuiCard-root').should('be.visible')
  })

  it('devrait permettre de naviguer vers les différentes sections', () => {
    // Vérifier que les liens de navigation s'affichent
    cy.get('nav').should('be.visible')
    
    // Cliquer sur un lien de navigation
    cy.get('nav').contains('Enfants').click()
    
    // Vérifier la navigation
    cy.url().should('include', '/children')
  })

  it('devrait afficher les informations de l\'utilisateur', () => {
    // Vérifier que les informations utilisateur s'affichent
    cy.get('body').should('contain', 'Test User')
  })
})
