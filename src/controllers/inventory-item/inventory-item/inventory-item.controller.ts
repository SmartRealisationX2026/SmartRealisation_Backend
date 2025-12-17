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
    @ApiOperation({
        summary: 'Add a new medication to pharmacy stock',
        description: `
        **UC2a: Add Inventory**
        - Pharmacist adds a specific batch of medication.
        - **Critical**: Must specify Batch Number and Expiration Date for traceability.
        `
    })
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
    @ApiResponse({
        status: 200,
        description: 'List of inventory items.',
        schema: {
            example: [
                {
                    "id": "item-uuid-1",
                    "pharmacyId": "pharma-uuid",
                    "medicationId": "med-uuid",
                    "quantityInStock": 50,
                    "sellingPriceFcfa": 1200,
                    "medication": { "commercialName": "Doliprane 1000mg" }
                }
            ]
        }
    })
    findAll(@Query('pharmacyId') pharmacyId?: string) {
        return this.inventoryItemService.findAll(pharmacyId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific inventory item' })
    @ApiResponse({
        status: 200,
        description: 'The inventory item.',
        schema: {
            example: {
                "id": "item-uuid-1",
                "quantityInStock": 50,
                "batchNumber": "BATCH-001",
                "expirationDate": "2025-12-31T00:00:00.000Z",
                "pharmacy": { "name": "Pharmacie Centrale" }
            }
        }
    })
    @ApiResponse({ status: 404, description: 'Item not found.' })
    findOne(@Param('id') id: string) {
        return this.inventoryItemService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Update stock quantity or price',
        description: `
        **UC2b: Update Inventory**
        - Used for simple quantity adjustments (new delivery, breakage) or price changes.
        - To record a *sale*, the frontend should calculate the remaining stock.
        `
    })
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
    @ApiOperation({
        summary: 'Bulk import/update stock via CSV',
        description: `
        **UC2e: CSV Import**
        - Allows uploading a CSV file to update inventory in bulk.
        - **Format**: medicationId, batchNumber, expirationDate, quantity, prices.
        - Should parse line-by-line and upsert.
        `
    })
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
