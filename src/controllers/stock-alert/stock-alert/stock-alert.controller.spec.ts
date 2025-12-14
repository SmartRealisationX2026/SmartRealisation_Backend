import { Test, TestingModule } from '@nestjs/testing';
import { StockAlertController } from './stock-alert.controller';

describe('StockAlertController', () => {
  let controller: StockAlertController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockAlertController],
    }).compile();

    controller = module.get<StockAlertController>(StockAlertController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
