import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Plus, Edit2, Trash2, Power, MapPin, X } from 'lucide-react';
import { initialPlaces } from '../data/places';
import './Dashboard.css';

interface Place {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  image: string;
  images?: string[];
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [places, setPlaces] = useState<Place[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'createdAt' | 'active'>('createdAt');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    address: '',
    image: '',
    images: [] as string[],
    hours: '',
    price: '',
    transport: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      navigate('/admin/login');
    }
    loadPlaces();
  }, [navigate]);

  const loadPlaces = () => {
    const saved = localStorage.getItem('places');
    if (saved) {
      setPlaces(JSON.parse(saved));
    } else {
      localStorage.setItem('places', JSON.stringify(initialPlaces));
      setPlaces(initialPlaces);
    }
  };

  const savePlaces = (newPlaces: Place[]) => {
    localStorage.setItem('places', JSON.stringify(newPlaces));
    setPlaces(newPlaces);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const openModal = (place?: Place) => {
    if (place) {
      setEditingPlace(place);
      setFormData({
        name: place.name,
        category: place.category,
        description: place.description,
        address: place.address,
        image: place.image,
        images: place.images || [],
        hours: (place as any).hours || '',
        price: (place as any).price || '',
        transport: (place as any).transport || ''
      });
    } else {
      setEditingPlace(null);
      setFormData({ name: '', category: '', description: '', address: '', image: '', images: [], hours: '', price: '', transport: '' });
    }
    setErrors({});
    setNewImageUrl('');
    setShowModal(true);
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) newErrors.name = 'Le nom est obligatoire';
    if (!formData.category) newErrors.category = 'La catégorie est obligatoire';
    if (!formData.description.trim()) newErrors.description = 'La description est obligatoire';
    if (!formData.image.trim() && formData.images.length === 0) {
      newErrors.image = 'Au moins une photo est obligatoire';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (editingPlace) {
      const updated = places.map(p => 
        p.id === editingPlace.id ? { ...p, ...formData, updatedAt: new Date().toISOString() } : p
      );
      savePlaces(updated);
      setSuccessMessage('Lieu modifié avec succès !');
    } else {
      const newPlace: Place = {
        id: Date.now().toString(),
        ...formData,
        active: true,
        createdAt: new Date().toISOString()
      };
      savePlaces([...places, newPlace]);
      setSuccessMessage('Lieu créé avec succès !');
    }
    
    setShowModal(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setFormData({...formData, images: [...formData.images, newImageUrl.trim()]});
      setNewImageUrl('');
      if (errors.image) setErrors({...errors, image: ''});
    }
  };

  const removeImage = (index: number) => {
    setFormData({...formData, images: formData.images.filter((_, i) => i !== index)});
  };

  const toggleActive = (id: string, currentStatus: boolean) => {
    const action = currentStatus ? 'désactiver' : 'réactiver';
    if (confirm(`Voulez-vous vraiment ${action} ce lieu ?`)) {
      const updated = places.map(p => 
        p.id === id ? { ...p, active: !p.active, updatedAt: new Date().toISOString() } : p
      );
      savePlaces(updated);
    }
  };

  const deletePlace = (id: string, name: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer définitivement "${name}" ?\n\nCette action est irréversible.`)) {
      savePlaces(places.filter(p => p.id !== id));
      setSuccessMessage('Lieu supprimé avec succès !');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const filteredAndSortedPlaces = places
    .filter(p => {
      if (filterCategory && p.category !== filterCategory) return false;
      if (filterStatus === 'active' && !p.active) return false;
      if (filterStatus === 'inactive' && p.active) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      if (sortBy === 'active') return Number(b.active) - Number(a.active);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <MapPin size={32} />
          <h2>Nador Explorer</h2>
        </div>
        <nav>
          <Link to="/admin/dashboard">Tableau de bord</Link>
          <Link to="/admin/places" className="active">Gestion des lieux</Link>
        </nav>
        <button className="btn-logout" onClick={handleLogout}>
          <LogOut size={20} />
          Déconnexion
        </button>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <h1>Gestion des Lieux</h1>
          <div style={{display: 'flex', gap: '1rem'}}>
            <button className="btn-primary" onClick={() => {
              const merged = [...initialPlaces, ...places.filter(p => !initialPlaces.find(ip => ip.id === p.id))];
              savePlaces(merged);
            }}>
              Charger données Nador
            </button>
            <button className="btn-primary" onClick={() => openModal()}>
              <Plus size={20} />
              Nouveau Lieu
            </button>
          </div>
        </header>

        {showSuccess && (
          <div className="success-message">
            ✓ {successMessage}
          </div>
        )}

        <div className="filters-bar">
          <div className="filter-group">
            <label>Trier par:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
              <option value="createdAt">Date de création</option>
              <option value="name">Nom</option>
              <option value="category">Catégorie</option>
              <option value="active">Statut</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Catégorie:</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="">Toutes</option>
              <option value="Plages">Plages</option>
              <option value="Sites naturels">Sites naturels</option>
              <option value="Monuments et patrimoine">Monuments et patrimoine</option>
              <option value="Musées et culture">Musées et culture</option>
              <option value="Restaurants">Restaurants</option>
              <option value="Hôtels et hébergements">Hôtels et hébergements</option>
              <option value="Cafés et salons de thé">Cafés et salons de thé</option>
              <option value="Shopping et souks">Shopping et souks</option>
              <option value="Loisirs et divertissements">Loisirs et divertissements</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Statut:</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as any)}>
              <option value="all">Tous</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
            </select>
          </div>
        </div>

        <div className="places-grid">
          {filteredAndSortedPlaces.map(place => (
            <div key={place.id} className={`place-card ${!place.active ? 'inactive' : ''}`}>
              <img src={place.image || 'https://via.placeholder.com/300x200'} alt={place.name} />
              <div className="place-content">
                <h3>{place.name}</h3>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap'}}>
                  <span className="category">{place.category}</span>
                  {!place.active && <span className="status-badge inactive-badge">Inactif</span>}
                </div>
                <p>{place.description}</p>
                {place.updatedAt && (
                  <p className="updated-date">
                    Modifié le {new Date(place.updatedAt).toLocaleDateString('fr-FR', { 
                      day: '2-digit', 
                      month: '2-digit', 
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
                <div className="place-actions">
                  <button 
                    onClick={() => toggleActive(place.id, place.active)} 
                    className={`btn-icon ${place.active ? 'btn-deactivate' : 'btn-activate'}`}
                    title={place.active ? 'Désactiver' : 'Réactiver'}
                  >
                    <Power size={18} />
                  </button>
                  <button onClick={() => openModal(place)} className="btn-icon">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => deletePlace(place.id, place.name)} className="btn-icon danger">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>{editingPlace ? 'Modifier' : 'Nouveau'} Lieu</h2>
              <form onSubmit={handleSubmit}>
                <input
                  placeholder="Nom du lieu *"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
                
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Catégorie *</option>
                  <option value="Plages">Plages</option>
                  <option value="Sites naturels">Sites naturels</option>
                  <option value="Monuments et patrimoine">Monuments et patrimoine</option>
                  <option value="Musées et culture">Musées et culture</option>
                  <option value="Restaurants">Restaurants</option>
                  <option value="Hôtels et hébergements">Hôtels et hébergements</option>
                  <option value="Cafés et salons de thé">Cafés et salons de thé</option>
                  <option value="Shopping et souks">Shopping et souks</option>
                  <option value="Loisirs et divertissements">Loisirs et divertissements</option>
                </select>
                {errors.category && <span className="error-text">{errors.category}</span>}
                
                <textarea
                  placeholder="Description *"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
                {errors.description && <span className="error-text">{errors.description}</span>}
                
                <input
                  placeholder="Adresse"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
                
                <div className="image-section">
                  <label>Photos * (au moins une)</label>
                  <input
                    placeholder="URL de l'image principale *"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                  />
                  {errors.image && <span className="error-text">{errors.image}</span>}
                  
                  <div className="add-image-group">
                    <input
                      placeholder="Ajouter une photo supplémentaire"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                    />
                    <button type="button" onClick={addImage} className="btn-add-image">
                      <Plus size={18} /> Ajouter
                    </button>
                  </div>
                  
                  {formData.images.length > 0 && (
                    <div className="images-list">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="image-item">
                          <img src={img} alt={`Photo ${idx + 1}`} />
                          <button type="button" onClick={() => removeImage(idx)} className="btn-remove-image">
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <input
                  placeholder="Horaires (ex: Lun-Dim 9h-18h)"
                  value={formData.hours}
                  onChange={(e) => setFormData({...formData, hours: e.target.value})}
                />
                <input
                  placeholder="Tarifs (ex: 50-100 DH)"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                />
                <textarea
                  placeholder="Moyens de transport et accessibilité"
                  value={formData.transport}
                  onChange={(e) => setFormData({...formData, transport: e.target.value})}
                />
                <div className="modal-actions">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingPlace ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
