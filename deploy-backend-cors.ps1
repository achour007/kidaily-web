# Script de redéploiement du backend avec CORS corrigé
# Ce script déploie le backend après la correction CORS

Write-Host "🚀 REDÉPLOIEMENT BACKEND CORS CORRIGÉ" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

# 1. Aller dans le dossier backend
Write-Host "📁 Navigation vers le dossier backend..." -ForegroundColor Yellow
Set-Location "..\kidaily-backend\kidaily-backend"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors de la navigation vers le backend" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dossier backend atteint" -ForegroundColor Green

# 2. Vérifier le statut Git
Write-Host "📋 Vérification du statut Git..." -ForegroundColor Yellow
git status

# 3. Ajouter les changements CORS
Write-Host "📝 Ajout des changements CORS..." -ForegroundColor Yellow
git add src/app.js

# 4. Commiter les changements
Write-Host "💾 Commit des changements CORS..." -ForegroundColor Yellow
git commit -m "🔧 CORS: Ajout des URLs stables Vercel

✅ URLs stables ajoutées :
- https://kidaily-app.vercel.app
- https://kidaily-production.vercel.app

🔧 Correction du problème CORS pour l'inscription
📱 Messages d'erreur précis maintenant visibles"

# 5. Déployer sur Heroku
Write-Host "🚀 Déploiement sur Heroku..." -ForegroundColor Yellow
git push heroku master

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du déploiement Heroku" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Déploiement Heroku réussi" -ForegroundColor Green

# 6. Vérifier le déploiement
Write-Host "🔍 Vérification du déploiement..." -ForegroundColor Yellow
heroku logs --tail --app kidaily-backend

Write-Host ""
Write-Host "🎯 DÉPLOIEMENT TERMINÉ !" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green
Write-Host "✅ Configuration CORS mise à jour" -ForegroundColor White
Write-Host "✅ Backend redéployé sur Heroku" -ForegroundColor White
Write-Host "✅ URLs stables Vercel autorisées" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Testez maintenant l'inscription avec un email existant :" -ForegroundColor Yellow
Write-Host "   https://kidaily-app.vercel.app/register" -ForegroundColor White
Write-Host ""
Write-Host "💡 Le message 'Ce mail est déjà utilisé' devrait maintenant s'afficher !" -ForegroundColor Green
