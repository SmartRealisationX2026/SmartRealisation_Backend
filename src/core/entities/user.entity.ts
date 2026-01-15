import { Pharmacy } from './pharmacy.entity';
import { Search } from './search.entity';
import { StockAlert } from './stock-alert.entity';
import { SystemAuditLog } from './system-audit-log.entity';
import { PriceHistory } from './price-history.entity';
import { Language, UserRole } from 'src/generated/prisma';

export class User {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  fullName: string;
  phone?: string | null;
  preferredLanguage: Language;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;

  // Relations
  ownedPharmacies?: Pharmacy[];
  searches?: Search[];
  stockAlerts?: StockAlert[];
  systemAuditLogs?: SystemAuditLog[];
  priceHistory?: PriceHistory[];
}
