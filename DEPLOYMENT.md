# Déploiement en ligne

## Déploiement du Backend

### Option 1: Heroku (Gratuit avec limitations)

```bash
# 1. Installez Heroku CLI
# 2. Connectez-vous
heroku login

# 3. Créez l'application
heroku create nom-de-votre-app

# 4. Ajoutez PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# 5. Configurez les variables d'environnement
heroku config:set JWT_SECRET=votre_secret
heroku config:set ADMIN_PASSWORD=votre_password
heroku config:set TWILIO_ACCOUNT_SID=votre_sid
heroku config:set TWILIO_AUTH_TOKEN=votre_token

# 6. Déployez
git push heroku main

# 7. Vérifiez
heroku open
```

### Option 2: DigitalOcean (Recommandé)

1. Créez un Droplet (5€/mois)
2. Installez Node.js et PostgreSQL
3. Clonez le repo
4. Configurez les variables d'environnement
5. Utilisez PM2 pour maintenir le service:
```bash
npm install -g pm2
pm2 start server.js
```

### Option 3: AWS

1. EC2: Créez une instance
2. RDS: Créez une base PostgreSQL
3. Configurez les groupe de sécurité
4. Déployez via Git

## Déploiement du Frontend

### Option 1: Netlify (Recommandé)

1. Buildez: `npm run build`
2. Allez sur https://netlify.com
3. Drag & drop le dossier `build/`
4. Configurez les variables d'environnement:
   - `REACT_APP_API_URL=https://votre-backend.com`

### Option 2: Vercel

1. Push sur GitHub
2. Connectez Vercel à votre repo
3. Déploiement automatique à chaque push

### Option 3: GitHub Pages

```bash
npm run build
# Uploadez le dossier build sur GitHub Pages
```

## Configuration post-déploiement

### 1. Base de données
```bash
# Sur votre serveur, exécutez:
psql -U postgres -d ays_coiffure -f init-data.sql
```

### 2. Variables d'environnement
Définissez toutes les variables de `.env.example`

### 3. HTTPS
Utilisez Let's Encrypt:
```bash
certbot certonly --standalone -d votre-domaine.com
```

### 4. Domaine personnalisé
- Achetez un domaine (Namecheap, GoDaddy, etc.)
- Pointez les DNS vers votre hébergeur
- Configurez le certificat SSL

## Monitoring

### Logs
```bash
# Heroku
heroku logs --tail

# DigitalOcean/AWS
pm2 logs
```

### Performance
- Utilisez New Relic ou DataDog
- Configurez les alertes

## Base de données en production

### Backups PostgreSQL
```bash
# Créer un backup
pg_dump -U postgres ays_coiffure > backup.sql

# Restaurer
psql -U postgres ays_coiffure < backup.sql
```

### Automiser les backups
```bash
# Sur Linux, ajoutez à crontab
0 2 * * * pg_dump -U postgres ays_coiffure | gzip > /backups/ays_$(date +\%Y\%m\%d).sql.gz
```

## Checklist de déploiement

- [ ] Variables d'environnement configurées
- [ ] Base de données initialisée
- [ ] Certificat SSL/HTTPS
- [ ] Domaine pointant vers l'app
- [ ] Backups automatiques
- [ ] Monitoring et logs
- [ ] Email de contact testé
- [ ] SMS testé (si Twilio)
- [ ] Performance testée
- [ ] Sécurité vérifiée

## Coûts estimés

- **Backend**: 5€/mois (DigitalOcean)
- **Frontend**: Gratuit (Netlify/Vercel)
- **Database**: Inclus ou 10€/mois
- **Domaine**: 10€/an
- **SMS**: 0.01€/SMS (Twilio)
- **Total**: ~15€/mois + SMS

## Exemple avec DigitalOcean

```bash
# Sur votre Droplet
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs postgresql postgresql-contrib

# Cloner le projet
git clone <votre-repo>
cd AYS\ Coiffure/backend
npm install
npm run dev

# Accédez via IP ou domaine
```
