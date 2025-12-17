import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SearchService } from '../../../use-cases/search/search/search.service';
import { SearchFilterDto } from '../../../core/dtos/request/search-filter.dto';

@ApiTags('Patient Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) { }

  @Get()
  @ApiOperation({
    summary: 'Search for medications in nearby pharmacies',
    description: 'Returns a list of pharmacies having the stock, ordered by distance. Filters available: Open Now, Max Price, Radius.'
  })
  @ApiResponse({ status: 200, description: 'List of matching inventory items with distance.' })
  async search(@Query() filters: SearchFilterDto) {
    return this.searchService.searchPharmacies(filters);
  }

  @Get('nearby')
  @ApiOperation({
    summary: 'Find pharmacies near a location',
    description: 'Returns all verified pharmacies within RADIUS (default 10km) sorted by distance.'
  })
  async findNearby(@Query() filters: SearchFilterDto) {
    return this.searchService.getNearbyPharmacies(filters);
  }
}
