# Galerie d'Images - Application Web

Une application web moderne pour partager et gérer des images avec une base de données SQLite.

## 🚀 Fonctionnalités

- **Ajout d'images** : Téléchargez des images (JPEG, PNG, GIF, WEBP) jusqu'à 5MB
- **Galerie interactive** : Visualisez toutes les images dans une grille responsive
- **Recherche et tri** : Trouvez facilement vos images par nom ou triez par date/taille
- **Visualisation en grand** : Cliquez sur une image pour la voir en plein écran
- **Suppression** : Supprimez les images que vous ne voulez plus
- **Téléchargement** : Téléchargez les images depuis la galerie
- **Interface moderne** : Design responsive et attrayant
- **Temps réel** : Tous les utilisateurs voient les changements instantanément

## 🛠️ Technologies utilisées

- **Backend** : Node.js, Express.js
- **Base de données** : SQLite3
- **Frontend** : HTML5, CSS3, JavaScript (ES6+)
- **Upload de fichiers** : Multer
- **Interface** : Design responsive avec Font Awesome

## 📦 Installation

1. **Cloner le projet**
   ```bash
   cd /tmp/gallery-web-app
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Démarrer le serveur**
   ```bash
   npm start
   ```

4. **Ouvrir dans le navigateur**
   ```
   http://localhost:3000
   ```

## 🎯 Utilisation

### Ajouter une image
1. Cliquez sur "Choisir une image" dans la section d'upload
2. Sélectionnez une image depuis votre ordinateur
3. Cliquez sur "Télécharger"
4. L'image apparaîtra automatiquement dans la galerie

### Gérer les images
- **Voir en grand** : Cliquez sur n'importe quelle image
- **Rechercher** : Utilisez la barre de recherche pour filtrer par nom
- **Trier** : Utilisez le menu déroulant pour trier par date ou taille
- **Supprimer** : Ouvrez une image et cliquez sur "Supprimer"
- **Télécharger** : Ouvrez une image et cliquez sur "Télécharger"

## 📁 Structure du projet

```
gallery-web-app/
├── public/                 # Fichiers frontend
│   ├── index.html         # Page principale
│   ├── styles.css         # Styles CSS
│   └── script.js          # JavaScript frontend
├── uploads/               # Dossier des images (créé automatiquement)
├── server.js              # Serveur Node.js
├── package.json           # Dépendances npm
├── gallery.db             # Base de données SQLite (créée automatiquement)
└── README.md              # Documentation
```

## 🔧 Configuration

### Variables d'environnement
- `PORT` : Port du serveur (défaut: 3000)

### Limites
- Taille maximale des images : 5MB
- Types d'images supportés : JPEG, JPG, PNG, GIF, WEBP

## 🚀 Déploiement

### En local
```bash
npm start
```

### En production
1. Configurez les variables d'environnement
2. Utilisez un gestionnaire de processus comme PM2
3. Configurez un serveur web (Nginx) comme proxy

## 🐛 Dépannage

### Problèmes courants
- **Erreur de port** : Vérifiez que le port 3000 est libre
- **Images non visibles** : Vérifiez que le dossier `uploads/` existe
- **Erreur de base de données** : Vérifiez les permissions d'écriture

### Logs
Les erreurs sont affichées dans la console du serveur et dans l'interface utilisateur.

## 📝 API Endpoints

- `GET /api/images` - Récupérer toutes les images
- `POST /api/images` - Ajouter une nouvelle image
- `DELETE /api/images/:id` - Supprimer une image

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer de nouvelles fonctionnalités
- Améliorer la documentation

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

---

**Développé avec ❤️ pour partager des images facilement !**
