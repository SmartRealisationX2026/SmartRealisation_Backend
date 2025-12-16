# 🗄️ Base de Données SmartRealisation - MediLink Platform

Documentation complète pour la configuration et l'utilisation de la base de données PostgreSQL avec le schéma MLD v2.

## 📋 Vue d'ensemble

La base de données SmartRealisation utilise PostgreSQL avec Prisma 7 comme ORM. Le schéma MLD v2 inclut **16 tables principales** avec toutes les relations et contraintes nécessaires pour une plateforme complète de liaison médicamenteuse.

### Tables principales (MLD v2)
- **Utilisateurs & Authentification**
  - `users` - Utilisateurs (Patient, Pharmacien, Admin)
  - `system_audit_logs` - Logs d'audit système

- **Géolocalisation & Adresses**
  - `cities` - Villes du Cameroun
  - `districts` - Quartiers par ville
  - `addresses` - Adresses détaillées

- **Pharmacies & Médicaments**
  - `pharmacies` - Pharmacies avec horaires et services
  - `medication_forms` - Formes galéniques
  - `categories` - Catégories thérapeutiques hiérarchiques
  - `medications` - Catalogue complet des médicaments

- **Stocks & Inventaire**
  - `inventory_items` - Stocks détaillés par pharmacie
  - `price_history` - Historique des prix

- **Recherches & Alertes**
  - `searches` - Historique des recherches géolocalisées
  - `stock_alerts` - Système d'alertes de stock

- **Analytics & Administration**
  - `admin_analytics` - Analyses administratives quotidiennes
+++++++ REPLACE</parameter>

## 🚀 Installation & Configuration

### Prérequis
- PostgreSQL installé localement avec extensions PostGIS et pg_trgm
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

#### Installation des extensions PostgreSQL

Ce projet nécessite les extensions PostgreSQL suivantes pour les fonctionnalités avancées :

- **PostGIS** : Pour les recherches géographiques et les calculs de distance
- **pg_trgm** : Pour la recherche floue (fuzzy search) sur les noms de médicaments

##### Méthode 1 : Via Stack Builder (Recommandé)
1. Ouvrir **Stack Builder** depuis PostgreSQL :
   - `Start → PostgreSQL 17 → Application Stack Builder`
   - Sélectionner votre installation PostgreSQL
   - Aller dans "Spatial Extensions"
   - Cocher "PostGIS 3.5 for PostgreSQL 17"
   - Installer

##### Méthode 2 : Installation manuelle via psql
Si Stack Builder ne fonctionne pas, installer manuellement :

```bash
# Se connecter à PostgreSQL
psql -U postgres -d medilink_db

# Créer les extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

# Vérifier l'installation
SELECT postgis_full_version();
\dx  # Lister les extensions installées
```

##### Vérification
```bash
# Tester PostGIS
psql -U postgres -d medilink_db -c "SELECT postgis_full_version();"

# Tester pg_trgm
psql -U postgres -d medilink_db -c "SELECT 'hello' % 'helo';"
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

## 🏗️ Architecture du schéma MLD v2

### Relations principales
```
users (PATIENT/PHARMACIST/ADMIN)
├── performs ── searches
├── creates ── stock_alerts
├── generates ── system_audit_logs
└── owns ── pharmacies

cities
├── contains ── districts
└── referenced_by ── addresses

districts
└── referenced_by ── addresses

addresses
└── locates ── pharmacies

pharmacies
├── contains ── inventory_items
├── notifies_about ── stock_alerts
└── owned_by ── users (PHARMACIST)

categories (hiérarchique)
├── parent ── categories
└── children ── categories
└── classifies ── medications

medication_forms
└── defines_form_of ── medications

medications
├── belongs_to ── categories
├── has_form ── medication_forms
├── stored_in ── inventory_items
├── searched_for ── searches
└── monitored_by ── stock_alerts

inventory_items
├── belongs_to ── pharmacies
├── contains ── medications
├── tracks ── price_history
└── located_at ── pharmacies

price_history
├── belongs_to ── inventory_items
└── changed_by ── users

searches
├── performed_by ── users (nullable)
└── searches_for ── medications

stock_alerts
├── created_by ── users (nullable)
├── monitors ── medications
└── targets ── pharmacies (nullable)

admin_analytics
└── generated_daily ── (système)

system_audit_logs
├── generated_by ── users
└── tracks_actions_on ── entities
```

### Contraintes importantes
- **Email unique** sur `users`
- **UUID générés automatiquement** pour toutes les clés primaires
- **Cascades configurées** : DELETE CASCADE pour relations fortes, SET NULL pour relations optionnelles
- **Index géographiques** sur latitude/longitude pour recherches spatiales
- **Index composites** sur (city_id, district_id) et (pharmacy_id, medication_id)
- **Contraintes d'unicité** sur (pharmacy_id, medication_id, batch_number)
- **Types énumérés** stricts pour rôles, statuts, canaux de notification
+++++++ REPLACE</parameter>

## 🌱 Données de test (MLD v2)

Le script de seeding crée un jeu de données complet et réaliste pour le développement :

### 📊 Volume de données générées
- **116 utilisateurs** (1 admin, 15 pharmaciens, 100 patients)
- **10 villes** camerounaises avec quartiers
- **45 pharmacies** avec adresses géolocalisées
- **174 médicaments** organisés en catégories thérapeutiques
- **648 éléments d'inventaire** avec gestion des stocks
- **600 recherches** avec géolocalisation
- **300 alertes de stock** configurées
- **1002 logs d'audit** pour traçabilité

### 🏙️ Villes couvertes
Yaoundé, Douala, Bafoussam, Bamenda, Garoua, Maroua, Buea, Limbe, Kribi, Ebolowa

### 💊 Catégories thérapeutiques
- Analgésiques (ANALG)
- Antibiotiques (ANTIB)
- Anti-inflammatoires (ANTI_INFL)
- Vitamines (VIT)
- Cardiovasculaires (CARDIO)
- Dermatologiques (DERM)

### 👥 Comptes de test
| Email | Mot de passe | Rôle |
|-------|-------------|------|
| admin@medilink.cm | password123 | ADMIN |
| pharmacist0@medilink.cm | password123 | PHARMACIST |
| ... | password123 | PHARMACIST |
| pharmacist14@medilink.cm | password123 | PHARMACIST |
| patient0@medilink.cm | password123 | PATIENT |
| ... | password123 | PATIENT |
| patient99@medilink.cm | password123 | PATIENT |

### 🔍 Fonctionnalités testables
- **Recherche géolocalisée** : Recherche de médicaments par proximité
- **Gestion des stocks** : Suivi des quantités et prix par pharmacie
- **Alertes intelligentes** : Notifications de disponibilité
- **Analytics temps réel** : Tableaux de bord administrateur
- **Authentification multi-rôles** : Gestion des permissions

### 🌍 Géolocalisation
- Coordonnées GPS réelles pour toutes les villes camerounaises
- Adresses détaillées avec landmarks et codes postaux
- Calculs de distance pour recherche par rayon
+++++++ REPLACE</parameter>

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

## ⚠️ Points d'attention MLD v2

### Données géographiques
- **Coordonnées GPS réelles** pour 10 villes camerounaises majeures
- **Adresses détaillées** avec landmarks et quartiers spécifiques
- **Calculs de proximité** pour recherche par rayon géographique

### Données métier
- **Prix en FCFA** (Franc CFA) avec historique de variations
- **Téléphones camerounais** format +237 avec validation
- **Horaires d'ouverture** en UTC avec conversion locale possible
- **Lots et péremption** pour traçabilité pharmaceutique

### Architecture technique
- **UUID v4** générés automatiquement pour toutes les entités
- **Prisma 7** avec adaptateur PostgreSQL pour optimisation
- **Index composites** pour recherches multi-critères
- **Cascades configurées** pour intégrité référentielle

### Sécurité & Conformité
- **Encodage UTF-8** complet pour support français/anglais
- **Logs d'audit** traçant toutes les actions utilisateur
- **Rôles stricts** : PATIENT, PHARMACIST, ADMIN
- **Mots de passe hashés** avec bcrypt (salt rounds: 10)

### Performance
- **Index géographiques** pour recherches spatiales rapides
- **Index sur colonnes fréquentes** (email, rôle, dates, coordonnées)
- **Batch processing** dans les seeds pour optimisation
- **Relations optimisées** avec clés étrangères appropriées

## 🐛 Dépannage

### Erreur de connexion
```bash
# Vérifier PostgreSQL
pg_isready -h localhost -p 5432

# Vérifier credentials
psql -U medilink_user -d medilink_db -c "SELECT version();"
```

### Erreur de migration "extension postgis is not available"
**Cause** : PostGIS n'est pas installé sur PostgreSQL
**Solution** :
1. Installer PostGIS via Stack Builder ou manuellement (voir section Installation des extensions)
2. Redémarrer PostgreSQL si nécessaire
3. Réessayer la migration

### Erreur "Drift detected" / "Schema drift"
**Cause** : Le schéma de la base ne correspond pas à l'historique des migrations Prisma
**Solutions** :
```bash
# Option 1: Reset complet (recommandé pour développement)
npx prisma migrate reset

# Option 2: Marquer le schéma actuel comme baseline (conserve les données)
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > baseline.sql
npx prisma db execute --file baseline.sql
npx prisma migrate resolve --applied [migration_name]
```

### Erreur Prisma Accelerate / Hosted database
**Cause** : Utilisation de Prisma Accelerate qui ne supporte pas certaines extensions
**Solution** : Basculer vers PostgreSQL local avec PostGIS installé

### Extensions non trouvées après installation
```bash
# Vérifier les extensions disponibles
psql -U postgres -d medilink_db -c "\dx"

# Créer manuellement si nécessaire
psql -U postgres -d medilink_db -c "CREATE EXTENSION IF NOT EXISTS postgis;"
psql -U postgres -d medilink_db -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;"
```

### Problème de seeds
```bash
# Vérifier les imports
npx tsc --noEmit prisma/seed.ts

# Lancer manuellement
npm run db:seed
```

### Vérification complète du setup
```bash
# 1. Vérifier PostgreSQL
pg_isready -h localhost -p 5432

# 2. Tester connexion
psql -U medilink_user -d medilink_db -c "SELECT version();"

# 3. Vérifier extensions
psql -U medilink_user -d medilink_db -c "SELECT name FROM pg_available_extensions WHERE name IN ('postgis', 'pg_trgm');"

# 4. Tester PostGIS
psql -U medilink_user -d medilink_db -c "SELECT postgis_full_version();"

# 5. Tester pg_trgm
psql -U medilink_user -d medilink_db -c "SELECT 'hello' % 'helo';"

# 6. Générer client Prisma
npm run db:generate

# 7. Tester migration
npx prisma migrate dev --create-only

# 8. Tester seeds
npm run db:seed
```
