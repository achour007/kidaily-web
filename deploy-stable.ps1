# Script de déploiement stable pour Kidaily
# Ce script déploie l'application avec des alias stables

Write-Host "🚀 DÉPLOIEMENT STABLE KIDAILY" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# 1. Build de l'application
Write-Host "📦 Build de l'application..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du build" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build terminé avec succès" -ForegroundColor Green

# 2. Déploiement sur Vercel avec alias stables
Write-Host "🚀 Déploiement sur Vercel..." -ForegroundColor Yellow
vercel --prod

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du déploiement" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Déploiement terminé avec succès" -ForegroundColor Green

# 3. Configuration des alias stables
Write-Host "🔗 Configuration des alias stables..." -ForegroundColor Yellow

# Alias principal
vercel alias set kidaily-app.vercel.app

# Alias de production
vercel alias set kidaily-production.vercel.app

Write-Host "✅ Alias configurés avec succès" -ForegroundColor Green

# 4. Affichage des URLs stables
Write-Host ""
Write-Host "🎯 URLs STABLES CONFIGURÉES :" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "🌐 URL principale : https://kidaily-app.vercel.app" -ForegroundColor White
Write-Host "🚀 URL production : https://kidaily-production.vercel.app" -ForegroundColor White
Write-Host ""
Write-Host "💡 Ces URLs ne changeront plus à chaque déploiement !" -ForegroundColor Green
Write-Host "🔧 Mettez à jour la configuration CORS du backend avec ces URLs" -ForegroundColor Yellow
