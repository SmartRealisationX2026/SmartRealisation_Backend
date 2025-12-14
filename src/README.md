# 📁 Architecture du Projet SmartRealisation Backend

## 🏗️ Vue d'ensemble

Ce projet suit une architecture **Clean Architecture / Hexagonal Architecture** avec NestJS, organisant le code en couches distinctes pour une meilleure maintenabilité et testabilité.

## 📂 Structure des répertoires

```
src/
├── core/              # Couche domaine (entities, repositories abstraits, DTOs)
├── use-cases/         # Cas d'utilisation métier (services, repositories concrets)
├── controllers/       # Couche présentation (API REST)
├── frameworks/        # Infrastructure (Prisma, JWT, Mailer)
├── app.module.ts      # Module racine de l'application
└── main.ts            # Point d'entrée de l'application
```

## 🔄 Flux de données

```
Requête HTTP
    ↓
Controller (controllers/)
    ↓
Service/Use Case (use-cases/)
    ↓
Repository (use-cases/*/repositories/)
    ↓
Prisma Service (frameworks/data-services/)
    ↓
Base de données PostgreSQL
```

## 📋 Couches de l'architecture

### 1. **Core** (`src/core/`)
Couche domaine contenant les abstractions et les entités métier.
- **Entities** : Modèles de domaine
- **Repositories** : Interfaces abstraites
- **DTOs** : Objets de transfert de données
- **Utils** : Utilitaires partagés

👉 Voir [core/README.md](./core/README.md) pour plus de détails

### 2. **Use Cases** (`src/use-cases/`)
Couche applicative contenant la logique métier.
- **Services** : Implémentation des cas d'utilisation
- **Repositories** : Implémentations concrètes des repositories
- **Modules** : Configuration NestJS par domaine

👉 Voir [use-cases/README.md](./use-cases/README.md) pour plus de détails

### 3. **Controllers** (`src/controllers/`)
Couche présentation gérant les requêtes HTTP.
- **Endpoints REST** : Routes API
- **Validation** : Validation des données d'entrée
- **Swagger** : Documentation API automatique

👉 Voir [controllers/README.md](./controllers/README.md) pour plus de détails

### 4. **Frameworks** (`src/frameworks/`)
Couche infrastructure contenant les implémentations techniques.
- **Data Services** : Prisma ORM
- **Auth Services** : JWT, Guards, Strategies
- **Mailer** : Service d'envoi d'emails

👉 Voir [frameworks/README.md](./frameworks/README.md) pour plus de détails

## 🎯 Principes de l'architecture

### Séparation des responsabilités
- Chaque couche a une responsabilité claire
- Les dépendances vont toujours vers le centre (Core)
- Les couches externes dépendent des couches internes, jamais l'inverse

### Inversion de dépendance
- Les repositories abstraits sont dans `core/`
- Les implémentations concrètes sont dans `use-cases/`
- Les modules NestJS utilisent l'injection de dépendance

### Testabilité
- Les abstractions permettent le mocking facile
- Chaque couche peut être testée indépendamment
- Les tests unitaires et d'intégration sont séparés

## 🔌 Modules disponibles

### Modules métier
- `UserUseCasesModule` - Gestion des utilisateurs
- `AuthCaseModule` - Authentification
- `PharmacyModule` - Gestion des pharmacies
- `MedicationModule` - Catalogue des médicaments
- `CategoryModule` - Catégories thérapeutiques
- `MedicationFormModule` - Formes galéniques
- `InventoryItemModule` - Gestion des stocks
- `SearchModule` - Recherche géolocalisée
- `StockAlertModule` - Alertes de stock
- `PriceHistoryModule` - Historique des prix

### Modules géographiques
- `AddressModule` - Adresses
- `CityModule` - Villes
- `DistrictModule` - Districts/Quartiers

### Modules administratifs
- `AdminAnalyticsModule` - Analytics administrateur
- `SystemAuditLogModule` - Logs d'audit

## 🚀 Démarrage rapide

### Installation
```bash
npm install
```

### Configuration
```bash
cp .env.example .env
# Éditer .env avec vos configurations
```

### Base de données
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### Démarrage
```bash
npm run start:dev
```

### Documentation API
Une fois l'application démarrée, accédez à :
- Swagger UI : `http://localhost:3000/api`

## 📚 Documentation par répertoire

- [Core](./core/README.md) - Couche domaine
- [Use Cases](./use-cases/README.md) - Logique métier
- [Controllers](./controllers/README.md) - API REST
- [Frameworks](./frameworks/README.md) - Infrastructure

## 🔒 Sécurité

- **JWT** : Authentification par tokens
- **Guards** : Protection des routes
- **Validation** : Validation des données d'entrée
- **Hashing** : Mots de passe hashés avec bcrypt

## 🧪 Tests

```bash
# Tests unitaires
npm test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:cov
```

## 📝 Conventions de code

- **Naming** : PascalCase pour les classes, camelCase pour les variables
- **Structure** : Un module = un domaine métier
- **Imports** : Utiliser les index.ts pour les exports groupés
- **Documentation** : Swagger pour l'API, JSDoc pour le code

