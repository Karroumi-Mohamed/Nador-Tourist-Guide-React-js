# 🗺️ ROADMAP - Nador Explorer

## 📚 NIVEAU 1 : Architecture Globale (Vue d'ensemble)

### 1.1 Structure du Projet
```
nador-guide/
├── src/                    # Code source
├── db.json                 # Base de données JSON Server
├── package.json            # Dépendances
└── SETUP.md               # Documentation
```

### 1.2 Technologies Utilisées
- **Frontend**: React + TypeScript + Vite
- **État Global**: Redux Toolkit
- **Formulaires**: React Hook Form + Yup
- **HTTP**: Axios
- **Backend**: JSON Server
- **Auth**: DummyJSON API
- **Notifications**: React Toastify
- **Routing**: React Router

---

## 📚 NIVEAU 2 : Flux de Données (Comment ça communique)

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ↓
┌─────────────────────────────────────┐
│         React App (main.tsx)        │
│  ┌───────────────────────────────┐  │
│  │    Redux Provider (Store)     │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │   React Router (App)    │  │  │
│  │  │  ┌──────────────────┐   │  │  │
│  │  │  │   Pages/Views    │   │  │  │
│  │  │  └──────────────────┘   │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
       │                    ↑
       ↓ (Axios)            │ (Response)
┌─────────────────────────────────────┐
│      JSON Server (db.json)          │
│      http://localhost:3001          │
└─────────────────────────────────────┘
```

---

## 📚 NIVEAU 3 : Point d'Entrée (Démarrage de l'App)

### 3.1 main.tsx - Le Cerveau Central
```typescript
// 1. Point d'entrée de l'application
createRoot(document.getElementById('root')!)
  .render(
    <Provider store={store}>        // Redux pour l'état global
      <App />                        // Application principale
      <ToastContainer />             // Notifications
    </Provider>
  )
```

**Rôle**: Initialise React, Redux et les notifications

---

## 📚 NIVEAU 4 : Redux Store (Gestion d'État)

### 4.1 store/store.ts - Le Cerveau de l'État
```typescript
export const store = configureStore({
  reducer: {
    places: placesReducer,    // Gère les lieux
    auth: authReducer,        // Gère l'authentification
  },
});
```

### 4.2 store/slices/placesSlice.ts - Gestion des Lieux
```
Actions Async (Thunks):
├── fetchPlaces()     → GET /places
├── createPlace()     → POST /places
├── updatePlace()     → PUT /places/:id
└── deletePlace()     → DELETE /places/:id

État:
├── items: []         → Liste des lieux
├── loading: false    → Chargement en cours?
└── error: null       → Erreur?
```

### 4.3 store/slices/authSlice.ts - Authentification
```
Actions:
├── login()           → POST https://dummyjson.com/auth/login
└── logout()          → Supprime le token

État:
├── user: null        → Utilisateur connecté
├── token: null       → JWT Token
├── loading: false    → Chargement?
└── error: null       → Erreur?
```

---

## 📚 NIVEAU 5 : Services (Communication HTTP)

### 5.1 services/api.ts - Configuration Axios
```typescript
const api = axios.create({
  baseURL: 'http://localhost:3001',
});

// Intercepteur Request: Ajoute le token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Intercepteur Response: Gère les erreurs 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Déconnexion automatique
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 📚 NIVEAU 6 : Validation (Schémas Yup)

### 6.1 schemas/validationSchemas.ts
```typescript
// Validation d'un lieu
export const placeSchema = yup.object({
  name: yup.string().required().min(3),
  category: yup.string().required(),
  description: yup.string().required().min(10),
  image: yup.string().url().required(),
  // ... autres champs
});

// Validation du login
export const loginSchema = yup.object({
  username: yup.string().required(),
  password: yup.string().required().min(4),
});
```

---

## 📚 NIVEAU 7 : Routing (Navigation)

### 7.1 App.tsx - Routes de l'Application
```typescript
<BrowserRouter>
  <Routes>
    {/* Routes Publiques */}
    <Route path="/" element={<Home />} />
    <Route path="/places" element={<PlacesNew />} />
    <Route path="/places/:id" element={<PlaceDetail />} />
    <Route path="/admin/login" element={<LoginNew />} />
    
    {/* Routes Protégées (Admin) */}
    <Route path="/admin/dashboard" element={
      <ProtectedRoute><AdminDashboard /></ProtectedRoute>
    } />
    <Route path="/admin/places" element={
      <ProtectedRoute><DashboardNew /></ProtectedRoute>
    } />
  </Routes>
</BrowserRouter>
```

### 7.2 components/ProtectedRoute.tsx
```typescript
// Vérifie si l'utilisateur est connecté
const isAuthenticated = localStorage.getItem('adminToken');

if (!isAuthenticated) {
  return <Navigate to="/admin/login" />;  // Redirige vers login
}

return <>{children}</>;  // Affiche la page
```

---

## 📚 NIVEAU 8 : Pages (Composants Principaux)

### 8.1 pages/LoginNew.tsx - Authentification
```
Flux:
1. Utilisateur saisit username/password
2. React Hook Form valide avec Yup
3. dispatch(login({ username, password }))
4. Redux appelle DummyJSON API
5. Si succès: stocke token + redirige vers dashboard
6. Si erreur: affiche toast d'erreur
```

### 8.2 pages/PlacesNew.tsx - Liste des Lieux (Public)
```
Flux:
1. useEffect() → dispatch(fetchPlaces())
2. Redux appelle GET /places via Axios
3. Filtre les lieux actifs (active: true)
4. Affiche dans une grille
5. Recherche et filtres par catégorie
```

### 8.3 pages/DashboardNew.tsx - Gestion des Lieux (Admin)
```
Flux CRUD:

CREATE:
1. Clic "Nouveau Lieu" → ouvre modal
2. React Hook Form + validation Yup
3. onSubmit → dispatch(createPlace(data))
4. Redux → POST /places
5. Toast succès + ferme modal

UPDATE:
1. Clic "Modifier" → ouvre modal pré-rempli
2. Modification des champs
3. onSubmit → dispatch(updatePlace(data))
4. Redux → PUT /places/:id
5. Toast succès

DELETE:
1. Clic "Supprimer" → confirmation
2. dispatch(deletePlace(id))
3. Redux → DELETE /places/:id
4. Toast succès

TOGGLE ACTIVE:
1. Clic bouton Power
2. dispatch(updatePlace({ ...place, active: !active }))
3. Redux → PUT /places/:id
```

---

## 📚 NIVEAU 9 : Flux Complet (Exemple: Créer un Lieu)

```
┌──────────────────────────────────────────────────────────┐
│ 1. USER: Remplit le formulaire dans DashboardNew.tsx    │
└────────────────────┬─────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────┐
│ 2. REACT HOOK FORM: Valide avec Yup (placeSchema)       │
└────────────────────┬─────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────┐
│ 3. COMPONENT: dispatch(createPlace(formData))           │
└────────────────────┬─────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────┐
│ 4. REDUX THUNK: Appelle api.post('/places', data)       │
└────────────────────┬─────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────┐
│ 5. AXIOS INTERCEPTOR: Ajoute JWT token dans headers     │
└────────────────────┬─────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────┐
│ 6. JSON SERVER: Sauvegarde dans db.json                 │
└────────────────────┬─────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────┐
│ 7. REDUX: Met à jour state.places.items                 │
└────────────────────┬─────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────┐
│ 8. REACT: Re-render automatique du composant            │
└────────────────────┬─────────────────────────────────────┘
                     ↓
┌──────────────────────────────────────────────────────────┐
│ 9. TOAST: Affiche "Lieu créé avec succès!"              │
└──────────────────────────────────────────────────────────┘
```

---

## 📚 NIVEAU 10 : Commandes Essentielles

```bash
# Installation
npm install

# Démarrer JSON Server (Terminal 1)
npm run server          # → http://localhost:3001

# Démarrer React (Terminal 2)
npm run dev            # → http://localhost:5173

# Ou tout en même temps
npm run dev:all
```

---

## 📚 NIVEAU 11 : Fichiers Clés à Étudier (Dans l'ordre)

1. **main.tsx** - Point d'entrée
2. **store/store.ts** - Configuration Redux
3. **store/slices/placesSlice.ts** - Logique des lieux
4. **services/api.ts** - Configuration Axios
5. **schemas/validationSchemas.ts** - Validation
6. **App.tsx** - Routes
7. **pages/LoginNew.tsx** - Authentification
8. **pages/PlacesNew.tsx** - Liste publique
9. **pages/DashboardNew.tsx** - Admin CRUD

---

## 📚 NIVEAU 12 : Concepts Clés à Comprendre

### Redux Toolkit
- **Store**: Conteneur global de l'état
- **Slice**: Morceau d'état + reducers
- **Thunk**: Action asynchrone (API calls)
- **useSelector**: Lire l'état Redux
- **useDispatch**: Déclencher des actions

### React Hook Form
- **register**: Enregistre un champ
- **handleSubmit**: Gère la soumission
- **errors**: Erreurs de validation
- **reset**: Réinitialise le formulaire

### Axios Interceptors
- **Request**: Modifie avant envoi (ajoute token)
- **Response**: Traite après réception (gère erreurs)

### JSON Server
- Base de données REST automatique
- CRUD complet sur db.json
- Routes générées automatiquement

---

## 🎯 EXERCICES PRATIQUES

1. **Débutant**: Ajoute un nouveau champ "rating" aux lieux
2. **Intermédiaire**: Crée une page de statistiques
3. **Avancé**: Ajoute la pagination côté serveur
4. **Expert**: Implémente le refresh token automatique

---

## 🐛 Debugging Tips

```bash
# Voir les requêtes Redux
# Installe Redux DevTools dans Chrome

# Voir les requêtes HTTP
# Ouvre Network tab dans DevTools

# Voir l'état Redux en temps réel
console.log(store.getState())

# Voir les données JSON Server
http://localhost:3001/places
```

---

## 📖 Ressources

- Redux Toolkit: https://redux-toolkit.js.org/
- React Hook Form: https://react-hook-form.com/
- Yup: https://github.com/jquense/yup
- Axios: https://axios-http.com/
- JSON Server: https://github.com/typicode/json-server
