import { Module } from '@nestjs/common';
import { MedicationService } from './medication/medication.service';
import { PrismaModule } from 'src/frameworks/data-services/prisma/prisma.module';
import { RedisModule } from 'src/frameworks/cache/redis.module';

@Module({
  imports: [PrismaModule, RedisModule],
  providers: [MedicationService],
  exports: [MedicationService],
})
export class MedicationModule {}
