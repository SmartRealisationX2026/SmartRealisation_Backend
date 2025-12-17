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
import { ApiProperty } from '@nestjs/swagger';

export class CreateInventoryItemDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID of the pharmacy' })
  @IsUUID()
  @IsNotEmpty()
  pharmacyId: string;

  @ApiProperty({ example: '987fcdeb-51a2-12d3-a456-426614174000', description: 'ID of the medication' })
  @IsUUID()
  @IsNotEmpty()
  medicationId: string;

  @ApiProperty({ example: 'BATCH-2025-001', description: 'Manufacturer batch number' })
  @IsString()
  @IsNotEmpty()
  batchNumber: string;

  @ApiProperty({ example: '2026-12-31T23:59:59.000Z', description: 'Expiration date of this batch' })
  @IsNotEmpty()
  @Type(() => Date)
  expirationDate: Date;

  @ApiProperty({ example: 100, description: 'Quantity available in stock', minimum: 0 })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @Type(() => Number)
  quantityInStock: number;

  @ApiProperty({ example: 500, description: 'Cost price per unit in FCFA', minimum: 0 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @Type(() => Number)
  unitPriceFcfa: number;

  @ApiProperty({ example: 800, description: 'Selling price per unit in FCFA', minimum: 0 })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  @Type(() => Number)
  sellingPriceFcfa: number;

  @ApiProperty({ example: true, description: 'Whether the item is available for sale', required: false, default: true })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean = true;

  @ApiProperty({ example: '2025-01-01T10:00:00.000Z', description: 'Last restock date', required: false })
  @IsOptional()
  @Type(() => Date)
  lastRestocked?: Date;
}

class InventoryItemId {
  @ApiProperty({ example: 'uuid-inventory-item', description: 'Unique ID of the inventory item' })
  @IsUUID()
  inventory_item_id: string;

  @ApiProperty({ example: '2025-01-01T10:00:00.000Z', description: 'Timestamp of last update' })
  @Type(() => Date)
  updatedAt: Date = new Date();
}

export class UpdateInventoryItemDto extends IntersectionType(
  PartialType(CreateInventoryItemDto),
  InventoryItemId,
) { }

