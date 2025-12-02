# ⚙️ GUIDE DE CONFIGURATION PERSONNALISÉE

Ce guide vous aidera à personnaliser le projet avec vos informations spécifiques.

## 1️⃣ Informations du Salon

### Modifier dans `.env`

```env
SALON_NAME=AYS Coiffure
SALON_PHONE=+33123456789
SALON_EMAIL=contact@ayscoiffure.fr
```

### Modifier dans la base (une fois le serveur lancé)

Allez sur `http://localhost:3000/admin/login` → "Salon" et remplissez:
- Nom
- Téléphone
- Email
- Adresse
- Description

## 2️⃣ Services Proposés

### Ajouter vos services

1. Connectez-vous à l'admin: `http://localhost:3000/admin/login`
2. Allez à "Services"
3. Ajoutez chacun de vos services:
   - **Coupe Homme**: 30 min, 15€
   - **Coupe Femme**: 45 min, 25€
   - **Coloration**: 60 min, 40€
   - Etc.

### Ou insérer en base de données

```bash
cd backend
psql -U postgres -d ays_coiffure -f init-data.sql
```

## 3️⃣ Horaires d'Ouverture

### Via l'interface admin

1. Admin → "Salon" → "Horaires d'ouverture"
2. Configurez pour chaque jour:
   - Lundi à Vendredi: 09:00 - 18:00
   - Samedi: 10:00 - 16:00
   - Dimanche: Fermé (cochez "Fermé")

### Par jour de la semaine

```
0 = Lundi
1 = Mardi
2 = Mercredi
3 = Jeudi
4 = Vendredi
5 = Samedi
6 = Dimanche
```

## 4️⃣ Mot de Passe Admin

### Changez le mot de passe par défaut

1. Modifiez `.env`:
```env
ADMIN_PASSWORD=votre_nouveau_password
```

2. Redémarrez le backend:
```bash
npm run dev
```

⚠️ **IMPORTANT**: N'oubliez pas votre mot de passe!

## 5️⃣ Intégration SMS (Twilio)

### Si vous voulez utiliser les SMS

1. Créez un compte: https://www.twilio.com
2. Obtenez votre Account SID et Auth Token
3. Achetez un numéro de téléphone
4. Ajoutez dans `.env`:
```env
TWILIO_ACCOUNT_SID=votre_sid
TWILIO_AUTH_TOKEN=votre_token
TWILIO_PHONE_NUMBER=+1234567890
```
5. Redémarrez le backend

### Tester les SMS

```bash
# Dans votre terminal backend, vérifiez les logs
# Vous devriez voir le SID si ça fonctionne
```

## 6️⃣ Personnaliser le Design

### Couleurs principales

Éditez `frontend/src/styles/global.css`:

```css
:root {
  --primary-color: #2c3e50;      /* Bleu foncé */
  --secondary-color: #e74c3c;    /* Rouge */
  --accent-color: #3498db;       /* Bleu clair */
  --success-color: #27ae60;      /* Vert */
  --danger-color: #c0392b;       /* Rouge sombre */
}
```

### Logo et images

1. Ajoutez votre logo dans `frontend/public/`
2. Importez-le dans `Navbar.js`:
```jsx
<img src="/logo.png" alt="Logo" />
```

## 7️⃣ Configuration de la Base de Données

### Changer le port ou le nom

Éditez `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mon_salon_coiffure
DB_USER=postgres
DB_PASSWORD=mon_password
```

Créez la nouvelle base:
```bash
createdb mon_salon_coiffure
```

## 8️⃣ Ajouter Plus de Fonctionnalités

### Paiements (Stripe)

1. Installez: `npm install stripe`
2. Créez un compte Stripe
3. Ajoutez à la route `/reservations`:
```javascript
const stripe = require('stripe')(process.env.STRIPE_KEY);
// Ajouter le paiement
```

### Avis des clients

Ajoutez une table:
```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  reservation_id INT REFERENCES reservations(id),
  rating INT,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 9️⃣ Deployer sur le Web

### Heroku (Backend)

```bash
# Créez une app
heroku create mon-salon

# Configurez la BD
heroku addons:create heroku-postgresql

# Déployez
git push heroku main
```

### Netlify (Frontend)

1. Push sur GitHub
2. Connectez Netlify à votre repo
3. Build: `npm run build`
4. Deploy automatique

## 🔟 Maintenance

### Sauvegarder la base

```bash
# Linux/macOS
pg_dump -U postgres ays_coiffure > backup.sql

# Windows (depuis psql)
\copy (SELECT * FROM reservations) TO 'C:\backups\reservations.csv' CSV HEADER
```

### Restaurer

```bash
psql -U postgres ays_coiffure < backup.sql
```

### Mettre à jour les dépendances

```bash
# Backend
cd backend && npm update

# Frontend
cd ../frontend && npm update
```

## 🎨 Exemples de Personnalisation

### Changer le titre du site

`frontend/public/index.html`:
```html
<title>Mon Salon de Coiffure</title>
```

### Ajouter un lien externe

`frontend/src/components/Navbar.js`:
```jsx
<a href="https://instagram.com/mon_salon" target="_blank">Instagram</a>
```

### Personnaliser le message de confirmation

`backend/services/smsService.js`:
```javascript
const message = `Merci! Votre RDV est confirmé pour le ${date} à ${time}.`;
```

## 📋 Checklist de Personnalisation

- [ ] Informations du salon configurées
- [ ] Services personnalisés
- [ ] Horaires définis
- [ ] Mot de passe admin changé
- [ ] SMS configuré (optionnel)
- [ ] Design personnalisé
- [ ] Testé en local
- [ ] Déployé en ligne
- [ ] Domaine configuré
- [ ] SSL/HTTPS activé

## 🆘 Problèmes Courants

### Le SMS ne fonctionne pas
→ Vérifiez vos credentials Twilio dans .env

### Le design ne change pas
→ Videz le cache du navigateur (Ctrl+Shift+Suppr)

### Erreur de connexion BD
→ Vérifiez que PostgreSQL s'exécute

### Admin ne peut pas se connecter
→ Vérifiez le mot de passe dans .env

## 📞 Support

Pour chaque problème, consultez:
1. Les logs backend/frontend
2. La console du navigateur (F12)
3. La documentation appropriée

Bon développement! 🚀
