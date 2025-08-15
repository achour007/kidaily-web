# 📚 Guide des Traductions - Kidaily

## 🎯 Vue d'ensemble

Ce dossier contient toutes les traductions de l'application Kidaily, organisées par langue et par section fonctionnelle.

## 📁 Structure des Fichiers

```
translations/
├── index.ts           # Interface TypeScript des traductions
├── translations.ts    # Export centralisé des traductions
├── fr.ts             # Traductions françaises
├── en.ts             # Traductions anglaises
├── de.ts             # Traductions allemandes
├── it.ts             # Traductions italiennes
└── README.md         # Ce fichier
```

## 🏗️ Organisation des Traductions

### Section Auth (Authentification)
```typescript
// Auth
login: 'Se connecter',
logout: 'Se déconnecter',
register: 'S\'inscrire',
email: 'Adresse email',
password: 'Mot de passe',
confirmPassword: 'Confirmer le mot de passe',
firstName: 'Prénom',
lastName: 'Nom',
phone: 'Téléphone',
subtitle: 'Connectez-vous à votre compte',
language: 'Langue de l\'application',
version: 'Version',
local: 'Locale',
cloud: 'Cloud',
versionLocalInfo: 'Version locale - Les données sont stockées localement',
versionCloudInfo: 'Version cloud - Les données seront synchronisées avec le serveur distant',
noAccount: 'Pas encore de compte ?',
createAccount: 'Créer un compte',
forgotPassword: 'Mot de passe oublié',
resetPassword: 'Réinitialiser le mot de passe',
rememberMe: 'Se souvenir de moi',
```

### Sections Disponibles

1. **Navigation** - Éléments de navigation principaux
2. **Dashboard** - Écran d'accueil et résumés
3. **Common** - Éléments communs (boutons, actions, etc.)
4. **Auth** - Authentification et gestion des comptes
5. **Validation** - Messages de validation des formulaires
6. **Child Management** - Gestion des enfants
7. **Evaluation** - Système d'évaluation
8. **Activities** - Activités et jeux
9. **Progress** - Suivi des progrès
10. **Notifications** - Système de notifications
11. **Profile** - Gestion du profil utilisateur
12. **Messages** - Système de messagerie
13. **Calendar** - Calendrier et événements
14. **Photos** - Gestion des photos
15. **Documents** - Gestion des documents
16. **Settings** - Paramètres de l'application
17. **Errors** - Messages d'erreur
18. **Success** - Messages de succès
19. **Time** - Expressions temporelles
20. **Numbers** - Nombres
21. **Months** - Mois de l'année
22. **Days** - Jours de la semaine
23. **Domains** - Domaines de développement
24. **Status** - Statuts et états

## 🔧 Utilisation

### Dans un Composant React

```typescript
import { useLanguageContext } from '../contexts/LanguageContext';

const MyComponent: React.FC = () => {
  const { t, language, changeLanguage } = useLanguageContext();
  
  return (
    <div>
      <h1>{t.welcome}</h1>
      <p>{t.subtitle}</p>
      <button>{t.save}</button>
    </div>
  );
};
```

### Ajouter une Nouvelle Traduction

1. **Ajouter la clé dans l'interface** (`index.ts`)
2. **Ajouter la traduction dans chaque fichier de langue**
3. **Utiliser la traduction dans le composant**

#### Exemple

```typescript
// 1. Ajouter dans index.ts
export interface Translations {
  // ... autres traductions
  newFeature: string;
}

// 2. Ajouter dans fr.ts
export const fr: Translations = {
  // ... autres traductions
  newFeature: 'Nouvelle fonctionnalité',
};

// 3. Ajouter dans en.ts
export const en: Translations = {
  // ... autres traductions
  newFeature: 'New feature',
};

// 4. Utiliser dans le composant
const { t } = useLanguageContext();
return <div>{t.newFeature}</div>;
```

## 🌍 Langues Supportées

- 🇫🇷 **Français** (`fr`) - Langue par défaut
- 🇬🇧 **English** (`en`) - Anglais
- 🇩🇪 **Deutsch** (`de`) - Allemand
- 🇮🇹 **Italiano** (`it`) - Italien

## 📝 Conventions

1. **Clés en camelCase** : `versionLocalInfo`, `createAccount`
2. **Commentaires descriptifs** : `// Auth`, `// Validation`
3. **Groupement logique** : Traductions liées groupées ensemble
4. **Cohérence** : Même structure dans tous les fichiers de langue

## 🚀 Bonnes Pratiques

1. **Toujours utiliser le contexte** : `useLanguageContext()` au lieu d'imports directs
2. **Tester toutes les langues** : Vérifier que les traductions fonctionnent
3. **Maintenir la cohérence** : Même ordre dans tous les fichiers
4. **Documenter les changements** : Mettre à jour ce README si nécessaire

## 🔍 Débogage

Pour déboguer les traductions, utilisez le composant `LanguageTest` :

```typescript
import LanguageTest from '../components/LanguageTest';

// Dans votre composant
<LanguageTest />
```

Ce composant affiche toutes les traductions disponibles et permet de tester le changement de langue.
