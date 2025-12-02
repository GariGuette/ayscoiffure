# Installation de PostgreSQL et préparation

## Windows

### 1. Installer PostgreSQL
1. Téléchargez depuis: https://www.postgresql.org/download/windows/
2. Lancez l'installateur
3. Notez le mot de passe du super-utilisateur postgres
4. Port par défaut: 5432
5. Finissez l'installation

### 2. Créer la base de données
Ouvrez "SQL Shell (psql)" ou utilisez:
```bash
createdb ays_coiffure
```

### 3. Vérifier la connexion
```bash
psql -U postgres -d ays_coiffure
```

## macOS

```bash
# Installer via Homebrew
brew install postgresql@15

# Démarrer PostgreSQL
brew services start postgresql@15

# Créer la base
createdb ays_coiffure
```

## Linux (Ubuntu/Debian)

```bash
# Installer
sudo apt install postgresql postgresql-contrib

# Démarrer le service
sudo systemctl start postgresql

# Créer la base
sudo -u postgres createdb ays_coiffure
```

## Configuration Node.js

1. Téléchargez Node.js LTS: https://nodejs.org/
2. Installez
3. Vérifiez: `node --version`

## Configuration d'un compte Twilio (optionnel pour SMS)

1. Allez sur https://www.twilio.com/console
2. Créez un compte gratuit
3. Achetez un numéro de téléphone
4. Obtenez vos credentials:
   - Account SID
   - Auth Token
5. Ajoutez dans `.env`

## Vérification

```bash
# Vérifier PostgreSQL
psql -U postgres -d ays_coiffure -c "SELECT 1"

# Vérifier Node.js
node -v
npm -v

# Installer backend
cd backend
npm install

# Installer frontend
cd ../frontend
npm install
```

Tout est prêt! Lancez avec:
- Terminal 1: `cd backend && npm run dev`
- Terminal 2: `cd frontend && npm start`
