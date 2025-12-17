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
    @ApiResponse({ status: 201, description: 'The item has been successfully created.' })
    create(@Body() createInventoryItemDto: CreateInventoryItemDto) {
        return this.inventoryItemService.create(createInventoryItemDto);
    }

    @Get()
    @ApiOperation({ summary: 'List all inventory items (optionally filter by pharmacyId)' })
    findAll(@Query('pharmacyId') pharmacyId?: string) {
        return this.inventoryItemService.findAll(pharmacyId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a specific inventory item' })
    findOne(@Param('id') id: string) {
        return this.inventoryItemService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update stock quantity or price' })
    update(
        @Param('id') id: string,
        @Body() updateInventoryItemDto: UpdateInventoryItemDto,
    ) {
        return this.inventoryItemService.update(id, updateInventoryItemDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Remove an item from stock' })
    remove(@Param('id') id: string) {
        return this.inventoryItemService.remove(id);
    }

    @Post('csv')
    @ApiOperation({ summary: 'Bulk import/update stock via CSV (Not implemented yet)' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
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
