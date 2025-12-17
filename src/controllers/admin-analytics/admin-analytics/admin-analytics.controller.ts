import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
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

    @Get('trends')
    @Get('trends')
    @ApiOperation({
        summary: 'Get advanced global trends (Top Meds, Cities)',
        description: `
        **UC2c: Global Trends**
        - **Top Medications**: Based on aggregation of all User Searches.
        - **Active Cities**: Where are the most pharmacies located?
        - Used for the Admin "Strategy" Dashboard.
        `
    })
    @ApiResponse({
        status: 200,
        description: 'Global insights retrieved.',
        schema: {
            example: {
                "topMedications": [
                    { "medication": "Doliprane 1000mg", "count": 1500 },
                    { "medication": "Efferalgan", "count": 1200 }
                ],
                "activeCities": [
                    { "city": "Yaoundé", "count": 12 },
                    { "city": "Douala", "count": 8 }
                ]
            }
        }
    })
    getTrends() {
        return this.analyticsService.getGlobalTrends();
    }

    @Get('export/:entity')
    @Get('export/:entity')
    @ApiOperation({
        summary: 'Export data to CSV',
        description: `
        **UC3a: Data Export**
        - Returns a **blob** (Content-Type: text/csv).
        - Browser should trigger a file download.
        - Supported entities: 'users' or 'pharmacies'.
        `
    })
    @ApiResponse({ status: 200, description: 'CSV file download.' })
    async exportData(@Param('entity') entity: 'users' | 'pharmacies', @Res() res: Response) {
        const csv = await this.analyticsService.exportData(entity);
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', `attachment; filename=${entity}_export_${Date.now()}.csv`);
        res.send(csv);
    }
}
