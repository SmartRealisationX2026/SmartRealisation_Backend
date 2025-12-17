import { Module } from '@nestjs/common';
import { PharmacyService } from './pharmacy/pharmacy.service';
import { PrismaModule } from '../../frameworks/data-services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [], // Service is used by PharmacyController (in AppModule list). 
  // Wait, PharmacyController is in AppModule controllers list? 
  // Check AppModule... Yes. 
  // But usually Modules export Providers and Controllers are in the Module.
  // The current codebase puts Controllers in AppModule. 
  // So I should add AdminPharmacyController to AppModule, NOT PharmacyModule if I follow existing pattern.
  providers: [PharmacyService],
  exports: [PharmacyService],
})
export class PharmacyModule { }
