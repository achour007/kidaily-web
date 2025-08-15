#!/bin/bash

# Script de démarrage pour l'application web Kidaily
echo "🌐 Démarrage de l'application web Kidaily..."

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js d'abord."
    exit 1
fi

# Vérifier que npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez installer npm d'abord."
    exit 1
fi

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Vérifier les warnings ESLint
echo "🔍 Vérification du code..."
npm run lint

# Démarrer l'application
echo "🎯 Lancement de l'application web..."
npm start

echo "✅ Application web démarrée avec succès!" 