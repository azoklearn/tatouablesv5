#!/bin/bash

# Script de démarrage pour la Galerie d'Images
# Ce script vérifie et installe Node.js si nécessaire

echo "🖼️  Galerie d'Images - Script de démarrage"
echo "=========================================="

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé sur ce système."
    echo ""
    echo "📦 Pour installer Node.js, vous pouvez :"
    echo "   1. Visiter https://nodejs.org et télécharger la version LTS"
    echo "   2. Utiliser un gestionnaire de paquets :"
    echo "      - macOS : brew install node"
    echo "      - Ubuntu/Debian : sudo apt install nodejs npm"
    echo "      - CentOS/RHEL : sudo yum install nodejs npm"
    echo ""
    echo "🔄 Alternative : Utiliser la version statique HTML"
    echo "   Ouvrez simplement le fichier public/index.html dans votre navigateur"
    echo "   (Note: Les fonctionnalités de base de données ne seront pas disponibles)"
    echo ""
    exit 1
fi

# Vérifier la version de Node.js
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 14 ]; then
    echo "⚠️  Node.js version $NODE_VERSION détectée. Version 14+ recommandée."
fi

echo "✅ Node.js $(node --version) détecté"

# Vérifier si npm est disponible
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez installer npm."
    exit 1
fi

echo "✅ npm $(npm --version) détecté"

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Erreur lors de l'installation des dépendances"
        exit 1
    fi
    echo "✅ Dépendances installées avec succès"
else
    echo "✅ Dépendances déjà installées"
fi

# Créer le dossier uploads s'il n'existe pas
if [ ! -d "uploads" ]; then
    mkdir -p uploads
    echo "✅ Dossier uploads créé"
fi

# Démarrer le serveur
echo ""
echo "🚀 Démarrage du serveur..."
echo "   URL : http://localhost:3000"
echo "   Appuyez sur Ctrl+C pour arrêter"
echo ""

node server.js
