import { Test, TestingModule } from '@nestjs/testing';
import { StockAlertService } from './stock-alert.service';

describe('StockAlertService', () => {
  let service: StockAlertService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StockAlertService],
    }).compile();

    service = module.get<StockAlertService>(StockAlertService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
