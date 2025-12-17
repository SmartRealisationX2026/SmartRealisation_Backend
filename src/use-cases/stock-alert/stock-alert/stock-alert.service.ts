import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStockAlertDto, UpdateStockAlertDto } from '../../../core/dtos/request/stock-alert.dto';
import { PrismaService } from '../../../frameworks/data-services/prisma/prisma.service';

@Injectable()
export class StockAlertService {
    constructor(private prisma: PrismaService) { }

    async create(createStockAlertDto: CreateStockAlertDto) {
        return this.prisma.stockAlert.create({
            data: createStockAlertDto,
        });
    }

    findAll(userId?: string) {
        if (userId) {
            return this.prisma.stockAlert.findMany({
                where: { userId },
                include: { medication: true, pharmacy: true }
            });
        }
        return this.prisma.stockAlert.findMany({
            include: { medication: true, pharmacy: true }
        });
    }

    async findOne(id: string) {
        const alert = await this.prisma.stockAlert.findUnique({
            where: { id },
            include: { medication: true, pharmacy: true }
        });
        if (!alert) throw new NotFoundException(`Stock Alert with ID ${id} not found`);
        return alert;
    }

    async update(id: string, updateStockAlertDto: UpdateStockAlertDto) {
        await this.findOne(id);
        return this.prisma.stockAlert.update({
            where: { id },
            data: updateStockAlertDto,
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.stockAlert.delete({
            where: { id },
        });
    }
}
