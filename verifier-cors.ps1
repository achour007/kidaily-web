# Script de vérification et correction CORS pour Kidaily
# Ce script vérifie et corrige la configuration CORS du backend

Write-Host "🔍 VÉRIFICATION ET CORRECTION CORS KIDAILY" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# 1. Vérifier la configuration CORS actuelle du backend
Write-Host "📋 Vérification de la configuration CORS actuelle..." -ForegroundColor Yellow

$backendPath = "..\kidaily-backend\kidaily-backend\src\app.js"
if (Test-Path $backendPath) {
    Write-Host "✅ Fichier app.js trouvé" -ForegroundColor Green
    
    # Lire le contenu du fichier
    $content = Get-Content $backendPath -Raw
    Write-Host "📄 Contenu du fichier app.js :" -ForegroundColor Cyan
    Write-Host $content -ForegroundColor White
    
    # Vérifier si les URLs stables sont présentes
    if ($content -match "kidaily-app\.vercel\.app" -and $content -match "kidaily-production\.vercel\.app") {
        Write-Host "✅ URLs stables trouvées dans la configuration CORS" -ForegroundColor Green
    } else {
        Write-Host "❌ URLs stables MANQUANTES dans la configuration CORS" -ForegroundColor Red
        Write-Host "🔧 Mise à jour nécessaire..." -ForegroundColor Yellow
        
        # Mettre à jour la configuration CORS
        $newContent = $content -replace 'origin: \[([^\]]*)\]', @"
        origin: [
          "http://localhost:3000",                    // Développement local frontend
          "http://localhost:3001",                    // Développement local backend
          "https://kidaily-app.vercel.app",           // Production Vercel - URL STABLE
          "https://kidaily-production.vercel.app"     // Production Vercel - URL STABLE
        ]
"@
        
        # Sauvegarder le fichier
        $backupPath = $backendPath + ".backup"
        Copy-Item $backendPath $backupPath
        Write-Host "💾 Sauvegarde créée : $backupPath" -ForegroundColor Yellow
        
        # Écrire le nouveau contenu
        Set-Content $backendPath $newContent -Encoding UTF8
        Write-Host "✅ Configuration CORS mise à jour avec les URLs stables" -ForegroundColor Green
        
        # Afficher le nouveau contenu
        Write-Host "📄 Nouvelle configuration CORS :" -ForegroundColor Cyan
        $newContent = Get-Content $backendPath -Raw
        Write-Host $newContent -ForegroundColor White
    }
} else {
    Write-Host "❌ Fichier app.js non trouvé à : $backendPath" -ForegroundColor Red
    Write-Host "🔍 Vérification de la structure des dossiers..." -ForegroundColor Yellow
    
    # Lister les dossiers pour comprendre la structure
    Write-Host "📁 Structure des dossiers :" -ForegroundColor Cyan
    Get-ChildItem "..\kidaily-backend" -Recurse -Directory | Select-Object FullName | ForEach-Object { Write-Host $_.FullName -ForegroundColor White }
}

Write-Host ""
Write-Host "🎯 PROCHAINES ÉTAPES :" -ForegroundColor Green
Write-Host "1. Vérifier que la configuration CORS est correcte" -ForegroundColor White
Write-Host "2. Redéployer le backend sur Heroku" -ForegroundColor White
Write-Host "3. Tester l'inscription avec un email existant" -ForegroundColor White
Write-Host "4. Vérifier que le message 'Ce mail est déjà utilisé' s'affiche" -ForegroundColor White
