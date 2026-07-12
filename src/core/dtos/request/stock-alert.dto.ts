import {
  IsUUID,
  IsOptional,
  IsNotEmpty,
  IsEnum,
  IsString,
} from 'class-validator';
import { PartialType, IntersectionType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { AlertStatus, NotificationChannel } from 'src/generated/prisma';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStockAlertDto {
  @ApiProperty({ example: 'uuid-user', description: 'ID of the user subscribing', required: false })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiProperty({ example: 'uuid-medication', description: 'ID of the medication to watch' })
  @IsUUID()
  @IsNotEmpty()
  medicationId: string;

  @ApiProperty({ example: 'uuid-pharmacy', description: 'Specific pharmacy to watch (optional)', required: false })
  @IsUUID()
  @IsOptional()
  pharmacyId?: string;

  @ApiProperty({ example: 'EMAIL', enum: NotificationChannel, description: 'Channel for notification' })
  @IsEnum(NotificationChannel)
  @IsNotEmpty()
  notificationChannel: NotificationChannel;

  @ApiProperty({ example: 'user@example.com', description: 'Contact details (email or phone)' })
  @IsString()
  @IsNotEmpty()
  contactInfo: string;

  @ApiProperty({ example: 'ACTIVE', enum: AlertStatus, description: 'Initial status', default: 'ACTIVE', required: false })
  @IsEnum(AlertStatus)
  @IsOptional()
  status?: AlertStatus = AlertStatus.ACTIVE;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', description: 'Alert expiration date', required: false })
  @IsOptional()
  @Type(() => Date)
  expiresAt?: Date;
}

class StockAlertId {
  @ApiProperty({ example: 'uuid-alert', description: 'Unique ID of the alert' })
  @IsUUID()
  stock_alert_id: string;

  @ApiProperty({ example: '2025-01-01T10:00:00.000Z', description: 'Timestamp of last update' })
  @Type(() => Date)
  updatedAt: Date = new Date();
}

export class UpdateStockAlertDto extends IntersectionType(
  PartialType(CreateStockAlertDto),
  StockAlertId,
) { }

