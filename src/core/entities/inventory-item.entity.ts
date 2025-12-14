import { Pharmacy } from './pharmacy.entity';
import { Medication } from './medication.entity';
import { PriceHistory } from './price-history.entity';

export class InventoryItem {
  id: string;
  pharmacyId: string;
  medicationId: string;
  batchNumber: string;
  expirationDate: Date;
  quantityInStock: number;
  unitPriceFcfa: number;
  sellingPriceFcfa: number;
  isAvailable: boolean;
  lastRestocked?: Date | null;
  updatedAt: Date;

  // Relations
  pharmacy?: Pharmacy;
  medication?: Medication;
  priceHistory?: PriceHistory[];
}

