import {
  IsString,
  IsEmail,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsUUID,
  IsEnum,
  IsPhoneNumber,
  IsNotEmpty,
} from 'class-validator';
import { PartialType, IntersectionType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { Language, UserRole } from '@prisma/client';




export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;
  
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole = UserRole.ADMIN;

  @IsPhoneNumber('CM', {message : "vous devez entrer le bon numero"})
  @IsOptional()
  phone? : string

  @IsEnum(Language)
  preferredLanguage : Language

  @IsEmail()
  email: string;

  @IsString()
  passwordHash: string;

}

class UserId {
  @IsUUID()
  id: string;

  @Type(() => Date)
  updatedAt: Date = new Date();
}

export class UpdateUserDto extends IntersectionType(
  PartialType(CreateUserDto),
  UserId,
) {}
