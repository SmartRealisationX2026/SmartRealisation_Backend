import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MedicationService } from 'src/use-cases/medication/medication/medication.service';
import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

class AutocompleteQueryDto {
  @IsString()
  @MinLength(2)
  q: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}

@ApiTags('Medications')
@Controller('api/medications')
export class MedicationController {
  constructor(private readonly medicationService: MedicationService) {}

  @Get('autocomplete')
  @ApiOperation({ summary: 'Autocomplete medications (fuzzy search)' })
  @ApiQuery({ name: 'q', description: 'Search text (min 2 chars)', required: true })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Max results' })
  @ApiResponse({
    status: 200,
    description: 'List of medication suggestions',
  })
  async autocomplete(@Query() query: AutocompleteQueryDto) {
    const { q, limit = 10 } = query;
    return { suggestions: await this.medicationService.autocomplete(q, limit) };
  }
}
