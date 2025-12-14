# Liste des modules, controllers et services à implémenter

---

# 📦 MODULES

## Modules métier principaux

### 1. Module Pharmacy (Pharmacie)
```bash
nest g mo use-cases/pharmacy
```

### 2. Module Medication (Médicament)
```bash
nest g mo use-cases/medication
```

### 3. Module Category (Catégorie)
```bash
nest g mo use-cases/category
```

### 4. Module MedicationForm (Forme de médicament)
```bash
nest g mo use-cases/medication-form
```

### 5. Module InventoryItem (Article d'inventaire)
```bash
nest g mo use-cases/inventory-item
```

### 6. Module Search (Recherche)
```bash
nest g mo use-cases/search
```

### 7. Module StockAlert (Alerte de stock)
```bash
nest g mo use-cases/stock-alert
```

### 8. Module PriceHistory (Historique des prix)
```bash
nest g mo use-cases/price-history
```

## Modules géographiques

### 9. Module Address (Adresse)
```bash
nest g mo use-cases/address
```

### 10. Module City (Ville)
```bash
nest g mo use-cases/city
```

### 11. Module District (District/Quartier)
```bash
nest g mo use-cases/district
```

## Modules administratifs

### 12. Module AdminAnalytics (Analytiques administrateur)
```bash
nest g mo use-cases/admin-analytics
```

### 13. Module SystemAuditLog (Logs d'audit système)
```bash
nest g mo use-cases/system-audit-log
```

---

# 🎮 CONTROLLERS

## Controllers métier principaux

### 1. Controller Pharmacy (Pharmacie)
```bash
nest g co controllers/pharmacy/pharmacy
```

### 2. Controller Medication (Médicament)
```bash
nest g co controllers/medication/medication
```

### 3. Controller Category (Catégorie)
```bash
nest g co controllers/category/category
```

### 4. Controller MedicationForm (Forme de médicament)
```bash
nest g co controllers/medication-form/medication-form
```

### 5. Controller InventoryItem (Article d'inventaire)
```bash
nest g co controllers/inventory-item/inventory-item
```

### 6. Controller Search (Recherche)
```bash
nest g co controllers/search/search
```

### 7. Controller StockAlert (Alerte de stock)
```bash
nest g co controllers/stock-alert/stock-alert
```

### 8. Controller PriceHistory (Historique des prix)
```bash
nest g co controllers/price-history/price-history
```

## Controllers géographiques

### 9. Controller Address (Adresse)
```bash
nest g co controllers/address/address
```

### 10. Controller City (Ville)
```bash
nest g co controllers/city/city
```

### 11. Controller District (District/Quartier)
```bash
nest g co controllers/district/district
```

## Controllers administratifs

### 12. Controller AdminAnalytics (Analytiques administrateur)
```bash
nest g co controllers/admin-analytics/admin-analytics
```

### 13. Controller SystemAuditLog (Logs d'audit système)
```bash
nest g co controllers/system-audit-log/system-audit-log
```

---

# ⚙️ SERVICES

## Services métier principaux

### 1. Service Pharmacy (Pharmacie)
```bash
nest g s use-cases/pharmacy/pharmacy
```

### 2. Service Medication (Médicament)
```bash
nest g s use-cases/medication/medication
```

### 3. Service Category (Catégorie)
```bash
nest g s use-cases/category/category
```

### 4. Service MedicationForm (Forme de médicament)
```bash
nest g s use-cases/medication-form/medication-form
```

### 5. Service InventoryItem (Article d'inventaire)
```bash
nest g s use-cases/inventory-item/inventory-item
```

### 6. Service Search (Recherche)
```bash
nest g s use-cases/search/search
```

### 7. Service StockAlert (Alerte de stock)
```bash
nest g s use-cases/stock-alert/stock-alert
```

### 8. Service PriceHistory (Historique des prix)
```bash
nest g s use-cases/price-history/price-history
```

## Services géographiques

### 9. Service Address (Adresse)
```bash
nest g s use-cases/address/address
```

### 10. Service City (Ville)
```bash
nest g s use-cases/city/city
```

### 11. Service District (District/Quartier)
```bash
nest g s use-cases/district/district
```

## Services administratifs

### 12. Service AdminAnalytics (Analytiques administrateur)
```bash
nest g s use-cases/admin-analytics/admin-analytics
```

### 13. Service SystemAuditLog (Logs d'audit système)
```bash
nest g s use-cases/system-audit-log/system-audit-log
```

---

## Ordre recommandé d'implémentation

1. **Modules géographiques** (City, District, Address) - Base pour les pharmacies
2. **Module Pharmacy** - Dépend des modules géographiques
3. **Modules de catalogue** (Category, MedicationForm, Medication) - Base pour l'inventaire
4. **Module InventoryItem** - Dépend de Pharmacy et Medication
5. **Module PriceHistory** - Dépend de InventoryItem
6. **Module Search** - Dépend de Medication et Pharmacy
7. **Module StockAlert** - Dépend de Medication, Pharmacy et User
8. **Modules administratifs** (AdminAnalytics, SystemAuditLog) - Pour la gestion et le monitoring

---

## 📝 Notes importantes

### Architecture des modules
- Tous les modules doivent suivre la même architecture que `UserUseCasesModule` et `AuthCaseModule`
- Chaque module doit avoir:
  - Un service (use-case service) dans `src/use-cases/<nom>/<nom>.service.ts`
  - Un repository (case-repository) dans `src/use-cases/<nom>/repositories/<nom>-case-repository.ts`
  - Un contrôleur dans `src/controllers/<nom>/<nom>.controller.ts`
  - Les DTOs et entités existent déjà dans `src/core/`

### Structure des fichiers générés

**Pour chaque module, vous devrez créer manuellement:**
- Le repository case-repository dans `src/use-cases/<nom>/repositories/`
- Lier le service au repository dans le module
- Lier le contrôleur au service dans le module
- Importer le module dans `app.module.ts`

### Exemple de workflow complet pour un module

```bash
# 1. Créer le module
nest g mo use-cases/pharmacy

# 2. Créer le service
nest g s use-cases/pharmacy/pharmacy

# 3. Créer le controller
nest g co controllers/pharmacy/pharmacy

# 4. Créer manuellement le repository
# src/use-cases/pharmacy/repositories/pharmacy-case-repository.ts

# 5. Configurer le module (voir UserUseCasesModule comme exemple)
# 6. Importer dans app.module.ts
```

### Commandes alternatives

Si les commandes ci-dessus ne fonctionnent pas, essayez:
- Pour les controllers: `nest g controller controllers/pharmacy`
- Pour les services: `nest g service use-cases/pharmacy`

