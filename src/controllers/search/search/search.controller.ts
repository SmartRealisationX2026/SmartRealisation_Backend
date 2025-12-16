import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { SearchService } from 'src/use-cases/search/search/search.service';

class PharmacySearchQueryDto {
  @IsUUID()
  medicationId: string;

  @Type(() => Number)
  @IsNumber()
  latitude: number;

  @Type(() => Number)
  @IsNumber()
  longitude: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  radiusKm?: number = 10;
}

@ApiTags('Search')
@Controller('api/pharmacies')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('search')
  @ApiOperation({ summary: 'Find pharmacies with medication and distance' })
  @ApiQuery({ name: 'medicationId', required: true, description: 'Medication UUID' })
  @ApiQuery({ name: 'latitude', required: true, type: Number })
  @ApiQuery({ name: 'longitude', required: true, type: Number })
  @ApiQuery({ name: 'radiusKm', required: false, type: Number, description: 'Search radius in km (1-50)' })
  @ApiResponse({ status: 200, description: 'Pharmacies with stock sorted by distance' })
  async search(@Query() query: PharmacySearchQueryDto) {
    const { medicationId, latitude, longitude, radiusKm = 10 } = query;
    const pharmacies = await this.searchService.searchPharmacies({
      medicationId,
      latitude,
      longitude,
      radiusKm,
    });
    return { pharmacies };
  }
}
