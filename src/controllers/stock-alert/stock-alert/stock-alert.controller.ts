import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { StockAlertService } from '../../../use-cases/stock-alert/stock-alert/stock-alert.service';
import { CreateStockAlertDto, UpdateStockAlertDto } from '../../../core/dtos/request/stock-alert.dto';
import { NotificationChannel, AlertStatus } from '@prisma/client';

@ApiTags('Stock Alerts')
@Controller('stock-alerts')
export class StockAlertController {
    constructor(private readonly stockAlertService: StockAlertService) { }

    @Post()
    @ApiOperation({
        summary: 'Subscribe to a stock alert',
        description: `
        **UC_StockAlert: Notify Me**
        - Patient subscribes to receive a notification when a medication is back in stock.
        - Triggered via WebSockets or Email (MVP supports Email placeholder).
        `
    })
    @ApiResponse({ status: 201, description: 'Alert subscription created successfully.', type: CreateStockAlertDto })
    @ApiResponse({ status: 400, description: 'Invalid input data.' })
    @ApiBody({
        type: CreateStockAlertDto,
        examples: {
            default: {
                summary: 'Standard Alert',
                value: {
                    userId: 'uuid-user',
                    medicationId: 'uuid-medication',
                    pharmacyId: 'uuid-pharmacy-optional',
                    notificationChannel: 'EMAIL',
                    contactInfo: 'patient@email.com',
                    status: 'ACTIVE'
                }
            }
        }
    })
    create(@Body() createStockAlertDto: CreateStockAlertDto) {
        return this.stockAlertService.create(createStockAlertDto);
    }

    @Get()
    @ApiOperation({ summary: 'List all stock alerts (optionally filtered by User)' })
    @ApiResponse({
        status: 200,
        description: 'List of alerts.',
        schema: {
            example: [
                {
                    "id": "alert-uuid-1",
                    "userId": "user-uuid",
                    "medicationId": "med-uuid",
                    "status": "ACTIVE",
                    "notificationChannel": "EMAIL",
                    "medication": { "commercialName": "Efferalgan" }
                }
            ]
        }
    })
    @ApiQuery({ name: 'userId', required: false, description: 'Filter alerts by User ID' })
    findAll(@Query('userId') userId?: string) {
        return this.stockAlertService.findAll(userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get alert details' })
    @ApiResponse({
        status: 200,
        description: 'Alert details.',
        schema: {
            example: {
                "id": "alert-uuid-1",
                "status": "ACTIVE",
                "notificationChannel": "EMAIL",
                "contactInfo": "user@example.com",
                "createdAt": "2025-01-01T12:00:00.000Z",
                "medication": { "commercialName": "Doliprane" },
                "pharmacy": { "name": "Pharmacie du Centre" }
            }
        }
    })
    @ApiResponse({ status: 404, description: 'Alert not found.' })
    findOne(@Param('id') id: string) {
        return this.stockAlertService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update alert status or contact info' })
    @ApiResponse({ status: 200, description: 'Alert updated successfully.' })
    @ApiResponse({ status: 404, description: 'Alert not found.' })
    @ApiBody({
        type: UpdateStockAlertDto,
        examples: {
            statusUpdate: {
                summary: 'Deactivate Alert',
                value: {
                    status: 'EXPIRED'
                }
            }
        }
    })
    update(
        @Param('id') id: string,
        @Body() updateStockAlertDto: UpdateStockAlertDto,
    ) {
        return this.stockAlertService.update(id, updateStockAlertDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a stock alert' })
    @ApiResponse({ status: 200, description: 'Alert deleted successfully.' })
    @ApiResponse({ status: 404, description: 'Alert not found.' })
    remove(@Param('id') id: string) {
        return this.stockAlertService.remove(id);
    }
}
