import {
  IsUUID,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsInt,
  Min,
} from 'class-validator';
import { PartialType, IntersectionType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreateSearchDto {
  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsUUID()
  @IsNotEmpty()
  medicationId: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  longitude: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  radiusKm?: number;

  @IsOptional()
  filtersApplied?: Record<string, any>;
}

class SearchId {
  @IsUUID()
  search_id: string;

  @Type(() => Date)
  updatedAt: Date = new Date();
}

export class UpdateSearchDto extends IntersectionType(
  PartialType(CreateSearchDto),
  SearchId,
) {}

