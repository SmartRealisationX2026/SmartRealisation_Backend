import {
  IsString,
  IsUUID,
  IsOptional,
  IsNotEmpty,
  IsInt,
  Min,
} from 'class-validator';
import { PartialType, IntersectionType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreateCategoryDto {
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

  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  level?: number = 1;

  @IsUUID()
  @IsOptional()
  parentId?: string;
}

class CategoryId {
  @IsUUID()
  category_id: string;

  @Type(() => Date)
  updatedAt: Date = new Date();
}

export class UpdateCategoryDto extends IntersectionType(
  PartialType(CreateCategoryDto),
  CategoryId,
) {}

