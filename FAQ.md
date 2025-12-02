# ❓ FAQ - Questions Fréquemment Posées

## Installation & Démarrage

### Q: Comment installer PostgreSQL?
**A:** 
- Windows: Téléchargez depuis https://www.postgresql.org/download/windows/
- macOS: `brew install postgresql@15`
- Linux: `sudo apt install postgresql`

Puis créez la base: `createdb ays_coiffure`

### Q: Quel port pour le backend et frontend?
**A:** 
- Backend: 5000 (configurable dans .env)
- Frontend: 3000 (par défaut React)

Si les ports sont occupés, changez-les dans .env ou package.json

### Q: Où configurer les variables d'environnement?
**A:** Créez un fichier `.env` dans le dossier `backend/`:
```bash
cp backend/.env.example backend/.env
# Puis éditez le fichier avec vos valeurs
```

### Q: Pourquoi le backend ne démarre pas?
**A:** Vérifiez:
1. PostgreSQL s'exécute: `psql -U postgres -d ays_coiffure -c "SELECT 1"`
2. Les ports sont libres
3. Les variables d'env sont correctes
4. Consultez les logs pour les erreurs détaillées

---

## Utilisation

### Q: Comment ajouter des services?
**A:** 
1. Connectez-vous admin: `localhost:3000/admin/login`
2. Allez à "Services"
3. Remplissez: Nom, Description, Durée (min), Prix (€)
4. Cliquez "Ajouter le service"

### Q: Comment modifier les horaires?
**A:**
1. Admin → "Salon" → "Horaires d'ouverture"
2. Configurez chaque jour (Lundi-Dimanche)
3. Vous pouvez marquer un jour comme "Fermé"
4. Cliquez "Enregistrer les horaires"

### Q: Comment changer les infos du salon?
**A:**
1. Admin → "Salon" → "Informations du salon"
2. Modifiez: Nom, Téléphone, Email, Adresse, Description
3. Cliquez "Enregistrer les informations"

### Q: Quel est le mot de passe admin par défaut?
**A:** `admin123` (configurable dans .env avec la clé `ADMIN_PASSWORD`)

### Q: Comment voir les réservations d'aujourd'hui?
**A:**
1. Connectez-vous admin
2. Dashboard affiche automatiquement les réservations d'aujourd'hui
3. Vous pouvez aussi aller à "Gestion RDV" pour voir toutes les réservations

---

## SMS (Twilio)

### Q: Comment activer les SMS?
**A:**
1. Créez un compte Twilio: https://www.twilio.com
2. Achetez un numéro de téléphone
3. Récupérez votre Account SID et Auth Token
4. Ajoutez dans `.env`:
```env
TWILIO_ACCOUNT_SID=votre_sid
TWILIO_AUTH_TOKEN=votre_token
TWILIO_PHONE_NUMBER=+1234567890
```
5. Redémarrez le backend

### Q: Que faire si les SMS ne s'envoient pas?
**A:**
1. Vérifiez que Twilio est bien configuré dans .env
2. Vérifiez les logs du backend pour les erreurs
3. Assurez-vous que le numéro Twilio est activé
4. Vérifiez que le numéro client est au bon format

### Q: Quand sont envoyés les SMS?
**A:**
- SMS de **confirmation**: Immédiatement après la réservation
- SMS de **rappel**: Tous les jours à 10h00 pour les RDV de demain
- SMS d'**annulation**: Quand vous annulez une RDV (admin)

### Q: Combien coûtent les SMS?
**A:** Environ 0.01€ par SMS avec Twilio (peut varier selon le pays)

---

## Base de Données

### Q: Comment sauvegarder ma base de données?
**A:**
```bash
# Linux/macOS
pg_dump -U postgres ays_coiffure > backup.sql

# Windows
# Utilisez pgAdmin ou le shell PostgreSQL
```

### Q: Comment restaurer une sauvegarde?
**A:**
```bash
psql -U postgres ays_coiffure < backup.sql
```

### Q: Comment voir les données de la base?
**A:**
```bash
psql -U postgres -d ays_coiffure
# Puis:
SELECT * FROM reservations;
SELECT * FROM services;
# etc.
```

### Q: Puis-je changer le nom de la base de données?
**A:** Oui, modifiez dans `.env`:
```env
DB_NAME=mon_nouveau_nom
```
Puis créez la nouvelle base: `createdb mon_nouveau_nom`

---

## Sécurité & Admin

### Q: Comment changer le mot de passe admin?
**A:** Modifiez `.env`:
```env
ADMIN_PASSWORD=mon_nouveau_password
```
Redémarrez le backend.

### Q: Comment ajouter un numéro à la liste rouge?
**A:**
1. Admin → "Liste Rouge"
2. Entrez le numéro de téléphone
3. Entrez une raison (optionnel)
4. Cliquez "Ajouter"

Ces numéros ne pourront plus prendre de RDV.

### Q: Comment retirer un numéro de la liste rouge?
**A:**
1. Admin → "Liste Rouge"
2. Trouvez le numéro dans la liste
3. Cliquez "Retirer"

### Q: Comment voir l'historique des réservations d'un client?
**A:** (Fonctionnalité future - à développer)

### Q: Comment exporter les réservations?
**A:** (Fonctionnalité future - à développer)

---

## Personnalisation

### Q: Comment changer les couleurs?
**A:** Éditez `frontend/src/styles/global.css`:
```css
:root {
  --primary-color: #2c3e50;    /* Couleur principale */
  --secondary-color: #e74c3c;  /* Couleur secondaire */
  --accent-color: #3498db;     /* Couleur accent */
}
```

### Q: Comment ajouter mon logo?
**A:**
1. Mettez votre logo dans `frontend/public/logo.png`
2. Modifiez `Navbar.js` pour l'afficher

### Q: Comment personnaliser les messages SMS?
**A:** Éditez `backend/services/smsService.js`:
```javascript
const message = `Votre message personnalisé ici`;
```

### Q: Comment traduire en d'autres langues?
**A:** (Fonctionnalité future - nécessite un système i18n)

---

## Déploiement

### Q: Où puis-je héberger le projet?
**A:**
- **Backend**: Heroku (gratuit), DigitalOcean (5€/mois), AWS
- **Frontend**: Netlify (gratuit), Vercel (gratuit), GitHub Pages
- **Database**: PostgreSQL sur AWS RDS, Heroku, ou DigitalOcean

### Q: Comment déployer sur Heroku?
**A:** Consultez `DEPLOYMENT.md` pour les instructions complètes

### Q: Combien ça coûte de déployer?
**A:**
- Gratuit avec limitations (Heroku, Netlify)
- ~15-20€/mois pour une bonne stabilité (DigitalOcean + DB)
- Plus les SMS (0.01€ chacun)

### Q: Comment configurer un domaine personnalisé?
**A:**
1. Achetez un domaine (Namecheap, GoDaddy, etc.)
2. Pointez les DNS vers votre hébergeur
3. Configurez le certificat SSL
4. Mettez à jour l'URL du backend dans le frontend

---

## Dépannage

### Q: "Cannot connect to PostgreSQL"
**A:**
1. Vérifiez que PostgreSQL s'exécute
2. Vérifiez les credentials dans .env
3. Vérifiez que la base existe: `createdb ays_coiffure`

### Q: "Port 5000 already in use"
**A:**
Changez le port dans `.env`:
```env
PORT=5001
```

### Q: "Cannot find module 'express'"
**A:**
Installez les dépendances:
```bash
cd backend
npm install
```

### Q: "CORS error"
**A:**
Le backend et frontend ne peuvent pas communiquer:
1. Vérifiez que le backend s'exécute sur 5000
2. Vérifiez le proxy dans `frontend/package.json`
3. Consultez les logs backend pour les erreurs

### Q: "JWT token expired"
**A:** 
C'est normal après 24h. Reconnectez-vous admin.

### Q: Les réservations n'apparaissent pas
**A:**
1. Vérifiez que la date sélectionnée est correcte
2. Vérifiez dans la base: `SELECT * FROM reservations;`
3. Redémarrez le frontend

---

## Maintenance

### Q: Comment mettre à jour les dépendances?
**A:**
```bash
# Backend
cd backend && npm update

# Frontend
cd ../frontend && npm update
```

### Q: Comment monitorer en production?
**A:**
Utilisez:
- New Relic
- DataDog
- Sentry pour les erreurs
- CloudFlare pour la CDN

### Q: Comment faire des backups automatiques?
**A:** Sur Linux, ajoutez à crontab:
```bash
0 2 * * * pg_dump -U postgres ays_coiffure | gzip > /backups/ays_$(date +\%Y\%m\%d).sql.gz
```

---

## Améliorations & Nouvelles Fonctionnalités

### Q: Peut-on ajouter les paiements?
**A:** Oui! Intégrez Stripe ou PayPal

### Q: Peut-on ajouter une app mobile?
**A:** Oui! Utilisez React Native

### Q: Peut-on ajouter les avis clients?
**A:** Oui! C'est une amélioration facile à implémenter

### Q: Peut-on intégrer Google Calendar?
**A:** Oui! Consultez l'API Google Calendar

---

## Support & Ressources

### Où trouver de l'aide?
- 📖 Documentation du projet (README, QUICKSTART, etc.)
- 🔍 Stack Overflow
- 💬 GitHub Issues
- 📚 Documentation officielle (React, Express, PostgreSQL, etc.)

### Liens utiles
- React: https://react.dev
- Express: https://expressjs.com
- PostgreSQL: https://www.postgresql.org/docs
- Twilio: https://www.twilio.com/docs
- Heroku: https://devcenter.heroku.com

---

## Encore des questions?

1. Consultez la documentation complète (README.md, etc.)
2. Vérifiez les logs (backend et navigateur)
3. Recherchez sur Google ou Stack Overflow
4. Lisez le code - il est bien commenté!

Bonne chance! 🚀
