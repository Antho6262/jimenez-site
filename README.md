# 🎸 Vizu 6Block's — Site Web

## 🚀 MISE EN PLACE

### 1. Créer un projet Firebase
1. Va sur [console.firebase.google.com](https://console.firebase.google.com)
2. Crée un nouveau projet (ex: `vizu-6blocks`)
3. Active **Realtime Database** (mode test)
4. Dans les paramètres du projet → "Ajouter une app Web" → copie la config

### 2. Configurer le site
Ouvre `js/firebase-config.js` et remplace les valeurs `VOTRE_...` par ta config Firebase :
```js
const FIREBASE_CONFIG = {
  apiKey: "...",
  authDomain: "...",
  databaseURL: "https://...firebaseio.com",
  projectId: "...",
  ...
};
```

### 3. Ajouter le logo (optionnel)
Place ton logo dans `img/logo.png`

### 4. Initialiser la base de données
1. Héberge le site (GitHub Pages ou local)
2. Ouvre `setup.html` dans le navigateur
3. Clique sur "Lancer l'initialisation"
4. **Ne pas refaire cette étape !**

### 5. Créer les membres
1. Va dans `pages/admin.html` (accès direct, pas de login requis au début)
2. Onglet **Membres** → ajouter chaque membre
3. Le mot de passe par défaut est : `prenom2026`

### 6. Déployer sur GitHub Pages
```bash
git init
git add .
git commit -m "Init Vizu 6Block's"
git remote add origin https://github.com/TON_USER/vizu-6blocks-site
git push -u origin main
```
Puis dans GitHub → Settings → Pages → Source: `main`

---

## 📁 STRUCTURE
```
vizu-6blocks-site/
├── index.html          ← Connexion
├── setup.html          ← Init Firebase (usage unique)
├── css/style.css       ← Thème or/noir
├── js/
│   ├── firebase-config.js  ← Config + grades + permissions
│   └── app.js              ← Sidebar, nav, utilitaires
├── img/logo.png        ← Logo (à placer)
└── pages/
    ├── dashboard.html
    ├── tracker.html
    ├── stats.html
    ├── stock.html
    ├── blanchiment.html
    ├── transactions.html
    ├── taxes.html
    ├── quotas.html
    ├── objectifs.html
    ├── sanctions.html
    ├── logs.html
    ├── tv.html
    ├── admin.html
    └── profil.html
```

## 🎭 GRADES PAR DÉFAUT
- **Patriarche** — Admin, accès total
- **Matriarche** — Admin, accès total
- **Ancien** — Accès limité (pas admin, pas stock, pas blanchiment)
- **Membre** — Accès limité
- **Apprenti** — Accès limité

> Modifiable dans `js/firebase-config.js` (tableau `GRADES` et `PERMS_DEFAUT`)
> Ou depuis le site : Admin → Permissions

## ⚠️ RÈGLES FIREBASE
Les règles expirent. Pour les renouveler :
Firebase Console → Realtime Database → Règles → changer la date d'expiration.

## ➕ AJOUTER UNE PAGE
1. Créer `pages/ma-page.html`
2. `js/app.js` → ajouter dans `NAV_ITEMS`
3. `js/firebase-config.js` → ajouter dans `PERMS_DEFAUT` pour chaque grade
4. `pages/admin.html` → ajouter dans `PAGES_DISPO`
"# vizu-6blocks-site" 
