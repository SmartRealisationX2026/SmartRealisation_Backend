import { Module } from '@nestjs/common';
import { AdminAnalyticsService } from './admin-analytics/admin-analytics.service';

@Module({
  providers: [AdminAnalyticsService]
})
export class AdminAnalyticsModule {}
