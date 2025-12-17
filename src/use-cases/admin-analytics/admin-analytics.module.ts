import { Module } from '@nestjs/common';
import { AdminAnalyticsService } from './admin-analytics/admin-analytics.service';
import { PrismaModule } from '../../frameworks/data-services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AdminAnalyticsService],
  exports: [AdminAnalyticsService],
})
export class AdminAnalyticsModule {}
