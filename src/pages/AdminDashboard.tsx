import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, MapPin, TrendingUp, Eye, EyeOff, Layers, Plus } from 'lucide-react';
import { initialPlaces } from '../data/places';
import './AdminDashboard.css';

interface Place {
  id: string;
  category: string;
  active: boolean;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      navigate('/admin/login');
    }
    const saved = localStorage.getItem('places');
    if (saved) {
      setPlaces(JSON.parse(saved));
    } else {
      setPlaces(initialPlaces);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const totalPlaces = places.length;
  const activePlaces = places.filter(p => p.active).length;
  const inactivePlaces = totalPlaces - activePlaces;

  const categoryCounts = places.reduce((acc: any, place) => {
    acc[place.category] = (acc[place.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <MapPin size={32} />
          <h2>Nador Explorer</h2>
        </div>
        <nav>
          <Link to="/admin/dashboard" className="active">Tableau de bord</Link>
          <Link to="/admin/places">Gestion des lieux</Link>
        </nav>
        <button className="btn-logout" onClick={handleLogout}>
          <LogOut size={20} />
          Déconnexion
        </button>
      </aside>

      <main className="main-content">
        <header className="content-header">
          <h1>Tableau de bord</h1>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{background: '#e6f2ff'}}>
              <Layers size={32} style={{color: '#667eea'}} />
            </div>
            <div className="stat-info">
              <h3>Total des lieux</h3>
              <p className="stat-number">{totalPlaces}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{background: '#e6ffe6'}}>
              <Eye size={32} style={{color: '#10b981'}} />
            </div>
            <div className="stat-info">
              <h3>Lieux actifs</h3>
              <p className="stat-number">{activePlaces}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{background: '#ffe6e6'}}>
              <EyeOff size={32} style={{color: '#ef4444'}} />
            </div>
            <div className="stat-info">
              <h3>Lieux inactifs</h3>
              <p className="stat-number">{inactivePlaces}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{background: '#fff4e6'}}>
              <TrendingUp size={32} style={{color: '#f59e0b'}} />
            </div>
            <div className="stat-info">
              <h3>Catégories</h3>
              <p className="stat-number">{Object.keys(categoryCounts).length}</p>
            </div>
          </div>
        </div>

        <div className="category-stats">
          <h2>Répartition par catégorie</h2>
          <div className="category-list">
            {Object.entries(categoryCounts).map(([category, count]) => (
              <div key={category} className="category-item">
                <span className="category-name">{category}</span>
                <span className="category-count">{count as number}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="quick-actions">
          <h2>Actions rapides</h2>
          <div className="actions-grid">
            <Link to="/admin/places" className="action-btn">
              <MapPin size={24} />
              <span>Gérer les lieux</span>
            </Link>
            <Link to="/admin/places" state={{ openModal: true }} className="action-btn">
              <Plus size={24} />
              <span>Ajouter un lieu</span>
            </Link>
            <Link to="/" className="action-btn">
              <Eye size={24} />
              <span>Voir le site</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
