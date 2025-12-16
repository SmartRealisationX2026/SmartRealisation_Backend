import { Module } from '@nestjs/common';
import { SearchService } from './search/search.service';
import { PrismaModule } from 'src/frameworks/data-services/prisma/prisma.module';
import { RedisModule } from 'src/frameworks/cache/redis.module';

@Module({
  imports: [PrismaModule, RedisModule],
  providers: [SearchService],
  exports: [SearchService],
})
export class SearchModule {}
