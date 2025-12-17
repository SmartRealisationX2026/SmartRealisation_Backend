import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PharmacyService } from '../../../use-cases/pharmacy/pharmacy/pharmacy.service';
// import { JwtAuthGuard } from '../../../frameworks/auth-services/guards/jwt-auth.guard';
// import { RolesGuard } from '../../../frameworks/auth-services/guards/roles.guard';
// import { Roles } from '../../../frameworks/auth-services/decorators/roles.decorator';
// import { UserRole } from '../../../core/entities/user.entity';

// NOTE: Uncomment Guards when Auth Module exports them. For MVP Dev, we document intent.

@ApiTags('Admin Pharmacy Management')
@Controller('admin/pharmacies')
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(UserRole.ADMIN) 
export class AdminPharmacyController {
    constructor(private readonly pharmacyService: PharmacyService) { }

    @Get('pending')
    @ApiOperation({
        summary: 'List all unverified pharmacies (Backlog)',
        description: `
        **UC1c: Pending Verifications**
        - Returns list of pharmacies where 'isVerified' is false.
        - Admin uses this list to perform manual checks before approval.
        `
    })
    @ApiResponse({
        status: 200,
        description: 'List of pending pharmacies.',
        schema: {
            example: [
                { "id": "uuid-1", "name": "Pharmacie Nouvelle", "dateCreated": "2025-01-01", "isVerified": false }
            ]
        }
    })
    findPending() {
        return this.pharmacyService.findPending();
    }

    @Patch(':id/verify')
    @ApiOperation({
        summary: 'Approve or Reject a pharmacy',
        description: `
        **UC1a: Validation Workflow**
        - Set 'isVerified' to TRUE to enable the pharmacy on the platform.
        - Set to FALSE to suspend or reject.
        `
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                isVerified: { type: 'boolean', example: true, description: 'Approval status' }
            }
        }
    })
    @ApiResponse({ status: 200, description: 'Pharmacy status updated successfully.' })
    verify(@Param('id') id: string, @Body('isVerified') isVerified: boolean) {
        return this.pharmacyService.verify(id, isVerified);
    }
}
