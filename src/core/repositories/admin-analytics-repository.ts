import {
  CreateAdminAnalyticsDto,
  UpdateAdminAnalyticsDto,
} from '../dtos';
import { AdminAnalytics } from '../entities';

export abstract class AdminAnalyticsRepository {
  abstract findOne(id: string): Promise<AdminAnalytics | null>;
  abstract create(analytics: CreateAdminAnalyticsDto): Promise<AdminAnalytics>;
  abstract update(
    id: string,
    analytics: UpdateAdminAnalyticsDto,
  ): Promise<AdminAnalytics>;
  abstract delete(id: string): Promise<void>;
  abstract findAll(): Promise<AdminAnalytics[]>;
  abstract findByDate(date: Date): Promise<AdminAnalytics | null>;
  abstract findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<AdminAnalytics[]>;
  abstract findLatest(): Promise<AdminAnalytics | null>;
  abstract generateDailyAnalytics(date: Date): Promise<AdminAnalytics>;
}

