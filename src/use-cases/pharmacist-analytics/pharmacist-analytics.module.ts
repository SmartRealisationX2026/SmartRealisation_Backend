import { Module } from '@nestjs/common';
import { PharmacistAnalyticsService } from './pharmacist-analytics/pharmacist-analytics.service';
import { PrismaModule } from '../../frameworks/data-services/prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [PharmacistAnalyticsService],
    exports: [PharmacistAnalyticsService],
})
export class PharmacistAnalyticsModule { }
