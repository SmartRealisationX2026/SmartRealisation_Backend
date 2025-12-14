import {
  IsUUID,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  IsString,
} from 'class-validator';
import { PartialType, IntersectionType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { AlertStatus, NotificationChannel } from '@prisma/client';



export class CreateStockAlertDto {
  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsUUID()
  @IsNotEmpty()
  medicationId: string;

  @IsUUID()
  @IsOptional()
  pharmacyId?: string;

  @IsEnum(NotificationChannel)
  @IsNotEmpty()
  notificationChannel: NotificationChannel;

  @IsString()
  @IsNotEmpty()
  contactInfo: string;

  @IsEnum(AlertStatus)
  @IsOptional()
  status?: AlertStatus = AlertStatus.ACTIVE;

  @IsOptional()
  @Type(() => Date)
  expiresAt?: Date;
}

class StockAlertId {
  @IsUUID()
  stock_alert_id: string;

  @Type(() => Date)
  updatedAt: Date = new Date();
}

export class UpdateStockAlertDto extends IntersectionType(
  PartialType(CreateStockAlertDto),
  StockAlertId,
) {}

