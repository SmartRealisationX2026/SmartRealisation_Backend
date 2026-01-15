import { CreateStockAlertDto, UpdateStockAlertDto } from '../dtos';
import { StockAlert } from '../entities';
import { AlertStatus } from 'src/generated/prisma';

export abstract class StockAlertRepository {
  abstract findOne(id: string): Promise<StockAlert | null>;
  abstract create(alert: CreateStockAlertDto): Promise<StockAlert>;
  abstract update(id: string, alert: UpdateStockAlertDto): Promise<StockAlert>;
  abstract delete(id: string): Promise<void>;
  abstract findAll(): Promise<StockAlert[]>;
  abstract findByUser(userId: string): Promise<StockAlert[]>;
  abstract findByMedication(medicationId: string): Promise<StockAlert[]>;
  abstract findByPharmacy(pharmacyId: string): Promise<StockAlert[]>;
  abstract findByStatus(status: AlertStatus): Promise<StockAlert[]>;
  abstract findActive(): Promise<StockAlert[]>;
  abstract findExpired(): Promise<StockAlert[]>;
  abstract findTriggered(): Promise<StockAlert[]>;
  abstract triggerAlert(id: string): Promise<StockAlert>;
  abstract expireAlert(id: string): Promise<StockAlert>;
  abstract findExpiringSoon(days: number): Promise<StockAlert[]>;
}

