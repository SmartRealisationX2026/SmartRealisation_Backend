import { Module } from '@nestjs/common';
import { PharmacyService } from './pharmacy/pharmacy.service';
import { PrismaModule } from '../../frameworks/data-services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PharmacyService],
  exports: [PharmacyService],
})
export class PharmacyModule {}
