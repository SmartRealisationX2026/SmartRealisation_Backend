import {
  CreateInventoryItemDto,
  UpdateInventoryItemDto,
} from '../dtos';
import { InventoryItem } from '../entities';

export abstract class InventoryItemRepository {
  abstract findOne(id: string): Promise<InventoryItem | null>;
  abstract create(item: CreateInventoryItemDto): Promise<InventoryItem>;
  abstract update(
    id: string,
    item: UpdateInventoryItemDto,
  ): Promise<InventoryItem>;
  abstract delete(id: string): Promise<void>;
  abstract findAll(): Promise<InventoryItem[]>;
  abstract findByPharmacy(pharmacyId: string): Promise<InventoryItem[]>;
  abstract findByMedication(medicationId: string): Promise<InventoryItem[]>;
  abstract findByPharmacyAndMedication(
    pharmacyId: string,
    medicationId: string,
  ): Promise<InventoryItem[]>;
  abstract findAvailable(): Promise<InventoryItem[]>;
  abstract findAvailableByPharmacy(
    pharmacyId: string,
  ): Promise<InventoryItem[]>;
  abstract findAvailableByMedication(
    medicationId: string,
  ): Promise<InventoryItem[]>;
  abstract findByLocationAndMedication(
    latitude: number,
    longitude: number,
    medicationId: string,
    radiusKm: number,
  ): Promise<InventoryItem[]>;
  abstract findLowStock(threshold: number): Promise<InventoryItem[]>;
  abstract findExpiringSoon(days: number): Promise<InventoryItem[]>;
  abstract findExpired(): Promise<InventoryItem[]>;
  abstract updateStock(
    id: string,
    quantity: number,
  ): Promise<InventoryItem>;
  abstract updatePrice(
    id: string,
    unitPrice: number,
    sellingPrice: number,
    changedBy: string,
  ): Promise<InventoryItem>;
}

