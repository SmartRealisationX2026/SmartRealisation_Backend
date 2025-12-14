# 🔧 Frameworks - Infrastructure

## 📋 Vue d'ensemble

Le répertoire `frameworks/` contient la **couche infrastructure** de l'application. C'est ici que se trouvent les implémentations techniques et les intégrations avec des services externes.

## 🎯 Principe

Les frameworks sont des **adaptateurs** qui permettent à l'application d'interagir avec :
- Les bases de données (Prisma)
- Les services d'authentification (JWT)
- Les services externes (Mailer, etc.)

## 📂 Structure

```
frameworks/
├── data-services/     # Services de données (Prisma)
│   └── prisma/
├── auth-services/     # Services d'authentification (JWT)
│   ├── JwtAuthGuard.ts
│   └── JwtAuthStrategy.ts
└── mailer/            # Service d'envoi d'emails
    ├── mailer.module.ts
    └── mailer.service.ts
```

## 📁 Services disponibles

### 1. **Data Services** (`data-services/`)

#### Prisma (`prisma/`)

Service ORM pour l'accès à la base de données PostgreSQL.

**Fichiers** :
- `prisma.module.ts` - Module NestJS
- `prisma.service.ts` - Service Prisma

**Utilisation** :
```typescript
constructor(private prisma: PrismaService) {}

async findOne(id: string) {
  return this.prisma.user.findUnique({ where: { id } });
}
```

👉 Voir [data-services/README.md](./data-services/README.md) pour plus de détails

### 2. **Auth Services** (`auth-services/`)

#### JWT Authentication

Services pour l'authentification JWT.

**Fichiers** :
- `JwtAuthStrategy.ts` - Stratégie Passport JWT
- `JwtAuthGuard.ts` - Guard pour protéger les routes

**Utilisation** :
```typescript
@UseGuards(JwtAuthGuard)
@Controller('api/user')
export class UserController {
  // Routes protégées
}
```

👉 Voir [auth-services/README.md](./auth-services/README.md) pour plus de détails

### 3. **Mailer** (`mailer/`)

Service d'envoi d'emails.

**Fichiers** :
- `mailer.module.ts` - Module NestJS
- `mailer.service.ts` - Service d'envoi

**Utilisation** :
```typescript
constructor(private mailer: MailerService) {}

async sendEmail(to: string, subject: string, body: string) {
  return this.mailer.sendEmail(to, subject, body);
}
```

👉 Voir [mailer/README.md](./mailer/README.md) pour plus de détails

## 🔄 Flux d'utilisation

### Dans les Repositories
```typescript
// use-cases/user/repositories/user-case-repository.ts
export class UserCaseRepository {
  constructor(private prisma: PrismaService) {}  // Framework
  
  async findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
```

### Dans les Controllers
```typescript
// controllers/user/user.controller.ts
@UseGuards(JwtAuthGuard)  // Framework
@Controller('api/user')
export class UserController {
  // ...
}
```

## ✅ Bonnes pratiques

### ✅ À faire
- Isoler les frameworks dans ce répertoire
- Créer des modules NestJS pour chaque framework
- Exporter les services pour injection
- Documenter les configurations

### ❌ À éviter
- Utiliser directement les frameworks dans les use-cases
- Mélanger la logique métier avec les frameworks
- Créer des dépendances circulaires
- Oublier de configurer les modules

## 🔗 Liens

- [Data Services](./data-services/README.md) - Prisma
- [Auth Services](./auth-services/README.md) - JWT
- [Mailer](./mailer/README.md) - Email

