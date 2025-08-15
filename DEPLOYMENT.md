# 🚀 Guide de Déploiement Kidaily

Ce guide vous accompagne dans le déploiement de l'application Kidaily en production.

## 📋 Prérequis

- Node.js 18+ et npm
- Git
- Compte sur la plateforme de déploiement choisie
- Tests qui passent (Cypress + Jest)

## 🎯 Plateformes de Déploiement

### 1. **Vercel (Recommandé pour commencer)**

**Avantages :**
- Déploiement automatique depuis Git
- CDN global
- HTTPS automatique
- Prévisualisation des PR
- Gratuit pour projets personnels

**Installation :**
```bash
npm i -g vercel
```

**Déploiement :**
```bash
npm run deploy:vercel
# ou
vercel --prod
```

### 2. **Netlify**

**Avantages :**
- Déploiement automatique
- Formulaires intégrés
- Fonctions serverless
- HTTPS automatique

**Installation :**
```bash
npm i -g netlify-cli
```

**Déploiement :**
```bash
npm run deploy:netlify
# ou
netlify deploy --prod --dir=build
```

### 3. **GitHub Pages**

**Avantages :**
- Intégration Git native
- Gratuit
- HTTPS automatique

**Installation :**
```bash
npm install --save-dev gh-pages
```

**Déploiement :**
```bash
npm run deploy:github
```

### 4. **AWS S3 + CloudFront**

**Avantages :**
- Très scalable
- CDN global
- Haute disponibilité
- Pay-per-use économique

**Déploiement :**
```bash
npm run deploy:aws
```

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env.production` avec :

```env
REACT_APP_ENV=production
REACT_APP_API_URL=https://api.kidaily.com
REACT_APP_VERSION=1.0.0
```

### Configuration Vercel

Le fichier `vercel.json` est déjà configuré pour :
- Build automatique
- Routing SPA
- Headers de sécurité
- Compression gzip

## 🚀 Déploiement Automatisé

### Script de déploiement complet

```bash
# Déploiement sur Vercel
./scripts/deploy-production.sh vercel

# Déploiement sur Netlify
./scripts/deploy-production.sh netlify

# Déploiement Docker
./scripts/deploy-production.sh docker
```

### Pipeline CI/CD

Le script automatise :
1. ✅ Vérification des prérequis
2. 🧪 Exécution des tests
3. 📊 Analyse de performance
4. 🚀 Déploiement
5. 🔍 Vérifications post-déploiement
6. 📢 Notification de l'équipe

## 🐳 Déploiement Docker

### Build de l'image

```bash
docker build -f Dockerfile.prod -t kidaily-web:latest .
```

### Lancement du conteneur

```bash
docker run -d --name kidaily-web -p 80:80 kidaily-web:latest
```

### Docker Compose

```yaml
version: '3.8'
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile.prod
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

## 📊 Monitoring et Performance

### Métriques à surveiller

- **Performance :** Lighthouse score > 90
- **Taille du bundle :** < 300KB gzippé
- **Temps de chargement :** < 3s
- **Disponibilité :** > 99.9%

### Outils de monitoring

- **Vercel Analytics** (intégré)
- **Google Analytics**
- **Sentry** (erreurs)
- **UptimeRobot** (disponibilité)

## 🔒 Sécurité

### Headers de sécurité

L'application inclut automatiquement :
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 1; mode=block`
- `X-Content-Type-Options: nosniff`
- `Content-Security-Policy`

### HTTPS

- **Vercel/Netlify :** Automatique
- **Docker :** Configurer avec Let's Encrypt

## 🚨 Rollback

### Vercel

```bash
vercel rollback [deployment-url]
```

### Netlify

```bash
netlify rollback [deployment-id]
```

### Docker

```bash
docker tag kidaily-web:previous kidaily-web:latest
docker restart kidaily-web
```

## 📝 Checklist de Déploiement

### Avant le déploiement

- [ ] Tests unitaires passent
- [ ] Tests E2E passent
- [ ] Build de production réussi
- [ ] Variables d'environnement configurées
- [ ] Branche main à jour

### Pendant le déploiement

- [ ] Script de déploiement exécuté
- [ ] Build déployé avec succès
- [ ] DNS propagé (si changement)
- [ ] SSL configuré

### Après le déploiement

- [ ] Application accessible
- [ ] Health check OK
- [ ] Tests de régression
- [ ] Performance vérifiée
- [ ] Équipe notifiée

## 🆘 Dépannage

### Problèmes courants

1. **Build échoue**
   - Vérifier les dépendances
   - Nettoyer le cache npm
   - Vérifier la version Node.js

2. **Déploiement échoue**
   - Vérifier les permissions
   - Vérifier la configuration
   - Consulter les logs

3. **Application ne se charge pas**
   - Vérifier le routing
   - Vérifier les variables d'environnement
   - Vérifier la console du navigateur

### Logs et debugging

```bash
# Logs de déploiement
tail -f deploy-*.log

# Logs Docker
docker logs kidaily-web

# Logs Vercel
vercel logs
```

## 📞 Support

- **Documentation :** [docs.kidaily.com](https://docs.kidaily.com)
- **Issues :** [GitHub Issues](https://github.com/kidaily/kidaily/issues)
- **Support :** [support@kidaily.com](mailto:support@kidaily.com)

---

**🚀 Prêt pour le déploiement ? Lancez :**

```bash
npm run deploy:check
./scripts/deploy-production.sh vercel
```
