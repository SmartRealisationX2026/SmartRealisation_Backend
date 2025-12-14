# 📦 DTOs - Data Transfer Objects

## 📋 Vue d'ensemble

Les DTOs (Data Transfer Objects) sont des objets utilisés pour **transférer des données** entre les couches de l'application, notamment entre les controllers et les services.

## 🎯 Principe

Les DTOs permettent de :
- **Valider** les données d'entrée
- **Découpler** les couches (Controller ↔ Service)
- **Sécuriser** en ne transmettant que les données nécessaires
- **Documenter** la structure des données attendues

## 📁 Structure

```
dtos/
├── request/           # DTOs pour les requêtes HTTP
│   ├── user.dto.ts
│   ├── pharmacy.dto.ts
│   └── ...
├── response/           # DTOs pour les réponses HTTP
│   ├── create-user-reponse.dto.ts
│   └── ...
└── index.ts            # Exports groupés
```

## 📋 Types de DTOs

### 1. **Request DTOs** (`request/`)

DTOs utilisés pour les **requêtes HTTP** (POST, PUT, PATCH).

#### Create DTOs
Pour la création d'entités.

**Exemple** : `request/user.dto.ts`
```typescript
export class CreateUserDto {
  @IsEmail()
  email: string;
  
  @IsString()
  @MinLength(8)
  password: string;
  
  @IsEnum(UserRole)
  role: UserRole;
  
  @IsString()
  fullName: string;
}
```

#### Update DTOs
Pour la mise à jour d'entités (généralement avec `PartialType`).

**Exemple** :
```typescript
export class UpdateUserDto extends PartialType(CreateUserDto) {
  // Tous les champs sont optionnels
}
```

### 2. **Response DTOs** (`response/`)

DTOs utilisés pour les **réponses HTTP** formatées.

**Exemple** : `response/create-user-reponse.dto.ts`
```typescript
export class CreateUserResponseDto {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: Date;
  // Pas de passwordHash !
}
```

### 3. **Query DTOs**

DTOs pour les paramètres de recherche (optionnel, peut être dans `request/`).

**Exemple** :
```typescript
export class SearchMedicationDto {
  @IsOptional()
  @IsString()
  name?: string;
  
  @IsOptional()
  @IsNumber()
  radiusKm?: number;
}
```

## 📁 DTOs disponibles

### 👤 Utilisateurs
- `CreateUserDto` - Création d'utilisateur
- `UpdateUserDto` - Mise à jour d'utilisateur

### 🏥 Pharmacies
- `CreatePharmacyDto` - Création de pharmacie
- `UpdatePharmacyDto` - Mise à jour de pharmacie

### 💊 Médicaments
- `CreateMedicationDto` - Création de médicament
- `UpdateMedicationDto` - Mise à jour de médicament

### 📦 Inventaire
- `CreateInventoryItemDto` - Création d'article d'inventaire
- `UpdateInventoryItemDto` - Mise à jour d'article

### 🔍 Recherche
- `SearchDto` - Paramètres de recherche

### 📊 Et plus...
Voir le répertoire `request/` pour la liste complète.

## 🔄 Utilisation

### Dans les Controllers
```typescript
@Post()
async create(@Body() createUserDto: CreateUserDto): Promise<User> {
  return this.userService.create(createUserDto);
}
```

### Dans les Services
```typescript
async create(user: CreateUserDto): Promise<User> {
  return this.userRepository.create(user);
}
```

### Validation automatique
NestJS valide automatiquement les DTOs grâce à `class-validator` :

```typescript
// main.ts
app.useGlobalPipes(new ValidationPipe());
```

## ✅ Bonnes pratiques

### ✅ À faire
- Utiliser des décorateurs de validation (`@IsEmail()`, `@IsString()`, etc.)
- Séparer les DTOs de création et de mise à jour
- Créer des DTOs de réponse pour ne pas exposer les données sensibles
- Documenter avec Swagger (`@ApiProperty()`)

### ❌ À éviter
- Exposer des données sensibles (mots de passe, tokens)
- Mélanger les DTOs avec les entités
- Oublier la validation
- Créer des DTOs trop complexes

## 🔒 Sécurité

### Ne jamais exposer
- Mots de passe (même hashés)
- Tokens d'authentification
- Données internes sensibles
- Clés privées

### Exemple de DTO sécurisé
```typescript
// ❌ Mauvais
export class UserResponseDto {
  passwordHash: string;  // Ne jamais exposer !
}

// ✅ Bon
export class UserResponseDto {
  id: string;
  email: string;
  fullName: string;
  // Pas de passwordHash
}
```

## 📝 Documentation Swagger

Les DTOs peuvent être documentés avec Swagger :

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Email de l\'utilisateur' })
  @IsEmail()
  email: string;
}
```

## 🔗 Liens

- [Entities](../entities/README.md)
- [Repositories](../repositories/README.md)
- [Controllers](../../controllers/README.md)

