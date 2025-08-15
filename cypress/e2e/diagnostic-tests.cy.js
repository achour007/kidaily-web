describe('Tests de Diagnostic - Kidaily', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.clearCookies()
    cy.wait(1000)
  })

  describe('Diagnostic de Base', () => {
    it('devrait diagnostiquer la page d\'accueil', () => {
      cy.visit('/')
      cy.wait(3000)
      
      // Capturer l'état de la page
      cy.screenshot('diagnostic-homepage')
      
      // Vérifier le contenu de la page
      cy.get('body').then(($body) => {
        cy.log('Contenu de la page d\'accueil:', $body.text())
      })
      
      // Vérifier l'URL
      cy.url().then((url) => {
        cy.log('URL actuelle:', url)
      })
    })

    it('devrait diagnostiquer la page de connexion', () => {
      cy.visit('/login')
      cy.wait(3000)
      
      // Capturer l'état de la page
      cy.screenshot('diagnostic-login')
      
      // Vérifier le contenu de la page
      cy.get('body').then(($body) => {
        cy.log('Contenu de la page de connexion:', $body.text())
      })
      
      // Vérifier l'URL
      cy.url().then((url) => {
        cy.log('URL actuelle:', url)
      })
      
      // Vérifier les éléments du formulaire
      cy.get('input').then(($inputs) => {
        cy.log('Nombre d\'inputs trouvés:', $inputs.length)
        $inputs.each((index, input) => {
          cy.log(`Input ${index}:`, input.name, input.type, input.placeholder)
        })
      })
    })

    it('devrait diagnostiquer la page d\'inscription', () => {
      cy.visit('/register')
      cy.wait(3000)
      
      // Capturer l'état de la page
      cy.screenshot('diagnostic-register')
      
      // Vérifier le contenu de la page
      cy.get('body').then(($body) => {
        cy.log('Contenu de la page d\'inscription:', $body.text())
      })
      
      // Vérifier l'URL
      cy.url().then((url) => {
        cy.log('URL actuelle:', url)
      })
      
      // Vérifier les éléments du formulaire
      cy.get('input').then(($inputs) => {
        cy.log('Nombre d\'inputs trouvés:', $inputs.length)
        $inputs.each((index, input) => {
          cy.log(`Input ${index}:`, input.name, input.type, input.placeholder)
        })
      })
    })
  })

  describe('Diagnostic des Formulaires', () => {
    it('devrait diagnostiquer le formulaire de connexion', () => {
      cy.visit('/login')
      cy.wait(3000)
      
      // Essayer de soumettre le formulaire vide
      cy.get('button[type="submit"]').click()
      cy.wait(2000)
      
      // Capturer l'état après soumission
      cy.screenshot('diagnostic-login-after-submit')
      
      // Vérifier le contenu après soumission
      cy.get('body').then(($body) => {
        cy.log('Contenu après soumission du formulaire vide:', $body.text())
      })
    })

    it('devrait diagnostiquer le formulaire d\'inscription', () => {
      cy.visit('/register')
      cy.wait(3000)
      
      // Essayer de soumettre le formulaire vide
      cy.get('button[type="submit"]').click()
      cy.wait(2000)
      
      // Capturer l'état après soumission
      cy.screenshot('diagnostic-register-after-submit')
      
      // Vérifier le contenu après soumission
      cy.get('body').then(($body) => {
        cy.log('Contenu après soumission du formulaire vide:', $body.text())
      })
    })
  })

  describe('Diagnostic de l\'API', () => {
    it('devrait diagnostiquer les appels API', () => {
      cy.visit('/login')
      cy.wait(3000)
      
      // Intercepter les appels API
      cy.intercept('POST', '/api/auth/login').as('loginApi')
      
      // Remplir et soumettre le formulaire
      cy.get('input[name="email"]').type('test@example.com')
      cy.get('input[name="password"]').type('password123')
      cy.get('button[type="submit"]').click()
      
      // Attendre l'appel API
      cy.wait('@loginApi').then((interception) => {
        cy.log('Appel API login:', {
          status: interception.response?.statusCode,
          body: interception.response?.body,
          headers: interception.response?.headers
        })
      })
      
      cy.wait(2000)
      cy.screenshot('diagnostic-after-api-call')
    })
  })

  describe('Diagnostic du State Redux', () => {
    it('devrait diagnostiquer l\'état Redux', () => {
      cy.visit('/login')
      cy.wait(3000)
      
      // Vérifier l'état initial
      cy.window().then((win) => {
        if (win.__REDUX_DEVTOOLS_EXTENSION__) {
          cy.log('Redux DevTools disponible')
        } else {
          cy.log('Redux DevTools non disponible')
        }
        
        // Vérifier les variables globales
        cy.log('Variables globales:', {
          isAuthenticated: win.isAuthenticated,
          user: win.user,
          token: win.token
        })
      })
    })
  })
})
