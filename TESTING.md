# Guide de Test du Système

## Test Local

### 1. Préparation

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev
# Doit afficher: "Server running on port 5000"

# Terminal 2 - Frontend
cd frontend
npm install
npm start
# Doit ouvrir localhost:3000
```

### 2. Tests Fonctionnels

#### Test 1: Accueil et Informations
- [ ] Accédez à `http://localhost:3000`
- [ ] Vérifiez que le salon s'affiche
- [ ] Consultez les horaires
- [ ] Vérifiez les informations de contact

#### Test 2: Ajout de Services (Admin)
- [ ] Allez à `http://localhost:3000/admin/login`
- [ ] Entrez le mot de passe: `admin123` (ou votre mot de passe .env)
- [ ] Allez à "Services"
- [ ] Ajoutez un nouveau service:
  - Nom: "Coupe Homme"
  - Durée: 30 min
  - Prix: 15€
- [ ] Vérifiez que le service apparaît dans la liste

#### Test 3: Prise de Rendez-vous
- [ ] Allez à `http://localhost:3000/booking`
- [ ] Sélectionnez le service créé
- [ ] Choisissez une date
- [ ] Vérifiez que des créneaux s'affichent
- [ ] Entrez votre nom et téléphone
- [ ] Cliquez "Réserver"
- [ ] Vous devriez voir: "Réservation créée! Un SMS de confirmation..."

#### Test 4: Tableau de Bord Admin
- [ ] Connectez-vous à `http://localhost:3000/admin/login`
- [ ] Allez au Dashboard
- [ ] Vérifiez les stats:
  - Réservations d'aujourd'hui
  - Cette semaine
  - Clients totaux
- [ ] Vérifiez que votre réservation apparaît dans "Réservations du jour"

#### Test 5: Gestion des Réservations (Admin)
- [ ] Allez à "Gestion RDV"
- [ ] Vérifiez la réservation créée
- [ ] Essayez d'annuler une réservation (optionnel)

#### Test 6: Ajouter une Réservation Manuellement
- [ ] Allez à "Ajouter RDV"
- [ ] Remplissez les champs:
  - Nom: "Test Client"
  - Téléphone: "+33612345678"
  - Service: Votre service
  - Date/Heure: Demain à 14h00
- [ ] Cliquez "Ajouter"
- [ ] Vérifiez que la réservation apparaît

#### Test 7: Liste Rouge
- [ ] Allez à "Liste Rouge"
- [ ] Essayez d'ajouter un numéro:
  - "+33987654321"
  - Raison: "Test blockage"
- [ ] Vérifiez que le numéro apparaît
- [ ] Essayez de prendre RDV avec ce numéro - doit être bloqué
- [ ] Revenez en admin et retirez le numéro

#### Test 8: Gestion du Salon
- [ ] Allez à "Salon"
- [ ] Modifiez les informations:
  - Nom, Email, Adresse, Description
- [ ] Modifiez les horaires:
  - Fermeture le lundi (test)
  - Autres jours normaux
- [ ] Cliquez "Enregistrer"
- [ ] Retournez à l'accueil et vérifiez les changements

### 3. Tests de Validation

#### Validation des Données
- [ ] Essayez de créer une réservation sans service
- [ ] Essayez un numéro de téléphone invalide
- [ ] Essayez une date passée
- [ ] Essayez un créneau horaire invalide

#### Authentification Admin
- [ ] Essayez de vous connecter avec un mauvais mot de passe
- [ ] Vérifiez que vous êtes redirigé vers le login
- [ ] Testez la déconnexion

### 4. Tests de Sécurité

- [ ] Essayez d'accéder directement à `/admin/dashboard` sans vous connecter
  - Vous devriez être redirigé vers le login
- [ ] Testez les réservations en liste rouge
- [ ] Vérifiez que les tokens JWT expirent après 24h

### 5. Tests d'API (avec cURL ou Postman)

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"admin123"}'

# Répondra avec un token

# Récupérer les réservations
curl -X GET http://localhost:5000/api/reservations \
  -H "Authorization: Bearer YOUR_TOKEN"

# Récupérer les services
curl -X GET http://localhost:5000/api/schedule/services

# Vérifier un numéro dans la liste rouge
curl -X GET http://localhost:5000/api/blacklist/check/%2B33612345678
```

## Checklist de Test Complet

### Frontend
- [ ] Navigation responsive
- [ ] Styles appliqués correctement
- [ ] Messages d'erreur affichés
- [ ] Formulaires valident les données
- [ ] Pages chargent correctement

### Backend
- [ ] Tous les endpoints répondent
- [ ] Les erreurs sont gérées
- [ ] Validation des données
- [ ] Authentification fonctionne
- [ ] Logs affichés en console

### Base de Données
- [ ] Les données sont sauvegardées
- [ ] Les relations entre tables fonctionnent
- [ ] Les contraintes sont appliquées
- [ ] Les updates fonctionnent

### SMS (si Twilio configuré)
- [ ] SMS de confirmation envoyé
- [ ] SMS de rappel envoyé
- [ ] SMS de cancelation envoyé
- [ ] Logs SMS affichés

## Dépannage

### Le backend ne démarre pas
```bash
# Vérifiez PostgreSQL
psql -U postgres -d ays_coiffure -c "SELECT 1"

# Vérifiez les ports
netstat -an | grep 5000
```

### Le frontend ne se connecte pas au backend
```bash
# Vérifiez que le backend s'exécute
curl http://localhost:5000/api/health

# Vérifiez le proxy dans package.json
```

### Erreurs de base de données
```bash
# Réinitialisez les tables
npm run init-db
```

## Rapport de Test

Créez un fichier `TEST_REPORT.md`:

```markdown
# Rapport de Test - AYS Coiffure

Date: 2024-01-XX
Testeur: Votre nom

## Résultats

### Frontend
- [ ] ✓ Accueil: OK
- [ ] ✓ Booking: OK
- [ ] ✓ Admin: OK

### Backend
- [ ] ✓ API: OK
- [ ] ✓ DB: OK

### Fonctionnalités
- [ ] ✓ Réservations: OK
- [ ] ✓ SMS: OK (si configuré)
- [ ] ✓ Authentification: OK
- [ ] ✓ Liste rouge: OK

## Bugs trouvés
- Aucun

## Recommandations
- Bon à déployer
```

Félicitations! Votre système est testé et prêt à l'emploi! 🎉
