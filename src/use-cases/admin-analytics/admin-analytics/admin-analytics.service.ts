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
}
