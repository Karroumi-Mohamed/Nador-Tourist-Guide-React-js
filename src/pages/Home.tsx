import { Link } from 'react-router-dom';
import { MapPin, Compass, Waves, Mountain, UtensilsCrossed, Hotel, Coffee, ShoppingBag, Palmtree } from 'lucide-react';
import './Home.css';

const categories = [
  { name: 'Plages', icon: Waves, color: '#3b82f6' },
  { name: 'Sites naturels', icon: Mountain, color: '#10b981' },
  { name: 'Monuments et patrimoine', icon: Palmtree, color: '#f59e0b' },
  { name: 'Musées et culture', icon: Compass, color: '#8b5cf6' },
  { name: 'Restaurants', icon: UtensilsCrossed, color: '#ef4444' },
  { name: 'Hôtels et hébergements', icon: Hotel, color: '#06b6d4' },
  { name: 'Cafés et salons de thé', icon: Coffee, color: '#84cc16' },
  { name: 'Shopping et souks', icon: ShoppingBag, color: '#ec4899' },
];

export default function Home() {
  return (
    <div className="home">
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">
            <MapPin size={28} />
            <span>Nador Explorer</span>
          </div>
          <div style={{display: 'flex', gap: '1rem'}}>
            <Link to="/places" className="nav-link">Découvrir les lieux</Link>
            <Link to="/admin/login" className="nav-link" style={{background: '#2d3748'}}>Admin</Link>
          </div>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <h1>Découvrez Nador</h1>
          <p>Perle de la Méditerranée marocaine</p>
          <Link to="/places" className="btn-hero">Explorer maintenant</Link>
        </div>
      </section>

      <section className="intro">
        <div className="container">
          <h2>Bienvenue à Nador</h2>
          <p>
            Nador, située sur la côte méditerranéenne du Maroc, est une destination qui allie beauté naturelle 
            et richesse culturelle. Découvrez la magnifique lagune de Marchica, les plages de Charrana et Boukana, 
            le majestueux mont Gourougou, et plongez dans l'authenticité des souks traditionnels et la culture rifaine unique.
          </p>
        </div>
      </section>

      <section className="categories">
        <div className="container">
          <h2>Explorer par catégorie</h2>
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link 
                key={cat.name} 
                to={`/places?category=${encodeURIComponent(cat.name)}`}
                className="category-card"
                style={{ borderColor: cat.color }}
              >
                <cat.icon size={32} style={{ color: cat.color }} />
                <h3>{cat.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 Nador Explorer - Région de l'Oriental</p>
      </footer>
    </div>
  );
}
