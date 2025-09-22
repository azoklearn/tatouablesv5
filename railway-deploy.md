# 🚀 Déploiement Railway - Instructions Détaillées

## Méthode 1 : Déploiement Direct (Sans Git)

### 1. Créer un compte Railway
1. Allez sur [railway.app](https://railway.app)
2. Cliquez sur "Start a New Project"
3. Connectez-vous avec GitHub
4. Cliquez sur "Deploy from folder" ou "Upload project"

### 2. Préparer le dossier
Votre dossier `~/gallery-web-app` contient déjà tous les fichiers nécessaires :
- ✅ `package.json` - Dépendances Node.js
- ✅ `server.js` - Serveur principal
- ✅ `railway.json` - Configuration Railway
- ✅ `public/` - Interface utilisateur
- ✅ `uploads/` - Dossier pour les images

### 3. Upload sur Railway
1. Sur Railway, sélectionnez "Deploy from folder"
2. Choisissez le dossier `~/gallery-web-app`
3. Railway détectera automatiquement que c'est une app Node.js
4. Cliquez sur "Deploy"

### 4. Configuration automatique
Railway va :
- Installer les dépendances (`npm install`)
- Démarrer le serveur (`node server.js`)
- Créer une base de données PostgreSQL
- Générer une URL publique

## Méthode 2 : Avec Git (Après installation des outils)

### 1. Installer les outils de développement
```bash
xcode-select --install
```

### 2. Initialiser Git
```bash
cd ~/gallery-web-app
git init
git add .
git commit -m "Initial commit"
```

### 3. Créer un repository GitHub
1. Allez sur [github.com](https://github.com)
2. Cliquez sur "New repository"
3. Nommez-le "gallery-web-app"
4. Créez le repository

### 4. Connecter le projet local à GitHub
```bash
git remote add origin https://github.com/VOTRE_USERNAME/gallery-web-app.git
git push -u origin main
```

### 5. Déployer sur Railway
1. Sur Railway, cliquez "New Project"
2. Sélectionnez "Deploy from GitHub repo"
3. Choisissez votre repository
4. Railway déploiera automatiquement !

## 🎯 Résultat Final

Votre galerie sera accessible sur une URL comme :
`https://votre-galerie-images.railway.app`

## 🔧 Configuration Post-Déploiement

### Variables d'environnement (automatiques)
- `NODE_ENV=production`
- `PORT` (géré automatiquement par Railway)
- `DATABASE_URL` (PostgreSQL fournie par Railway)

### Fonctionnalités disponibles
- ✅ Ajout d'images
- ✅ Suppression d'images
- ✅ Galerie responsive
- ✅ Base de données persistante
- ✅ Accessible depuis n'importe où

## 🆘 Dépannage

### Si le déploiement échoue :
1. Vérifiez les logs dans Railway
2. Assurez-vous que `package.json` est correct
3. Vérifiez que `server.js` démarre sans erreur

### Si les images ne s'affichent pas :
1. Vérifiez que le dossier `uploads/` est créé
2. Vérifiez les permissions de fichiers
3. Regardez les logs du serveur

## 🎉 Félicitations !

Une fois déployé, votre galerie d'images sera en ligne et accessible à tous !
