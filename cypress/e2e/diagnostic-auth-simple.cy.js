describe('Diagnostic Authentification Simplifié - Kidaily', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.wait(1000)
  })

  describe('Diagnostic de la Page de Connexion', () => {
    it('devrait diagnostiquer la structure de la page de connexion', () => {
      cy.visit('/login')
      cy.wait(3000)
      
      // 1. Vérifier l'URL
      cy.url().should('include', '/login')
      
      // 2. Vérifier que la page se charge
      cy.get('#root').should('not.be.empty')
      
      // 3. Prendre une capture d'écran pour diagnostic
      cy.screenshot('diagnostic-login-page')
      
      // 4. Analyser la structure de la page
      cy.get('body').then(($body) => {
        cy.log('Contenu de la page:', $body.text())
      })
      
      // 5. Chercher tous les éléments input
      cy.get('input').then(($inputs) => {
        cy.log(`Nombre d'inputs trouvés: ${$inputs.length}`)
        $inputs.each((index, input) => {
          cy.log(`Input ${index}:`, {
            type: input.type,
            name: input.name,
            id: input.id,
            placeholder: input.placeholder,
            visible: input.offsetParent !== null
          })
        })
      })
      
      // 6. Chercher tous les boutons
      cy.get('button').then(($buttons) => {
        cy.log(`Nombre de boutons trouvés: ${$buttons.length}`)
        $buttons.each((index, button) => {
          cy.log(`Bouton ${index}:`, {
            text: button.textContent,
            type: button.type,
            disabled: button.disabled,
            visible: button.offsetParent !== null
          })
        })
      })
      
      // 7. Vérifier la présence de formulaires
      cy.get('form').then(($forms) => {
        cy.log(`Nombre de formulaires trouvés: ${$forms.length}`)
      })
    })
  })

  describe('Diagnostic de la Page d\'Inscription', () => {
    it('devrait diagnostiquer la structure de la page d\'inscription', () => {
      cy.visit('/register')
      cy.wait(3000)
      
      // 1. Vérifier l'URL
      cy.url().should('include', '/register')
      
      // 2. Vérifier que la page se charge
      cy.get('#root').should('not.be.empty')
      
      // 3. Prendre une capture d'écran pour diagnostic
      cy.screenshot('diagnostic-register-page')
      
      // 4. Analyser la structure de la page
      cy.get('body').then(($body) => {
        cy.log('Contenu de la page:', $body.text())
      })
      
      // 5. Chercher tous les éléments input
      cy.get('input').then(($inputs) => {
        cy.log(`Nombre d'inputs trouvés: ${$inputs.length}`)
        $inputs.each((index, input) => {
          cy.log(`Input ${index}:`, {
            type: input.type,
            name: input.name,
            id: input.id,
            placeholder: input.placeholder,
            visible: input.offsetParent !== null
          })
        })
      })
      
      // 6. Chercher tous les boutons
      cy.get('button').then(($buttons) => {
        cy.log(`Nombre de boutons trouvés: ${$buttons.length}`)
        $buttons.each((index, button) => {
          cy.log(`Bouton ${index}:`, {
            text: button.textContent,
            type: button.type,
            disabled: button.disabled,
            visible: button.offsetParent !== null
          })
        })
      })
      
      // 7. Vérifier la présence de formulaires
      cy.get('form').then(($forms) => {
        cy.log(`Nombre de formulaires trouvés: ${$forms.length}`)
      })
    })
  })

  describe('Test de Navigation Simple', () => {
    it('devrait naviguer entre login et register sans erreur', () => {
      // 1. Aller sur login
      cy.visit('/login')
      cy.wait(2000)
      cy.url().should('include', '/login')
      
      // 2. Aller sur register
      cy.visit('/register')
      cy.wait(2000)
      cy.url().should('include', '/register')
      
      // 3. Retourner sur login
      cy.visit('/login')
      cy.wait(2000)
      cy.url().should('include', '/login')
      
      cy.log('Navigation entre pages fonctionne correctement')
    })
  })

  describe('Test de Remplissage Simple', () => {
    it('devrait pouvoir remplir les champs s\'ils existent', () => {
      cy.visit('/login')
      cy.wait(3000)
      
      // Essayer de trouver et remplir les champs
      cy.get('body').then(($body) => {
        // Chercher des inputs par différents sélecteurs
        const emailInput = $body.find('input[type="email"], input[name="email"], input[placeholder*="email"], input[placeholder*="Email"]')
        const passwordInput = $body.find('input[type="password"], input[name="password"], input[placeholder*="password"], input[placeholder*="Password"]')
        
        if (emailInput.length > 0) {
          cy.log('Champ email trouvé, tentative de remplissage')
          cy.wrap(emailInput.first()).type('test@example.com')
        } else {
          cy.log('Aucun champ email trouvé')
        }
        
        if (passwordInput.length > 0) {
          cy.log('Champ password trouvé, tentative de remplissage')
          cy.wrap(passwordInput.first()).type('testpass')
        } else {
          cy.log('Aucun champ password trouvé')
        }
      })
      
      // Prendre une capture d'écran après tentative de remplissage
      cy.screenshot('diagnostic-after-fill-attempt')
    })
  })
})
