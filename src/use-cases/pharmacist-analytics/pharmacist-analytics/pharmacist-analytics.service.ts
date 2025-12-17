import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../frameworks/data-services/prisma/prisma.service';

@Injectable()
export class PharmacistAnalyticsService {
    constructor(private prisma: PrismaService) { }

    async getPharmacyStats(pharmacyId: string) {
        // 1. Get Pharmacy Location
        const pharmacy = await this.prisma.pharmacy.findUnique({
            where: { id: pharmacyId },
            include: { address: true }
        });

        if (!pharmacy) throw new NotFoundException('Pharmacy not found');

        const lat = Number(pharmacy.address.latitude);
        const lng = Number(pharmacy.address.longitude);

        // 2. Find Searches within 20km (Local Demand)
        // We fetch all recent searches and filter in memory for MVP (or use simple lat/lng box)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentSearches = await this.prisma.search.findMany({
            where: {
                searchedAt: { gte: thirtyDaysAgo }
            },
            include: { medication: true }
        });

        const localSearches = recentSearches.filter(s => {
            const sLat = Number(s.latitude);
            const sLng = Number(s.longitude);
            // Simple Haversine
            const R = 6371;
            const dLat = (sLat - lat) * Math.PI / 180;
            const dLon = (sLng - lng) * Math.PI / 180;
            const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat * Math.PI / 180) * Math.cos(sLat * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return (R * c) <= 20; // 20km Radius
        });

        // 3. Aggregate Top Medications
        const medCounts = {};
        localSearches.forEach(s => {
            const medName = s.medication.commercialName;
            medCounts[medName] = (medCounts[medName] || 0) + 1;
        });

        // Sort top 5
        const topMeds = Object.entries(medCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a: any, b: any) => b.count - a.count)
            .slice(0, 5);

        return {
            period: 'Last 30 Days',
            totalLocalSearches: localSearches.length,
            nearbyRadiusKm: 20,
            topRequestedMedications: topMeds
        };
    }
}
