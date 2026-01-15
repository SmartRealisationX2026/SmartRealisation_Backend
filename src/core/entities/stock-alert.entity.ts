import { User } from './user.entity';
import { Medication } from './medication.entity';
import { Pharmacy } from './pharmacy.entity';
import { AlertStatus, NotificationChannel } from 'src/generated/prisma';

export class StockAlert {
  id: string;
  userId?: string | null;
  medicationId: string;
  pharmacyId?: string | null;
  notificationChannel: NotificationChannel;
  contactInfo: string;
  status: AlertStatus;
  createdAt: Date;
  triggeredAt?: Date | null;
  expiresAt?: Date | null;

  // Relations
  user?: User | null;
  medication?: Medication;
  pharmacy?: Pharmacy | null;
}

