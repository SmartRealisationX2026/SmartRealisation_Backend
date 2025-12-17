import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../frameworks/data-services/prisma/prisma.service';

@Injectable()
export class AdminAnalyticsService {
    constructor(private prisma: PrismaService) { }

    async getDashboardData() {
        const [totalUsers, activePharmacies, totalSearches, lowStockItems] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.pharmacy.count({ where: { isVerified: true } }),
            this.prisma.search.count(),
            this.prisma.inventoryItem.count({ where: { quantityInStock: { lt: 10 } } }),
        ]);

        const recentSearches = await this.prisma.search.groupBy({
            by: ['medicationId'],
            _count: {
                medicationId: true,
            },
            orderBy: {
                _count: {
                    medicationId: 'desc',
                },
            },
            take: 5,
        });

        return {
            overview: {
                totalUsers,
                activePharmacies,
                totalSearches,
                lowStockAlerts: lowStockItems,
            },
            topSearchedMedications: recentSearches,
            generatedAt: new Date(),
        };
    }
    async getGlobalTrends() {
        // 1. Top 10 Searched Medications (with Names)
        const topSearches = await this.prisma.search.groupBy({
            by: ['medicationId'],
            _count: { medicationId: true },
            orderBy: { _count: { medicationId: 'desc' } },
            take: 10,
        });

        const enrichedSearches = await Promise.all(topSearches.map(async (s) => {
            const med = await this.prisma.medication.findUnique({ where: { id: s.medicationId } });
            return {
                medication: med?.commercialName || 'Unknown',
                count: s._count.medicationId
            };
        }));

        // 2. Pharmacies per City (Regional Activity)
        const pharmacies = await this.prisma.pharmacy.findMany({
            include: { address: { include: { city: true } } }
        });

        const cityCounts: Record<string, number> = {};
        pharmacies.forEach(p => {
            const cityName = p.address?.city?.nameFr || 'Unknown';
            cityCounts[cityName] = (cityCounts[cityName] || 0) + 1;
        });

        const topCities = Object.entries(cityCounts)
            .map(([city, count]) => ({ city, count }))
            .sort((a, b) => b.count - a.count);

        return {
            topMedications: enrichedSearches,
            activeCities: topCities
        };
    }

    async exportData(entity: 'users' | 'pharmacies'): Promise<string> {
        if (entity === 'users') {
            const users = await this.prisma.user.findMany();
            if (!users.length) return 'id,email,role,fullName\n';
            const header = 'id,email,role,fullName\n';
            const rows = users.map(u => `${u.id},${u.email},${u.role},"${u.fullName}"`).join('\n');
            return header + rows;
        } else if (entity === 'pharmacies') {
            const pharms = await this.prisma.pharmacy.findMany({ include: { address: { include: { city: true } } } });
            if (!pharms.length) return 'id,name,city,status\n';
            const header = 'id,name,city,isVerified\n';
            const rows = pharms.map(p => `${p.id},"${p.name}","${p.address?.city?.nameFr || 'N/A'}",${p.isVerified}`).join('\n');
            return header + rows;
        }
        return '';
    }
}
