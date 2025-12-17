# 📘 MediLink API Master Contract (47 Use Cases)

> [!IMPORTANT]
> **Status Matrix**:
> *   ✅ **[LIVE]**: Implemented and functioning on your backend copy.
> *   🛠️ **[SPEC]**: Specified in this contract but requires code implementation. The `curl` command represents the **Target Behavior**.

---

## 🚀 Environment Setup (Run This First)
Initialize your session variables using the Default Seed Data (`npm run seed`).

```bash
# === OPTION A: BASH / MAC / LINUX ===
# 1. Capture Admin Token
export ADMIN_TOKEN=$(curl -s -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{ "email": "admin@medilink.cm", "password": "password123" }' | jq -r '.accessToken')

# 2. Capture Pharmacist Token
export PHARMA_TOKEN=$(curl -s -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{ "email": "pharmacist.yaounde@medilink.cm", "password": "password123" }' | jq -r '.accessToken')

# 3. Capture Patient Token
export PATIENT_TOKEN=$(curl -s -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{ "email": "patient.demo@medilink.cm", "password": "password123" }' | jq -r '.accessToken')

# 4. Capture Reference IDs
export PHARMA_ID=$(curl -s -X GET "http://localhost:3000/api/pharmacies" -H "Authorization: Bearer $ADMIN_TOKEN" | jq -r '.[0].id')
export MED_ID=$(curl -s -X GET "http://localhost:3000/api/medications" -H "Authorization: Bearer $PATIENT_TOKEN" | jq -r '.[0].id')
```

```powershell
# === OPTION B: WINDOWS POWERSHELL ===
# Note: Copy/Paste these blocks one by one.

# 1. Capture Admin Token
$AdminResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -ContentType "application/json" -Body '{ "email": "admin@medilink.cm", "password": "password123" }'
$env:ADMIN_TOKEN = $AdminResponse.accessToken

# 2. Capture Pharmacist Token
$PharmaResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -ContentType "application/json" -Body '{ "email": "pharmacist.yaounde@medilink.cm", "password": "password123" }'
$env:PHARMA_TOKEN = $PharmaResponse.accessToken

# 3. Capture Patient Token
$PatientResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -ContentType "application/json" -Body '{ "email": "patient.demo@medilink.cm", "password": "password123" }'
$env:PATIENT_TOKEN = $PatientResponse.accessToken

# 4. Capture Reference IDs
$Pharmas = Invoke-RestMethod -Uri "http://localhost:3000/api/pharmacies" -Method Get -Headers @{ Authorization = "Bearer $env:ADMIN_TOKEN" }
$env:PHARMA_ID = $Pharmas[0].id

$Meds = Invoke-RestMethod -Uri "http://localhost:3000/api/medications" -Method Get -Headers @{ Authorization = "Bearer $env:PATIENT_TOKEN" }
$env:MED_ID = $Meds[0].id

Write-Host "Setup Complete. Refs: Pharma=$env:PHARMA_ID, Med=$env:MED_ID"
```

---

## 💊 I. Use Cases Pharmacien (The Supplier)

### UC1: Gérer Compte
#### UC1a: Créer compte (Register) 🛠️ [SPEC]
*   **Goal**: Sign up a new pharmacist.
```bash
curl -X POST "http://localhost:3000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "new.pharma@medilink.cm",
    "password": "Password123!",
    "fullName": "Jean Nouveau",
    "role": "PHARMACIST",
    "phone": "+237600000001"
  }'
```

#### UC1b: Se connecter (Login) ✅ [LIVE]
*   **Goal**: Obtain JWT.
*   **See**: *Environment Setup* section above.

#### UC1c: Modifier profil 🛠️ [SPEC]
*   **Goal**: Update own phone number or name.
```bash
curl -X PATCH "http://localhost:3000/api/users/profile" \
  -H "Authorization: Bearer $PHARMA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "phone": "+237699999999" }'
```

### UC2: Gérer Stocks
#### UC2a: Ajouter médicament ✅ [LIVE]
```bash
curl -X POST "http://localhost:3000/api/inventory-items" \
  -H "Authorization: Bearer $PHARMA_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"pharmacyId\": \"$PHARMA_ID\",
    \"medicationId\": \"$MED_ID\",
    \"batchNumber\": \"DEMO-BATCH-$(date +%s)\",
    \"expirationDate\": \"2026-01-01T00:00:00Z\",
    \"quantityInStock\": 100,
    \"unitPriceFcfa\": 500,
    \"sellingPriceFcfa\": 750
  }"
```

#### UC2b: Modifier quantité ✅ [LIVE]
```bash
# First get the Item ID
export ITEM_ID=$(curl -s -X GET "http://localhost:3000/api/inventory-items?pharmacyId=$PHARMA_ID" \
  -H "Authorization: Bearer $PHARMA_TOKEN" | jq -r '.[0].id')

curl -X PATCH "http://localhost:3000/api/inventory-items/$ITEM_ID" \
  -H "Authorization: Bearer $PHARMA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "quantityInStock": 80 }'
```

#### UC2c: Supprimer médicament 🛠️ [SPEC]
```bash
curl -X DELETE "http://localhost:3000/api/inventory-items/$ITEM_ID" \
  -H "Authorization: Bearer $PHARMA_TOKEN"
```

#### UC2d: Marquer rupture 🛠️ [SPEC]
*   **Goal**: Explicitly mark as non-available without deleting history.
```bash
curl -X PATCH "http://localhost:3000/api/inventory-items/$ITEM_ID" \
  -H "Authorization: Bearer $PHARMA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "isAvailable": false, "quantityInStock": 0 }'
```

#### UC2e: Importer CSV ✅ [LIVE] (Stubbed)
```bash
curl -X POST "http://localhost:3000/api/inventory-items/csv" \
  -H "Authorization: Bearer $PHARMA_TOKEN" \
  -F "file=@/path/to/inventory.csv"
```

### UC3: Consulter Statistiques
#### UC3a: Recherches par médicament ✅ [LIVE]
*   **Goal**: See how many times users searched for a specific drug I sell.
*   **Logic**: Aggregates data from `Search` logs (last 30 days, 20km radius).
```bash
curl -X GET "http://localhost:3000/api/analytics/pharmacy/$PHARMA_ID/stats" \
  -H "Authorization: Bearer $PHARMA_TOKEN"
```

#### UC3b: Statistiques visites 🛠️ [SPEC]
*   **Goal**: Number of profile views.
```bash
curl -X GET "http://localhost:3000/api/analytics/pharmacist/visits?period=30d" \
  -H "Authorization: Bearer $PHARMA_TOKEN"
```

#### UC3c: Tendance demande ✅ [LIVE] (via Stats Endpoint)
*   **Goal**: What people are searching for in my city.
*   **Note**: The `/stats` endpoint includes "Top Requested Medications" in the area.
```bash
# Same as UC3a
curl -X GET "http://localhost:3000/api/analytics/pharmacy/$PHARMA_ID/stats" \
  -H "Authorization: Bearer $PHARMA_TOKEN"
```

### UC4: Gérer Pharmacie Info
#### UC4a: Modifier adresse 🛠️ [SPEC]
*   **Goal**: Update location coordinates.
```bash
export ADDR_ID=$(curl -s -X GET "http://localhost:3000/api/pharmacies/$PHARMA_ID" \
  -H "Authorization: Bearer $PHARMA_TOKEN" | jq -r '.addressId')

curl -X PATCH "http://localhost:3000/api/addresses/$ADDR_ID" \
  -H "Authorization: Bearer $PHARMA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "latitude": 3.8480, "longitude": 11.5021 }'
```

#### UC4b: Modifier horaires ✅ [LIVE]
```bash
curl -X PATCH "http://localhost:3000/api/pharmacies/$PHARMA_ID" \
  -H "Authorization: Bearer $PHARMA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "openingTime": "1970-01-01T07:30:00.000Z" }'
```

#### UC4c: Modifier contacts 🛠️ [SPEC]
```bash
curl -X PATCH "http://localhost:3000/api/pharmacies/$PHARMA_ID" \
  -H "Authorization: Bearer $PHARMA_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "phone": "+237600000000", "emergencyPhone": "+237699999999" }'
```

---

## 🚑 II. Use Cases Patient (The Consumer)

### UC1: Rechercher Médicament
#### UC1a: Auto-complétion & UC1c: Fuzzy 🛠️ [SPEC]
*   **Goal**: Type "doli" or "dolirpane" and get results.
```bash
curl -X GET "http://localhost:3000/api/medications/search?term=doliprn&fuzzy=true"
```

#### UC1b: Suggestions similaires 🛠️ [SPEC]
*   **Goal**: If out of stock, suggest generics (DCI match).
```bash
curl -X GET "http://localhost:3000/api/medications/$MED_ID/alternatives"
```

### UC2: Voir Pharmacies sur Carte
#### UC2a: Géolocalisation (Search by Box) ✅ [LIVE]
*   **Goal**: Find pharmacies purely by location (for map view).
```bash
curl -X GET "http://localhost:3000/api/search/nearby?userLat=3.86&userLng=11.51&radiusKm=5" \
  -H "Authorization: Bearer $PATIENT_TOKEN"
```

### UC3: Filtrer Résultats ✅ [LIVE]
*   **Goal**: Find "Paracétamol" nearby, open NOW, under 500 FCFA.
*   **Note**: Uses `GET` with Query Params standard.
```bash
curl -X GET "http://localhost:3000/api/search?term=Paracétamol&userLat=3.8667&userLng=11.5167&isOpen=true&maxPrice=500&radiusKm=2" \
  -H "Authorization: Bearer $PATIENT_TOKEN"
```

### UC4: Consulter Infos Pharmacie
#### UC4a/c/d: Détails Complets ✅ [LIVE]
```bash
curl -X GET "http://localhost:3000/api/pharmacies/$PHARMA_ID" \
  -H "Authorization: Bearer $PATIENT_TOKEN"
```

### UC_StockAlert: Alertes Rupture ✅ [LIVE]
```bash
curl -X POST "http://localhost:3000/api/stock-alerts" \
  -H "Authorization: Bearer $PATIENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{ \"medicationId\": \"$MED_ID\", \"notificationChannel\": \"EMAIL\", \"contactInfo\": \"me@test.com\" }"
```

### Additional Patient UCs
#### UC6: Historique Recherches 🛠️ [SPEC]
```bash
curl -X GET "http://localhost:3000/api/users/history" \
  -H "Authorization: Bearer $PATIENT_TOKEN"
```

---

## 🛡️ III. Use Cases Administrateur (The Supervisor)

### UC1: Valider Pharmacies
#### UC1a: Approuver inscription ✅ [LIVE]
```bash
curl -X PATCH "http://localhost:3000/api/admin/pharmacies/$PHARMA_ID/verify" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "isVerified": true }'
```
#### UC1c: Voir Pharmacies en Attente ✅ [LIVE]
```bash
curl -X GET "http://localhost:3000/api/admin/pharmacies/pending" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

#### UC1b: Suspendre/Supprimer 🛠️ [SPEC]
```bash
curl -X PATCH "http://localhost:3000/api/admin/pharmacies/$PHARMA_ID/status" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{ "status": "SUSPENDED" }'
```

### UC2: Superviser Plateforme
#### UC2a: Voir KPIs ✅ [LIVE]
```bash
curl -X GET "http://localhost:3000/api/admin-analytics/dashboard" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

#### UC2b: Logs Système 🛠️ [SPEC]
```bash
curl -X GET "http://localhost:3000/api/admin/logs?limit=50" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### UC3: Gérer Données
#### UC3b: Importer Médicaments 🛠️ [SPEC]
```bash
curl -X POST "http://localhost:3000/api/admin/medications/import" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -F "file=@/path/to/med_db.json"
```

#### UC3a: Exporter Données 🛠️ [SPEC]
```bash
curl -X GET "http://localhost:3000/api/admin/export/users" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  --output users_backup.csv
```

---

## ⚡ IV. Real-Time (WebSockets)

### UC5: Mises à jour Stock ✅ [LIVE]
*   **Protocol**: Socket.io
*   **Namespace**: `/stock`
*   **Event**: `stock_update`

#### Client Example (JS)
```javascript
const socket = io('http://localhost:3000/stock');

socket.on('connect', () => {
  console.log('Connected to Stock Stream');
});

socket.on('stock_update', (data) => {
  console.log('Stock Change Detected:', data);
  // Data: { pharmacyId, medicationId, newQuantity, timestamp }
  // Action: Update UI pill count instantly
});
```

---

## 📐 Data Types & Constraints (Parameter Dictionary)

### 1. InventoryItem (Stock)
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `quantityInStock` | Int | Yes | Real-time physical count. Min: 0. |
| `unitPriceFcfa` | Int | Yes | Cost price. |
| `sellingPriceFcfa` | Int | Yes | **Patient Price**. Must be consistent. |
| `lastRestocked` | Date | No | ISO 8601. Updates automatically on PUT. |

### 2. SearchFilter
| Field | Type | Default | Impact |
| :--- | :--- | :--- | :--- |
| `isOpen` | Bool | false | Checks `openingTime` vs `now` vs `workingDays`. |
| `maxPrice` | Int | null | Filters `sellingPriceFcfa` <= Value. |
| `maxDistanceKm` | Int | 10 | Haversine distance from `userLat/Lng`. |
