import { Category } from './category.entity';
import { MedicationForm } from './medication-form.entity';
import { InventoryItem } from './inventory-item.entity';
import { Search } from './search.entity';
import { StockAlert } from './stock-alert.entity';

export class Medication {
  id: string;
  commercialName: string;
  dciName?: string | null;
  categoryId: string;
  formId: string;
  dosageStrength: string;
  dosageUnit: string;
  requiresPrescription: boolean;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  category?: Category;
  form?: MedicationForm;
  inventoryItems?: InventoryItem[];
  searches?: Search[];
  stockAlerts?: StockAlert[];
}

