# 🎯 Core - Couche Domaine

## 📋 Vue d'ensemble

Le répertoire `core/` contient la **couche domaine** de l'application, c'est-à-dire les abstractions et les entités métier qui sont indépendantes de l'infrastructure. Cette couche ne dépend d'aucune autre couche du projet.

## 📂 Structure

```
core/
├── entities/          # Entités métier (modèles de domaine)
├── repositories/      # Interfaces abstraites des repositories
├── dtos/              # Objets de transfert de données
│   ├── request/       # DTOs pour les requêtes
│   └── response/      # DTOs pour les réponses
└── utils/             # Utilitaires partagés
```

## 🎯 Principes

### Indépendance
- **Aucune dépendance** vers les frameworks (NestJS, Prisma, etc.)
- **Interfaces pures** : Pas d'implémentation concrète
- **Entités métier** : Représentent les concepts du domaine

### Réutilisabilité
- Les abstractions peuvent être réutilisées dans différents contextes
- Les DTOs sont partagés entre les couches
- Les utilitaires sont indépendants du contexte

## 📁 Détails par sous-répertoire

### 1. **Entities** (`entities/`)

Les entités représentent les modèles de domaine de l'application. Elles sont des classes TypeScript simples qui définissent la structure des données métier.

**Exemple** : `user.entity.ts`
```typescript
export class User {
  id: string;
  email: string;
  role: UserRole;
  fullName: string;
  // ...
}
```

**Entités disponibles** :
- `User` - Utilisateur (Patient, Pharmacien, Admin)
- `Pharmacy` - Pharmacie
- `Medication` - Médicament
- `Category` - Catégorie thérapeutique
- `InventoryItem` - Article d'inventaire
- `Address` - Adresse
- `City` - Ville
- `District` - District/Quartier
- `Search` - Recherche
- `StockAlert` - Alerte de stock
- `PriceHistory` - Historique des prix
- `AdminAnalytics` - Analytics administrateur
- `SystemAuditLog` - Log d'audit

👉 Voir [entities/README.md](./entities/README.md) pour plus de détails

### 2. **Repositories** (`repositories/`)

Les repositories sont des **interfaces abstraites** qui définissent les contrats pour l'accès aux données. Elles ne contiennent aucune implémentation.

**Exemple** : `user-repository.ts`
```typescript
export abstract class UserRepository {
  abstract findOne(id: string): Promise<User | null>;
  abstract create(user: CreateUserDto): Promise<User>;
  // ...
}
```

**Principe** : L'inversion de dépendance permet de :
- Définir le contrat dans `core/`
- Implémenter dans `use-cases/*/repositories/`
- Faciliter les tests avec des mocks

**Repositories disponibles** :
- `UserRepository`
- `AuthRepository`
- `PharmacyRepository`
- `MedicationRepository`
- `CategoryRepository`
- `InventoryItemRepository`
- `SearchRepository`
- `StockAlertRepository`
- `PriceHistoryRepository`
- `AddressRepository`
- `CityRepository`
- `DistrictRepository`
- `AdminAnalyticsRepository`
- `SystemAuditLogRepository`

👉 Voir [repositories/README.md](./repositories/README.md) pour plus de détails

### 3. **DTOs** (`dtos/`)

Les DTOs (Data Transfer Objects) sont des objets utilisés pour transférer des données entre les couches, notamment entre les controllers et les services.

**Structure** :
- `request/` - DTOs pour les requêtes HTTP (Create, Update)
- `response/` - DTOs pour les réponses HTTP

**Exemple** : `request/user.dto.ts`
```typescript
export class CreateUserDto {
  email: string;
  password: string;
  role: UserRole;
  fullName: string;
}
```

**Types de DTOs** :
- **Create DTOs** : Pour la création d'entités
- **Update DTOs** : Pour la mise à jour d'entités
- **Response DTOs** : Pour les réponses formatées
- **Query DTOs** : Pour les paramètres de recherche

👉 Voir [dtos/README.md](./dtos/README.md) pour plus de détails

### 4. **Utils** (`utils/`)

Utilitaires partagés utilisables dans toute l'application.

**Utilitaires disponibles** :
- `sanitizeFileName.ts` - Nettoyage de noms de fichiers

## 🔄 Flux d'utilisation

```
1. Controller reçoit une requête HTTP
   ↓
2. Controller utilise un DTO (request) pour valider les données
   ↓
3. Controller appelle le Service (use-case)
   ↓
4. Service utilise l'interface Repository (core)
   ↓
5. L'implémentation concrète du Repository (use-cases) accède aux données
   ↓
6. Les données sont retournées sous forme d'Entity (core)
   ↓
7. Controller retourne une réponse avec un DTO (response)
```

## ✅ Bonnes pratiques

### ✅ À faire
- Définir les interfaces dans `repositories/`
- Utiliser les entités pour représenter le domaine
- Créer des DTOs pour chaque opération
- Exporter via `index.ts` pour faciliter les imports

### ❌ À éviter
- Importer des dépendances externes (Prisma, NestJS)
- Ajouter de la logique métier dans les entités
- Créer des dépendances circulaires
- Mélanger les abstractions et les implémentations

## 🔗 Liens

- [Entities](./entities/README.md)
- [Repositories](./repositories/README.md)
- [DTOs](./dtos/README.md)
- [Utils](./utils/README.md)

