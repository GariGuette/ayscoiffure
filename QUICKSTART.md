# Guide de démarrage rapide

## Installation rapide (5 minutes)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Modifiez .env avec vos paramètres
npm run dev
```

Le backend démarre sur `http://localhost:5000`

### 2. Frontend (nouveau terminal)

```bash
cd frontend
npm install
npm start
```

Le frontend démarre sur `http://localhost:3000`

## Premier test

1. Accédez à `http://localhost:3000`
2. Ajoutez des services via l'admin
3. Testez la création de réservations
4. Consultez le tableau de bord admin

## Variables d'environnement essentielles

```env
# Base de données
DB_HOST=localhost
DB_NAME=ays_coiffure

# Admin
ADMIN_PASSWORD=admin123

# Twilio (SMS) - Optionnel pour tester
# TWILIO_ACCOUNT_SID=...
# TWILIO_AUTH_TOKEN=...
# TWILIO_PHONE_NUMBER=...
```

## Fonctionnement

- **Page d'accueil**: Infos du salon et horaires
- **Prendre RDV**: Calendrier public
- **Admin**: Protégé par mot de passe (défaut: admin123)
- **SMS**: Confirmations et rappels (nécessite Twilio)

## Troubleshooting

### Backend n'a pas accès à la BD
```bash
createdb ays_coiffure
```

### Port déjà utilisé
```bash
# Changer le port dans .env (PORT=5001)
```

### Frontend pas de connexion au backend
```bash
# Assurez-vous que le backend s'exécute sur port 5000
# Vérifiez le proxy dans frontend/package.json
```

Besoin d'aide? Consultez le README principal.
