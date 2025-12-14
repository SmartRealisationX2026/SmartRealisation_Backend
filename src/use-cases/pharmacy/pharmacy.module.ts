import { Module } from '@nestjs/common';
import { PharmacyService } from './pharmacy/pharmacy.service';

@Module({
  providers: [PharmacyService]
})
export class PharmacyModule {}
