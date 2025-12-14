# 🗄️ Data Services - Prisma

## 📋 Vue d'ensemble

Le service Prisma fournit l'accès à la base de données PostgreSQL via l'ORM Prisma.

## 🎯 Principe

Prisma est utilisé comme **adaptateur** pour :
- Accéder à la base de données
- Mapper les modèles Prisma vers les entités (core)
- Gérer les transactions
- Optimiser les requêtes

## 📁 Fichiers

- `prisma.module.ts` - Module NestJS qui exporte PrismaService
- `prisma.service.ts` - Service Prisma injectable

## 🔄 Utilisation

### Injection dans les Repositories

```typescript
// use-cases/user/repositories/user-case-repository.ts
import { PrismaService } from 'src/frameworks/data-services/prisma/prisma.service';

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
    return {
      id: prismaUser.id,
      email: prismaUser.email,
      // ...
    };
  }
}
```

### Requêtes complexes

```typescript
// Recherche avec relations
const pharmacy = await this.prisma.pharmacy.findUnique({
  where: { id },
  include: {
    address: {
      include: {
        city: true,
        district: true
      }
    },
    owner: true
  }
});
```

### Transactions

```typescript
await this.prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: userData });
  await tx.pharmacy.create({ data: { ...pharmacyData, ownerId: user.id } });
});
```

## ✅ Bonnes pratiques

### ✅ À faire
- Utiliser Prisma uniquement dans les repositories
- Mapper les modèles Prisma vers les entités (core)
- Utiliser les transactions pour les opérations complexes
- Optimiser les requêtes avec `select` et `include`

### ❌ À éviter
- Utiliser Prisma directement dans les services
- Exposer les modèles Prisma dans les controllers
- Oublier de mapper vers les entités
- Créer des requêtes N+1

## 🔗 Liens

- [Prisma Schema](../../../../prisma/schema.prisma) - Schéma de base de données
- [Prisma Documentation](https://www.prisma.io/docs) - Documentation officielle

