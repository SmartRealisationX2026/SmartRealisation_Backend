import { Module } from '@nestjs/common';
import { AuthController } from '../../controllers/auth/auth.controller';
import { JwtStrategy } from '../../frameworks/auth-services/JwtAuthStrategy';
import { RolesGuard } from '../../frameworks/auth-services/roles.guard';
import { AuthCaseService } from './auth.service';
import { AuthCaseRepository } from './repositories/auth-case-repository';
import { AuthRepository } from '../../core/repositories';

@Module({
  providers: [
    AuthCaseService,
    JwtStrategy,
    RolesGuard,
    {
      provide: AuthRepository,
      useClass: AuthCaseRepository
    }
  ],
  imports: [],
  controllers: [AuthController],
  exports: [AuthCaseService, RolesGuard],
})
export class AuthCaseModule {
}
