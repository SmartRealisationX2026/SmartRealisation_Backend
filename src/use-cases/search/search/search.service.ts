import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../frameworks/data-services/prisma/prisma.service';
import { SearchFilterDto } from '../../../core/dtos/request/search-filter.dto';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) { }

  async searchPharmacies(filters: SearchFilterDto) {
    const { term, medicationId, userLat, userLng, radiusKm, isOpen, maxPrice } = filters;

    // 1. Base Query: Find Inventory Items matching medication
    const radius = radiusKm || 10;

    // STRICT FILTERING: Only verified pharmacies, In Stock, Available.
    const whereClause: any = {
      quantityInStock: { gt: 0 },
      isAvailable: true,
      pharmacy: {
        isVerified: true,
      }
    };

    if (medicationId) {
      whereClause.medicationId = medicationId;
    } else if (term) {
      whereClause.medication = {
        commercialName: { contains: term, mode: 'insensitive' }
      };
    }

    if (maxPrice) {
      whereClause.sellingPriceFcfa = { lte: maxPrice };
    }

    const inventoryItems = await this.prisma.inventoryItem.findMany({
      where: whereClause,
      include: {
        medication: true,
        pharmacy: {
          include: {
            address: true
          }
        }
      }
    });

    // 2. Post-Process: Calculate Distance & Availability
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday
    // Note: isOpen logic is simplified for MVP (check workingDays)

    const mappedResults = inventoryItems.map(item => {
      const lat = Number(item.pharmacy.address.latitude);
      const lng = Number(item.pharmacy.address.longitude);

      // Haversine Distance
      const R = 6371; // Earth radius km
      const dLat = (lat - userLat) * Math.PI / 180;
      const dLon = (lng - userLng) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(userLat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distanceKm = R * c;

      // Check Open Status
      let isOpenCalculated = false;
      if (item.pharmacy.is24_7) {
        isOpenCalculated = true;
      } else {
        const workingDays = item.pharmacy.workingDays as unknown as number[];
        // Map JS 0 -> 7
        const todayPrisma = currentDay === 0 ? 7 : currentDay;

        if (Array.isArray(workingDays) && workingDays.includes(todayPrisma)) {
          // Basic day check
          isOpenCalculated = true;
        }
      }

      return {
        ...item,
        distanceKm,
        isOpen: isOpenCalculated
      };
    });

    // 3. Filter by Radius & Open Status
    let finalResults = mappedResults.filter(r => r.distanceKm <= radius);

    if (isOpen) {
      finalResults = finalResults.filter(r => r.isOpen);
    }

    // 4. Sort by Distance
    finalResults.sort((a, b) => a.distanceKm - b.distanceKm);

    // 5. ASYNC LOGGING (Fire & Forget for performance)
    this.logSearch(filters, finalResults.length).catch(err => console.error('Search Log Error:', err));

    return finalResults;
  }

  private async logSearch(filters: SearchFilterDto, resultsCount: number) {
    // Basic logging. In prod, use a Queue (Bull/Redis).
    // Here we log to DB directly.
    try {
      if (!filters.term && !filters.medicationId) return; // Don't log empty nearby browsing? Or do? 
      // Let's log if there is intent.

      // If medicationId is provided, we need to ensure it checks out or just log it.
      // The Search Entity in Schema requires medicationId? let's check schema.
      // Schema: medicationId String @map("medication_id") @db.Uuid() -> It is REQUIRED relation.
      // If we search by TERM only, we might not have a medicationId immediately unless we exact match a med.
      // IF search is by TERM, we can't easily insert into `Search` table if it demands a valid `medicationId`.
      // Schema check: `medicationId` is Reference to `Medication`.
      // Issue: Simple text search might not map to one ID.
      // Solution for MVP: Only log if `medicationId` is present (Auto-complete selected) OR find best match.
      // If term is used, we might skip logging detailed relational search or find the first match.

      if (filters.medicationId) {
        await this.prisma.search.create({
          data: {
            medicationId: filters.medicationId,
            latitude: filters.userLat,
            longitude: filters.userLng,
            radiusKm: filters.radiusKm || 10,
            filtersApplied: JSON.parse(JSON.stringify(filters)) as any,
            resultsFound: resultsCount
            // userId: can be extracted if we passed User context. For now anonymous.
          }
        });
      }
    } catch (e) {
      // Ignore log errors to not block search
    }
  }

  async getNearbyPharmacies(filters: SearchFilterDto) {
    const { userLat, userLng, radiusKm, isOpen } = filters;

    const pharmacies = await this.prisma.pharmacy.findMany({
      where: { isVerified: true },
      include: { address: true }
    });

    const mapped = pharmacies.map(p => {
      const lat = Number(p.address.latitude);
      const lng = Number(p.address.longitude);

      // Haversine
      const R = 6371;
      const dLat = (lat - userLat) * Math.PI / 180;
      const dLon = (lng - userLng) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(userLat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distanceKm = R * c;

      return { ...p, distanceKm };
    });

    const radius = radiusKm || 10;

    // Filter Radius
    let results = mapped.filter(p => p.distanceKm <= radius);

    // Sort
    results.sort((a, b) => a.distanceKm - b.distanceKm);

    return results;
  }
}
