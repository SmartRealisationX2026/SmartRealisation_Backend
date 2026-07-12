import {
  CreateSystemAuditLogDto,
  UpdateSystemAuditLogDto,
} from '../dtos';
import { SystemAuditLog } from '../entities';
import { ActionType } from 'src/generated/prisma';

export abstract class SystemAuditLogRepository {
  abstract findOne(id: string): Promise<SystemAuditLog | null>;
  abstract create(log: CreateSystemAuditLogDto): Promise<SystemAuditLog>;
  abstract update(
    id: string,
    log: UpdateSystemAuditLogDto,
  ): Promise<SystemAuditLog>;
  abstract delete(id: string): Promise<void>;
  abstract findAll(): Promise<SystemAuditLog[]>;
  abstract findByUser(userId: string): Promise<SystemAuditLog[]>;
  abstract findByActionType(actionType: ActionType): Promise<SystemAuditLog[]>;
  abstract findByEntity(entityType: string, entityId: string): Promise<SystemAuditLog[]>;
  abstract findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<SystemAuditLog[]>;
  abstract findRecent(limit?: number): Promise<SystemAuditLog[]>;
  abstract getAuditTrail(
    entityType: string,
    entityId: string,
  ): Promise<SystemAuditLog[]>;
}

