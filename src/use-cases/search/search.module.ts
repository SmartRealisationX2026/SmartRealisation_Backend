import { Module } from '@nestjs/common';
import { SearchService } from './search/search.service';
import { SearchController } from '../../controllers/search/search/search.controller';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService]
})
export class SearchModule { }
