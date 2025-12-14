import { Module } from '@nestjs/common';
import { UserController } from '../../controllers/user/user.controller';
import { UserCaseRepository } from './repositories/user-case-repository';
import { UserRepository } from '../../core/repositories';
import { UserFactoryService } from './user.service';

@Module({
  providers: [
    UserFactoryService,
    {
      provide: UserRepository,
      useClass: UserCaseRepository,
    }
  ],
  controllers: [UserController],
  exports: [UserFactoryService],
})
export class UserUseCasesModule {
}
