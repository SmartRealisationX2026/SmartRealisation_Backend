import { InventoryItem } from './inventory-item.entity';
import { User } from './user.entity';

export class PriceHistory {
  id: string;
  inventoryItemId: string;
  oldPriceFcfa: number;
  newPriceFcfa: number;
  changedAt: Date;
  changedBy: string;

  // Relations
  inventoryItem?: InventoryItem;
  user?: User;
}

