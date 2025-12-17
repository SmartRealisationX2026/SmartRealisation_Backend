import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePharmacyDto, UpdatePharmacyDto } from '../../../core/dtos/request/pharmacy.dto';
import { PrismaService } from '../../../frameworks/data-services/prisma/prisma.service';

@Injectable()
export class PharmacyService {
    constructor(private prisma: PrismaService) { }

    async create(createPharmacyDto: CreatePharmacyDto) {
        return this.prisma.pharmacy.create({
            data: {
                ...createPharmacyDto,
                workingDays: createPharmacyDto.workingDays as any,
            },
        });
    }

    findAll() {
        return this.prisma.pharmacy.findMany({
            include: { address: {
              include :{ city : true , district : true}
              }, owner: true }
        });
    }

    async findOne(id: string) {
      console.log(id);
        const pharmacy = await this.prisma.pharmacy.findUnique({
            where: { id },
            include: { address: {include :{ city : true , district : true}}, owner: true, inventoryItems: true }
        });
        console.log(pharmacy);
        if (!pharmacy) throw new NotFoundException(`Pharmacy with ID ${id} not found`);
        return pharmacy;
    }

    async update(id: string, updatePharmacyDto: UpdatePharmacyDto) {
        await this.findOne(id);
        return this.prisma.pharmacy.update({
            where: { id },
            data: updatePharmacyDto,
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.pharmacy.delete({
            where: { id },
        });
    }
}
