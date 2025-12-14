import { Module } from '@nestjs/common';
import { MedicationFormService } from './medication-form/medication-form.service';

@Module({
  providers: [MedicationFormService]
})
export class MedicationFormModule {}
