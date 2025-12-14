import {
  IsString,
  IsUUID,
  IsNotEmpty,
  IsInt,
  Min,
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { PartialType, IntersectionType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreateInventoryItemDto {
  @IsUUID()
  @IsNotEmpty()
  pharmacyId: string;

  @IsUUID()
  @IsNotEmpty()
  medicationId: string;

  @IsString()
  @IsNotEmpty()
  batchNumber: string;

  @IsNotEmpty()
  @Type(() => Date)
  expirationDate: Date;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @Type(() => Number)
  quantityInStock: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @Type(() => Number)
  unitPriceFcfa: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @Type(() => Number)
  sellingPriceFcfa: number;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean = true;

  @IsOptional()
  @Type(() => Date)
  lastRestocked?: Date;
}

class InventoryItemId {
  @IsUUID()
  inventory_item_id: string;

  @Type(() => Date)
  updatedAt: Date = new Date();
}

export class UpdateInventoryItemDto extends IntersectionType(
  PartialType(CreateInventoryItemDto),
  InventoryItemId,
) {}

