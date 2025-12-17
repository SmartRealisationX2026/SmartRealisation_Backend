import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PharmacyService } from '../../../use-cases/pharmacy/pharmacy/pharmacy.service';
import { CreatePharmacyDto, UpdatePharmacyDto } from '../../../core/dtos/request/pharmacy.dto';

@ApiTags('Pharmacies')
@Controller('pharmacies')
export class PharmacyController {
    constructor(private readonly pharmacyService: PharmacyService) { }

    @Post()
    @ApiOperation({ summary: 'Register a new pharmacy' })
    @ApiResponse({ status: 201, description: 'The pharmacy has been successfully created.' })
    create(@Body() createPharmacyDto: CreatePharmacyDto) {
        return this.pharmacyService.create(createPharmacyDto);
    }

    @Get()
    @ApiOperation({ summary: 'List all pharmacies' })
    findAll() {
        return this.pharmacyService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get pharmacy details' })
    findOne(@Param('id') id: string) {
        return this.pharmacyService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update pharmacy details' })
    update(
        @Param('id') id: string,
        @Body() updatePharmacyDto: UpdatePharmacyDto,
    ) {
        return this.pharmacyService.update(id, updatePharmacyDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a pharmacy' })
    remove(@Param('id') id: string) {
        return this.pharmacyService.remove(id);
    }
}
