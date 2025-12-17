import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SearchService } from '../../../use-cases/search/search/search.service';
import { SearchFilterDto } from '../../../core/dtos/request/search-filter.dto';

@ApiTags('Patient Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) { }

  @Get()
  @ApiOperation({
    summary: 'Search for medications in nearby pharmacies',
    description: `
    **UC1: Search for Medication**
    - Returns a list of pharmacies that have the specific medication in stock.
    - Results are sorted by distance (nearest first).
    - Can filter by 'Open Now' status and 'Max Price'.
    `
  })
  @ApiQuery({ name: 'term', required: false, description: 'Commercial name of the medication (e.g. "Doliprane")' })
  @ApiQuery({ name: 'medicationId', required: false, description: 'Precise ID from autocomplete (overrides term)' })
  @ApiQuery({ name: 'userLat', required: true, type: Number, example: 3.8480 })
  @ApiQuery({ name: 'userLng', required: true, type: Number, example: 11.5021 })
  @ApiQuery({ name: 'isOpen', required: false, type: Boolean, description: 'Only show pharmacies currently open' })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number, description: 'Filter by maximum selling price (FCFA)' })
  @ApiQuery({ name: 'radiusKm', required: false, type: Number, example: 10, description: 'Search radius in KM (Default: 10)' })
  @ApiResponse({
    status: 200,
    description: 'List of matching inventory items with distance.',
    schema: {
      example: [
        {
          "id": "item-uuid",
          "quantityInStock": 50,
          "sellingPriceFcfa": 1500,
          "distanceKm": 2.5,
          "isOpen": true,
          "pharmacy": { "name": "Pharmacie de la Cathédrale", "address": { "city": { "nameFr": "Yaoundé" } } }
        }
      ]
    }
  })
  async search(@Query() filters: SearchFilterDto) {
    return this.searchService.searchPharmacies(filters);
  }

  @Get('nearby')
  @ApiOperation({
    summary: 'Find pharmacies near a location (Map View)',
    description: `
    **UC2: Geolocation / Map**
    - Returns all APPROVED pharmacies within the radius.
    - Used to populate the map view.
    `
  })
  @ApiQuery({ name: 'userLat', required: true, type: Number })
  @ApiQuery({ name: 'userLng', required: true, type: Number })
  @ApiQuery({ name: 'radiusKm', required: false, type: Number, example: 5 })
  @ApiResponse({
    status: 200,
    description: 'List of pharmacies with coordinates.',
    schema: {
      example: [
        { "id": "pharma-uuid", "name": "Pharmacie du Soleil", "latitude": 3.85, "longitude": 11.51, "distanceKm": 1.2 }
      ]
    }
  })
  async findNearby(@Query() filters: SearchFilterDto) {
    return this.searchService.getNearbyPharmacies(filters);
  }
}
