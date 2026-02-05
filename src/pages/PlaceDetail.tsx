import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { MapPin, Clock, DollarSign, MapPinned, ArrowLeft, Bus, Car, Accessibility } from 'lucide-react';
import './PlaceDetail.css';

interface Place {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  image: string;
  active: boolean;
  hours?: string;
  price?: string;
  transport?: string;
  images?: string[];
}

export default function PlaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState<Place | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('places');
    if (saved) {
      const places = JSON.parse(saved);
      const found = places.find((p: Place) => p.id === id);
      if (found && found.active) {
        setPlace(found);
      } else {
        navigate('/places');
      }
    }
  }, [id, navigate]);

  if (!place) return null;

  const gallery = place.images && place.images.length > 0 ? place.images : [place.image];
  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);

  return (
    <div className="place-detail">
      <nav className="navbar">
        <div className="nav-content">
          <Link to="/" className="logo">
            <MapPin size={28} />
            <span>Nador Explorer</span>
          </Link>
          <Link to="/admin/login" className="nav-link" style={{background: '#2d3748'}}>Admin</Link>
        </div>
      </nav>

      <div className="detail-container">
        <button onClick={() => navigate(-1)} className="back-btn">
          <ArrowLeft size={20} />
          Retour
        </button>

        <div className="detail-header">
          <img src={gallery[currentImageIndex] || 'https://via.placeholder.com/1200x500'} alt={place.name} />
          {gallery.length > 1 && (
            <>
              <button className="nav-btn prev" onClick={prevImage}>&lt;</button>
              <button className="nav-btn next" onClick={nextImage}>&gt;</button>
              <div className="image-counter">{currentImageIndex + 1} / {gallery.length}</div>
            </>
          )}
          <div className="header-overlay">
            <span className="category-badge">{place.category}</span>
            <h1>{place.name}</h1>
          </div>
        </div>

        <div className="detail-content">
          <div className="main-info">
            <section className="info-section">
              <h2>Description</h2>
              <p>{place.description}</p>
            </section>

            <section className="info-section">
              <h2>Informations pratiques</h2>
              <div className="info-grid">
                <div className="info-item">
                  <MapPinned size={24} />
                  <div>
                    <h3>Adresse</h3>
                    <p>{place.address}</p>
                  </div>
                </div>

                {place.hours && (
                  <div className="info-item">
                    <Clock size={24} />
                    <div>
                      <h3>Horaires</h3>
                      <p>{place.hours}</p>
                    </div>
                  </div>
                )}
                {!place.hours && (
                  <div className="info-item">
                    <Clock size={24} />
                    <div>
                      <h3>Horaires</h3>
                      <p style={{color: '#999'}}>Non renseigné</p>
                    </div>
                  </div>
                )}

                {place.price && (
                  <div className="info-item">
                    <DollarSign size={24} />
                    <div>
                      <h3>Tarifs</h3>
                      <p>{place.price}</p>
                    </div>
                  </div>
                )}
                {!place.price && (
                  <div className="info-item">
                    <DollarSign size={24} />
                    <div>
                      <h3>Tarifs</h3>
                      <p style={{color: '#999'}}>Non renseigné</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {place.transport && (
              <section className="info-section">
                <h2>Accès et transport</h2>
                <div className="transport-info">
                  <Bus size={24} />
                  <Car size={24} />
                  <Accessibility size={24} />
                  <p>{place.transport}</p>
                </div>
              </section>
            )}
            {!place.transport && (
              <section className="info-section">
                <h2>Accès et transport</h2>
                <p style={{color: '#999'}}>Non renseigné</p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
