import { Module } from '@nestjs/common';
import { StockAlertService } from './stock-alert/stock-alert.service';

@Module({
  providers: [StockAlertService]
})
export class StockAlertModule {}
