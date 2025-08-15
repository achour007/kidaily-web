// Configuration du serveur de développement avec redirection forcée
const express = require('express');
const path = require('path');

const app = express();

// Middleware de redirection forcée vers /setup
app.use((req, res, next) => {
  console.log(`[DEV-SERVER] Request: ${req.method} ${req.path}`);
  
  // Si c'est une ressource statique, continuer
  if (req.path.startsWith('/static/') || 
      req.path.startsWith('/favicon.ico') || 
      req.path.startsWith('/manifest.json') ||
      req.path.startsWith('/setup')) {
    console.log(`[DEV-SERVER] Allowing: ${req.path}`);
    return next();
  }
  
  // Rediriger TOUT le reste vers /setup
  console.log(`[DEV-SERVER] REDIRECTING ${req.path} to /setup`);
  res.redirect(302, '/setup');
});

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../public')));

// Route par défaut - toujours /setup
app.get('*', (req, res) => {
  if (req.path === '/setup') {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  } else {
    res.redirect(302, '/setup');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[DEV-SERVER] Server running on port ${PORT}`);
  console.log(`[DEV-SERVER] ALL routes will redirect to /setup`);
  console.log(`[DEV-SERVER] Access: http://localhost:${PORT}/setup`);
});

module.exports = app;

