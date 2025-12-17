import {
  IsString,
  IsUUID,
  IsOptional,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { PartialType, IntersectionType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePharmacyDto {
  @ApiProperty({ example: 'Pharmacie Centrale', description: 'Commercial name of the pharmacy' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'uuid-address', description: 'ID of the pharmacy address' })
  @IsUUID()
  @IsNotEmpty()
  addressId: string;

  @ApiProperty({ example: 'LIC-2025-001', description: 'Official license number', required: false })
  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @ApiProperty({ example: '+237690000000', description: 'Primary contact phone', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: '+237699999999', description: 'Emergency / Night shift phone', required: false })
  @IsString()
  @IsOptional()
  emergencyPhone?: string;

  @ApiProperty({ example: false, description: 'Is open 24/7?', default: false, required: false })
  @IsBoolean()
  @IsOptional()
  is24_7?: boolean = false;

  @ApiProperty({ example: '08:00:00', description: 'Opening time (if not 24/7)', required: false })
  @IsOptional()
  @Type(() => Date)
  openingTime?: Date;

  @ApiProperty({ example: '20:00:00', description: 'Closing time (if not 24/7)', required: false })
  @IsOptional()
  @Type(() => Date)
  closingTime?: Date;

  @ApiProperty({ example: [1, 2, 3, 4, 5, 6], description: 'Working days (1=Mon, 7=Sun)', required: false })
  @IsOptional()
  workingDays?: number[]; // [1,2,3,4,5,6,7]

  @ApiProperty({ example: 'uuid-owner', description: 'ID of the Pharmacist owner' })
  @IsUUID()
  @IsNotEmpty()
  ownerId: string;
}

class PharmacyId {
  @ApiProperty({ example: 'uuid-pharmacy', description: 'Unique ID of the pharmacy' })
  @IsUUID()
  pharmacy_id: string;

  @ApiProperty({ example: '2025-01-01T10:00:00.000Z', description: 'Timestamp of last update' })
  @Type(() => Date)
  updatedAt: Date = new Date();
}

export class UpdatePharmacyDto extends IntersectionType(
  PartialType(CreatePharmacyDto),
  PharmacyId,
) { }

