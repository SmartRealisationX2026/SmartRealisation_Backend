# 🚀 Quick Start - Backend MVP Features

## ✅ Ce qui est implémenté

### 1. Infrastructure
- ✅ PostgreSQL extensions (pg_trgm, PostGIS) avec indexes
- ✅ Redis caching service
- ✅ Role-based access control (RBAC)

### 2. APIs Core

#### Medication Autocomplete
```
GET /api/medications/autocomplete?q=para&limit=10
```
- Recherche floue (fuzzy search) avec pg_trgm
- Cache Redis (5 min)
- Suggestions triées par similarité

#### Pharmacy Search (Geolocation)
```
GET /api/pharmacies/search?medicationId={uuid}&latitude=4.0511&longitude=9.7679&radiusKm=10
```
- Recherche géolocalisée avec PostGIS
- Filtre par stock disponible
- Tri par distance
- Cache Redis (5 min)

## 🔧 Configuration requise

### Variables d'environnement
```env
DATABASE_URL=postgresql://user:password@localhost:5432/medilink_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
```

### Migrations
```bash
# Appliquer les extensions PostgreSQL
npx prisma migrate dev
```

**Important:** Les extensions `pg_trgm` et `postgis` nécessitent des privilèges superuser. Si erreur, exécuter manuellement:
```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS postgis;
```

## 📚 Documentation API

Swagger disponible à: `http://localhost:3000/api`

## 🔐 Authentification & Rôles

### Utilisation des guards

```typescript
// Route protégée (authentification requise)
@UseGuards(JwtAuthGuard)
@Get('protected')
async protectedRoute() {}

// Route avec rôle spécifique
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.PHARMACIST)
@Post('inventory')
async manageInventory() {}
```

### Rôles disponibles
- `PATIENT` - Accès lecture (recherche)
- `PHARMACIST` - Gestion de sa propre pharmacie
- `ADMIN` - Accès complet

## 🏗️ Architecture

```
Controller → Service → Prisma/Redis
```

- **Controllers**: Endpoints REST avec Swagger
- **Services**: Logique métier + caching
- **Prisma**: Accès base de données
- **Redis**: Cache pour performances

## 🐛 Dépannage

### Redis non disponible
Si Redis n'est pas disponible, les services continueront de fonctionner mais sans cache (plus lent).

### Extensions PostgreSQL manquantes
Si les extensions ne sont pas installées:
- Les requêtes de recherche floue échoueront
- Les requêtes géolocalisées échoueront

Vérifier avec:
```sql
SELECT * FROM pg_extension WHERE extname IN ('pg_trgm', 'postgis');
```

## 📝 Prochaines étapes

1. Implémenter les APIs de gestion d'inventaire (Pharmacist)
2. Ajouter les APIs admin (verification pharmacies)
3. Implémenter l'audit logging automatique

