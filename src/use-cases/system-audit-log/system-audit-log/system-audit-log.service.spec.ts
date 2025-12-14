import { Test, TestingModule } from '@nestjs/testing';
import { SystemAuditLogService } from './system-audit-log.service';

describe('SystemAuditLogService', () => {
  let service: SystemAuditLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SystemAuditLogService],
    }).compile();

    service = module.get<SystemAuditLogService>(SystemAuditLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
