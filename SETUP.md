# Nador Explorer - Guide d'utilisation

## Technologies utilisées

✅ **TypeScript** - Langage principal
✅ **React** - Framework frontend
✅ **React Hook Form** - Gestion des formulaires
✅ **Yup** - Validation des formulaires
✅ **React Toastify** - Notifications
✅ **Redux Toolkit** - Gestion d'état
✅ **Axios** - Requêtes HTTP avec intercepteurs
✅ **Json-Server** - Backend mock
✅ **DummyJSON Auth API** - Authentification
✅ **React Router** - Routage avec routes protégées
✅ **JWT** - Stocké dans localStorage

## Installation

```bash
npm install
```

## Démarrage

### Option 1: Démarrer tout ensemble
```bash
npm run dev:all
```

### Option 2: Démarrer séparément
Terminal 1:
```bash
npm run server
```

Terminal 2:
```bash
npm run dev
```

## URLs

- **Frontend**: http://localhost:5173
- **Backend (JSON Server)**: http://localhost:3001
- **API Places**: http://localhost:3001/places

## Authentification

### DummyJSON Test Credentials
- Username: `emilys`
- Password: `emilyspass`

Autres comptes disponibles sur: https://dummyjson.com/users

## Structure du projet

```
src/
├── store/
│   ├── store.ts              # Configuration Redux
│   └── slices/
│       ├── placesSlice.ts    # Gestion des lieux
│       └── authSlice.ts      # Gestion auth
├── services/
│   └── api.ts                # Configuration Axios + intercepteurs
├── schemas/
│   └── validationSchemas.ts  # Schémas Yup
├── pages/
│   ├── LoginNew.tsx          # Login avec React Hook Form
│   ├── DashboardNew.tsx      # Dashboard avec Redux
│   └── PlacesNew.tsx         # Liste avec Redux
└── types/
    └── index.ts              # Types TypeScript
```

## Fonctionnalités

- ✅ Authentification avec DummyJSON API
- ✅ CRUD complet des lieux (Create, Read, Update, Delete)
- ✅ Validation des formulaires avec Yup
- ✅ Notifications toast
- ✅ Gestion d'état avec Redux
- ✅ Routes protégées
- ✅ Intercepteurs Axios pour JWT
- ✅ Backend JSON Server
