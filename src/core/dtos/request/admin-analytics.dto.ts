import {
  IsNotEmpty,
  IsInt,
  Min,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { PartialType, IntersectionType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreateAdminAnalyticsDto {
  @IsNotEmpty()
  @Type(() => Date)
  analyticsDate: Date;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @Type(() => Number)
  totalSearches: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @Type(() => Number)
  successfulSearches: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @Type(() => Number)
  newUsers: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @Type(() => Number)
  activePharmacies: number;

  @IsOptional()
  topMedications?: any;

  @IsOptional()
  searchHeatmap?: any;
}

class AdminAnalyticsId {
  @IsUUID()
  admin_analytics_id: string;

  @Type(() => Date)
  updatedAt: Date = new Date();
}

export class UpdateAdminAnalyticsDto extends IntersectionType(
  PartialType(CreateAdminAnalyticsDto),
  AdminAnalyticsId,
) {}

