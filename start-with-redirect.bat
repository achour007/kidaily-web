@echo off
echo ========================================
echo  DEMARRAGE KIDAILY AVEC REDIRECTION
echo ========================================
echo.
echo [1/3] Arret des processus Node.js existants...
taskkill /f /im node.exe >nul 2>&1
echo [1/3] OK - Processus arretes
echo.
echo [2/3] Demarrage du serveur avec redirection forcee...
echo [2/3] Toutes les routes redirigeront vers /setup
echo.
echo [3/3] Lancement de l'application...
start chrome "http://localhost:3001/setup"
echo.
echo ========================================
echo  APPLICATION LANCEE SUR /setup
echo ========================================
echo.
echo Si vous voyez encore /login, attendez 5 secondes
echo et rechargez la page (F5)
echo.
pause

