#!/usr/bin/env node

/**
 * Script de démarrage ultra-intelligent pour les tests Kidaily
 * Configure automatiquement l'environnement de test et démarre l'application
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration des couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Fonction de log coloré
const log = (color, message) => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

// Fonction de log d'erreur
const logError = (message) => {
  console.error(`${colors.red}❌ ${message}${colors.reset}`);
};

// Fonction de log de succès
const logSuccess = (message) => {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
};

// Fonction de log d'information
const logInfo = (message) => {
  console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
};

// Fonction de log d'avertissement
const logWarning = (message) => {
  console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
};

// Configuration pour l'environnement de test
const setupTestEnvironment = () => {
  logInfo('🔧 Configuration de l\'environnement de test...');

  // Variables d'environnement principales
  const envVars = {
    NODE_ENV: 'test',
    REACT_APP_TEST_MODE: 'true',
    CYPRESS_TEST_MODE: 'true',
    REACT_APP_CYPRESS_MODE: 'true',
    REACT_APP_DISABLE_SETUP_REDIRECT: 'true',
    REACT_APP_ENVIRONMENT: 'test',
    REACT_APP_CYPRESS_MODE: 'true',
    PORT: '3001',
    BROWSER: 'none'
  };

  // Appliquer les variables d'environnement
  Object.entries(envVars).forEach(([key, value]) => {
    process.env[key] = value;
  });

  logSuccess('Variables d\'environnement configurées');
  
  // Afficher la configuration
  logInfo('📋 Configuration actuelle:');
  Object.entries(envVars).forEach(([key, value]) => {
    console.log(`   ${colors.cyan}${key}${colors.reset}: ${colors.yellow}${value}${colors.reset}`);
  });
};

// Fonction de vérification des dépendances
const checkDependencies = () => {
  logInfo('🔍 Vérification des dépendances...');

  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    logError('package.json non trouvé');
    process.exit(1);
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Vérifier les dépendances Cypress
  if (!packageJson.devDependencies?.cypress) {
    logWarning('Cypress n\'est pas installé. Installation...');
    const installCypress = spawn('npm', ['install', '--save-dev', 'cypress'], {
      stdio: 'inherit',
      shell: true,
      env: process.env
    });

    installCypress.on('close', (code) => {
      if (code === 0) {
        logSuccess('Cypress installé avec succès');
      } else {
        logError('Échec de l\'installation de Cypress');
        process.exit(1);
      }
    });
  } else {
    logSuccess('Dépendances vérifiées');
  }
};

// Fonction de démarrage de l'application
const startApplication = () => {
  logInfo('🚀 Démarrage de l\'application en mode test...');

  // Démarrer l'application React
  const startApp = spawn('npm', ['start'], {
    stdio: 'inherit',
    shell: true,
    env: process.env,
    cwd: path.join(__dirname, '..')
  });

  // Gérer les événements du processus
  startApp.on('error', (error) => {
    logError(`Erreur lors du démarrage de l'application: ${error.message}`);
    process.exit(1);
  });

  startApp.on('close', (code) => {
    logInfo(`📱 Application fermée avec le code: ${code}`);
    process.exit(code);
  });

  // Gérer l'interruption
  process.on('SIGINT', () => {
    logWarning('\n🛑 Arrêt de l\'application...');
    startApp.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    logWarning('\n🛑 Arrêt de l\'application...');
    startApp.kill('SIGTERM');
  });

  return startApp;
};

// Fonction principale
const main = async () => {
  try {
    // Afficher le header
    console.log('\n' + '='.repeat(60));
    log('bright', '🚀 KIDAILY - DÉMARRAGE EN MODE TEST');
    console.log('='.repeat(60) + '\n');

    // Vérifier les dépendances
    checkDependencies();

    // Configurer l'environnement
    setupTestEnvironment();

    // Démarrer l'application
    const appProcess = startApplication();

    // Attendre que l'application soit prête
    setTimeout(() => {
      logSuccess('🎉 Application prête pour les tests !');
      logInfo('📱 URL: http://localhost:3001');
      logInfo('🧪 Pour lancer Cypress: npm run test:e2e:open');
      logInfo('🔄 Pour les tests headless: npm run test:e2e:headless');
    }, 5000);

  } catch (error) {
    logError(`Erreur fatale: ${error.message}`);
    process.exit(1);
  }
};

// Exécuter le script principal
if (require.main === module) {
  main();
}

module.exports = {
  setupTestEnvironment,
  checkDependencies,
  startApplication
};



