import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis, { Redis as RedisClient } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: RedisClient;
  private readonly defaultTtlSeconds = 300; // 5 minutes

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    this.client = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      connectTimeout: 5_000,
    });
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      if (!value) return null;
      return JSON.parse(value) as T;
    } catch {
      // Redis unavailable - return null (no cache)
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds = this.defaultTtlSeconds): Promise<void> {
    try {
      await this.client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch {
      // Redis unavailable - silently fail (no cache)
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch {
      // Redis unavailable - silently fail
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.quit();
  }
}

