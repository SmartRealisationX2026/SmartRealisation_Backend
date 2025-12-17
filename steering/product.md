# MediLink - Product Overview

MediLink (SmartRealisation) is a medication linkage platform for Cameroon connecting patients with pharmacies through intelligent search and real-time availability tracking.

## Target Users (Personas)

- **Marie Fotso** - Urban patient: Teacher, needs quick medication search for family, uses basic Android/3G
- **Dr Armand Nkolo** - Prescriber: Doctor prescribing 30-40 patients/day, needs to verify medication availability
- **Justine Mbala** - Pharmacist: Manages pharmacy with 2 employees, wants digital visibility
- **Jean-Paul Ekani** - Administrator: Regulator ensuring pharmacy compliance, fighting counterfeit drugs
- **Thomas Ndongo** - Rural patient: Farmer with chronic condition, limited connectivity, needs reliable access

## User Roles & Capabilities

| Role | Key Actions |
|------|-------------|
| **PATIENT** | Search medications, view pharmacies on map, filter results, set stock alerts, voice search |
| **PHARMACIST** | Manage inventory (add/update/delete), update pharmacy info, view demand statistics, CSV import |
| **ADMIN** | Validate pharmacy accounts, access analytics dashboard, manage categories, audit logs |

## Core Features

- **Medication Search**: Fuzzy search with autocomplete (<2s response), pg_trgm optimization
- **Geolocation**: GPS-based pharmacy search with Haversine distance calculation
- **Real-time Stock**: WebSocket updates when pharmacists modify inventory
- **Stock Alerts**: Notifications via EMAIL, SMS, or PUSH when medications become available
- **Price Tracking**: Historical price changes with audit trail
- **Analytics Dashboard**: Search heatmaps, top medications, user metrics
- **Multi-language**: French (FR) and English (EN) support

## Geographic Context

- **Target Market**: Cameroon (Yaoundé, Douala initially, then national expansion)
- **Location Hierarchy**: Cities (10 regions) → Districts → Addresses with GPS coordinates
- **Currency**: FCFA (Central African CFA franc)
- **Constraints**: Basic smartphones, 3G connectivity, app size <15MB

## SMART Goals (MVP)

1. **Search Time**: 80% of searches complete in <2 minutes
2. **First-trip Success**: +30% success rate finding medication on first pharmacy visit
3. **Pharmacy Revenue**: +20-30% revenue for partner pharmacies
4. **Counterfeit Reduction**: Decrease black market reliance (measured at 12 months)

## Key Differentiators vs Competitors

- Validated pharmacies only (Ordre des Pharmaciens)
- Real-time stock updates (not just static listings)
- Optimized for low-bandwidth/basic devices
- Dedicated prescriber interface (future)
