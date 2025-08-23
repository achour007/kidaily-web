# 🚀 GUIDE DE DÉVELOPPEMENT ET DÉPLOIEMENT - KIDAILY

## 📁 STRUCTURE RÉELLE DES RÉPERTOIRES

```
C:\Users\Home\Desktop\application depart de base\appli_dario\
├── kidaily-git\                    ← FRONTEND (React + Vercel)
│   ├── src\
│   │   ├── components\             ← Composants React
│   │   ├── screens\                ← Écrans de l'application
│   │   ├── services\               ← Services API
│   │   ├── translations\           ← Fichiers de traduction
│   │   ├── store\                  ← Redux store
│   │   └── types\                  ← Types TypeScript
│   ├── package.json                ← Dépendances frontend
│   ├── vercel.json                 ← Configuration Vercel
│   └── tsconfig.json               ← Configuration TypeScript
│
└── kidaily-backend\                ← BACKEND (Node.js + Heroku)
    └── kidaily-backend\            ← RÉPERTOIRE PRINCIPAL BACKEND
        ├── src\
        │   ├── routes\
        │   │   ├── auth.js         ← Authentification (login + register)
        │   │   ├── users.js        ← Gestion utilisateurs
        │   │   ├── children.js     ← Gestion enfants
        │   │   └── evaluations.js  ← Gestion évaluations
        │   ├── middleware\          ← Middleware Express
        │   ├── config\              ← Configuration
        │   └── app.js              ← Configuration principale + CORS
        ├── prisma\
        │   └── schema.prisma       ← Schéma base de données
        ├── package.json             ← Dépendances backend
        └── .env                    ← Variables d'environnement
```

## 🛠️ DÉVELOPPEMENT LOCAL - PROCÉDURE RÉELLE

### **1. PRÉREQUIS OBLIGATOIRES**
- Node.js >= 18.0.0
- npm >= 8.0.0
- Git installé et configuré
- Compte Heroku CLI connecté
- Compte Vercel CLI connecté

### **2. DÉVELOPPEMENT FRONTEND - PROCÉDURE RÉELLE**

```bash
# 1. Aller dans le répertoire frontend
cd "C:\Users\Home\Desktop\application depart de base\appli_dario\kidaily-git"

# 2. Installer les dépendances
npm install

# 3. Démarrer l'application en mode développement
npm start
# L'application démarre sur http://localhost:3000
# Hot reload activé automatiquement
```

**Fichiers clés à modifier :**
- `src/services/api.ts` - Configuration des endpoints API
- `src/screens/` - Écrans de l'application
- `src/components/` - Composants réutilisables
- `src/translations/` - Fichiers de traduction

### **3. DÉVELOPPEMENT BACKEND - PROCÉDURE RÉELLE**

```bash
# 1. Aller dans le répertoire backend
cd "C:\Users\Home\Desktop\application depart de base\appli_dario\kidaily-backend\kidaily-backend"

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
# Créer/modifier le fichier .env avec :
NODE_ENV=development
PORT=3001
DATABASE_URL="postgresql://..."
JWT_SECRET="votre_secret_jwt"

# 4. Générer le client Prisma
npm run db:generate

# 5. Démarrer l'application en mode développement
npm run dev
# L'API démarre sur http://localhost:3001
```

**Fichiers clés à modifier :**
- `src/routes/auth.js` - Endpoints d'authentification
- `src/app.js` - Configuration CORS et middleware
- `prisma/schema.prisma` - Schéma base de données

### **4. TESTS LOCAUX - PROCÉDURE RÉELLE**

```bash
# Frontend - Tests
cd kidaily-git
npm test                    # Tests unitaires
npm run build              # Build de production local

# Backend - Tests
cd kidaily-backend\kidaily-backend
npm test                   # Tests unitaires
npm run build              # Build de production local
```

## 🚀 DÉPLOIEMENT - PROCÉDURE RÉELLE

### **1. DÉPLOIEMENT BACKEND (HEROKU) - PROCÉDURE RÉELLE**

```bash
# 1. Aller dans le répertoire backend
cd "C:\Users\Home\Desktop\application depart de base\appli_dario\kidaily-backend\kidaily-backend"

# 2. Vérifier le statut Git
git status
git log --oneline -5

# 3. Vérifier le statut Heroku
heroku ps --app kidaily-backend

# 4. Préparer le déploiement
git add .
git commit -m "📝 Description précise des changements"
git push heroku master

# 5. Vérifier le déploiement
heroku ps --app kidaily-backend
heroku logs --app kidaily-backend --tail --num 20

# 6. Test de l'API après déploiement
# Attendre 15-20 secondes puis tester
```

**URL Backend :** `https://kidaily-backend-cb9a147c3208.herokuapp.com`

### **2. DÉPLOIEMENT FRONTEND (VERCEL) - PROCÉDURE RÉELLE**

```bash
# 1. Aller dans le répertoire frontend
cd "C:\Users\Home\Desktop\application depart de base\appli_dario\kidaily-git"

# 2. Vérifier la configuration Vercel
cat vercel.json

# 3. Vérifier que l'URL API pointe vers le bon backend
# Dans vercel.json, vérifier :
"REACT_APP_API_URL": "https://kidaily-backend-cb9a147c3208.herokuapp.com"

# 4. Déployer sur Vercel
vercel --prod

# 5. Vérifier le déploiement
vercel ls
```

**URL Frontend :** `https://kidaily-6e5r4hmtc-achour007s-projects.vercel.app`

### **3. CONFIGURATION CORS - PROCÉDURE RÉELLE**

**Fichier :** `src/app.js` dans le backend

```javascript
// Configuration CORS ACTUELLE
app.use(cors({
  origin: [
    "http://localhost:3000",        // Développement local frontend
    "http://localhost:3001",        // Développement local backend
    "https://kidaily-6e5r4hmtc-achour007s-projects.vercel.app"  // Production Vercel
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"]
}));
```

**⚠️ IMPORTANT :** Si vous changez l'URL Vercel, mettre à jour cette configuration !

### **4. URLs STABLES ET ALIAS - NOUVEAU SYSTÈME**

**🎯 PROBLÈME RÉSOLU :** L'URL Vercel changeait à chaque déploiement, causant des problèmes de CORS !

#### **A. URLs stables configurées :**
- 🌐 **URL principale :** `https://kidaily-app.vercel.app`
- 🚀 **URL production :** `https://kidaily-production.vercel.app`

#### **B. Avantages des URLs stables :**
- ✅ **Configuration CORS** du backend **une seule fois**
- ✅ **URLs de production** stables et prévisibles
- ✅ **Meilleure expérience** utilisateur
- ✅ **Configuration** simplifiée pour l'équipe

#### **C. Fichiers de configuration :**
- `vercel.json` - Configuration Vercel optimisée
- `deploy-stable.ps1` - Script de déploiement automatisé
- `vercel-domains.json` - Documentation des domaines

#### **D. Procédure de déploiement avec URLs stables :**

```bash
# 1. Déploiement standard
vercel --prod

# 2. Configuration des alias stables
vercel alias set kidaily-app.vercel.app
vercel alias set kidaily-production.vercel.app

# 3. Vérification des alias
vercel alias ls
```

#### **E. Configuration CORS mise à jour :**

```javascript
// Configuration CORS AVEC URLs STABLES
app.use(cors({
  origin: [
    "http://localhost:3000",                    // Développement local frontend
    "http://localhost:3001",                    // Développement local backend
    "https://kidaily-app.vercel.app",           // Production Vercel - URL STABLE
    "https://kidaily-production.vercel.app"     // Production Vercel - URL STABLE
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"]
}));
```

**💡 AVANTAGE :** Plus besoin de mettre à jour la configuration CORS à chaque déploiement !

## 🔐 AUTHENTIFICATION - ENDPOINTS RÉELS

### **1. ENDPOINTS DISPONIBLES ET TESTÉS**

- **POST** `/api/auth/login` - Connexion utilisateur ✅
- **POST** `/api/auth/register` - Création de compte ✅

### **2. UTILISATEURS DE TEST RÉELS**

```json
{
  "compte1": {
    "email": "test@kidaily.ch",
    "password": "password123",
    "status": "✅ Fonctionnel"
  },
  "compte2": {
    "email": "achour.ighil@gmail.com",
    "password": "password123",
    "status": "✅ Fonctionnel"
  }
}
```

### **3. TEST DES ENDPOINTS - PROCÉDURE RÉELLE**

```bash
# Test de connexion
curl -X POST https://kidaily-backend-cb9a147c3208.herokuapp.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@kidaily.ch","password":"password123"}'

# Test de création de compte
curl -X POST https://kidaily-backend-cb9a147c3208.herokuapp.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"nouveau@test.ch","password":"password123","firstName":"Test","lastName":"User","language":"fr","role":"PARENT"}'
```

## 📊 MONITORING ET MAINTENANCE - PROCÉDURE RÉELLE

### **1. LOGS HEROKU - COMMANDES RÉELLES**

```bash
# Logs en temps réel
heroku logs --tail --app kidaily-backend

# Logs des 50 dernières lignes
heroku logs --app kidaily-backend --num 50

# Logs avec filtrage par erreur
heroku logs --app kidaily-backend --num 100 | Select-String "ERROR"

# Redémarrer l'application
heroku restart --app kidaily-backend
```

### **2. STATUT DE L'APPLICATION - COMMANDES RÉELLES**

```bash
# Vérifier le statut
heroku ps --app kidaily-backend

# Vérifier les add-ons
heroku addons --app kidaily-backend

# Vérifier la configuration
heroku config --app kidaily-backend

# Vérifier les releases
heroku releases --app kidaily-backend
```

## 🚨 PROCÉDURES D'URGENCE - PROCÉDURE RÉELLE

### **1. ROLLBACK EN CAS DE PROBLÈME**

```bash
# 1. Voir les versions déployées
heroku releases --app kidaily-backend

# 2. Identifier la version stable précédente
# Exemple : v29, v28, v27...

# 3. Rollback à la version précédente
heroku rollback --app kidaily-backend

# 4. Redémarrer après rollback
heroku restart --app kidaily-backend

# 5. Vérifier le statut
heroku ps --app kidaily-backend
```

### **2. RESTAURATION DE FICHIERS - PROCÉDURE RÉELLE**

```bash
# 1. Restaurer depuis une sauvegarde
Copy-Item src/app.js.backup src/app.js

# 2. Vérifier la restauration
git status
git diff

# 3. Commiter la restauration
git add src/app.js
git commit -m "🔄 Restauration depuis sauvegarde"

# 4. Redéployer
git push heroku master

# 5. Vérifier le déploiement
heroku ps --app kidaily-backend
```

### **3. PROBLÈME CORS - PROCÉDURE RÉELLE**

```bash
# 1. Vérifier la configuration CORS
Get-Content src/app.js | Select-String -Pattern "origin:|kidaily" -Context 3

# 2. Corriger l'URL Vercel si nécessaire
# Remplacer l'ancienne URL par la nouvelle dans src/app.js

# 3. Commiter et déployer
git add src/app.js
git commit -m "🔧 Correction configuration CORS"
git push heroku master
```

## 📝 CHECKLIST DE DÉPLOIEMENT - PROCÉDURE RÉELLE

### **AVANT DÉPLOIEMENT**
- [ ] Tests locaux réussis (npm start + npm run dev)
- [ ] Variables d'environnement configurées (.env)
- [ ] Configuration CORS mise à jour avec la bonne URL Vercel
- [ ] Base de données synchronisée (Prisma)
- [ ] Fichiers sauvegardés si modifications critiques

### **DÉPLOIEMENT BACKEND**
- [ ] Aller dans `kidaily-backend\kidaily-backend`
- [ ] `git add .` et `git commit -m "message"`
- [ ] `git push heroku master`
- [ ] Attendre le build et vérifier `heroku ps --app kidaily-backend`
- [ ] Vérifier les logs `heroku logs --app kidaily-backend --tail`

### **DÉPLOIEMENT FRONTEND**
- [ ] Aller dans `kidaily-git`
- [ ] Vérifier `vercel.json` (URL API correcte)
- [ ] `vercel --prod`
- [ ] **NOUVEAU :** Configurer les alias stables :
  - [ ] `vercel alias set kidaily-app.vercel.app`
  - [ ] `vercel alias set kidaily-production.vercel.app`
- [ ] Vérifier le déploiement `vercel ls`
- [ ] Vérifier les alias `vercel alias ls`

### **APRÈS DÉPLOIEMENT**
- [ ] Test de l'API backend (endpoint /health ou /auth/login)
- [ ] Test du frontend (accès à l'URL Vercel)
- [ ] Test de création de compte (endpoint /auth/register)
- [ ] Test de connexion (endpoint /auth/login)
- [ ] Vérification des logs Heroku

## 🔗 LIENS UTILES - RÉELS

- **Dashboard Heroku :** https://dashboard.heroku.com/apps/kidaily-backend
- **Dashboard Vercel :** https://vercel.com/achour007s-projects/kidaily-web
- **API Backend :** https://kidaily-backend-cb9a147c3208.herokuapp.com
- **Frontend URLs STABLES :**
  - 🌐 **URL principale :** https://kidaily-app.vercel.app
  - 🚀 **URL production :** https://kidaily-production.vercel.app
- **Frontend URL temporaire :** https://kidaily-6e5r4hmtc-achour007s-projects.vercel.app

## 📚 COMMANDES RAPIDES - RÉFÉRENCE

```bash
# Développement
cd kidaily-git && npm start                    # Frontend local
cd kidaily-backend\kidaily-backend && npm run dev  # Backend local

# Déploiement
cd kidaily-backend\kidaily-backend && git push heroku master  # Backend
cd kidaily-git && vercel --prod               # Frontend

# Monitoring
heroku ps --app kidaily-backend               # Statut backend
heroku logs --tail --app kidaily-backend      # Logs temps réel
```

## 🐛 DÉPANNAGE - PROBLÈMES COURANTS

### **1. ERREUR CORS**
**Symptôme :** `No 'Access-Control-Allow-Origin' header is present`
**Solution :** Vérifier la configuration CORS dans `src/app.js` du backend

### **2. ERREUR 404 SUR /api/auth/register**
**Symptôme :** `POST /api/auth/register 404 (Not Found)`
**Solution :** Vérifier que l'endpoint register existe dans `src/routes/auth.js`

### **3. ERREUR D'AUTHENTIFICATION**
**Symptôme :** `Invalid credentials` ou `User not found`
**Solution :** Vérifier la base de données et les hashes de mots de passe

### **4. ERREUR DE DÉPLOIEMENT HEROKU**
**Symptôme :** Build failed ou application crash
**Solution :** Vérifier les logs avec `heroku logs --app kidaily-backend --tail`

---

**⚠️ IMPORTANT :** Toujours tester en local avant de déployer en production !
**✅ RÈGLE D'OR :** Un commit = Un déploiement = Une vérification !

**📅 Dernière mise à jour :** 2024-12-19
**👤 Créé par :** Équipe de développement Kidaily
**✅ Basé sur :** Procédures réelles testées et validées
