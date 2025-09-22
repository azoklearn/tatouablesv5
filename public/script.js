// Variables globales
let images = [];
let currentImageId = null;

// Éléments DOM
const uploadForm = document.getElementById('uploadForm');
const imageInput = document.getElementById('imageInput');
const uploadProgress = document.getElementById('uploadProgress');
const gallery = document.getElementById('gallery');
const loading = document.getElementById('loading');
const emptyState = document.getElementById('emptyState');
const imageCount = document.getElementById('imageCount');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDetails = document.getElementById('modalDetails');
const downloadBtn = document.getElementById('downloadBtn');
const deleteBtn = document.getElementById('deleteBtn');
const closeModal = document.querySelector('.close');
const toast = document.getElementById('toast');

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    loadImages();
    setupEventListeners();
});

// Configuration des événements
function setupEventListeners() {
    // Upload form
    uploadForm.addEventListener('submit', handleUpload);
    imageInput.addEventListener('change', handleFileSelect);
    
    // Recherche et tri
    searchInput.addEventListener('input', filterImages);
    sortSelect.addEventListener('change', sortImages);
    
    // Modal
    closeModal.addEventListener('click', closeImageModal);
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) closeImageModal();
    });
    
    // Actions modal
    downloadBtn.addEventListener('click', downloadImage);
    deleteBtn.addEventListener('click', deleteImage);
    
    // Fermeture modal avec Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeImageModal();
    });
}

// Chargement des images
async function loadImages() {
    try {
        showLoading(true);
        const response = await fetch('/api/images');
        if (!response.ok) throw new Error('Erreur lors du chargement des images');
        
        images = await response.json();
        displayImages(images);
        updateImageCount();
    } catch (error) {
        console.error('Erreur:', error);
        showToast('Erreur lors du chargement des images', 'error');
    } finally {
        showLoading(false);
    }
}

// Affichage des images
function displayImages(imagesToShow) {
    if (imagesToShow.length === 0) {
        gallery.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    gallery.style.display = 'grid';
    emptyState.style.display = 'none';
    
    gallery.innerHTML = imagesToShow.map(image => `
        <div class="image-card" onclick="openImageModal(${image.id})">
            <img src="/${image.path}" alt="${image.originalname}" loading="lazy">
            <div class="image-info">
                <div class="image-name" title="${image.originalname}">${image.originalname}</div>
                <div class="image-details">
                    <span class="image-size">${formatFileSize(image.size)}</span>
                    <span class="image-date">${formatDate(image.uploaded_at)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Gestion de la sélection de fichier
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        // Validation du type de fichier
        if (!file.type.startsWith('image/')) {
            showToast('Veuillez sélectionner un fichier image valide', 'error');
            imageInput.value = '';
            return;
        }
        
        // Validation de la taille (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            showToast('Le fichier est trop volumineux (max 5MB)', 'error');
            imageInput.value = '';
            return;
        }
        
        // Mise à jour du label
        const label = document.querySelector('.file-input-label span');
        label.textContent = file.name;
    }
}

// Gestion de l'upload
async function handleUpload(e) {
    e.preventDefault();
    
    const file = imageInput.files[0];
    if (!file) {
        showToast('Veuillez sélectionner une image', 'error');
        return;
    }
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
        showUploadProgress(true);
        const uploadBtn = document.querySelector('.upload-btn');
        uploadBtn.disabled = true;
        uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Téléchargement...';
        
        const response = await fetch('/api/images', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur lors de l\'upload');
        }
        
        const result = await response.json();
        showToast('Image ajoutée avec succès !', 'success');
        
        // Recharger les images
        await loadImages();
        
        // Reset du formulaire
        uploadForm.reset();
        const label = document.querySelector('.file-input-label span');
        label.textContent = 'Choisir une image';
        
    } catch (error) {
        console.error('Erreur upload:', error);
        showToast(error.message || 'Erreur lors de l\'upload', 'error');
    } finally {
        showUploadProgress(false);
        const uploadBtn = document.querySelector('.upload-btn');
        uploadBtn.disabled = false;
        uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Télécharger';
    }
}

// Filtrage des images
function filterImages() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredImages = images.filter(image => 
        image.originalname.toLowerCase().includes(searchTerm)
    );
    displayImages(filteredImages);
}

// Tri des images
function sortImages() {
    const sortBy = sortSelect.value;
    let sortedImages = [...images];
    
    switch (sortBy) {
        case 'newest':
            sortedImages.sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at));
            break;
        case 'oldest':
            sortedImages.sort((a, b) => new Date(a.uploaded_at) - new Date(b.uploaded_at));
            break;
        case 'name':
            sortedImages.sort((a, b) => a.originalname.localeCompare(b.originalname));
            break;
        case 'size':
            sortedImages.sort((a, b) => b.size - a.size);
            break;
    }
    
    displayImages(sortedImages);
}

// Ouverture de la modal d'image
function openImageModal(imageId) {
    const image = images.find(img => img.id === imageId);
    if (!image) return;
    
    currentImageId = imageId;
    modalImage.src = `/${image.path}`;
    modalTitle.textContent = image.originalname;
    modalDetails.innerHTML = `
        <strong>Taille:</strong> ${formatFileSize(image.size)}<br>
        <strong>Type:</strong> ${image.mimetype}<br>
        <strong>Ajoutée le:</strong> ${formatDate(image.uploaded_at)}
    `;
    
    imageModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Fermeture de la modal
function closeImageModal() {
    imageModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentImageId = null;
}

// Téléchargement d'image
function downloadImage() {
    if (!currentImageId) return;
    
    const image = images.find(img => img.id === currentImageId);
    if (!image) return;
    
    const link = document.createElement('a');
    link.href = `/${image.path}`;
    link.download = image.originalname;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Téléchargement démarré', 'success');
}

// Suppression d'image
async function deleteImage() {
    if (!currentImageId) return;
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/images/${currentImageId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erreur lors de la suppression');
        }
        
        showToast('Image supprimée avec succès', 'success');
        closeImageModal();
        await loadImages();
        
    } catch (error) {
        console.error('Erreur suppression:', error);
        showToast(error.message || 'Erreur lors de la suppression', 'error');
    }
}

// Affichage du progress d'upload
function showUploadProgress(show) {
    uploadProgress.style.display = show ? 'block' : 'none';
    if (show) {
        const progressFill = document.querySelector('.progress-fill');
        progressFill.style.width = '100%';
    }
}

// Affichage du loading
function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
    if (!show) {
        gallery.style.display = 'grid';
    }
}

// Mise à jour du compteur d'images
function updateImageCount() {
    const count = images.length;
    imageCount.textContent = `${count} image${count > 1 ? 's' : ''}`;
}

// Formatage de la taille de fichier
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Formatage de la date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Affichage des notifications toast
function showToast(message, type = 'success') {
    const toastIcon = toast.querySelector('.toast-icon');
    const toastMessage = toast.querySelector('.toast-message');
    
    // Configuration du type
    toast.className = `toast ${type}`;
    toastIcon.className = `toast-icon fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`;
    toastMessage.textContent = message;
    
    // Affichage
    toast.classList.add('show');
    
    // Masquage automatique
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Gestion des erreurs globales
window.addEventListener('error', (e) => {
    console.error('Erreur globale:', e.error);
    showToast('Une erreur inattendue s\'est produite', 'error');
});

// Gestion des promesses rejetées
window.addEventListener('unhandledrejection', (e) => {
    console.error('Promesse rejetée:', e.reason);
    showToast('Une erreur s\'est produite', 'error');
});
