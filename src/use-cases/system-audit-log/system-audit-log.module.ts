import { Module } from '@nestjs/common';
import { SystemAuditLogService } from './system-audit-log/system-audit-log.service';

@Module({
  providers: [SystemAuditLogService]
})
export class SystemAuditLogModule {}
