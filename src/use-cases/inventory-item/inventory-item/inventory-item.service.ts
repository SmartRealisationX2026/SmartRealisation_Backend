import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInventoryItemDto, UpdateInventoryItemDto } from '../../../core/dtos/request/inventory-item.dto';
import { PrismaService } from '../../../frameworks/data-services/prisma/prisma.service';

@Injectable()
export class InventoryItemService {
    constructor(private prisma: PrismaService) { }

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
            return this.prisma.inventoryItem.update({
                where: { id: existing.id },
                data: {
                    quantityInStock: existing.quantityInStock + createInventoryItemDto.quantityInStock,
                    lastRestocked: new Date()
                }
            });
        }

        return this.prisma.inventoryItem.create({
            data: {
                ...createInventoryItemDto,
                lastRestocked: createInventoryItemDto.lastRestocked || new Date(),
            },
        });
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
        return this.prisma.inventoryItem.update({
            where: { id },
            data: updateInventoryItemDto,
        });
    }

    async remove(id: string) {
        await this.findOne(id); // Ensure exists
        return this.prisma.inventoryItem.delete({
            where: { id },
        });
    }
}
