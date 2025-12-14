import {
  IsString,
  IsUUID,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { PartialType, IntersectionType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreateMedicationFormDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  nameFr: string;

  @IsString()
  @IsNotEmpty()
  nameEn: string;

  @IsString()
  @IsOptional()
  description?: string;
}

class MedicationFormId {
  @IsUUID()
  medication_form_id: string;

  @Type(() => Date)
  updatedAt: Date = new Date();
}

export class UpdateMedicationFormDto extends IntersectionType(
  PartialType(CreateMedicationFormDto),
  MedicationFormId,
) {}

