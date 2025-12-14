-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PATIENT', 'PHARMACIST', 'ADMIN');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('ACTIVE', 'TRIGGERED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'SMS', 'PUSH');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('FR', 'EN');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT,
    "preferred_language" "Language" NOT NULL DEFAULT 'FR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "city_id" UUID NOT NULL,
    "district_id" UUID,
    "street_address" TEXT NOT NULL,
    "landmark" TEXT,
    "postal_code" TEXT,
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cities" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name_fr" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "region" TEXT NOT NULL,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "districts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "city_id" UUID NOT NULL,
    "name_fr" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "description" TEXT,
    "level" INTEGER NOT NULL DEFAULT 1,
    "parent_id" UUID,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medication_forms" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" TEXT NOT NULL,
    "name_fr" TEXT NOT NULL,
    "name_en" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "medication_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "commercial_name" TEXT NOT NULL,
    "dci_name" TEXT,
    "category_id" UUID NOT NULL,
    "form_id" UUID NOT NULL,
    "dosage_strength" TEXT NOT NULL,
    "dosage_unit" TEXT NOT NULL,
    "requires_prescription" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pharmacies" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "address_id" UUID NOT NULL,
    "license_number" TEXT,
    "phone" TEXT,
    "emergency_phone" TEXT,
    "is_24_7" BOOLEAN NOT NULL DEFAULT false,
    "opening_time" TIME,
    "closing_time" TIME,
    "working_days" JSONB NOT NULL,
    "owner_id" UUID NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pharmacies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "pharmacy_id" UUID NOT NULL,
    "medication_id" UUID NOT NULL,
    "batch_number" TEXT NOT NULL,
    "expiration_date" DATE NOT NULL,
    "quantity_in_stock" INTEGER NOT NULL,
    "unit_price_fcfa" DECIMAL(10,2) NOT NULL,
    "selling_price_fcfa" DECIMAL(10,2) NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "last_restocked" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "searches" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "medication_id" UUID NOT NULL,
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,
    "radius_km" INTEGER,
    "filters_applied" JSONB,
    "results_found" INTEGER NOT NULL DEFAULT 0,
    "searched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "searches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "inventory_item_id" UUID NOT NULL,
    "old_price_fcfa" DECIMAL(10,2) NOT NULL,
    "new_price_fcfa" DECIMAL(10,2) NOT NULL,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "changed_by" UUID NOT NULL,

    CONSTRAINT "price_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_alerts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID,
    "medication_id" UUID NOT NULL,
    "pharmacy_id" UUID,
    "notification_channel" "NotificationChannel" NOT NULL,
    "contact_info" TEXT NOT NULL,
    "status" "AlertStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "triggered_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "stock_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_analytics" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "analytics_date" DATE NOT NULL,
    "total_searches" INTEGER NOT NULL,
    "successful_searches" INTEGER NOT NULL,
    "new_users" INTEGER NOT NULL,
    "active_pharmacies" INTEGER NOT NULL,
    "top_medications" JSONB,
    "search_heatmap" JSONB,
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_audit_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "action_type" "ActionType" NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "addresses_latitude_longitude_idx" ON "addresses"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "addresses_city_id_district_id_idx" ON "addresses"("city_id", "district_id");

-- CreateIndex
CREATE INDEX "cities_region_idx" ON "cities"("region");

-- CreateIndex
CREATE INDEX "districts_city_id_idx" ON "districts"("city_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_code_key" ON "categories"("code");

-- CreateIndex
CREATE INDEX "categories_parent_id_idx" ON "categories"("parent_id");

-- CreateIndex
CREATE INDEX "categories_level_idx" ON "categories"("level");

-- CreateIndex
CREATE UNIQUE INDEX "medication_forms_code_key" ON "medication_forms"("code");

-- CreateIndex
CREATE INDEX "medications_commercial_name_idx" ON "medications"("commercial_name");

-- CreateIndex
CREATE INDEX "medications_dci_name_idx" ON "medications"("dci_name");

-- CreateIndex
CREATE INDEX "medications_category_id_idx" ON "medications"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "pharmacies_address_id_key" ON "pharmacies"("address_id");

-- CreateIndex
CREATE INDEX "pharmacies_address_id_idx" ON "pharmacies"("address_id");

-- CreateIndex
CREATE INDEX "pharmacies_owner_id_idx" ON "pharmacies"("owner_id");

-- CreateIndex
CREATE INDEX "pharmacies_is_verified_idx" ON "pharmacies"("is_verified");

-- CreateIndex
CREATE INDEX "inventory_items_quantity_in_stock_idx" ON "inventory_items"("quantity_in_stock");

-- CreateIndex
CREATE INDEX "inventory_items_expiration_date_idx" ON "inventory_items"("expiration_date");

-- CreateIndex
CREATE INDEX "inventory_items_unit_price_fcfa_idx" ON "inventory_items"("unit_price_fcfa");

-- CreateIndex
CREATE INDEX "inventory_items_selling_price_fcfa_idx" ON "inventory_items"("selling_price_fcfa");

-- CreateIndex
CREATE INDEX "inventory_items_pharmacy_id_medication_id_idx" ON "inventory_items"("pharmacy_id", "medication_id");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_items_pharmacy_id_medication_id_batch_number_key" ON "inventory_items"("pharmacy_id", "medication_id", "batch_number");

-- CreateIndex
CREATE INDEX "searches_latitude_longitude_idx" ON "searches"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "searches_searched_at_idx" ON "searches"("searched_at");

-- CreateIndex
CREATE INDEX "price_history_inventory_item_id_idx" ON "price_history"("inventory_item_id");

-- CreateIndex
CREATE INDEX "price_history_changed_at_idx" ON "price_history"("changed_at");

-- CreateIndex
CREATE INDEX "admin_analytics_analytics_date_idx" ON "admin_analytics"("analytics_date");

-- CreateIndex
CREATE INDEX "system_audit_logs_action_type_idx" ON "system_audit_logs"("action_type");

-- CreateIndex
CREATE INDEX "system_audit_logs_entity_type_idx" ON "system_audit_logs"("entity_type");

-- CreateIndex
CREATE INDEX "system_audit_logs_created_at_idx" ON "system_audit_logs"("created_at");

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "districts" ADD CONSTRAINT "districts_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medications" ADD CONSTRAINT "medications_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medications" ADD CONSTRAINT "medications_form_id_fkey" FOREIGN KEY ("form_id") REFERENCES "medication_forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pharmacies" ADD CONSTRAINT "pharmacies_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pharmacies" ADD CONSTRAINT "pharmacies_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_medication_id_fkey" FOREIGN KEY ("medication_id") REFERENCES "medications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "searches" ADD CONSTRAINT "searches_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "searches" ADD CONSTRAINT "searches_medication_id_fkey" FOREIGN KEY ("medication_id") REFERENCES "medications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_history" ADD CONSTRAINT "price_history_inventory_item_id_fkey" FOREIGN KEY ("inventory_item_id") REFERENCES "inventory_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_history" ADD CONSTRAINT "price_history_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_alerts" ADD CONSTRAINT "stock_alerts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_alerts" ADD CONSTRAINT "stock_alerts_medication_id_fkey" FOREIGN KEY ("medication_id") REFERENCES "medications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_alerts" ADD CONSTRAINT "stock_alerts_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_audit_logs" ADD CONSTRAINT "system_audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
