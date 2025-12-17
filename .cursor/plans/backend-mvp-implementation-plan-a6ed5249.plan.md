<!-- a6ed5249-c1d4-4435-83e4-f64a06bbef7e 617e105f-7b7f-4e0e-b307-96f2ae7161d1 -->
# Complete Missing Business Logic Implementation

## Critical Analysis: What's Missing

### Current State

- ✅ **Auth**: Login, register, verify (complete)
- ✅ **User**: Full CRUD (complete)
- ✅ **Medication**: Only autocomplete (missing CRUD)
- ✅ **Search**: Only pharmacy geolocation search (missing search history logging)
- ❌ **Pharmacy**: EMPTY - No CRUD, no business logic
- ❌ **InventoryItem**: EMPTY - CRITICAL for pharmacists
- ❌ **PriceHistory**: EMPTY - Required for price tracking
- ❌ **Category, MedicationForm, Address, City, District**: EMPTY - Reference data
- ❌ **StockAlert**: EMPTY - User notifications
- ❌ **AdminAnalytics**: EMPTY - Dashboard data
- ❌ **SystemAuditLog**: EMPTY - Compliance requirement

### Why Pharmacy Search Returns Empty

The query is correct, but likely:

1. No verified pharmacies in database (`p.is_verified = true` filter)
2. No inventory items with stock (`ii.quantity_in_stock > 0` filter)
3. No data matching the medication ID

**Solution**: Implement full CRUD for pharmacies and inventory items so data can be created.

## Phase 0: Fix Broken Endpoints (URGENT)

### 0.1 Fix Medication Autocomplete

**Problem**: Returns empty even with data, pg_trgm might not be installed

**Fix**:

1. Add fallback query if `similarity()` fails (use ILIKE only)
2. Check if extension is installed, log warning if not
3. Better error handling
4. Verify data exists in database

**Files**:

- `src/use-cases/medication/medication/medication.service.ts` (FIX)

### 0.2 Fix Pharmacy Search - Make It Flexible

**Problem**: Too strict validation, doesn't accept medication names

**Fix**:

1. Accept `medicationId` (UUID) OR `medicationName` (string)
2. If medicationName provided, lookup medication ID first
3. Fix query param parsing (ensure numbers are parsed correctly)
4. Add better error messages
5. Support both `lat/lng` and `latitude/longitude` for compatibility

**Files**:

- `src/controllers/search/search/search.controller.ts` (FIX DTO)
- `src/use-cases/search/search/search.service.ts` (FIX logic)

### 0.3 Verify Database State

**Problem**: Don't know if data exists or extensions are installed

**Fix**:

1. Add health check endpoint to verify:

- PostgreSQL extensions installed
- Data exists (medications, pharmacies, inventory)
- Redis connection

2. Add diagnostic info

**Files**:

- `src/controllers/health/health.controller.ts` (NEW)

## Phase 1: Reference Data CRUD (Foundation)

### 1.1 Category Module

**Why first**: Medications depend on categories. Without categories, medications can't be created.

**Implement**:

- `findAll()` - List all categories
- `findOne(id)` - Get category details
- `findByLevel(level)` - Hierarchical categories
- `findChildren(parentId)` - Sub-categories
- Admin: `create()`, `update()`, `delete()`

**Files**:

- `src/use-cases/category/category/category.service.ts`
- `src/use-cases/category/repositories/category-case-repository.ts`
- `src/controllers/category/category/category.controller.ts`

### 1.2 MedicationForm Module

**Why second**: Medications require forms. Reference data.

**Implement**:

- `findAll()` - List all forms
- `findOne(id)` - Get form details
- `findByCode(code)` - Lookup by code
- Admin: `create()`, `update()`, `delete()`

**Files**:

- `src/use-cases/medication-form/medication-form/medication-form.service.ts`
- `src/use-cases/medication-form/repositories/medication-form-case-repository.ts`
- `src/controllers/medication-form/medication-form/medication-form.controller.ts`

### 1.3 Geographic Modules (City, District, Address)

**Why third**: Pharmacies require addresses. Geographic hierarchy.

**Implement**:

- **City**: `findAll()`, `findOne(id)`, `findByRegion(region)`, Admin CRUD
- **District**: `findAll()`, `findByCity(cityId)`, Admin CRUD
- **Address**: `findOne(id)`, `create()`, `update()` (used by pharmacies)

**Files**:

- `src/use-cases/city/`, `src/use-cases/district/`, `src/use-cases/address/`

## Phase 2: Medication Full CRUD

### 2.1 Medication Service - Complete Implementation

**Current**: Only `autocomplete()` exists
**Missing**: All CRUD operations

**Implement**:

- `findAll()` - List all medications (paginated)
- `findOne(id)` - Get medication with relations (category, form)
- `create(dto)` - Admin only, validate category/form exist
- `update(id, dto)` - Admin only
- `delete(id)` - Admin only, check if used in inventory
- `findByCategory(categoryId)` - Filter by category
- `findByForm(formId)` - Filter by form
- `findRequiringPrescription()` - Filter prescription meds
- `searchMedications(query)` - Full-text search (different from autocomplete)

**Business Rules**:

- Cannot delete medication if used in inventory_items
- Validate categoryId and formId exist
- Preserve autocomplete() method

**Files**:

- `src/use-cases/medication/repositories/medication-case-repository.ts` (NEW)
- `src/use-cases/medication/medication/medication.service.ts` (EXTEND)
- `src/controllers/medication/medication/medication.controller.ts` (EXTEND)

## Phase 3: Pharmacy Full CRUD (Critical)

### 3.1 Pharmacy Service - Complete Implementation

**Current**: EMPTY
**Why critical**: Without pharmacies, search returns empty. Pharmacists need to manage their pharmacy.

**Implement**:

- `findAll()` - List all pharmacies (public, paginated)
- `findOne(id)` - Get pharmacy with full details (address, owner, inventory count)
- `create(dto)` - Pharmacist creates their pharmacy (role guard)
- `update(id, dto)` - Pharmacist updates own pharmacy (ownership check)
- `findByOwner(ownerId)` - Pharmacist's pharmacies
- `findVerified()` - Public: only verified pharmacies
- `findByLocation(lat, lng, radiusKm)` - Public: nearby pharmacies
- `findOpenNow()` - Public: currently open pharmacies
- `verifyPharmacy(id)` - Admin only: verify pharmacy

**Business Rules**:

- Pharmacist can only create ONE pharmacy (check existing)
- Pharmacist can only update their own pharmacy
- Address must be created first (or included in DTO)
- Verification requires admin role

**Files**:

- `src/use-cases/pharmacy/repositories/pharmacy-case-repository.ts` (NEW)
- `src/use-cases/pharmacy/pharmacy/pharmacy.service.ts` (IMPLEMENT)
- `src/controllers/pharmacy/pharmacy/pharmacy.controller.ts` (IMPLEMENT)

## Phase 4: Inventory Management (CRITICAL for Pharmacists)

### 4.1 InventoryItem Service - Complete Implementation

**Current**: EMPTY
**Why critical**: This is the core feature for pharmacists. Without this, they can't manage stock.

**Implement**:

- `findAll()` - List all inventory (pharmacist: own pharmacy only)
- `findOne(id)` - Get inventory item with relations
- `create(dto)` - Pharmacist adds medication to their pharmacy
- `update(id, dto)` - Pharmacist updates stock/price
- `delete(id)` - Pharmacist removes inventory item
- `findByPharmacy(pharmacyId)` - Get all items for a pharmacy
- `findByMedication(medicationId)` - Find all pharmacies with this medication
- `findAvailable()` - Items with stock > 0
- `updateStock(id, quantity)` - Update quantity only
- `updatePrice(id, unitPrice, sellingPrice, changedBy)` - Update price + log to price_history
- `findLowStock(threshold)` - Alert: stock below threshold
- `findExpiringSoon(days)` - Alert: expiring within X days
- `findExpired()` - Items past expiration

**Business Rules**:

- Pharmacist can only manage their own pharmacy's inventory
- Price update must create price_history entry
- Cannot set quantity < 0
- Batch number must be unique per pharmacy+medication
- Expiration date validation

**Files**:

- `src/use-cases/inventory-item/repositories/inventory-item-case-repository.ts` (NEW)
- `src/use-cases/inventory-item/inventory-item/inventory-item.service.ts` (IMPLEMENT)
- `src/controllers/inventory-item/inventory-item/inventory-item.controller.ts` (IMPLEMENT)

### 4.2 PriceHistory Service

**Why**: Track price changes for audit and analytics

**Implement**:

- `findByInventoryItem(inventoryItemId)` - Price history for an item
- `findByPharmacy(pharmacyId)` - All price changes for pharmacy
- Auto-create on inventory price update (in inventory service)

**Files**:

- `src/use-cases/price-history/repositories/price-history-case-repository.ts` (NEW)
- `src/use-cases/price-history/price-history/price-history.service.ts` (IMPLEMENT)

## Phase 5: Search Enhancement

### 5.1 Search History Logging

**Current**: Search works but doesn't log to `searches` table
**Why**: Analytics and user history

**Enhance**:

- After successful pharmacy search, create `Search` record
- Include: userId (if authenticated), medicationId, location, radius, resultsFound
- Store filters applied as JSON

**Files**:

- `src/use-cases/search/search/search.service.ts` (EXTEND)

## Phase 6: Stock Alerts

### 6.1 StockAlert Service

**Why**: Users want notifications when medication becomes available

**Implement**:

- `create(dto)` - Patient creates alert for medication+pharmacy
- `findByUser(userId)` - User's active alerts
- `findByMedication(medicationId)` - All alerts for medication
- `triggerAlert(alertId)` - Mark as triggered when stock available
- `delete(id)` - Cancel alert
- Background job: Check alerts when inventory updated

**Files**:

- `src/use-cases/stock-alert/repositories/stock-alert-case-repository.ts` (NEW)
- `src/use-cases/stock-alert/stock-alert/stock-alert.service.ts` (IMPLEMENT)

## Phase 7: Admin Features

### 7.1 SystemAuditLog Service

**Why**: Healthcare compliance requires audit trails

**Implement**:

- Auto-logging interceptor (already planned in Phase 2 of original plan)
- `findAll()` - Admin: all logs (paginated, filtered)
- `findByUser(userId)` - User's actions
- `findByEntity(entityType, entityId)` - Entity history
- `findByActionType(actionType)` - Filter by CREATE/UPDATE/DELETE

**Files**:

- `src/frameworks/audit/audit.interceptor.ts` (from original plan)
- `src/use-cases/system-audit-log/repositories/system-audit-log-case-repository.ts` (NEW)
- `src/use-cases/system-audit-log/system-audit-log/system-audit-log.service.ts` (IMPLEMENT)

### 7.2 AdminAnalytics Service

**Why**: Dashboard data for admins

**Implement**:

- `generateDailyAnalytics()` - Background job: daily stats
- `getAnalytics(date)` - Get analytics for date
- `getLatest()` - Latest analytics
- Metrics: total searches, successful searches, new users, active pharmacies, top medications

**Files**:

- `src/use-cases/admin-analytics/repositories/admin-analytics-case-repository.ts` (NEW)
- `src/use-cases/admin-analytics/admin-analytics/admin-analytics.service.ts` (IMPLEMENT)

## Implementation Order (Priority)

1. **Category + MedicationForm** (Blocks medication creation)
2. **Medication CRUD** (Needed for inventory)
3. **City + District + Address** (Blocks pharmacy creation)
4. **Pharmacy CRUD** (Critical - search returns empty without verified pharmacies)
5. **InventoryItem CRUD** (Critical - pharmacists can't work without this)
6. **PriceHistory** (Auto-created, but need read endpoints)
7. **Search history logging** (Enhancement)
8. **StockAlert** (Nice-to-have)
9. **SystemAuditLog** (Compliance)
10. **AdminAnalytics** (Dashboard)

## Key Business Rules to Enforce

### Ownership & Permissions

- **Patient**: Read-only (search, view pharmacies)
- **Pharmacist**: Manage own pharmacy + inventory only
- **Admin**: Full access + verification powers

### Data Integrity

- Cannot delete medication if used in inventory
- Cannot delete pharmacy if has inventory
- Batch number unique per pharmacy+medication
- Address required for pharmacy
- Category/Form must exist before medication creation

### Validation

- Stock quantity >= 0
- Prices > 0
- Expiration date in future (for new items)
- Coordinates valid (latitude: -90 to 90, longitude: -180 to 180)

## Testing Strategy (Minimal)

Since time is limited, focus on:

1. **Manual testing via Swagger** - Test each endpoint
2. **Data validation** - Ensure business rules enforced
3. **Role guards** - Verify permissions work
4. **Integration flow** - Create pharmacy → Add inventory → Search works

## Success Criteria

- ✅ All CRUD operations implemented for core entities
- ✅ Role-based access control enforced
- ✅ Business rules validated
- ✅ Pharmacy search returns results (with data)
- ✅ Pharmacists can manage inventory
- ✅ Swagger documentation complete
- ✅ Code follows existing architecture patterns