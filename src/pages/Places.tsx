import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPin, Search } from 'lucide-react';
import { initialPlaces } from '../data/places';
import './Places.css';

interface Place {
  id: string;
  name: string;
  category: string;
  description: string;
  address: string;
  image: string;
  active: boolean;
}

const categories = [
  'Plages',
  'Sites naturels',
  'Monuments et patrimoine',
  'Musées et culture',
  'Restaurants',
  'Hôtels et hébergements',
  'Cafés et salons de thé',
  'Shopping et souks',
  'Loisirs et divertissements'
];

export default function Places() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [places, setPlaces] = useState<Place[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string[]>(
    searchParams.get('category') ? [searchParams.get('category')!] : []
  );
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const placesPerPage = 6;

  useEffect(() => {
    setLoading(true);
    const saved = localStorage.getItem('places');
    if (saved) {
      setPlaces(JSON.parse(saved));
    } else {
      localStorage.setItem('places', JSON.stringify(initialPlaces));
      setPlaces(initialPlaces);
    }
    setTimeout(() => setLoading(false), 500);
  }, []);

  const filteredPlaces = places.filter(place => {
    if (!place.active) return false;
    if (searchTerm.length > 0 && searchTerm.length < 3) return true;
    const matchesSearch = searchTerm.length === 0 || place.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory.length === 0 || selectedCategory.includes(place.category);
    return matchesSearch && matchesCategory;
  });

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedCategory([]);
    setSearchParams({});
    setCurrentPage(1);
  };

  const indexOfLastPlace = currentPage * placesPerPage;
  const indexOfFirstPlace = indexOfLastPlace - placesPerPage;
  const currentPlaces = filteredPlaces.slice(indexOfFirstPlace, indexOfLastPlace);
  const totalPages = Math.ceil(filteredPlaces.length / placesPerPage);

  return (
    <div className="places-page">
      <nav className="navbar">
        <div className="nav-content">
          <Link to="/" className="logo">
            <MapPin size={28} />
            <span>Nador Explorer</span>
          </Link>
          <Link to="/admin/login" className="nav-link" style={{background: '#2d3748'}}>Admin</Link>
        </div>
      </nav>

      <div className="places-container">
        <aside className="filters">
          <h3>Filtrer par catégorie</h3>
          <button 
            className="filter-btn reset-btn"
            onClick={resetFilters}
          >
            Réinitialiser les filtres
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={selectedCategory.includes(cat) ? 'filter-btn active' : 'filter-btn'}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </aside>

        <main className="places-main">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Rechercher un lieu (min 3 caractères)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm.length > 0 && searchTerm.length < 3 && (
              <span style={{color: '#ef4444', fontSize: '0.875rem'}}>Min 3 caractères</span>
            )}
          </div>

          <div className="results-info">
            <h2>Lieux touristiques</h2>
            <span>{filteredPlaces.length} résultat(s)</span>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Chargement des lieux...</p>
            </div>
          ) : filteredPlaces.length === 0 ? (
            <div className="no-results">
              <p>Aucun lieu ne correspond à votre recherche</p>
              {(searchTerm.length >= 3 || selectedCategory.length > 0) && (
                <button onClick={() => { setSearchTerm(''); resetFilters(); }} className="btn-reset-search">
                  Réinitialiser la recherche
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="places-grid">
                {currentPlaces.map(place => (
                  <Link key={place.id} to={`/places/${place.id}`} className="place-card">
                    <img src={place.image || 'https://via.placeholder.com/400x300'} alt={place.name} />
                    <div className="card-content">
                      <h3>{place.name}</h3>
                      <span className="badge">{place.category}</span>
                      <p>{place.description.substring(0, 100)}...</p>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Précédent
                  </button>
                  <span>Page {currentPage} sur {totalPages}</span>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Suivant
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
