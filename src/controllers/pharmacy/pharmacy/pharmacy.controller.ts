import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PharmacyService } from '../../../use-cases/pharmacy/pharmacy/pharmacy.service';
import { CreatePharmacyDto, UpdatePharmacyDto } from '../../../core/dtos/request/pharmacy.dto';

@ApiTags('Pharmacies')
@Controller('pharmacies')
export class PharmacyController {
    constructor(private readonly pharmacyService: PharmacyService) { }

    @Post()
    @ApiOperation({ summary: 'Register a new pharmacy' })
    @ApiResponse({ status: 201, description: 'The pharmacy has been successfully created.', type: CreatePharmacyDto })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    @ApiBody({
        type: CreatePharmacyDto,
        examples: {
            default: {
                summary: 'Standard Pharmacy',
                value: {
                    name: 'Pharmacie Centrale',
                    addressId: 'uuid-address',
                    ownerId: 'uuid-owner',
                    phone: '+237690000000',
                    is24_7: true,
                    workingDays: [1, 2, 3, 4, 5, 6, 7]
                }
            }
        }
    })
    create(@Body() createPharmacyDto: CreatePharmacyDto) {
        return this.pharmacyService.create(createPharmacyDto);
    }

    @Get()
    @ApiOperation({ summary: 'List all pharmacies' })
    @ApiResponse({ status: 200, description: 'List of pharmacies.' })
    findAll() {
        return this.pharmacyService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get pharmacy details' })
    @ApiResponse({ status: 200, description: 'Pharmacy details including address and owner.' })
    @ApiResponse({ status: 404, description: 'Pharmacy not found.' })
    findOne(@Param('id') id: string) {
        return this.pharmacyService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update pharmacy details' })
    @ApiResponse({ status: 200, description: 'Pharmacy updated successfully.' })
    @ApiResponse({ status: 404, description: 'Pharmacy not found.' })
    update(
        @Param('id') id: string,
        @Body() updatePharmacyDto: UpdatePharmacyDto,
    ) {
        return this.pharmacyService.update(id, updatePharmacyDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a pharmacy' })
    @ApiResponse({ status: 200, description: 'Pharmacy deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Pharmacy not found.' })
    remove(@Param('id') id: string) {
        return this.pharmacyService.remove(id);
    }
}
