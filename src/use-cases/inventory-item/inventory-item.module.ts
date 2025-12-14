import { Module } from '@nestjs/common';
import { InventoryItemService } from './inventory-item/inventory-item.service';

@Module({
  providers: [InventoryItemService]
})
export class InventoryItemModule {}
