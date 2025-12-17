import { Module } from '@nestjs/common';
import { StockAlertService } from './stock-alert/stock-alert.service';
import { PrismaModule } from '../../frameworks/data-services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [StockAlertService],
  exports: [StockAlertService],
})
export class StockAlertModule {}
