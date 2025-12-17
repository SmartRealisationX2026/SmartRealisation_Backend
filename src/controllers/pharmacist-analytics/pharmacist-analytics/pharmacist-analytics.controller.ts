import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PharmacistAnalyticsService } from '../../../use-cases/pharmacist-analytics/pharmacist-analytics/pharmacist-analytics.service';

@ApiTags('Pharmacist Analytics')
@Controller('analytics/pharmacy')
export class PharmacistAnalyticsController {
    constructor(private readonly service: PharmacistAnalyticsService) { }

    @Get(':id/stats')
    @ApiOperation({
        summary: 'Get local demand statistics for a pharmacy',
        description: `
        **UC3: Local Market Intelligence**
        - Aggregates "Unmet Demand" from user searches.
        - **Scope**: Searches within 20km radius of the pharmacy.
        - **Timeframe**: Last 30 Days.
        - **Data**: Total search volume + Top 5 requested medications.
        `
    })
    @ApiResponse({
        status: 200,
        description: 'Returns search volume and top medications in 20km radius.',
        schema: {
            example: {
                "period": "Last 30 Days",
                "totalLocalSearches": 150,
                "nearbyRadiusKm": 20,
                "topRequestedMedications": [
                    { "name": "Doliprane 1000mg", "count": 45 },
                    { "name": "Spasfon", "count": 30 }
                ]
            }
        }
    })
    getStats(@Param('id') id: string) {
        return this.service.getPharmacyStats(id);
    }
}
