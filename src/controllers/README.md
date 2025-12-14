# 🎮 Controllers - API REST

## 📋 Vue d'ensemble

Le répertoire `controllers/` contient la **couche présentation** de l'application. Les controllers gèrent les requêtes HTTP et les réponses de l'API REST.

## 🎯 Principe

Les controllers sont responsables de :
- **Recevoir** les requêtes HTTP
- **Valider** les données d'entrée (DTOs)
- **Appeler** les services (use-cases)
- **Retourner** les réponses HTTP formatées

## 📂 Structure

```
controllers/
├── user/
│   └── user.controller.ts
├── auth/
│   ├── auth.controller.ts
│   └── apiBody/
│       └── apiBody.swagger.ts
├── pharmacy/
│   └── pharmacy/
│       └── pharmacy.controller.ts
└── ...
```

## 🔄 Architecture d'un Controller

### Exemple : `user/user.controller.ts`

```typescript
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/user')
export class UserController implements UserRepository {
  constructor(
    private readonly userFactoryService: UserFactoryService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les utilisateurs' })
  async findAll(): Promise<User[]> {
    return this.userFactoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un utilisateur par ID' })
  async findOne(@Param('id') id: string): Promise<User | null> {
    return this.userFactoryService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() user: CreateUserDto): Promise<User> {
    return this.userFactoryService.create(user);
  }
}
```

## 📁 Controllers disponibles

### 👤 Utilisateurs & Authentification
- `user/user.controller.ts` - Gestion des utilisateurs
- `auth/auth.controller.ts` - Authentification

### 🏥 Pharmacies & Géolocalisation
- `pharmacy/pharmacy/pharmacy.controller.ts` - Gestion des pharmacies
- `address/address/address.controller.ts` - Gestion des adresses
- `city/city/city.controller.ts` - Gestion des villes
- `district/district/district.controller.ts` - Gestion des districts

### 💊 Médicaments & Catalogue
- `medication/medication/medication.controller.ts` - Catalogue des médicaments
- `category/category/category.controller.ts` - Catégories thérapeutiques
- `medication-form/medication-form/medication-form.controller.ts` - Formes galéniques

### 📦 Inventaire & Stocks
- `inventory-item/inventory-item/inventory-item.controller.ts` - Gestion des stocks
- `price-history/price-history/price-history.controller.ts` - Historique des prix

### 🔍 Recherche & Alertes
- `search/search/search.controller.ts` - Recherche géolocalisée
- `stock-alert/stock-alert/stock-alert.controller.ts` - Alertes de stock

### 📊 Administration
- `admin-analytics/admin-analytics/admin-analytics.controller.ts` - Analytics
- `system-audit-log/system-audit-log/system-audit-log.controller.ts` - Logs d'audit

## 🛡️ Sécurité

### Guards
Les controllers utilisent des **Guards** pour protéger les routes :

```typescript
@UseGuards(JwtAuthGuard)
@Controller('api/user')
export class UserController {
  // Routes protégées
}
```

### Décorateurs de sécurité
- `@ApiBearerAuth()` - Authentification JWT pour Swagger
- `@UseGuards(JwtAuthGuard)` - Protection des routes
- `@Roles()` - Contrôle d'accès par rôle (si implémenté)

## 📝 Documentation Swagger

Les controllers sont documentés avec **Swagger/OpenAPI** :

```typescript
@ApiTags('Users')
@ApiOperation({ summary: 'Description de l\'endpoint' })
@ApiResponse({ status: 200, description: 'Succès' })
@ApiResponse({ status: 404, description: 'Non trouvé' })
```

### Accès à la documentation
Une fois l'application démarrée :
- Swagger UI : `http://localhost:3000/api`

## 🔄 Méthodes HTTP

### GET - Lecture
```typescript
@Get()
async findAll(): Promise<User[]> { }

@Get(':id')
async findOne(@Param('id') id: string): Promise<User> { }
```

### POST - Création
```typescript
@Post()
@HttpCode(HttpStatus.CREATED)
async create(@Body() dto: CreateUserDto): Promise<User> { }
```

### PUT - Mise à jour complète
```typescript
@Put(':id')
async update(
  @Param('id') id: string,
  @Body() dto: UpdateUserDto
): Promise<User> { }
```

### DELETE - Suppression
```typescript
@Delete(':id')
@HttpCode(HttpStatus.NO_CONTENT)
async delete(@Param('id') id: string): Promise<void> { }
```

## ✅ Bonnes pratiques

### ✅ À faire
- Garder les controllers **minces** (pas de logique métier)
- Utiliser les **DTOs** pour la validation
- Documenter avec **Swagger**
- Utiliser les **Guards** pour la sécurité
- Retourner les **codes HTTP appropriés**

### ❌ À éviter
- Mettre de la logique métier dans les controllers
- Accéder directement à la base de données
- Oublier la validation des données
- Exposer des données sensibles
- Ignorer la gestion d'erreurs

## 🔗 Liens

- [Use Cases](../use-cases/README.md) - Services métier
- [DTOs](../core/dtos/README.md) - Validation des données
- [Frameworks](../frameworks/README.md) - Guards et sécurité

