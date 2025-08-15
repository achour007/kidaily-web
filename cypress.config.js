const { defineConfig } = require('cypress');

/**
 * Configuration Cypress ultra-robuste pour Kidaily
 * Optimisée pour la stabilité et la performance des tests E2E
 */
module.exports = defineConfig({
  // Configuration E2E principale
  e2e: {
    // URL de base pour les tests
    baseUrl: 'http://localhost:3001',
    
    // Variables d'environnement globales
    env: {
      testMode: true,
      disableSetupRedirect: true,
      cypress: true,
      appName: 'Kidaily',
      version: '1.0.0'
    },
    
    // Fichiers de support et de configuration
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    
    // Configuration de la vue
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Configuration des captures
    video: false,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    
    // Configuration des timeouts
    defaultCommandTimeout: 15000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    pageLoadTimeout: 30000,
    
    // Configuration de la retry
    retries: {
      runMode: 2,
      openMode: 1
    },
    
    // Configuration des hooks
    setupNodeEvents(on, config) {
      // Configuration des variables d'environnement
      config.env.testMode = true;
      config.env.disableSetupRedirect = true;
      config.env.cypress = true;
      
      // Variables d'environnement pour l'application
      config.env.NODE_ENV = 'test';
      config.env.REACT_APP_TEST_MODE = 'true';
      config.env.CYPRESS_TEST_MODE = 'true';
      config.env.REACT_APP_CYPRESS_MODE = 'true';
      config.env.REACT_APP_DISABLE_SETUP_REDIRECT = 'true';
      
      // Configuration des plugins
      on('before:browser:launch', (browser, launchOptions) => {
        // Optimisations pour Chrome
        if (browser.name === 'chrome' && browser.isHeadless) {
          launchOptions.args.push('--disable-gpu');
          launchOptions.args.push('--no-sandbox');
          launchOptions.args.push('--disable-dev-shm-usage');
          launchOptions.args.push('--disable-web-security');
          launchOptions.args.push('--disable-features=VizDisplayCompositor');
        }
        
        // Optimisations pour Firefox
        if (browser.name === 'firefox' && browser.isHeadless) {
          launchOptions.args.push('--headless');
        }
        
        return launchOptions;
      });
      
      // Configuration des tâches personnalisées
      on('task', {
        // Tâche pour forcer le mode test
        forceTestMode() {
          console.log('Mode test forcé via tâche Cypress');
          return null;
        },
        
        // Tâche pour nettoyer les données de test
        cleanTestData() {
          console.log('Nettoyage des données de test');
          return null;
        }
      });
      
      return config;
    },
    
    // Configuration de la performance
    numTestsKeptInMemory: 50,
    watchForFileChanges: false,
    
    // Configuration de la sécurité
    chromeWebSecurity: false,
    
    // Configuration des logs
    log: true,
    reporter: 'spec',
    reporterOptions: {
      mochaFile: 'cypress/results/results-[hash].xml',
      toConsole: true
    }
  },
  
  // Configuration pour les composants
  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
      webpackConfig: {
        resolve: {
          alias: {
            '@': require('path').resolve(__dirname, 'src')
          }
        }
      }
    },
    
    env: {
      testMode: true,
      disableSetupRedirect: true,
      cypress: true
    },
    
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.js'
  },
  
  // Configuration globale
  projectId: 'kidaily-web',
  watchForFileChanges: false,
  
  // Configuration des rapports
  reporter: 'spec',
  reporterOptions: {
    mochaFile: 'cypress/results/results-[hash].xml',
    toConsole: true
  }
});