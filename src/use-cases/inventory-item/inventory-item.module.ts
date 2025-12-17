import { Module } from '@nestjs/common';
import { InventoryItemService } from './inventory-item/inventory-item.service';
import { PrismaModule } from '../../frameworks/data-services/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [InventoryItemService],
  exports: [InventoryItemService],
})
export class InventoryItemModule {}
