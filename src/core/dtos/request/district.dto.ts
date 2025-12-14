import {
  IsString,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';
import { PartialType, IntersectionType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreateDistrictDto {
  @IsUUID()
  @IsNotEmpty()
  cityId: string;

  @IsString()
  @IsNotEmpty()
  nameFr: string;

  @IsString()
  @IsNotEmpty()
  nameEn: string;
}

class DistrictId {
  @IsUUID()
  district_id: string;

  @Type(() => Date)
  updatedAt: Date = new Date();
}

export class UpdateDistrictDto extends IntersectionType(
  PartialType(CreateDistrictDto),
  DistrictId,
) {}

