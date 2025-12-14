# ⚙️ Use Cases - Logique Métier

## 📋 Vue d'ensemble

Le répertoire `use-cases/` contient la **couche applicative** de l'application. C'est ici que se trouve la logique métier et les cas d'utilisation de l'application.

## 🎯 Principe

Chaque module dans `use-cases/` représente un **domaine métier** et contient :
- **Service** : Logique métier et cas d'utilisation
- **Repository** : Implémentation concrète de l'interface (core)
- **Module** : Configuration NestJS

## 📂 Structure

```
use-cases/
├── user/
│   ├── user.service.ts           # Service métier
│   ├── user.module.ts            # Module NestJS
│   └── repositories/
│       └── user-case-repository.ts # Implémentation concrète
├── pharmacy/
│   ├── pharmacy/
│   │   └── pharmacy.service.ts
│   ├── pharmacy.module.ts
│   └── repositories/ (si nécessaire)
└── ...
```

## 🔄 Architecture d'un module

### 1. **Service** (`*.service.ts`)

Le service contient la **logique métier** et implémente les cas d'utilisation.

**Exemple** : `user/user.service.ts`
```typescript
@Injectable()
export class UserFactoryService implements UserRepository {
  constructor(
    private readonly userCaseRepository: UserRepository
  ) {}

  async findOne(id: string): Promise<User | null> {
    return this.userCaseRepository.findOne(id);
  }
  
  async create(user: CreateUserDto): Promise<User> {
    // Logique métier ici
    return this.userCaseRepository.create(user);
  }
}
```

### 2. **Repository** (`repositories/*-case-repository.ts`)

L'implémentation concrète de l'interface repository (définie dans `core/`).

**Exemple** : `user/repositories/user-case-repository.ts`
```typescript
@Injectable()
export class UserCaseRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });
    return user ? this.toEntity(user) : null;
  }
  
  private toEntity(prismaUser: any): User {
    // Mapping Prisma → Entity
  }
}
```

### 3. **Module** (`*.module.ts`)

Configuration NestJS qui lie les composants.

**Exemple** : `user/user.module.ts`
```typescript
@Module({
  providers: [
    UserFactoryService,
    {
      provide: UserRepository,  // Interface (core)
      useClass: UserCaseRepository  // Implémentation
    }
  ],
  controllers: [UserController],
  exports: [UserFactoryService],
})
export class UserUseCasesModule {}
```

## 📁 Modules disponibles

### 👤 Utilisateurs & Authentification
- `user/` - Gestion des utilisateurs
- `auth/` - Authentification et autorisation

### 🏥 Pharmacies & Géolocalisation
- `pharmacy/` - Gestion des pharmacies
- `address/` - Gestion des adresses
- `city/` - Gestion des villes
- `district/` - Gestion des districts

### 💊 Médicaments & Catalogue
- `medication/` - Catalogue des médicaments
- `category/` - Catégories thérapeutiques
- `medication-form/` - Formes galéniques

### 📦 Inventaire & Stocks
- `inventory-item/` - Gestion des stocks
- `price-history/` - Historique des prix

### 🔍 Recherche & Alertes
- `search/` - Recherche géolocalisée
- `stock-alert/` - Alertes de stock

### 📊 Administration
- `admin-analytics/` - Analytics administrateur
- `system-audit-log/` - Logs d'audit

## 🔄 Flux d'exécution

```
1. Controller reçoit une requête
   ↓
2. Controller appelle le Service (use-case)
   ↓
3. Service exécute la logique métier
   ↓
4. Service utilise le Repository (interface)
   ↓
5. Repository concret (use-cases) accède à Prisma
   ↓
6. Prisma interroge la base de données
   ↓
7. Données remontent jusqu'au Controller
```

## ✅ Bonnes pratiques

### ✅ À faire
- Mettre la logique métier dans les services
- Utiliser les interfaces de repository (core)
- Implémenter les repositories avec Prisma
- Exporter les services pour réutilisation
- Grouper par domaine métier

### ❌ À éviter
- Mettre de la logique dans les controllers
- Accéder directement à Prisma depuis les services
- Créer des dépendances circulaires
- Mélanger les domaines métier

## 🧪 Testabilité

Les services sont facilement testables grâce à l'injection de dépendance :

```typescript
// test/user.service.spec.ts
const mockRepository: UserRepository = {
  findOne: jest.fn(),
  // ...
};

const service = new UserFactoryService(mockRepository);
```

## 📝 Créer un nouveau module

1. **Créer le module** : `nest g mo use-cases/nom-module`
2. **Créer le service** : `nest g s use-cases/nom-module/nom-module`
3. **Créer le repository** : `nom-module/repositories/nom-module-case-repository.ts`
4. **Configurer le module** : Lier service, repository et controller
5. **Importer dans app.module.ts**

## 🔗 Liens

- [Core](../core/README.md) - Interfaces et entités
- [Controllers](../controllers/README.md) - API REST
- [Frameworks](../frameworks/README.md) - Infrastructure

