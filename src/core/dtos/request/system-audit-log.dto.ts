import {
  IsUUID,
  IsNotEmpty,
  IsEnum,
  IsString,
  IsOptional,
} from 'class-validator';
import { PartialType, IntersectionType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { ActionType } from 'src/generated/prisma';

export class CreateSystemAuditLogDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsEnum(ActionType)
  @IsNotEmpty()
  actionType: ActionType;

  @IsString()
  @IsNotEmpty()
  entityType: string;

  @IsString()
  @IsNotEmpty()
  entityId: string;

  @IsOptional()
  oldValues?: any;

  @IsOptional()
  newValues?: any;

  @IsString()
  @IsOptional()
  ipAddress?: string;
}

class SystemAuditLogId {
  @IsUUID()
  system_audit_log_id: string;

  @Type(() => Date)
  updatedAt: Date = new Date();
}

export class UpdateSystemAuditLogDto extends IntersectionType(
  PartialType(CreateSystemAuditLogDto),
  SystemAuditLogId,
) {}

