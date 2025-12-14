import {
  IsString,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';
import { PartialType, IntersectionType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreateCityDto {
  @IsString()
  @IsNotEmpty()
  nameFr: string;

  @IsString()
  @IsNotEmpty()
  nameEn: string;

  @IsString()
  @IsNotEmpty()
  region: string;
}

class CityId {
  @IsUUID()
  city_id: string;

  @Type(() => Date)
  updatedAt: Date = new Date();
}

export class UpdateCityDto extends IntersectionType(
  PartialType(CreateCityDto),
  CityId,
) {}

