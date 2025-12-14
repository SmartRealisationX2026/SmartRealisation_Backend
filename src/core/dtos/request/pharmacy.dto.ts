import {
  IsString,
  IsUUID,
  IsOptional,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { PartialType, IntersectionType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreatePharmacyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  @IsNotEmpty()
  addressId: string;

  @IsString()
  @IsOptional()
  licenseNumber?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  emergencyPhone?: string;

  @IsBoolean()
  @IsOptional()
  is24_7?: boolean = false;

  @IsOptional()
  @Type(() => Date)
  openingTime?: Date;

  @IsOptional()
  @Type(() => Date)
  closingTime?: Date;

  @IsOptional()
  workingDays?: number[]; // [1,2,3,4,5,6,7]

  @IsUUID()
  @IsNotEmpty()
  ownerId: string;
}

class PharmacyId {
  @IsUUID()
  pharmacy_id: string;

  @Type(() => Date)
  updatedAt: Date = new Date();
}

export class UpdatePharmacyDto extends IntersectionType(
  PartialType(CreatePharmacyDto),
  PharmacyId,
) {}

