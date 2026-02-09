import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LogOut, Plus, Edit2, Trash2, Power, MapPin, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { fetchPlaces, createPlace, updatePlace, deletePlace } from '../store/slices/placesSlice';
import { logout } from '../store/slices/authSlice';
import { placeSchema } from '../schemas/validationSchemas';
import type { RootState } from '../store/store';
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
  hours?: string;
  price?: string;
  transport?: string;
}

interface PlaceForm {
  name: string;
  category: string;
  description: string;
  address: string;
  image: string;
  images: string[];
  hours: string;
  price: string;
  transport: string;
}

export default function DashboardNew() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { items: places, loading } = useSelector((state: RootState) => state.places);
  const [showModal, setShowModal] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<PlaceForm>({
    resolver: yupResolver(placeSchema),
    defaultValues: {
      images: [],
    }
  });

  useEffect(() => {
    dispatch(fetchPlaces());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/admin/login');
  };

  const openModal = (place?: Place) => {
    if (place) {
      setEditingPlace(place);
      reset({
        name: place.name,
        category: place.category,
        description: place.description,
        address: place.address || '',
        image: place.image,
        images: place.images || [],
        hours: place.hours || '',
        price: place.price || '',
        transport: place.transport || '',
      });
      setAdditionalImages(place.images || []);
    } else {
      setEditingPlace(null);
      reset({
        name: '',
        category: '',
        description: '',
        address: '',
        image: '',
        images: [],
        hours: '',
        price: '',
        transport: '',
      });
      setAdditionalImages([]);
    }
    setNewImageUrl('');
    setShowModal(true);
  };

  const onSubmit = async (data: PlaceForm) => {
    try {
      const placeData = {
        ...data,
        images: additionalImages,
        active: true,
        createdAt: editingPlace?.createdAt || new Date().toISOString(),
        updatedAt: editingPlace ? new Date().toISOString() : undefined,
      };

      if (editingPlace) {
        await dispatch(updatePlace({ ...placeData, id: editingPlace.id })).unwrap();
        toast.success('Lieu modifié avec succès !');
      } else {
        await dispatch(createPlace(placeData)).unwrap();
        toast.success('Lieu créé avec succès !');
      }
      setShowModal(false);
    } catch (error) {
      toast.error('Une erreur est survenue');
    }
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setAdditionalImages([...additionalImages, newImageUrl.trim()]);
      setValue('images', [...additionalImages, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    const updated = additionalImages.filter((_, i) => i !== index);
    setAdditionalImages(updated);
    setValue('images', updated);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer définitivement "${name}" ?\n\nCette action est irréversible.`)) {
      try {
        await dispatch(deletePlace(id)).unwrap();
        toast.success('Lieu supprimé avec succès !');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleToggleActive = async (place: Place) => {
    try {
      await dispatch(updatePlace({ ...place, active: !place.active, updatedAt: new Date().toISOString() })).unwrap();
      toast.success(place.active ? 'Lieu désactivé' : 'Lieu activé');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

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
          <button className="btn-primary" onClick={() => openModal()}>
            <Plus size={20} />
            Nouveau Lieu
          </button>
        </header>

        {loading ? (
          <div className="loading">Chargement...</div>
        ) : (
          <div className="places-grid">
            {places.map(place => (
              <div key={place.id} className={`place-card ${!place.active ? 'inactive' : ''}`}>
                <img src={place.image} alt={place.name} />
                <div className="place-content">
                  <h3>{place.name}</h3>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap'}}>
                    <span className="category">{place.category}</span>
                    {!place.active && <span className="status-badge inactive-badge">Inactif</span>}
                  </div>
                  <p>{place.description}</p>
                  <div className="place-actions">
                    <button onClick={() => handleToggleActive(place)} className={`btn-icon ${place.active ? 'btn-deactivate' : 'btn-activate'}`}>
                      <Power size={18} />
                    </button>
                    <button onClick={() => openModal(place)} className="btn-icon">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(place.id, place.name)} className="btn-icon danger">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h2>{editingPlace ? 'Modifier' : 'Nouveau'} Lieu</h2>
              <form onSubmit={handleSubmit(onSubmit)}>
                <input placeholder="Nom du lieu *" {...register('name')} />
                {errors.name && <span className="error-text">{errors.name.message}</span>}
                
                <select {...register('category')}>
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
                {errors.category && <span className="error-text">{errors.category.message}</span>}
                
                <textarea placeholder="Description *" {...register('description')} />
                {errors.description && <span className="error-text">{errors.description.message}</span>}
                
                <input placeholder="Adresse" {...register('address')} />
                
                <div className="image-section">
                  <label>Photos * (au moins une)</label>
                  <input placeholder="URL de l'image principale *" {...register('image')} />
                  {errors.image && <span className="error-text">{errors.image.message}</span>}
                  
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
                  
                  {additionalImages.length > 0 && (
                    <div className="images-list">
                      {additionalImages.map((img, idx) => (
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
                
                <input placeholder="Horaires (ex: Lun-Dim 9h-18h)" {...register('hours')} />
                <input placeholder="Tarifs (ex: 50-100 DH)" {...register('price')} />
                <textarea placeholder="Moyens de transport et accessibilité" {...register('transport')} />
                
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
