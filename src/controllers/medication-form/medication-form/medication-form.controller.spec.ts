import { Test, TestingModule } from '@nestjs/testing';
import { MedicationFormController } from './medication-form.controller';

describe('MedicationFormController', () => {
  let controller: MedicationFormController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicationFormController],
    }).compile();

    controller = module.get<MedicationFormController>(MedicationFormController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
