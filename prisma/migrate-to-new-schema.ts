/**
 * Migration script to migrate from old schema to new MLD v2
 * Handles data transformation for existing records
 */

import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function migrateToNewSchema() {
  console.log('🚀 Starting migration to new MLD v2 schema...');

  try {
    // Step 1: Create reference data first
    console.log('📝 Creating reference data...');

    // Create default categories
    const defaultCategory = await prisma.category.upsert({
      where: { code: 'DEFAULT' },
      update: {},
      create: {
        code: 'DEFAULT',
        nameFr: 'Médicament',
        nameEn: 'Medication',
        description: 'Catégorie par défaut',
        level: 1
      }
    });

    // Create default medication form
    const defaultForm = await prisma.medicationForm.upsert({
      where: { code: 'TABLET' },
      update: {},
      create: {
        code: 'TABLET',
        nameFr: 'Comprimé',
        nameEn: 'Tablet',
        description: 'Forme solide'
      }
    });

    // Create default city for Cameroon
    const defaultCity = await prisma.city.upsert({
      where: { nameFr: 'Yaoundé' },
      update: {},
      create: {
        nameFr: 'Yaoundé',
        nameEn: 'Yaounde',
        region: 'Centre'
      }
    });

    // Create default district
    const defaultDistrict = await prisma.district.upsert({
      where: {
        cityId_nameFr: {
          cityId: defaultCity.id,
          nameFr: 'Centre-ville'
        }
      },
      update: {},
      create: {
        cityId: defaultCity.id,
        nameFr: 'Centre-ville',
        nameEn: 'City Center'
      }
    });

    // Step 2: Migrate users data
    console.log('👥 Migrating users data...');

    const users = await prisma.$queryRaw<Array<{id: string, name: string, password: string, email: string, role: string, language: string, createdAt: Date, updatedAt: Date}>>`
      SELECT id, name, password, email, role, language, "createdAt", "updatedAt" FROM users
    `;

    for (const user of users) {
      await prisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: {
          id: user.id,
          email: user.email,
          passwordHash: user.password,
          role: user.role as any,
          fullName: user.name,
          preferredLanguage: user.language as any || 'FR',
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      });
    }

    // Step 3: Migrate medications data
    console.log('💊 Migrating medications data...');

    const medications = await prisma.$queryRaw<Array<{id: string, name: string, dci: string, form: string, dosage: string, category: string, createdAt: Date, updatedAt: Date}>>`
      SELECT id, name, dci, form, dosage, category, "createdAt", "updatedAt" FROM medications
    `;

    for (const med of medications) {
      await prisma.medication.upsert({
        where: { id: med.id },
        update: {},
        create: {
          id: med.id,
          commercialName: med.name,
          dciName: med.dci,
          categoryId: defaultCategory.id,
          formId: defaultForm.id,
          dosageStrength: med.dosage || 'N/A',
          dosageUnit: 'mg',
          createdAt: med.createdAt,
          updatedAt: med.updatedAt
        }
      });
    }

    // Step 4: Create addresses for pharmacies
    console.log('🏥 Migrating pharmacies and creating addresses...');

    const pharmacies = await prisma.$queryRaw<Array<{id: string, name: string, address: string, city: string, latitude: number, longitude: number, phone: string, is_24_7: boolean, owner_id: string, is_approved: boolean, createdAt: Date, updatedAt: Date}>>`
      SELECT id, name, address, city, latitude, longitude, phone, "is_24_7", "owner_id", "is_approved", "createdAt", "updatedAt" FROM pharmacies
    `;

    for (const pharmacy of pharmacies) {
      // Create address
      const address = await prisma.address.create({
        data: {
          cityId: defaultCity.id,
          districtId: defaultDistrict.id,
          streetAddress: pharmacy.address,
          latitude: pharmacy.latitude,
          longitude: pharmacy.longitude
        }
      });

      // Create pharmacy with address reference
      await prisma.pharmacy.upsert({
        where: { id: pharmacy.id },
        update: {},
        create: {
          id: pharmacy.id,
          name: pharmacy.name,
          addressId: address.id,
          phone: pharmacy.phone,
          is24_7: pharmacy.is_24_7,
          workingDays: [1,2,3,4,5,6,7], // Default all days
          ownerId: pharmacy.owner_id,
          isVerified: pharmacy.is_approved,
          createdAt: pharmacy.createdAt,
          updatedAt: pharmacy.updatedAt
        }
      });
    }

    // Step 5: Migrate stocks to inventory_items
    console.log('📦 Migrating stocks to inventory_items...');

    const stocks = await prisma.$queryRaw<Array<{id: string, pharmacy_id: string, medication_id: string, quantity: number, price_fcfa: number, last_updated: Date, createdAt: Date, updatedAt: Date}>>`
      SELECT id, "pharmacy_id", "medication_id", quantity, "price_fcfa", "last_updated", "createdAt", "updatedAt" FROM stocks
    `;

    for (const stock of stocks) {
      await prisma.inventoryItem.create({
        data: {
          pharmacyId: stock.pharmacy_id,
          medicationId: stock.medication_id,
          batchNumber: 'DEFAULT_BATCH',
          expirationDate: new Date('2025-12-31'), // Default future date
          quantityInStock: stock.quantity,
          unitPriceFcfa: stock.price_fcfa,
          sellingPriceFcfa: stock.price_fcfa * 1.2, // 20% markup
          lastRestocked: stock.last_updated,
          updatedAt: stock.updatedAt
        }
      });
    }

    // Step 6: Migrate searches (update column names)
    console.log('🔍 Updating searches table structure...');

    await prisma.$executeRaw`
      ALTER TABLE searches
      ADD COLUMN IF NOT EXISTS "results_found" INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "searched_at" TIMESTAMP DEFAULT NOW(),
      ADD COLUMN IF NOT EXISTS "radius_km" INTEGER,
      ADD COLUMN IF NOT EXISTS "filters_applied" JSONB;

      UPDATE searches SET
        "results_found" = "results_count",
        "searched_at" = "createdAt"
      WHERE "results_found" IS NULL;
    `;

    // Step 7: Migrate alerts to stock_alerts
    console.log('🔔 Migrating alerts to stock_alerts...');

    const alerts = await prisma.$queryRaw<Array<{id: string, user_id: string, medication_id: string, pharmacy_id: string, contact_info: string, status: string, createdAt: Date, sent_at: Date}>>`
      SELECT id, "user_id", "medication_id", "pharmacy_id", "contact_info", status, "createdAt", "sent_at" FROM alerts
    `;

    for (const alert of alerts) {
      await prisma.stockAlert.create({
        data: {
          userId: alert.user_id,
          medicationId: alert.medication_id,
          pharmacyId: alert.pharmacy_id,
          notificationChannel: 'EMAIL', // Default
          contactInfo: alert.contact_info,
          status: alert.status === 'sent' ? 'TRIGGERED' : 'ACTIVE',
          createdAt: alert.createdAt,
          triggeredAt: alert.sent_at
        }
      });
    }

    // Step 8: Create system audit logs from existing audit_logs
    console.log('📋 Migrating audit logs...');

    const auditLogs = await prisma.$queryRaw<Array<{id: string, user_id: string, action: string, details: any, createdAt: Date}>>`
      SELECT id, "user_id", action, details, "createdAt" FROM audit_logs
    `;

    for (const log of auditLogs) {
      await prisma.systemAuditLog.create({
        data: {
          userId: log.user_id,
          actionType: log.action as any,
          entityType: 'UNKNOWN', // Default
          entityId: log.id,
          oldValues: log.details,
          createdAt: log.createdAt
        }
      });
    }

    console.log('✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateToNewSchema()
  .then(() => {
    console.log('🎉 Migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration script failed:', error);
    process.exit(1);
  });
