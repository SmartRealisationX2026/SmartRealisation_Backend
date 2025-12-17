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
    @ApiOperation({ summary: 'List all unverified pharmacies' })
    @ApiResponse({ status: 200, description: 'List of pending pharmacies.' })
    findPending() {
        return this.pharmacyService.findPending();
    }

    @Patch(':id/verify')
    @ApiOperation({ summary: 'Approve or Reject a pharmacy' })
    @ApiBody({ schema: { example: { isVerified: true } } })
    @ApiResponse({ status: 200, description: 'Pharmacy verification status updated.' })
    verify(@Param('id') id: string, @Body('isVerified') isVerified: boolean) {
        return this.pharmacyService.verify(id, isVerified);
    }
}
