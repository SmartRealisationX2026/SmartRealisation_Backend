import { Test, TestingModule } from '@nestjs/testing';
import { MedicationFormService } from './medication-form.service';

describe('MedicationFormService', () => {
  let service: MedicationFormService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicationFormService],
    }).compile();

    service = module.get<MedicationFormService>(MedicationFormService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
