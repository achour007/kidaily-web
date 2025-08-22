# Correction du schema.prisma
# Remplacer provider = "sqlite" par provider = "postgresql"

Write-Host "🚀 Début de la correction..." -ForegroundColor Green

# Se connecter au serveur Heroku
Write-Host "�� Connexion au serveur Heroku..." -ForegroundColor Cyan
heroku run bash --app kidaily-backend

# Dans le bash, exécuter :
Write-Host "⚙️ Dans le bash Heroku, exécutez ces commandes :" -ForegroundColor White
Write-Host "cd /app" -ForegroundColor White
Write-Host "cp prisma/schema.prisma prisma/schema.prisma.backup" -ForegroundColor White
Write-Host "sed -i 's/provider = \"sqlite\"/provider = \"postgresql\"/' prisma/schema.prisma" -ForegroundColor White
Write-Host "cat prisma/schema.prisma | grep provider" -ForegroundColor White
Write-Host "npx prisma generate" -ForegroundColor White
Write-Host "npx prisma db push" -ForegroundColor White
Write-Host "exit" -ForegroundColor White

# Redémarrer le serveur
Write-Host "🔄 Redémarrage du serveur..." -ForegroundColor Yellow
heroku restart --app kidaily-backend

Write-Host "✅ Correction terminée !" -ForegroundColor Green
