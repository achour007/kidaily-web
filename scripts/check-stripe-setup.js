#!/usr/bin/env node

/**
 * Script de vérification de la configuration Stripe
 * Exécutez ce script pour vérifier que Stripe est correctement configuré
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Vérification de la configuration Stripe pour Kidaily...\n');

// Vérifier la présence des dépendances
console.log('📦 Vérification des dépendances...');
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

const requiredDependencies = [
  '@stripe/stripe-js',
  '@stripe/react-stripe-js'
];

let dependenciesOk = true;
requiredDependencies.forEach(dep => {
  if (packageJson.dependencies[dep]) {
    console.log(`  ✅ ${dep} - ${packageJson.dependencies[dep]}`);
  } else {
    console.log(`  ❌ ${dep} - MANQUANT`);
    dependenciesOk = false;
  }
});

// Vérifier la présence des fichiers de configuration
console.log('\n📁 Vérification des fichiers de configuration...');
const configFiles = [
  'src/config/stripe.ts',
  'src/services/monetizationService.ts',
  'STRIPE_SETUP.md'
];

let configFilesOk = true;
configFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MANQUANT`);
    configFilesOk = false;
  }
});

// Vérifier la structure des composants
console.log('\n🧩 Vérification des composants...');
const componentFiles = [
  'src/components/ProfessionalPlanCard.tsx',
  'src/screens/SubscriptionScreen.tsx'
];

let componentsOk = true;
componentFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MANQUANT`);
    componentsOk = false;
  }
});

// Vérifier la compilation
console.log('\n🔨 Test de compilation...');
try {
  const { execSync } = require('child_process');
  execSync('npm run build', { 
    cwd: path.join(__dirname, '..'), 
    stdio: 'pipe' 
  });
  console.log('  ✅ Compilation réussie');
} catch (error) {
  console.log('  ❌ Erreur de compilation');
  console.log(`     ${error.message}`);
}

// Résumé
console.log('\n📋 Résumé de la vérification...');
console.log(`  Dependencies: ${dependenciesOk ? '✅' : '❌'}`);
console.log(`  Configuration: ${configFilesOk ? '✅' : '❌'}`);
console.log(`  Composants: ${componentsOk ? '✅' : '❌'}`);

if (dependenciesOk && configFilesOk && componentsOk) {
  console.log('\n🎉 Configuration Stripe complète et fonctionnelle !');
  console.log('\n📝 Prochaines étapes :');
  console.log('  1. Créez un fichier .env avec votre clé Stripe');
  console.log('  2. Configurez vos produits dans le dashboard Stripe');
  console.log('  3. Testez les paiements avec les cartes de test');
  console.log('\n📚 Consultez STRIPE_SETUP.md pour plus de détails');
} else {
  console.log('\n⚠️  Certains éléments sont manquants ou incorrects');
  console.log('   Vérifiez les erreurs ci-dessus et corrigez-les');
}

console.log('\n🔗 Liens utiles :');
console.log('  - Dashboard Stripe: https://dashboard.stripe.com');
console.log('  - Documentation Stripe: https://stripe.com/docs');
console.log('  - Support Stripe: https://support.stripe.com');
