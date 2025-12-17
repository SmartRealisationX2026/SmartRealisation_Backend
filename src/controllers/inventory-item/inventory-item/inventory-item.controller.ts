import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    UseGuards,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { InventoryItemService } from '../../../use-cases/inventory-item/inventory-item/inventory-item.service';
import { CreateInventoryItemDto, UpdateInventoryItemDto } from '../../../core/dtos/request/inventory-item.dto';

@ApiTags('Inventory Items')
@Controller('inventory-items')
export class InventoryItemController {
    constructor(private readonly inventoryItemService: InventoryItemService) { }

    @Post()
    @ApiOperation({ summary: 'Add a new medication to pharmacy stock' })
    @ApiResponse({ status: 201, description: 'The item has been successfully created.', type: CreateInventoryItemDto })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    @ApiBody({
        type: CreateInventoryItemDto,
        examples: {
            default: {
                summary: 'Standard Item',
                value: {
                    pharmacyId: 'uuid-pharma',
                    medicationId: 'uuid-medication',
                    batchNumber: 'BATCH-001',
                    expirationDate: '2025-12-31',
                    quantityInStock: 100,
                    unitPriceFcfa: 500,
                    sellingPriceFcfa: 750,
                    isAvailable: true
                }
            }
        }
    })
    create(@Body() createInventoryItemDto: CreateInventoryItemDto) {
        return this.inventoryItemService.create(createInventoryItemDto);
    }

    @Get()
    @ApiOperation({ summary: 'List all inventory items' })
    @ApiResponse({ status: 200, description: 'List of inventory items.' })
    findAll(@Query('pharmacyId') pharmacyId?: string) {
        return this.inventoryItemService.findAll(pharmacyId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific inventory item' })
    @ApiResponse({ status: 200, description: 'The inventory item.' })
    @ApiResponse({ status: 404, description: 'Item not found.' })
    findOne(@Param('id') id: string) {
        return this.inventoryItemService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update stock quantity or price' })
    @ApiResponse({ status: 200, description: 'The item has been successfully updated.' })
    @ApiResponse({ status: 404, description: 'Item not found.' })
    @ApiBody({
        type: UpdateInventoryItemDto,
        examples: {
            updateStock: {
                summary: 'Update Stock & Price',
                value: {
                    quantityInStock: 200,
                    sellingPriceFcfa: 800
                }
            }
        }
    })
    update(
        @Param('id') id: string,
        @Body() updateInventoryItemDto: UpdateInventoryItemDto,
    ) {
        return this.inventoryItemService.update(id, updateInventoryItemDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove an item from stock' })
    @ApiResponse({ status: 200, description: 'The item has been successfully removed.' })
    @ApiResponse({ status: 404, description: 'Item not found.' })
    remove(@Param('id') id: string) {
        return this.inventoryItemService.remove(id);
    }

    @Post('csv')
    @ApiOperation({ summary: 'Bulk import/update stock via CSV' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'CSV file containing: medicationId, batchNumber, expirationDate, quantity, prices'
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('file'))
    uploadCsv(@UploadedFile() file: any) {
        // TODO: Connect to a CsvProcessingService
        return { message: 'File uploaded successfully', fileName: file?.originalname };
    }
}
