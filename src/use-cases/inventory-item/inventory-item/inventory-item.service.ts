import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryItemDto, UpdateInventoryItemDto } from '../../../core/dtos/request/inventory-item.dto';
import { PrismaService } from '../../../frameworks/data-services/prisma/prisma.service';

import { StockUpdateGateway } from '../../../frameworks/socket/stock-update.gateway';

@Injectable()
export class InventoryItemService {
    constructor(
        private prisma: PrismaService,
        private stockGateway: StockUpdateGateway
    ) { }

    async create(createInventoryItemDto: CreateInventoryItemDto) {
        // Check if item already exists for this pharmacy/medication/batch
        const existing = await this.prisma.inventoryItem.findUnique({
            where: {
                pharmacyId_medicationId_batchNumber: {
                    pharmacyId: createInventoryItemDto.pharmacyId,
                    medicationId: createInventoryItemDto.medicationId,
                    batchNumber: createInventoryItemDto.batchNumber
                }
            }
        });

        if (existing) {
            // Update quantity if exists
            const updated = await this.prisma.inventoryItem.update({
                where: { id: existing.id },
                data: {
                    quantityInStock: existing.quantityInStock + createInventoryItemDto.quantityInStock,
                    lastRestocked: new Date()
                }
            });
            this.stockGateway.broadcastStockUpdate(updated.pharmacyId, updated.medicationId, updated.quantityInStock);
            return updated;
        }

        const created = await this.prisma.inventoryItem.create({
            data: {
                ...createInventoryItemDto,
                lastRestocked: createInventoryItemDto.lastRestocked || new Date(),
            },
        });
        this.stockGateway.broadcastStockUpdate(created.pharmacyId, created.medicationId, created.quantityInStock);
        return created;
    }

    findAll(pharmacyId?: string) {
        if (pharmacyId) {
            return this.prisma.inventoryItem.findMany({
                where: { pharmacyId },
                include: { medication: true, pharmacy: true }
            });
        }
        return this.prisma.inventoryItem.findMany({
            include: { medication: true, pharmacy: true }
        });
    }

    async findOne(id: string) {
        const item = await this.prisma.inventoryItem.findUnique({
            where: { id },
            include: { medication: true, pharmacy: true }
        });
        if (!item) throw new NotFoundException(`Inventory item with ID ${id} not found`);
        return item;
    }

    async update(id: string, updateInventoryItemDto: UpdateInventoryItemDto) {
        await this.findOne(id); // Ensure exists
        const updated = await this.prisma.inventoryItem.update({
            where: { id },
            data: updateInventoryItemDto,
        });
        if (updated.quantityInStock !== undefined) {
            this.stockGateway.broadcastStockUpdate(updated.pharmacyId, updated.medicationId, updated.quantityInStock);
        }
        return updated;
    }

    async remove(id: string) {
        await this.findOne(id); // Ensure exists
        return this.prisma.inventoryItem.delete({
            where: { id },
        });
    }
}
