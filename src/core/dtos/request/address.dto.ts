import {
  IsString,
  IsUUID,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsDecimal,
} from 'class-validator';
import { PartialType, IntersectionType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreateAddressDto {
  @IsUUID()
  @IsNotEmpty()
  cityId: string;

  @IsUUID()
  @IsOptional()
  districtId?: string;

  @IsString()
  @IsNotEmpty()
  streetAddress: string;

  @IsString()
  @IsOptional()
  landmark?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  longitude: number;
}

class AddressId {
  @IsUUID()
  address_id: string;

  @Type(() => Date)
  updatedAt: Date = new Date();
}

export class UpdateAddressDto extends IntersectionType(
  PartialType(CreateAddressDto),
  AddressId,
) {}

