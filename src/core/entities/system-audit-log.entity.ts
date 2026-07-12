import { User } from './user.entity';
import { ActionType } from 'src/generated/prisma';

export class SystemAuditLog {
  id: string;
  userId: string;
  actionType: ActionType;
  entityType: string;
  entityId: string;
  oldValues?: any | null; // JSON
  newValues?: any | null; // JSON
  ipAddress?: string | null;
  createdAt: Date;

  // Relations
  user?: User;
}

