import {
  IsUUID,
  IsNotEmpty,
  IsNumber,
  Min,
} from 'class-validator';
import { PartialType, IntersectionType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreatePriceHistoryDto {
  @IsUUID()
  @IsNotEmpty()
  inventoryItemId: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @Type(() => Number)
  oldPriceFcfa: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @Type(() => Number)
  newPriceFcfa: number;

  @IsUUID()
  @IsNotEmpty()
  changedBy: string;
}

class PriceHistoryId {
  @IsUUID()
  price_history_id: string;

  @Type(() => Date)
  updatedAt: Date = new Date();
}

export class UpdatePriceHistoryDto extends IntersectionType(
  PartialType(CreatePriceHistoryDto),
  PriceHistoryId,
) {}

