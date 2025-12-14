import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';
import { IntersectionType, PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class CreateImageDto {
  @IsString()
  image_url: string;
  @IsUUID()
  todo_id: string;
}

class ImageId {
  @IsUUID()
  image_id: string;
}

export class UpdateImageDto extends IntersectionType(
  PartialType(CreateImageDto),
  ImageId,
) {}
