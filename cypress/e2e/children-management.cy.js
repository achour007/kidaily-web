describe('Gestion des Enfants Kidaily', () => {
  beforeEach(() => {
    cy.login('test@kidaily.com', 'password123')
    cy.visit('/children')
    cy.waitForPageLoad()
  })

  it('devrait afficher la liste des enfants', () => {
    // Vérifier que la page des enfants s'affiche
    cy.get('h1, h2, h3, h4, h5, h6').should('contain', 'Enfants')
    
    // Vérifier que la liste s'affiche
    cy.get('.MuiList-root, .MuiCard-root').should('be.visible')
  })

  it('devrait permettre d\'ajouter un nouvel enfant', () => {
    // Cliquer sur le bouton d'ajout
    cy.get('button').contains('Ajouter').click()
    
    // Vérifier que le dialogue s'ouvre
    cy.get('.MuiDialog-root, .MuiModal-root').should('be.visible')
    
    // Remplir le formulaire
    cy.get('input[name="name"]').type('Nouvel Enfant')
    cy.get('input[name="birthDate"]').type('2020-01-01')
    cy.get('select[name="gender"]').select('F')
    
    // Soumettre le formulaire
    cy.get('button[type="submit"]').click()
    
    // Vérifier que l'enfant est ajouté
    cy.get('body').should('contain', 'Nouvel Enfant')
  })

  it('devrait valider les champs requis', () => {
    // Cliquer sur le bouton d'ajout
    cy.get('button').contains('Ajouter').click()
    
    // Essayer de soumettre sans remplir les champs
    cy.get('button[type="submit"]').click()
    
    // Vérifier les messages d'erreur
    cy.get('.MuiFormHelperText-root').should('contain', 'requis')
  })

  it('devrait permettre de modifier un enfant existant', () => {
    // Cliquer sur le bouton de modification d'un enfant
    cy.get('.MuiIconButton-root').first().click()
    
    // Vérifier que le dialogue s'ouvre
    cy.get('.MuiDialog-root, .MuiModal-root').should('be.visible')
    
    // Modifier le nom
    cy.get('input[name="name"]').clear().type('Enfant Modifié')
    
    // Soumettre le formulaire
    cy.get('button[type="submit"]').click()
    
    // Vérifier que la modification est appliquée
    cy.get('body').should('contain', 'Enfant Modifié')
  })

  it('devrait permettre de supprimer un enfant', () => {
    // Cliquer sur le bouton de suppression d'un enfant
    cy.get('.MuiIconButton-root').last().click()
    
    // Confirmer la suppression
    cy.get('button').contains('Confirmer').click()
    
    // Vérifier que l'enfant est supprimé
    cy.get('body').should('not.contain', 'Test Child')
  })
}) 