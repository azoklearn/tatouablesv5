# 🚀 Guide de Déploiement en Ligne - Galerie d'Images

Ce guide vous explique comment déployer votre galerie d'images en ligne sur différentes plateformes gratuites.

## 📋 Prérequis

- Un compte GitHub (gratuit)
- Node.js installé sur votre Mac (optionnel pour certains déploiements)

## 🎯 Options de Déploiement Gratuit

### 1. 🌟 **Railway (Recommandé)**
**Avantages :** Base de données PostgreSQL incluse, déploiement automatique, domaine personnalisé gratuit

#### Étapes :
1. **Créer un compte Railway**
   - Allez sur [railway.app](https://railway.app)
   - Connectez-vous avec GitHub

2. **Déployer le projet**
   ```bash
   # Dans le dossier du projet
   cd ~/gallery-web-app
   
   # Initialiser Git (si pas déjà fait)
   git init
   git add .
   git commit -m "Initial commit"
   
   # Pousser sur GitHub
   git remote add origin https://github.com/VOTRE_USERNAME/gallery-web-app.git
   git push -u origin main
   ```

3. **Connecter Railway à GitHub**
   - Sur Railway, cliquez "New Project"
   - Sélectionnez "Deploy from GitHub repo"
   - Choisissez votre repository
   - Railway déploiera automatiquement !

4. **Configurer la base de données**
   - Dans Railway, ajoutez un service "PostgreSQL"
   - Railway vous donnera l'URL de connexion
   - Votre app sera disponible sur un domaine Railway

---

### 2. ⚡ **Vercel**
**Avantages :** Déploiement ultra-rapide, CDN global, excellent pour les apps Node.js

#### Étapes :
1. **Installer Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Déployer**
   ```bash
   cd ~/gallery-web-app
   vercel
   ```

3. **Configuration automatique**
   - Vercel détectera automatiquement que c'est une app Node.js
   - Suivez les instructions à l'écran
   - Votre app sera déployée en quelques secondes !

---

### 3. 🔥 **Heroku**
**Avantages :** Plateforme mature, add-ons disponibles

#### Étapes :
1. **Installer Heroku CLI**
   ```bash
   brew install heroku/brew/heroku
   ```

2. **Se connecter**
   ```bash
   heroku login
   ```

3. **Créer l'app**
   ```bash
   cd ~/gallery-web-app
   heroku create votre-galerie-images
   ```

4. **Déployer**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

---

### 4. 🌐 **Render**
**Avantages :** Interface simple, déploiement automatique depuis GitHub

#### Étapes :
1. Allez sur [render.com](https://render.com)
2. Connectez votre compte GitHub
3. Sélectionnez "New Web Service"
4. Choisissez votre repository
5. Configuration :
   - **Build Command :** `npm install`
   - **Start Command :** `node server.js`
6. Cliquez "Create Web Service"

---

## 🔧 Configuration pour la Production

### Variables d'Environnement
Ajoutez ces variables dans votre plateforme de déploiement :

```env
NODE_ENV=production
PORT=3000
```

### Base de Données
- **Railway :** PostgreSQL inclus
- **Heroku :** Ajoutez l'add-on "Heroku Postgres"
- **Vercel :** Utilisez Vercel Postgres
- **Render :** Ajoutez un service PostgreSQL

## 📱 Accès Mobile

Votre galerie sera accessible depuis n'importe quel appareil :
- **Ordinateur :** Interface complète
- **Mobile :** Design responsive adapté
- **Tablette :** Expérience optimisée

## 🔄 Mises à Jour Automatiques

Une fois déployé, chaque push sur GitHub déclenchera automatiquement un nouveau déploiement !

## 🆘 Dépannage

### Problèmes courants :
1. **Erreur de port :** Vérifiez que `process.env.PORT` est utilisé
2. **Base de données :** Assurez-vous que la DB est accessible
3. **Images :** Vérifiez que le dossier `uploads/` est créé

### Logs :
- **Railway :** Onglet "Deployments" → "View Logs"
- **Vercel :** Dashboard → "Functions" → "View Function Logs"
- **Heroku :** `heroku logs --tail`

## 🎉 Félicitations !

Votre galerie d'images est maintenant en ligne et accessible à tous ! Partagez l'URL avec vos amis et famille.

---

**💡 Conseil :** Commencez par Railway pour la simplicité, ou Vercel pour la vitesse !
