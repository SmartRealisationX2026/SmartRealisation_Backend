import { Address } from './address.entity';
import { User } from './user.entity';
import { InventoryItem } from './inventory-item.entity';
import { StockAlert } from './stock-alert.entity';

export class Pharmacy {
  id: string;
  name: string;
  addressId: string;
  licenseNumber?: string | null;
  phone?: string | null;
  emergencyPhone?: string | null;
  is24_7: boolean;
  openingTime?: Date | null;
  closingTime?: Date | null;
  workingDays: number[]; // JSON array [1,2,3,4,5,6,7]
  ownerId: string;
  isVerified: boolean;
  verifiedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  address?: Address;
  owner?: User;
  inventoryItems?: InventoryItem[];
  stockAlerts?: StockAlert[];
}

