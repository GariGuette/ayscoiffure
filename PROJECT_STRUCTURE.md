# 📊 STRUCTURE COMPLÈTE DU PROJET AYS COIFFURE

```
AYS Coiffure/
│
├── 📄 Documentation (Lire en premier!)
│   ├── README.md                 ← VUE D'ENSEMBLE
│   ├── GETTING_STARTED.md        ← COMMENCEZ ICI! 🌟
│   ├── QUICKSTART.md             ← Guide rapide (5 min)
│   ├── INSTALLATION.md           ← Instructions détaillées
│   ├── DEPLOYMENT.md             ← Déployer en ligne
│   └── TESTING.md                ← Tester le système
│
├── 🔧 Backend (API Node.js)
│   ├── server.js                 ← Point d'entrée
│   ├── package.json              ← Dépendances npm
│   ├── .env.example              ← Variables d'env
│   │
│   ├── 📁 config/
│   │   ├── database.js           ← Connexion PostgreSQL
│   │   └── auth.js               ← Middleware JWT
│   │
│   ├── 📁 routes/
│   │   ├── auth.js               ← Login admin
│   │   ├── reservations.js       ← Gestion des RDV
│   │   ├── schedule.js           ← Services & horaires
│   │   ├── sms.js                ← Logs SMS
│   │   ├── blacklist.js          ← Liste noire
│   │   ├── admin.js              ← Statistiques admin
│   │   └── public.js             ← Routes publiques
│   │
│   ├── 📁 services/
│   │   └── smsService.js         ← Intégration Twilio
│   │
│   └── init-data.sql             ← Données d'exemple
│
├── 🎨 Frontend (React)
│   ├── package.json              ← Dépendances npm
│   │
│   ├── 📁 public/
│   │   └── index.html            ← HTML principal
│   │
│   └── 📁 src/
│       ├── App.js                ← Routeur principal
│       ├── index.js              ← Point d'entrée React
│       │
│       ├── 📁 pages/             ← Pages principales
│       │   ├── Home.js           ← Accueil
│       │   ├── Booking.js        ← Prise de RDV
│       │   ├── Info.js           ← Infos
│       │   ├── Login.js          ← Connexion admin
│       │   ├── AdminDashboard.js ← Tableau de bord
│       │   ├── ManageReservations.js   ← Gestion RDV
│       │   ├── AddReservation.js       ← Ajouter RDV
│       │   ├── ManageBlacklist.js      ← Liste rouge
│       │   ├── ManageServices.js       ← Services
│       │   └── ManageSalon.js          ← Infos salon
│       │
│       ├── 📁 components/        ← Composants réutilisables
│       │   ├── Navbar.js         ← Barre de navigation
│       │   └── ProtectedRoute.js ← Protection des routes
│       │
│       ├── 📁 context/           ← State management
│       │   └── AuthContext.js    ← Contexte d'auth
│       │
│       └── 📁 styles/            ← Feuilles de style
│           ├── global.css        ← Styles globaux
│           ├── auth.css          ← Login/auth
│           ├── booking.css       ← Page booking
│           ├── home.css          ← Accueil
│           ├── admin-dashboard.css
│           ├── admin.css         ← Pages admin
│           └── navbar.css        ← Navigation
│
└── 📋 Configuration racine
    ├── .gitignore                ← Fichiers ignorés git
    └── package.json              ← Scripts npm globaux
```

## 🔄 FLUX DE L'APPLICATION

### Page Client (Public)
```
Accueil (Home.js)
    ↓
Horaires & Services (schedule/info)
    ↓
Prendre RDV (Booking.js)
    ↓
Vérifier créneaux disponibles
    ↓
Créer réservation
    ↓
SMS confirmation envoyé ✓
```

### Page Admin (Protégée)
```
Login (Login.js)
    ↓ [Vérification mot de passe]
Dashboard (AdminDashboard.js)
    ↓
├── Gestion des RDV
├── Ajouter RDV manuellement
├── Gestion services
├── Gestion blacklist
├── Configuration salon
└── Horaires d'ouverture
```

## 🗄️ BASE DE DONNÉES (PostgreSQL)

```
ays_coiffure
│
├── services
│   ├── id (PK)
│   ├── name
│   ├── description
│   ├── duration
│   └── price
│
├── reservations
│   ├── id (PK)
│   ├── client_name
│   ├── client_phone
│   ├── service_id (FK)
│   ├── reservation_date
│   ├── reservation_time
│   ├── status
│   ├── confirmation_code
│   ├── confirmed
│   └── ...
│
├── opening_hours
│   ├── id (PK)
│   ├── day_of_week
│   ├── opening_time
│   ├── closing_time
│   └── is_closed
│
├── blacklist
│   ├── id (PK)
│   ├── phone_number (UNIQUE)
│   ├── reason
│   └── added_date
│
├── sms_log
│   ├── id (PK)
│   ├── reservation_id (FK)
│   ├── phone_number
│   ├── message
│   ├── sms_type
│   ├── status
│   ├── twilio_sid
│   └── created_at
│
├── salon_info
│   ├── id (PK)
│   ├── name
│   ├── phone
│   ├── email
│   ├── address
│   └── description
│
└── admin_user
    ├── id (PK)
    ├── username
    ├── password_hash
    └── email
```

## 🔗 ENDPOINTS API

### Auth
```
POST   /api/auth/login
GET    /api/auth/verify
```

### Réservations (Public)
```
POST   /api/reservations               [Create]
GET    /api/reservations/available/:date/:serviceId
PUT    /api/reservations/:id/confirm
```

### Réservations (Admin)
```
GET    /api/reservations               [Protected]
GET    /api/reservations/today         [Protected]
POST   /api/reservations/admin/manual  [Protected]
PUT    /api/reservations/:id/cancel    [Protected]
```

### Services
```
GET    /api/schedule/services
POST   /api/schedule/services          [Protected]
```

### Horaires
```
GET    /api/schedule/hours
GET    /api/schedule/info
PUT    /api/schedule/info              [Protected]
PUT    /api/schedule/hours/:day        [Protected]
```

### Blacklist
```
GET    /api/blacklist                  [Protected]
POST   /api/blacklist                  [Protected]
DELETE /api/blacklist/:id              [Protected]
GET    /api/blacklist/check/:phone
```

### SMS
```
POST   /api/sms/send                   [Protected]
GET    /api/sms/logs                   [Protected]
GET    /api/sms/logs/:reservationId    [Protected]
```

### Admin
```
GET    /api/admin/dashboard            [Protected]
GET    /api/admin/client/:phone        [Protected]
```

## 🚀 DÉMARRAGE

### 1️⃣ Installez les dépendances

Backend:
```bash
cd backend
npm install
```

Frontend:
```bash
cd frontend
npm install
```

### 2️⃣ Configurez PostgreSQL

```bash
createdb ays_coiffure
```

### 3️⃣ Configurez .env

```bash
cp backend/.env.example backend/.env
# Modifiez les paramètres
```

### 4️⃣ Lancez

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

### 5️⃣ Accédez

- 🏠 Accueil: http://localhost:3000
- 🔐 Admin: http://localhost:3000/admin/login
- 📅 API: http://localhost:5000/api/health

## 📦 DÉPENDANCES PRINCIPALES

### Backend
- express - Framework web
- pg - Client PostgreSQL
- jsonwebtoken - Authentification JWT
- bcryptjs - Hachage des mots de passe
- twilio - Envoi de SMS
- cors - Gestion CORS
- dotenv - Variables d'environnement
- node-cron - Jobs programmés (rappels SMS)

### Frontend
- react - Framework UI
- react-dom - Rendu React
- react-router-dom - Routage
- axios - Requêtes HTTP
- date-fns - Manipulation de dates

## 🎯 NAVIGATION

Pour naviguer dans le code:
1. Commencez par `GETTING_STARTED.md`
2. Consultez `README.md` pour les détails
3. Regardez la structure ci-dessus
4. Le code est bien commenté et organisé

## 💡 POINTS CLÉS

✅ **Sécurité**: JWT, mots de passe hachés, validation entrées
✅ **Responsive**: Fonctionne sur mobile et desktop
✅ **SMS**: Intégration Twilio complète
✅ **Scalable**: Architecture bien séparée frontend/backend
✅ **Documenté**: Chaque fichier a un commentaire explicatif

## 🎉 PRÊT À COMMENCER?

1. Lisez `GETTING_STARTED.md` 📖
2. Installez les dépendances 📦
3. Configurez la base de données 🗄️
4. Lancez le projet 🚀
5. Testez selon `TESTING.md` ✅
6. Déployez avec `DEPLOYMENT.md` 🌍

**Bon développement! 💻**
