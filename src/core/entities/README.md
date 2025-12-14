# 📦 Entities - Entités Métier

## 📋 Vue d'ensemble

Les entités représentent les **modèles de domaine** de l'application. Ce sont des classes TypeScript simples qui définissent la structure des données métier, indépendantes de la base de données.

## 🎯 Principe

Les entités sont des **objets métier purs** :
- Pas de dépendance vers Prisma ou la base de données
- Représentent les concepts du domaine métier
- Peuvent être utilisées dans toute l'application

## 📁 Entités disponibles

### 👤 Utilisateurs & Authentification

#### `user.entity.ts`
Représente un utilisateur du système (Patient, Pharmacien, Admin).

**Propriétés principales** :
- `id` : Identifiant unique (UUID)
- `email` : Email de l'utilisateur
- `role` : Rôle (PATIENT, PHARMACIST, ADMIN)
- `fullName` : Nom complet
- `phone` : Numéro de téléphone (optionnel)
- `isActive` : Statut actif/inactif

### 🏥 Pharmacies & Géolocalisation

#### `pharmacy.entity.ts`
Représente une pharmacie avec ses informations et localisation.

**Propriétés principales** :
- `id` : Identifiant unique
- `name` : Nom de la pharmacie
- `address` : Adresse complète
- `licenseNumber` : Numéro de licence
- `is24_7` : Ouverture 24/7
- `isVerified` : Statut de vérification

#### `address.entity.ts`
Représente une adresse géolocalisée.

**Propriétés principales** :
- `id` : Identifiant unique
- `streetAddress` : Adresse de la rue
- `latitude` / `longitude` : Coordonnées GPS
- `city` : Ville
- `district` : District/Quartier (optionnel)

#### `city.entity.ts`
Représente une ville.

**Propriétés principales** :
- `id` : Identifiant unique
- `nameFr` / `nameEn` : Nom en français/anglais
- `region` : Région

#### `district.entity.ts`
Représente un district/quartier.

**Propriétés principales** :
- `id` : Identifiant unique
- `nameFr` / `nameEn` : Nom en français/anglais
- `cityId` : ID de la ville parente

### 💊 Médicaments & Catalogue

#### `medication.entity.ts`
Représente un médicament du catalogue.

**Propriétés principales** :
- `id` : Identifiant unique
- `commercialName` : Nom commercial
- `dciName` : Nom DCI (Dénomination Commune Internationale)
- `dosageStrength` : Force du dosage
- `dosageUnit` : Unité de dosage
- `requiresPrescription` : Nécessite une ordonnance

#### `category.entity.ts`
Représente une catégorie thérapeutique (hiérarchique).

**Propriétés principales** :
- `id` : Identifiant unique
- `code` : Code unique de la catégorie
- `nameFr` / `nameEn` : Nom en français/anglais
- `level` : Niveau dans la hiérarchie
- `parentId` : ID de la catégorie parente (optionnel)

#### `medication-form.entity.ts`
Représente une forme galénique (comprimé, sirop, etc.).

**Propriétés principales** :
- `id` : Identifiant unique
- `code` : Code unique
- `nameFr` / `nameEn` : Nom en français/anglais

### 📦 Inventaire & Stocks

#### `inventory-item.entity.ts`
Représente un article en stock dans une pharmacie.

**Propriétés principales** :
- `id` : Identifiant unique
- `pharmacyId` : ID de la pharmacie
- `medicationId` : ID du médicament
- `batchNumber` : Numéro de lot
- `expirationDate` : Date d'expiration
- `quantityInStock` : Quantité en stock
- `unitPriceFcfa` : Prix unitaire en FCFA
- `sellingPriceFcfa` : Prix de vente en FCFA
- `isAvailable` : Disponibilité

#### `price-history.entity.ts`
Représente l'historique des changements de prix.

**Propriétés principales** :
- `id` : Identifiant unique
- `inventoryItemId` : ID de l'article d'inventaire
- `oldPriceFcfa` : Ancien prix
- `newPriceFcfa` : Nouveau prix
- `changedAt` : Date du changement
- `changedBy` : ID de l'utilisateur qui a changé

### 🔍 Recherche & Alertes

#### `search.entity.ts`
Représente une recherche effectuée par un utilisateur.

**Propriétés principales** :
- `id` : Identifiant unique
- `userId` : ID de l'utilisateur (optionnel)
- `medicationId` : ID du médicament recherché
- `latitude` / `longitude` : Position de recherche
- `radiusKm` : Rayon de recherche en km
- `resultsFound` : Nombre de résultats trouvés
- `searchedAt` : Date de la recherche

#### `stock-alert.entity.ts`
Représente une alerte de stock configurée par un utilisateur.

**Propriétés principales** :
- `id` : Identifiant unique
- `userId` : ID de l'utilisateur (optionnel)
- `medicationId` : ID du médicament surveillé
- `pharmacyId` : ID de la pharmacie (optionnel)
- `notificationChannel` : Canal de notification (EMAIL, SMS, PUSH)
- `status` : Statut (ACTIVE, TRIGGERED, EXPIRED)

### 📊 Administration

#### `admin-analytics.entity.ts`
Représente les analytics quotidiennes pour les administrateurs.

**Propriétés principales** :
- `id` : Identifiant unique
- `analyticsDate` : Date des analytics
- `totalSearches` : Nombre total de recherches
- `successfulSearches` : Recherches réussies
- `newUsers` : Nouveaux utilisateurs
- `activePharmacies` : Pharmacies actives
- `topMedications` : Top médicaments (JSON)

#### `system-audit-log.entity.ts`
Représente un log d'audit système.

**Propriétés principales** :
- `id` : Identifiant unique
- `userId` : ID de l'utilisateur
- `actionType` : Type d'action (CREATE, UPDATE, DELETE)
- `entityType` : Type d'entité concernée
- `entityId` : ID de l'entité concernée
- `oldValues` / `newValues` : Valeurs avant/après (JSON)
- `ipAddress` : Adresse IP
- `createdAt` : Date de création

## 🔄 Utilisation

### Dans les Services
```typescript
import { User } from 'src/core/entities';

async findOne(id: string): Promise<User | null> {
  // Retourne une entité User
}
```

### Dans les Controllers
```typescript
import { User } from 'src/core/entities';

@Get(':id')
async findOne(@Param('id') id: string): Promise<User | null> {
  return this.userService.findOne(id);
}
```

## ✅ Bonnes pratiques

### ✅ À faire
- Utiliser les entités pour représenter le domaine métier
- Garder les entités simples (pas de logique complexe)
- Utiliser les types TypeScript appropriés
- Exporter via `index.ts`

### ❌ À éviter
- Ajouter des dépendances externes (Prisma, etc.)
- Mettre de la logique métier complexe dans les entités
- Créer des dépendances circulaires entre entités
- Mélanger les entités avec les DTOs

## 📝 Notes

- Les entités sont **indépendantes** de la base de données
- Elles peuvent être **mappées** depuis les modèles Prisma
- Elles représentent le **domaine métier** pur
- Elles sont **réutilisables** dans toute l'application

