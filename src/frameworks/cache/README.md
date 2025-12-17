# 🔄 Cache - Redis Service

## Vue d'ensemble

Service Redis pour le caching des requêtes fréquentes, notamment les recherches de médicaments et pharmacies.

## Configuration

**Variable d'environnement requise:**
```env
REDIS_URL=redis://localhost:6379
```

Si non définie, utilise `redis://localhost:6379` par défaut.

## Utilisation

### Service Redis

```typescript
import { RedisService } from 'src/frameworks/cache/redis.service';

constructor(private readonly redis: RedisService) {}

// Get
const cached = await this.redis.get<MyType>('my:key');

// Set (TTL par défaut: 5 minutes)
await this.redis.set('my:key', data);

// Set avec TTL personnalisé
await this.redis.set('my:key', data, 600); // 10 minutes

// Delete
await this.redis.del('my:key');
```

### Cache Interceptor (Automatique)

Le `CacheInterceptor` peut être utilisé sur les endpoints pour un caching automatique:

```typescript
@UseInterceptors(CacheInterceptor)
@Get('endpoint')
async getData() {
  // Le résultat sera automatiquement mis en cache
}
```

**Note:** Pour les endpoints de recherche, le caching est géré manuellement dans les services pour un contrôle plus fin (clés personnalisées, TTL spécifiques).

## Conventions de clés

- `medication:autocomplete:{query}:{limit}` - Suggestions de médicaments
- `pharmacy:search:{medicationId}:{lat}:{lng}:{radius}` - Recherche de pharmacies

TTL par défaut: **300 secondes (5 minutes)**

