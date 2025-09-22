const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Stockage en mémoire pour la démonstration
let images = [];
let nextId = 1;

// Configuration de multer pour le téléchargement d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées (JPEG, JPG, PNG, GIF, WEBP)'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

// Routes API

// Récupérer toutes les images
app.get('/api/images', (req, res) => {
  try {
    res.json(images);
  } catch (error) {
    console.error('Erreur lors de la récupération des images:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Ajouter une nouvelle image
app.post('/api/images', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucune image fournie' });
    }

    const { filename, originalname, path: filePath, size, mimetype } = req.file;
    
    const newImage = {
      id: nextId++,
      filename,
      originalname,
      path: filePath,
      size,
      mimetype,
      uploaded_at: new Date().toISOString()
    };
    
    images.push(newImage);
    
    res.json({ 
      ...newImage,
      message: 'Image ajoutée avec succès' 
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'image:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Supprimer une image
app.delete('/api/images/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const imageIndex = images.findIndex(img => img.id === id);
    
    if (imageIndex === -1) {
      return res.status(404).json({ error: 'Image non trouvée' });
    }

    const image = images[imageIndex];
    
    // Supprimer le fichier physique
    if (fs.existsSync(image.path)) {
      fs.unlink(image.path, (err) => {
        if (err) console.error('Erreur lors de la suppression du fichier:', err);
      });
    }

    // Supprimer de la liste
    images.splice(imageIndex, 1);
    
    res.json({ message: 'Image supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour la page principale
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Gestion des erreurs
app.use((error, req, res, next) => {
  console.error('Erreur:', error);
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Fichier trop volumineux (max 5MB)' });
    }
  }
  res.status(500).json({ error: 'Erreur serveur' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`Environnement: ${process.env.NODE_ENV || 'development'}`);
});

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
  console.log('Arrêt du serveur...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Arrêt du serveur...');
  process.exit(0);
});
