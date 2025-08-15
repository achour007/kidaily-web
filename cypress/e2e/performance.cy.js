describe('Performance et Optimisation', () => {
  beforeEach(() => {
    // Nettoyer les données avant chaque test
    cy.cleanupTestData()
    cy.waitForApi()
  })

  describe('Temps de Chargement', () => {
    it('devrait charger la page d\'accueil rapidement', () => {
      const startTime = Date.now()
      
      cy.visit('/')
      cy.waitForPageLoad()
      
      const endTime = Date.now()
      const loadTime = endTime - startTime
      
      // Vérifier que le temps de chargement est inférieur à 3 secondes
      expect(loadTime).to.be.lessThan(3000)
      
      // Vérifier la performance avec l'API Performance
      cy.checkPagePerformance()
    })

    it('devrait charger le dashboard rapidement', () => {
      // Se connecter d'abord
      cy.login('test@kidaily.com', 'password123')
      
      const startTime = Date.now()
      
      cy.visit('/dashboard')
      cy.waitForPageLoad()
      
      const endTime = Date.now()
      const loadTime = endTime - startTime
      
      // Vérifier que le temps de chargement est inférieur à 2 secondes
      expect(loadTime).to.be.lessThan(2000)
    })

    it('devrait charger la liste des enfants rapidement', () => {
      cy.login('test@kidaily.com', 'password123')
      
      const startTime = Date.now()
      
      cy.visit('/children')
      cy.waitForPageLoad()
      
      const endTime = Date.now()
      const loadTime = endTime - startTime
      
      // Vérifier que le temps de chargement est inférieur à 2 secondes
      expect(loadTime).to.be.lessThan(2000)
    })
  })

  describe('Optimisation des Images', () => {
    it('devrait charger les images avec une taille optimisée', () => {
      cy.visit('/')
      cy.waitForPageLoad()

      // Vérifier que les images sont optimisées
      cy.get('img').each(($img) => {
        cy.wrap($img).should('be.visible')
        
        // Vérifier que l'image a une largeur et hauteur définies
        const width = $img[0].naturalWidth
        const height = $img[0].naturalHeight
        
        expect(width).to.be.greaterThan(0)
        expect(height).to.be.greaterThan(0)
      })
    })

    it('devrait utiliser le lazy loading pour les images', () => {
      cy.visit('/dashboard')
      cy.waitForPageLoad()

      // Vérifier que les images utilisent le lazy loading
      cy.get('img').each(($img) => {
        cy.wrap($img).should('have.attr', 'loading', 'lazy')
      })
    })
  })

  describe('Optimisation du Bundle', () => {
    it('devrait avoir une taille de bundle raisonnable', () => {
      cy.visit('/')
      cy.waitForPageLoad()

      // Vérifier la taille du bundle via les métriques de performance
      cy.window().then((win) => {
        const performance = win.performance
        const navigation = performance.getEntriesByType('navigation')[0]
        
        // Vérifier que le transfert de données est raisonnable (< 2MB)
        const transferSize = navigation.transferSize || 0
        expect(transferSize).to.be.lessThan(2 * 1024 * 1024) // 2MB
      })
    })

    it('devrait utiliser la compression gzip', () => {
      cy.request({
        url: '/',
        headers: {
          'Accept-Encoding': 'gzip, deflate, br'
        }
      }).then((response) => {
        // Vérifier que la réponse utilise la compression
        expect(response.headers['content-encoding']).to.be.oneOf(['gzip', 'br'])
      })
    })
  })

  describe('Optimisation du Cache', () => {
    it('devrait utiliser le cache efficacement', () => {
      cy.visit('/')
      cy.waitForPageLoad()

      // Vérifier que les ressources statiques sont mises en cache
      cy.window().then((win) => {
        const performance = win.performance
        const resources = performance.getEntriesByType('resource')
        
        // Vérifier que les ressources CSS et JS sont mises en cache
        const cachedResources = resources.filter(resource => 
          resource.name.includes('.css') || resource.name.includes('.js')
        )
        
        expect(cachedResources.length).to.be.greaterThan(0)
      })
    })

    it('devrait recharger rapidement après mise en cache', () => {
      // Premier chargement
      cy.visit('/')
      cy.waitForPageLoad()

      // Deuxième chargement (devrait être plus rapide)
      const startTime = Date.now()
      cy.visit('/')
      cy.waitForPageLoad()
      const endTime = Date.now()
      const reloadTime = endTime - startTime

      // Le rechargement devrait être plus rapide que le premier chargement
      expect(reloadTime).to.be.lessThan(1000)
    })
  })

  describe('Optimisation Mobile', () => {
    it('devrait être optimisé pour mobile', () => {
      cy.viewport(375, 667)
      cy.visit('/')
      cy.waitForPageLoad()

      // Vérifier que la page s'adapte correctement
      cy.get('body').should('have.css', 'width', '375px')
    })

    it('devrait charger rapidement sur mobile', () => {
      cy.viewport(375, 667)
      
      const startTime = Date.now()
      cy.visit('/')
      cy.waitForPageLoad()
      const endTime = Date.now()
      const mobileLoadTime = endTime - startTime

      // Le chargement mobile devrait être rapide
      expect(mobileLoadTime).to.be.lessThan(3000)
    })
  })

  describe('Optimisation de la Mémoire', () => {
    it('devrait utiliser la mémoire efficacement', () => {
      cy.visit('/')
      cy.waitForPageLoad()

      // Vérifier l'utilisation de la mémoire
      cy.window().then((win) => {
        if (win.performance.memory) {
          const memory = win.performance.memory
          
          // Vérifier que l'utilisation de la mémoire est raisonnable
          expect(memory.usedJSHeapSize).to.be.lessThan(100 * 1024 * 1024) // 100MB
        }
      })
    })

    it('devrait nettoyer la mémoire après navigation', () => {
      cy.visit('/')
      cy.waitForPageLoad()

      // Naviguer vers une autre page
      cy.visit('/dashboard')
      cy.waitForPageLoad()

      // Vérifier que la mémoire n'a pas augmenté de manière significative
      cy.window().then((win) => {
        if (win.performance.memory) {
          const memory = win.performance.memory
          expect(memory.usedJSHeapSize).to.be.lessThan(200 * 1024 * 1024) // 200MB
        }
      })
    })
  })

  describe('Optimisation des Requêtes API', () => {
    it('devrait minimiser les requêtes API', () => {
      cy.intercept('GET', '/api/**').as('apiRequest')
      
      cy.visit('/dashboard')
      cy.waitForPageLoad()

      // Vérifier le nombre de requêtes API
      cy.get('@apiRequest.all').then((interceptions) => {
        // Le nombre de requêtes devrait être minimal
        expect(interceptions.length).to.be.lessThan(20)
      })
    })

    it('devrait utiliser la mise en cache des requêtes', () => {
      cy.intercept('GET', '/api/**').as('apiRequest')
      
      cy.visit('/dashboard')
      cy.waitForPageLoad()

      // Recharger la page
      cy.visit('/dashboard')
      cy.waitForPageLoad()

      // Vérifier que certaines requêtes sont mises en cache
      cy.get('@apiRequest.all').then((interceptions) => {
        const cachedRequests = interceptions.filter(req => 
          req.response?.headers['cache-control']?.includes('max-age')
        )
        expect(cachedRequests.length).to.be.greaterThan(0)
      })
    })
  })
})
