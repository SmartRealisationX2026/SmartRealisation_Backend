import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminAnalyticsService } from '../../../use-cases/admin-analytics/admin-analytics/admin-analytics.service';

@ApiTags('Admin Analytics')
@Controller('admin-analytics')
export class AdminAnalyticsController {
    constructor(private readonly analyticsService: AdminAnalyticsService) { }

    @Get('dashboard')
    @ApiOperation({ summary: 'Get aggregated dashboard statistics' })
    @ApiResponse({
        status: 200,
        description: 'Dashboard KPIs retrieved successfully.',
        schema: {
            example: {
                overview: {
                    totalUsers: 150,
                    activePharmacies: 12,
                    totalSearches: 450,
                    lowStockAlerts: 5
                },
                topSearchedMedications: [
                    { medicationId: "uuid-1", _count: { medicationId: 45 } },
                    { medicationId: "uuid-2", _count: { medicationId: 30 } }
                ],
                generatedAt: "2025-12-17T12:00:00.000Z"
            }
        }
    })
    getDashboardData() {
        return this.analyticsService.getDashboardData();
    }
}
