# 🔌 Repositories - Interfaces Abstraites

## 📋 Vue d'ensemble

Les repositories dans `core/repositories/` sont des **interfaces abstraites** qui définissent les contrats pour l'accès aux données. Elles suivent le principe de l'**Inversion de Dépendance (Dependency Inversion)**.

## 🎯 Principe

### Inversion de Dépendance
```
❌ Sans inversion :
Service → Repository concret → Base de données

✅ Avec inversion :
Service → Interface Repository (core) ← Implémentation (use-cases)
```

**Avantages** :
- **Testabilité** : Facile de créer des mocks
- **Flexibilité** : Changer d'implémentation sans modifier le service
- **Séparation** : Le domaine ne dépend pas de l'infrastructure

## 📁 Repositories disponibles

### 👤 Utilisateurs & Authentification

#### `user-repository.ts`
Interface pour la gestion des utilisateurs.

**Méthodes** :
- `findOne(id: string): Promise<User | null>`
- `findByEmail(email: string): Promise<User | null>`
- `create(user: CreateUserDto): Promise<User>`
- `update(id: string, user: UpdateUserDto): Promise<User>`
- `delete(id: string): Promise<void>`
- `findAll(): Promise<User[]>`
- `findByRole(role: UserRole): Promise<User[]>`
- `findActiveUsers(): Promise<User[]>`

#### `auth-repository.ts`
Interface pour l'authentification.

**Méthodes** :
- `login(email: string, password: string): Promise<User | null>`
- `verifyAuth(token: string): Promise<User | null>`

### 🏥 Pharmacies & Géolocalisation

#### `pharmacy-repository.ts`
Interface pour la gestion des pharmacies.

#### `address-repository.ts`
Interface pour la gestion des adresses.

#### `city-repository.ts`
Interface pour la gestion des villes.

#### `district-repository.ts`
Interface pour la gestion des districts.

### 💊 Médicaments & Catalogue

#### `medication-repository.ts`
Interface pour la gestion des médicaments.

#### `category-repository.ts`
Interface pour la gestion des catégories.

#### `medication-form-repository.ts`
Interface pour la gestion des formes galéniques.

### 📦 Inventaire & Stocks

#### `inventory-item-repository.ts`
Interface pour la gestion des articles d'inventaire.

#### `price-history-repository.ts`
Interface pour la gestion de l'historique des prix.

### 🔍 Recherche & Alertes

#### `search-repository.ts`
Interface pour la gestion des recherches.

#### `stock-alert-repository.ts`
Interface pour la gestion des alertes de stock.

### 📊 Administration

#### `admin-analytics-repository.ts`
Interface pour la gestion des analytics.

#### `system-audit-log-repository.ts`
Interface pour la gestion des logs d'audit.

## 🔄 Flux d'utilisation

### 1. Définition de l'interface (core)
```typescript
// core/repositories/user-repository.ts
export abstract class UserRepository {
  abstract findOne(id: string): Promise<User | null>;
  abstract create(user: CreateUserDto): Promise<User>;
}
```

### 2. Implémentation concrète (use-cases)
```typescript
// use-cases/user/repositories/user-case-repository.ts
export class UserCaseRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}
  
  async findOne(id: string): Promise<User | null> {
    // Implémentation avec Prisma
  }
}
```

### 3. Injection dans le module
```typescript
// use-cases/user/user.module.ts
@Module({
  providers: [
    {
      provide: UserRepository,  // Interface (core)
      useClass: UserCaseRepository  // Implémentation (use-cases)
    }
  ]
})
```

### 4. Utilisation dans le service
```typescript
// use-cases/user/user.service.ts
export class UserFactoryService {
  constructor(
    private readonly userCaseRepository: UserRepository  // Interface
  ) {}
  
  async findOne(id: string): Promise<User | null> {
    return this.userCaseRepository.findOne(id);
  }
}
```

## ✅ Bonnes pratiques

### ✅ À faire
- Définir toutes les méthodes nécessaires dans l'interface
- Utiliser des types précis (Promise, DTOs, Entities)
- Documenter les méthodes avec JSDoc
- Exporter via `index.ts`

### ❌ À éviter
- Ajouter de l'implémentation dans l'interface
- Créer des dépendances vers des frameworks
- Mélanger les abstractions et les implémentations
- Oublier d'exporter l'interface

## 🧪 Testabilité

Grâce à l'inversion de dépendance, il est facile de créer des mocks :

```typescript
// test/user.service.spec.ts
const mockUserRepository: UserRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  // ...
};

const service = new UserFactoryService(mockUserRepository);
```

## 📝 Structure d'une interface Repository

```typescript
import { CreateEntityDto, UpdateEntityDto } from '../dtos';
import { Entity } from '../entities';

export abstract class EntityRepository {
  // Lecture
  abstract findOne(id: string): Promise<Entity | null>;
  abstract findAll(): Promise<Entity[]>;
  
  // Écriture
  abstract create(entity: CreateEntityDto): Promise<Entity>;
  abstract update(id: string, entity: UpdateEntityDto): Promise<Entity>;
  abstract delete(id: string): Promise<void>;
  
  // Recherche spécifique (selon le besoin)
  abstract findByCriteria(criteria: any): Promise<Entity[]>;
}
```

## 🔗 Liens

- [Implémentations concrètes](../../use-cases/README.md)
- [Entités](../entities/README.md)
- [DTOs](../dtos/README.md)

