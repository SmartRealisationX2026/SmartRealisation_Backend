import { Module } from '@nestjs/common';
import { PriceHistoryService } from './price-history/price-history.service';

@Module({
  providers: [PriceHistoryService]
})
export class PriceHistoryModule {}
