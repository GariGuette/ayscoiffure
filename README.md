<<<<<<< HEAD
# ayscoiffure
=======
# AYS Coiffure - Salon de Coiffure Management System

Un site web complet pour la gestion d'un salon de coiffure avec réservations en ligne, SMS de confirmation, et tableau de bord administrateur.

## Fonctionnalités

### Pour les clients
- 🗓️ Calendrier interactif pour prendre des rendez-vous
- 📋 Choix de services (coupes, couleur, etc.)
- 📱 SMS de confirmation automatique
- 📱 Vérification SMS pour confirmer les rendez-vous
- ℹ️ Consultation des horaires d'ouverture
- 📞 Informations de contact du salon

### Pour l'administrateur
- 🔐 Interface protégée par mot de passe
- 📊 Tableau de bord avec statistiques
- 📅 Gestion des réservations (voir, ajouter, annuler)
- 🔴 Liste rouge: gestion des numéros de téléphone bloqués
- 💇 Gestion des services (coupes, prix, durée)
- ⏰ Configuration des horaires d'ouverture
- 📝 Informations du salon (nom, adresse, téléphone, etc.)
- 🕐 Rappels SMS automatiques la veille des rendez-vous

## Structure du projet
# AYS Coiffure - Salon de Coiffure Management System

Un site web complet pour la gestion d'un salon de coiffure avec réservations en ligne, SMS de confirmation, et tableau de bord administrateur.

## Fonctionnalités

### Pour les clients
- 🗓️ Calendrier interactif pour prendre des rendez-vous
- 📋 Choix de services (coupes, couleur, etc.)
- 📱 SMS de confirmation automatique
- 📱 Vérification SMS pour confirmer les rendez-vous
- ℹ️ Consultation des horaires d'ouverture
- 📞 Informations de contact du salon

### Pour l'administrateur
- 🔐 Interface protégée par mot de passe
- 📊 Tableau de bord avec statistiques
- 📅 Gestion des réservations (voir, ajouter, annuler)
- 🔴 Liste rouge: gestion des numéros de téléphone bloqués
- 💇 Gestion des services (coupes, prix, durée)
- ⏰ Configuration des horaires d'ouverture
- 📝 Informations du salon (nom, adresse, téléphone, etc.)
- 🕐 Rappels SMS automatiques la veille des rendez-vous

## Structure du projet

```
AYS Coiffure/
├── backend/           # API Node.js/Express
│   ├── config/        # Configuration
│   ├── routes/        # Routes API
│   ├── services/      # Services (SMS, etc.)
│   └── server.js      # Point d'entrée
│
└── frontend/          # Application React
    ├── public/        # Fichiers statiques
    ├── src/
    │   ├── pages/     # Pages principales
    │   ├── components/# Composants réutilisables
    │   ├── styles/    # CSS
    │   ├── context/   # Context API
    │   └── App.js     # Application principale
    └── package.json
```

## Installation

### Prérequis
- Node.js >= 14
- PostgreSQL >= 12
- npm ou yarn

### Backend

1. Allez dans le dossier backend:
```bash
cd backend
```

2. Installez les dépendances:
```bash
npm install
```

3. Créez un fichier `.env` basé sur `.env.example`:
```bash
cp .env.example .env
```

4. Configurez les variables d'environnement:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ays_coiffure
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
ADMIN_PASSWORD=admin123
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1234567890
PORT=5000
```

5. Créez la base de données PostgreSQL:
```bash
createdb ays_coiffure
```

6. Démarrez le serveur:
```bash
npm run dev
```

Le serveur doit être disponible sur `http://localhost:5000`

### Frontend

1. Dans un nouveau terminal, allez dans le dossier frontend:
```bash
cd frontend
```

2. Installez les dépendances:
```bash
npm install
```

3. Démarrez l'application React:
```bash
npm start
```

L'application doit s'ouvrir sur `http://localhost:3000`

## Configuration Twilio (SMS)

Pour utiliser les SMS:

1. Créez un compte sur [Twilio](https://www.twilio.com)
2. Obtenez votre Account SID et Auth Token
3. Achetez un numéro de téléphone Twilio
4. Ajoutez ces informations dans le fichier `.env`

## Utilisation

### Pour les clients
1. Accédez à la page d'accueil
2. Consultez les horaires et services
3. Cliquez sur "Prendre un rendez-vous"
4. Sélectionnez un service, une date et une heure
5. Confirmez votre rendez-vous via SMS

### Pour l'administrateur
1. Accédez à `/admin/login`
2. Entrez le mot de passe (configuré dans `.env`)
3. Accédez au tableau de bord pour:
   - Voir les réservations
   - Gérer les clients
   - Configurer le salon
   - Gérer la liste rouge

## API Endpoints

### Authentification
- `POST /api/auth/login` - Connexion admin
- `GET /api/auth/verify` - Vérifier le token

### Réservations
- `GET /api/reservations` - Toutes les réservations (admin)
- `GET /api/reservations/today` - Réservations d'aujourd'hui (admin)
- `GET /api/reservations/available/:date/:serviceId` - Créneaux disponibles
- `POST /api/reservations` - Créer une réservation
- `PUT /api/reservations/:id/confirm` - Confirmer une réservation
- `PUT /api/reservations/:id/cancel` - Annuler une réservation (admin)

### Services
- `GET /api/schedule/services` - Tous les services
- `POST /api/schedule/services` - Ajouter un service (admin)

### Horaires
- `GET /api/schedule/hours` - Horaires d'ouverture
- `PUT /api/schedule/hours/:day` - Modifier horaires (admin)

### Liste rouge
- `GET /api/blacklist` - Tous les numéros bloqués (admin)
- `POST /api/blacklist` - Ajouter à la liste rouge (admin)
- `DELETE /api/blacklist/:id` - Retirer de la liste rouge (admin)
- `GET /api/blacklist/check/:phoneNumber` - Vérifier si bloqué

### SMS
- `POST /api/sms/send` - Envoyer SMS (admin)
- `GET /api/sms/logs` - Historique SMS (admin)

## Déploiement

### Sur un hébergeur web

1. **Backend** (Node.js):
   - Déployez sur Heroku, DigitalOcean, AWS ou similaire
   - Configurez les variables d'environnement
   - Assurez-vous que PostgreSQL est accessible

2. **Frontend** (React):
   - Buildez: `npm run build`
   - Déployez le dossier `build/` sur un hébergeur statique (Netlify, Vercel, etc.)
   - Configurez l'URL du backend dans le proxy

## Sécurité

- Les mots de passe admins sont protégés par JWT
- Les routes sensibles nécessitent une authentification
- Les données sont validées côté serveur
- Les numéros de téléphone peuvent être bloqués via la liste rouge

## Support des rappels SMS

Les rappels SMS sont envoyés automatiquement:
- Tous les jours à 10h00
- Pour les rendez-vous de demain confirmés
- Personnalisables via le cron job dans `server.js`

## Prochaines étapes

- [ ] Ajouter l'intégration Stripe pour les paiements
- [ ] Système de notation/avis clients
- [ ] Application mobile
- [ ] Exportation des réservations en PDF
- [ ] Multi-langue
- [ ] Intégration avec Google Calendar

## License

MIT
