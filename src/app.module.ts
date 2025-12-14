import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserUseCasesModule } from './use-cases/user/user.module';
import { AuthCaseModule } from './use-cases/auth/auth.module';
import { MailerModule } from './frameworks/mailer/mailer.module';
import { PrismaModule } from './frameworks/data-services/prisma/prisma.module';
import { PharmacyModule } from './use-cases/pharmacy/pharmacy.module';
import { MedicationModule } from './use-cases/medication/medication.module';
import { CategoryModule } from './use-cases/category/category.module';
import { MedicationFormModule } from './use-cases/medication-form/medication-form.module';
import { InventoryItemModule } from './use-cases/inventory-item/inventory-item.module';
import { SearchModule } from './use-cases/search/search.module';
import { StockAlertModule } from './use-cases/stock-alert/stock-alert.module';
import { PriceHistoryModule } from './use-cases/price-history/price-history.module';
import { AddressModule } from './use-cases/address/address.module';
import { CityModule } from './use-cases/city/city.module';
import { DistrictModule } from './use-cases/district/district.module';
import { AdminAnalyticsModule } from './use-cases/admin-analytics/admin-analytics.module';
import { SystemAuditLogModule } from './use-cases/system-audit-log/system-audit-log.module';
import { PharmacyController } from './controllers/pharmacy/pharmacy/pharmacy.controller';
import { MedicationController } from './controllers/medication/medication/medication.controller';
import { CategoryController } from './controllers/category/category/category.controller';
import { MedicationFormController } from './controllers/medication-form/medication-form/medication-form.controller';
import { InventoryItemController } from './controllers/inventory-item/inventory-item/inventory-item.controller';
import { SearchController } from './controllers/search/search/search.controller';
import { StockAlertController } from './controllers/stock-alert/stock-alert/stock-alert.controller';
import { PriceHistoryController } from './controllers/price-history/price-history/price-history.controller';
import { AddressController } from './controllers/address/address/address.controller';
import { CityController } from './controllers/city/city/city.controller';
import { DistrictController } from './controllers/district/district/district.controller';
import { AdminAnalyticsController } from './controllers/admin-analytics/admin-analytics/admin-analytics.controller';
import { SystemAuditLogController } from './controllers/system-audit-log/system-audit-log/system-audit-log.controller';

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
    PharmacyModule,
    MedicationModule,
    CategoryModule,
    MedicationFormModule,
    InventoryItemModule,
    SearchModule,
    StockAlertModule,
    PriceHistoryModule,
    AddressModule,
    CityModule,
    DistrictModule,
    AdminAnalyticsModule,
    SystemAuditLogModule,
  ],
  controllers: [PharmacyController, MedicationController, CategoryController, MedicationFormController, InventoryItemController, SearchController, StockAlertController, PriceHistoryController, AddressController, CityController, DistrictController, AdminAnalyticsController, SystemAuditLogController],
})
export class AppModule {}
