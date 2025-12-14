import {
  IsString,
  IsUUID,
  IsOptional,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { PartialType, IntersectionType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreateMedicationDto {
  @IsString()
  @IsNotEmpty()
  commercialName: string;

  @IsString()
  @IsOptional()
  dciName?: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @IsUUID()
  @IsNotEmpty()
  formId: string;

  @IsString()
  @IsNotEmpty()
  dosageStrength: string;

  @IsString()
  @IsNotEmpty()
  dosageUnit: string;

  @IsBoolean()
  @IsOptional()
  requiresPrescription?: boolean = false;
}

class MedicationId {
  @IsUUID()
  medication_id: string;

  @Type(() => Date)
  updatedAt: Date = new Date();
}

export class UpdateMedicationDto extends IntersectionType(
  PartialType(CreateMedicationDto),
  MedicationId,
) {}

