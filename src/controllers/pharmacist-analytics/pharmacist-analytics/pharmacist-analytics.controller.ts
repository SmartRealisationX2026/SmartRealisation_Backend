import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PharmacistAnalyticsService } from '../../../use-cases/pharmacist-analytics/pharmacist-analytics/pharmacist-analytics.service';

@ApiTags('Pharmacist Analytics')
@Controller('analytics/pharmacy')
export class PharmacistAnalyticsController {
    constructor(private readonly service: PharmacistAnalyticsService) { }

    @Get(':id/stats')
    @ApiOperation({ summary: 'Get local demand statistics for a pharmacy' })
    @ApiResponse({ status: 200, description: 'Returns search volume and top medications in 20km radius.' })
    getStats(@Param('id') id: string) {
        return this.service.getPharmacyStats(id);
    }
}
