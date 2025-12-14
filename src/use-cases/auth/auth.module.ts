import { Module } from '@nestjs/common';
import { AuthController } from '../../controllers/auth/auth.controller';
import { JwtStrategy } from '../../frameworks/auth-services/JwtAuthStrategy';
import { AuthCaseService } from './auth.service';
import { AuthCaseRepository } from './repositories/auth-case-repository';
import { AuthRepository } from '../../core/repositories';

@Module({
  providers: [
    AuthCaseService,
    JwtStrategy,
    {
      provide: AuthRepository,
      useClass: AuthCaseRepository
    }
  ],
  imports: [],
  controllers: [AuthController],
  exports: [AuthCaseService],
})
export class AuthCaseModule {
}
