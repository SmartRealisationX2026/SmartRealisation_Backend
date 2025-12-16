import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RedisService } from './redis.service';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private readonly defaultTtlSeconds = 300; // 5 minutes

  constructor(private readonly redisService: RedisService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request & { user?: any }>();

    // Only cache idempotent GET requests
    if (request?.method !== 'GET') {
      return next.handle();
    }

    const cacheKey = this.buildCacheKey(request);
    const cached = await this.redisService.get<any>(cacheKey);
    if (cached !== null) {
      return of(cached);
    }

    return next.handle().pipe(
      tap(async (data) => {
        try {
          await this.redisService.set(cacheKey, data, this.defaultTtlSeconds);
        } catch {
          // Fail silently on cache write to keep request flow
        }
      }),
    );
  }

  private buildCacheKey(request: Request & { user?: any }): string {
    const base = `cache:${request.method}:${request.url}`;
    const userFragment = request.user?.id ? `:u:${request.user.id}` : '';
    return `${base}${userFragment}`;
  }
}

