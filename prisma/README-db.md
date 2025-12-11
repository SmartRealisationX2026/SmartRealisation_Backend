# 🗄️ Base de Données MediLink

Documentation complète pour la configuration et l'utilisation de la base de données PostgreSQL.

## 📋 Vue d'ensemble

La base de données MediLink utilise PostgreSQL avec Prisma comme ORM. Le schéma inclut 7 tables principales avec toutes les relations et contraintes nécessaires.

### Tables principales
- `users` - Utilisateurs (Patient, Pharmacien, Admin)
- `pharmacies` - Pharmacies avec géolocalisation
- `medications` - Catalogue des médicaments
- `stocks` - Stocks par pharmacie
- `searches` - Historique des recherches
- `alerts` - Système d'alertes
- `audit_logs` - Logs d'audit

## 🚀 Installation & Configuration

### Prérequis
- PostgreSQL installé localement
- Node.js et npm installés
- Dépendances du projet installées (`npm install`)

### Configuration rapide

1. **Copier le fichier d'environnement** :
   ```bash
   cp .env.example .env
   # Éditer .env avec vos credentials PostgreSQL
   ```

2. **Initialiser la base de données** :
   ```bash
   bash prisma/scripts/init-db.sh
   ```

3. **Générer le client Prisma** :
   ```bash
   npm run db:generate
   ```

4. **Créer et appliquer les migrations** :
   ```bash
   npm run db:migrate
   ```

5. **Peupler avec des données de test** :
   ```bash
   npm run db:seed
   ```

## 📊 Scripts disponibles

### Scripts npm
```bash
# Génération du client Prisma
npm run db:generate

# Migration en développement
npm run db:migrate

# Push direct du schéma (développement uniquement)
npm run db:push

# Exécution des seeds
npm run db:seed

# Interface graphique Prisma
npm run db:studio

# Reset complet de la base (⚠️ ATTENTION)
npm run db:reset
```

### Scripts bash
```bash
# Initialisation de la base (création DB + user)
bash prisma/scripts/init-db.sh

# Reset complet (⚠️ SUPPRIME TOUTES LES DONNÉES)
bash prisma/scripts/reset-db.sh
```

### Scripts SQL
```bash
# Validation de la structure
psql -d medilink_db -f prisma/scripts/validate.sql
```

## 🔧 Configuration détaillée

### Variables d'environnement (.env)
```env
DATABASE_URL="postgresql://username:password@localhost:5432/medilink_db?schema=public"
```

### Credentials par défaut
- **Utilisateur** : `medilink_user`
- **Mot de passe** : `medilink123`
- **Base** : `medilink_db`
- **Port** : `5432` (PostgreSQL par défaut)

## 🏗️ Architecture du schéma

### Relations principales
```
users (PATIENT/PHARMACIST/ADMIN)
├── owns ── pharmacies
├── performs ── searches
└── subscribes ── alerts

pharmacies
├── contains ── stocks
└── notifies ── alerts

medications
└── has ── stocks

stocks (relation many-to-many entre pharmacies et medications)
```

### Contraintes importantes
- Email unique sur `users`
- FK avec CASCADE/SET NULL selon logique métier
- Index sur colonnes fréquemment recherchées
- Géolocalisation stockée en JSON pour flexibilité

## 🌱 Données de test

Le script de seeding crée :
- **1 admin** (admin@medilink.cm)
- **2 pharmaciens** avec leurs pharmacies
- **2 patients** avec coordonnées GPS
- **5 médicaments** courants
- **6 entrées de stock** avec prix en FCFA
- **2 recherches** (une authentifiée, une anonyme)
- **2 alertes** (une avec compte, une anonyme)
- **1 log d'audit**

### Comptes de test
| Email | Mot de passe | Rôle |
|-------|-------------|------|
| admin@medilink.cm | password123 | ADMIN |
| pharmacist1@medilink.cm | password123 | PHARMACIST |
| pharmacist2@medilink.cm | password123 | PHARMACIST |
| patient1@medilink.cm | password123 | PATIENT |
| patient2@medilink.cm | password123 | PATIENT |

## 🔍 Validation et débogage

### Vérifier la structure
```bash
psql -d medilink_db -f prisma/scripts/validate.sql
```

### Interface graphique
```bash
npm run db:studio
```

### Logs Prisma
```bash
DEBUG="*" npm run db:migrate
```

## 🚀 Déploiement

### Production
1. Variables d'environnement sécurisées
2. Utilisateur PostgreSQL dédié avec droits limités
3. Migrations appliquées en CI/CD
4. Sauvegarde automatique configurée

### Développement
1. Script `init-db.sh` pour setup rapide
2. Seeds pour données de test cohérentes
3. Reset possible avec `reset-db.sh`

## 📝 Migration future

Pour ajouter/modifier le schéma :
1. Modifier `prisma/schema.prisma`
2. Générer migration : `npx prisma migrate dev --name description`
3. Tester en développement
4. Appliquer en production

## ⚠️ Points d'attention

- **Géolocalisation** : Utilise des coordonnées GPS réelles (Douala, Yaoundé)
- **Devise** : Prix en FCFA (Franc CFA)
- **Téléphones** : Format camerounais (+237)
- **Encodage** : UTF-8 pour support français
- **Timezones** : UTC avec conversion locale si nécessaire

## 🐛 Dépannage

### Erreur de connexion
```bash
# Vérifier PostgreSQL
pg_isready -h localhost -p 5432

# Vérifier credentials
psql -U medilink_user -d medilink_db -c "SELECT version();"
```

### Erreur de migration
```bash
# Reset et re-migration
npm run db:reset
npm run db:migrate
```

### Problème de seeds
```bash
# Vérifier les imports
npx tsc --noEmit prisma/seed.ts

# Lancer manuellement
npm run db:seed
