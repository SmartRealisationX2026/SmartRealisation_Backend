import {
  CreatePriceHistoryDto,
  UpdatePriceHistoryDto,
} from '../dtos';
import { PriceHistory } from '../entities';

export abstract class PriceHistoryRepository {
  abstract findOne(id: string): Promise<PriceHistory | null>;
  abstract create(priceHistory: CreatePriceHistoryDto): Promise<PriceHistory>;
  abstract update(
    id: string,
    priceHistory: UpdatePriceHistoryDto,
  ): Promise<PriceHistory>;
  abstract delete(id: string): Promise<void>;
  abstract findAll(): Promise<PriceHistory[]>;
  abstract findByInventoryItem(
    inventoryItemId: string,
  ): Promise<PriceHistory[]>;
  abstract findByUser(userId: string): Promise<PriceHistory[]>;
  abstract findRecent(limit?: number): Promise<PriceHistory[]>;
  abstract getPriceTrend(
    inventoryItemId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<PriceHistory[]>;
}

