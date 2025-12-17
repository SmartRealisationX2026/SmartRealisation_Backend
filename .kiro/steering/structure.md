# Project Structure

This project follows Clean Architecture / Hexagonal Architecture with NestJS.

```
SmartRealisation_Backend/
├── src/
│   ├── main.ts                    # Application entry point, Swagger setup
│   ├── app.module.ts              # Root module with all imports
│   │
│   ├── core/                      # Domain layer (abstractions)
│   │   ├── entities/              # Domain models (plain TS classes)
│   │   ├── repositories/          # Abstract repository interfaces
│   │   ├── dtos/
│   │   │   ├── request/           # Input DTOs with class-validator
│   │   │   └── response/          # Output DTOs
│   │   └── utils/                 # Shared utilities
│   │
│   ├── use-cases/                 # Application layer (business logic)
│   │   └── {domain}/
│   │       ├── {domain}.module.ts
│   │       ├── {domain}/
│   │       │   ├── {domain}.service.ts
│   │       │   └── {domain}.service.spec.ts
│   │       └── repositories/      # Concrete implementations
│   │
│   ├── controllers/               # Presentation layer (REST API)
│   │   └── {domain}/
│   │       └── {domain}/
│   │           ├── {domain}.controller.ts
│   │           └── {domain}.controller.spec.ts
│   │
│   ├── frameworks/                # Infrastructure layer
│   │   ├── data-services/prisma/  # PrismaService, PrismaModule
│   │   ├── auth-services/         # JwtAuthGuard, JwtStrategy, RolesGuard
│   │   ├── cache/                 # RedisService, CacheInterceptor
│   │   └── mailer/                # MailerService
│   │
│   └── generated/prisma/          # Auto-generated Prisma client
│
├── prisma/
│   ├── schema.prisma              # Database schema (source of truth)
│   ├── seed.ts                    # Database seeding (200 meds, 50 pharmacies)
│   ├── migrations/                # SQL migrations
│   └── scripts/                   # init-db.sh, reset-db.sh, validate.sql
│
├── docs/diagram/                  # Mermaid diagrams (MCD, MLD, use cases, sequences)
│
└── test/                          # E2E tests
```

## Architecture Flow

```
HTTP Request → Controller → Service (Use Case) → Repository → Prisma → PostgreSQL
                                                      ↓
                                                   Redis (cache)
```

## Domain Modules

| Module | Purpose |
|--------|---------|
| `user` | User management, profiles |
| `auth` | JWT authentication, login/register |
| `pharmacy` | Pharmacy CRUD, verification |
| `medication` | Medication catalog |
| `category` | Therapeutic categories (hierarchical) |
| `medication-form` | Dosage forms (tablet, syrup, etc.) |
| `inventory-item` | Stock management per pharmacy |
| `search` | Medication search with geolocation |
| `stock-alert` | Availability notifications |
| `price-history` | Price change tracking |
| `address`, `city`, `district` | Geographic data |
| `admin-analytics` | Dashboard metrics |
| `system-audit-log` | Action logging |

## Database Schema (Key Tables)

- `users` - All user types with role enum (PATIENT, PHARMACIST, ADMIN)
- `pharmacies` - Linked to owner (user), address, with verification status
- `medications` - Commercial name, DCI, category, form, dosage
- `inventory_items` - Stock per pharmacy with batch, expiration, pricing
- `searches` - Search history with location and filters
- `stock_alerts` - User subscriptions for medication availability

## Naming Conventions

- **Files**: kebab-case (`pharmacy.controller.ts`)
- **Classes**: PascalCase (`PharmacyController`, `CreatePharmacyDto`)
- **Variables/Functions**: camelCase (`findById`, `isAvailable`)
- **Database columns**: snake_case via `@map()` (`created_at`, `pharmacy_id`)
- **DTOs**: `Create{Entity}Dto`, `Update{Entity}Dto`
- **Enums**: SCREAMING_SNAKE_CASE values (`PATIENT`, `PHARMACIST`, `ADMIN`)

## Key Patterns

- Dependency injection via NestJS modules
- Repository pattern for data access abstraction
- DTOs with class-validator decorators for input validation
- Swagger decorators for API documentation
- Guards for route protection (`@UseGuards(JwtAuthGuard, RolesGuard)`)
- `@Roles()` decorator for role-based access

## Adding a New Domain

1. Create entity in `core/entities/{domain}.entity.ts`
2. Create DTOs in `core/dtos/request/{domain}.dto.ts`
3. Create abstract repository in `core/repositories/{domain}-repository.ts`
4. Create service in `use-cases/{domain}/{domain}/{domain}.service.ts`
5. Create module in `use-cases/{domain}/{domain}.module.ts`
6. Create controller in `controllers/{domain}/{domain}/{domain}.controller.ts`
7. Register module in `app.module.ts`
8. Update Prisma schema if needed, run `npm run db:migrate`
