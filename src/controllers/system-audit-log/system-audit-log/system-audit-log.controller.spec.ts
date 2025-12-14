import { Test, TestingModule } from '@nestjs/testing';
import { SystemAuditLogController } from './system-audit-log.controller';

describe('SystemAuditLogController', () => {
  let controller: SystemAuditLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SystemAuditLogController],
    }).compile();

    controller = module.get<SystemAuditLogController>(SystemAuditLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
