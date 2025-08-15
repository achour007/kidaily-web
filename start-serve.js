const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Démarrage du serveur web Kidaily...');

const serveProcess = spawn('serve', ['-s', 'build', '-l', '3001'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

serveProcess.on('error', (error) => {
  console.error('❌ Erreur lors du démarrage du serveur:', error);
  process.exit(1);
});

serveProcess.on('exit', (code) => {
  console.log(`📊 Serveur web arrêté avec le code: ${code}`);
  process.exit(code);
});

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
  console.log('\n🛑 Arrêt du serveur web...');
  serveProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Arrêt du serveur web...');
  serveProcess.kill('SIGTERM');
}); 