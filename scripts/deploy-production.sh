#!/bin/bash

# Script de déploiement en production pour Kidaily
# Usage: ./scripts/deploy-production.sh [platform]

set -e  # Arrêter en cas d'erreur

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="Kidaily"
VERSION=$(node -p "require('./package.json').version")
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
DEPLOY_LOG="deploy-${TIMESTAMP}.log"

# Fonction de logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$DEPLOY_LOG"
}

success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$DEPLOY_LOG"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$DEPLOY_LOG"
}

error() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$DEPLOY_LOG"
    exit 1
}

# Vérifications pré-déploiement
check_prerequisites() {
    log "🔍 Vérification des prérequis..."
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js n'est pas installé"
    fi
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        error "npm n'est pas installé"
    fi
    
    # Vérifier Git
    if ! command -v git &> /dev/null; then
        error "Git n'est pas installé"
    fi
    
    # Vérifier que nous sommes sur la branche main
    CURRENT_BRANCH=$(git branch --show-current)
    if [ "$CURRENT_BRANCH" != "main" ]; then
        warning "Vous n'êtes pas sur la branche main (actuellement sur: $CURRENT_BRANCH)"
        read -p "Continuer quand même ? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            error "Déploiement annulé"
        fi
    fi
    
    success "Prérequis vérifiés"
}

# Tests de qualité
run_tests() {
    log "🧪 Exécution des tests..."
    
    # Tests unitaires
    log "  - Tests unitaires..."
    npm run test:coverage || error "Tests unitaires échoués"
    
    # Tests E2E
    log "  - Tests E2E..."
    npm run test:e2e:headless || error "Tests E2E échoués"
    
    # Build de production
    log "  - Build de production..."
    npm run build:prod || error "Build de production échoué"
    
    success "Tous les tests passent"
}

# Analyse de performance
analyze_performance() {
    log "📊 Analyse de performance..."
    
    # Vérifier la taille du bundle
    BUNDLE_SIZE=$(du -sh build/static/js/ | cut -f1)
    log "  - Taille du bundle: $BUNDLE_SIZE"
    
    # Vérifier la compression
    if command -v gzip &> /dev/null; then
        COMPRESSED_SIZE=$(gzip -c build/static/js/main.*.js | wc -c)
        ORIGINAL_SIZE=$(wc -c < build/static/js/main.*.js)
        COMPRESSION_RATIO=$((100 - (COMPRESSED_SIZE * 100 / ORIGINAL_SIZE)))
        log "  - Ratio de compression: ${COMPRESSION_RATIO}%"
    fi
    
    success "Analyse de performance terminée"
}

# Déploiement sur Vercel
deploy_vercel() {
    log "🚀 Déploiement sur Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        error "Vercel CLI n'est pas installé. Installez-le avec: npm i -g vercel"
    fi
    
    vercel --prod --yes || error "Déploiement Vercel échoué"
    success "Déploiement Vercel réussi"
}

# Déploiement sur Netlify
deploy_netlify() {
    log "🚀 Déploiement sur Netlify..."
    
    if ! command -v netlify &> /dev/null; then
        error "Netlify CLI n'est pas installé. Installez-le avec: npm i -g netlify-cli"
    fi
    
    netlify deploy --prod --dir=build || error "Déploiement Netlify échoué"
    success "Déploiement Netlify réussi"
}

# Déploiement sur GitHub Pages
deploy_github() {
    log "🚀 Déploiement sur GitHub Pages..."
    
    if ! command -v gh-pages &> /dev/null; then
        log "Installation de gh-pages..."
        npm install --save-dev gh-pages
    fi
    
    npm run deploy:github || error "Déploiement GitHub Pages échoué"
    success "Déploiement GitHub Pages réussi"
}

# Déploiement Docker
deploy_docker() {
    log "🐳 Déploiement Docker..."
    
    if ! command -v docker &> /dev/null; then
        error "Docker n'est pas installé"
    fi
    
    # Construire l'image
    docker build -f Dockerfile.prod -t kidaily-web:latest . || error "Build Docker échoué"
    
    # Arrêter l'ancien conteneur
    docker stop kidaily-web 2>/dev/null || true
    docker rm kidaily-web 2>/dev/null || true
    
    # Démarrer le nouveau conteneur
    docker run -d --name kidaily-web -p 80:80 kidaily-web:latest || error "Démarrage Docker échoué"
    
    success "Déploiement Docker réussi"
}

# Vérifications post-déploiement
post_deploy_checks() {
    log "🔍 Vérifications post-déploiement..."
    
    # Attendre que l'application soit prête
    sleep 10
    
    # Vérifier la santé de l'application
    if command -v curl &> /dev/null; then
        if curl -f http://localhost/health &>/dev/null; then
            success "Application accessible et en bonne santé"
        else
            warning "Application accessible mais health check échoué"
        fi
    fi
    
    success "Vérifications post-déploiement terminées"
}

# Notification
notify_team() {
    log "📢 Notification de l'équipe..."
    
    # Ici vous pouvez ajouter des notifications Slack, email, etc.
    echo "🎉 Déploiement de $APP_NAME v$VERSION terminé avec succès !" | tee -a "$DEPLOY_LOG"
    
    success "Équipe notifiée"
}

# Fonction principale
main() {
    log "🚀 Démarrage du déploiement de $APP_NAME v$VERSION"
    
    # Vérifications préalables
    check_prerequisites
    
    # Tests de qualité
    run_tests
    
    # Analyse de performance
    analyze_performance
    
    # Déploiement selon la plateforme
    PLATFORM=${1:-vercel}
    case $PLATFORM in
        "vercel")
            deploy_vercel
            ;;
        "netlify")
            deploy_netlify
            ;;
        "github")
            deploy_github
            ;;
        "docker")
            deploy_docker
            ;;
        *)
            error "Plateforme non reconnue: $PLATFORM. Utilisez: vercel, netlify, github, ou docker"
            ;;
    esac
    
    # Vérifications post-déploiement
    post_deploy_checks
    
    # Notification
    notify_team
    
    success "🎉 Déploiement terminé avec succès !"
    log "📋 Logs sauvegardés dans: $DEPLOY_LOG"
}

# Exécution du script
main "$@"
