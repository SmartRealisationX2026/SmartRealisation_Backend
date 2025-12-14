import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserUseCasesModule } from './use-cases/user/user.module';
import { AuthCaseModule } from './use-cases/auth/auth.module';
import { MailerModule } from './frameworks/mailer/mailer.module';
import { PrismaModule } from './frameworks/data-services/prisma/prisma.module';

@Module({
  imports: [
    // Configuration globale
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Modules de base de données
    PrismaModule,

    // Modules d'authentification
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '2h' },
    }),

    // Modules métier
    MailerModule,
    UserUseCasesModule,
    AuthCaseModule,
  ],
})
export class AppModule {}
