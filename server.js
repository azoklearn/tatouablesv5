const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration pour le déploiement en production
if (process.env.NODE_ENV === 'production') {
  // Utiliser un stockage persistant pour les images en production
  const uploadDir = process.env.UPLOAD_DIR || 'uploads/';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

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

// Initialisation de la base de données SQLite
const db = new sqlite3.Database('gallery.db', (err) => {
  if (err) {
    console.error('Erreur lors de l\'ouverture de la base de données:', err.message);
  } else {
    console.log('Connexion à la base de données SQLite établie.');
  }
});

// Création de la table images
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL,
    originalname TEXT NOT NULL,
    path TEXT NOT NULL,
    size INTEGER,
    mimetype TEXT,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// Routes API

// Récupérer toutes les images
app.get('/api/images', (req, res) => {
  db.all('SELECT * FROM images ORDER BY uploaded_at DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Ajouter une nouvelle image
app.post('/api/images', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucune image fournie' });
  }

  const { filename, originalname, path: filePath, size, mimetype } = req.file;
  
  db.run(
    'INSERT INTO images (filename, originalname, path, size, mimetype) VALUES (?, ?, ?, ?, ?)',
    [filename, originalname, filePath, size, mimetype],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ 
        id: this.lastID, 
        filename, 
        originalname, 
        path: filePath, 
        size, 
        mimetype,
        message: 'Image ajoutée avec succès' 
      });
    }
  );
});

// Supprimer une image
app.delete('/api/images/:id', (req, res) => {
  const id = req.params.id;
  
  // Récupérer les informations de l'image avant suppression
  db.get('SELECT * FROM images WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!row) {
      return res.status(404).json({ error: 'Image non trouvée' });
    }

    // Supprimer le fichier physique
    fs.unlink(row.path, (err) => {
      if (err && err.code !== 'ENOENT') {
        console.error('Erreur lors de la suppression du fichier:', err);
      }
    });

    // Supprimer l'entrée de la base de données
    db.run('DELETE FROM images WHERE id = ?', [id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Image supprimée avec succès' });
    });
  });
});

// Route pour la page principale
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Gestion des erreurs
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Fichier trop volumineux (max 5MB)' });
    }
  }
  res.status(500).json({ error: error.message });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

// Fermeture propre de la base de données
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connexion à la base de données fermée.');
    process.exit(0);
  });
});
