# Tech Stack & Build System

## Core Technologies

- **Runtime**: Node.js (v18+)
- **Framework**: NestJS 11
- **Language**: TypeScript 5.7
- **Database**: PostgreSQL 12+ with PostGIS extensions
- **ORM**: Prisma 7
- **Cache**: Redis (via ioredis) - autocomplete caching (5 min TTL)

## Authentication & Security

- JWT authentication (@nestjs/jwt, passport-jwt)
- Role-based access control: `JwtAuthGuard`, `RolesGuard`
- Password hashing with bcrypt
- 2FA support via speakeasy
- System audit logging for compliance

## API & Documentation

- REST API with Swagger/OpenAPI at `/api`
- Validation: class-validator, class-transformer
- CORS enabled for frontend integration

## Real-time Features

- WebSockets: @nestjs/websockets, socket.io
- Stock update broadcasts to connected clients

## Search Optimization

- PostgreSQL `pg_trgm` extension for fuzzy search
- Full-text indexes on medication names (commercial_name, dci_name)
- Haversine formula for distance calculations
- Redis caching for autocomplete results

## Additional Services

- Email: nodemailer
- Logging: Winston (centralized in `/logs`)

## Code Quality

- Linting: ESLint 9 with TypeScript plugin
- Formatting: Prettier (single quotes, trailing commas)
- Testing: Jest 30, Supertest

## Common Commands

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugger

# Build & Production
npm run build              # Compile TypeScript
npm run start:prod         # Run compiled code

# Database
npm run db:generate        # Generate Prisma client
npm run db:migrate         # Run migrations (with clean)
npm run db:migrate:raw     # Run prisma migrate dev directly
npm run db:seed            # Seed database with test data
npm run db:studio          # Open Prisma Studio GUI
npm run db:reset           # Reset database (DELETES ALL DATA)

# Testing
npm run test               # Unit tests
npm run test:e2e           # End-to-end tests
npm run test:cov           # Coverage report

# Code Quality
npm run lint               # ESLint with auto-fix
npm run format             # Prettier formatting
```

## Environment Variables

Key variables in `.env`:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection (for caching)
- `JWT_SECRET` - Token signing secret
- `PORT` - Server port (default: 3000)

## Performance Requirements

- Search response: <2 seconds
- Page load: <3 seconds
- Autocomplete: cached 5 minutes
- Target: 20K → 100K users scalability
