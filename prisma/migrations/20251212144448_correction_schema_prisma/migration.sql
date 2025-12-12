/*
  Warnings:

  - The primary key for the `alerts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `alerts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `user_id` column on the `alerts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `pharmacy_id` column on the `alerts` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `audit_logs` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `audit_logs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `medications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `medications` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `pharmacies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `pharmacies` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `searches` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `searches` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `user_id` column on the `searches` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `stocks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `stocks` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `medication_id` on the `alerts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user_id` on the `audit_logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `owner_id` on the `pharmacies` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `medication_id` on the `searches` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `pharmacy_id` on the `stocks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `medication_id` on the `stocks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "alerts" DROP CONSTRAINT "alerts_medication_id_fkey";

-- DropForeignKey
ALTER TABLE "alerts" DROP CONSTRAINT "alerts_pharmacy_id_fkey";

-- DropForeignKey
ALTER TABLE "alerts" DROP CONSTRAINT "alerts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "pharmacies" DROP CONSTRAINT "pharmacies_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "searches" DROP CONSTRAINT "searches_medication_id_fkey";

-- DropForeignKey
ALTER TABLE "searches" DROP CONSTRAINT "searches_user_id_fkey";

-- DropForeignKey
ALTER TABLE "stocks" DROP CONSTRAINT "stocks_medication_id_fkey";

-- DropForeignKey
ALTER TABLE "stocks" DROP CONSTRAINT "stocks_pharmacy_id_fkey";

-- AlterTable
ALTER TABLE "alerts" DROP CONSTRAINT "alerts_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "user_id",
ADD COLUMN     "user_id" UUID,
DROP COLUMN "medication_id",
ADD COLUMN     "medication_id" UUID NOT NULL,
DROP COLUMN "pharmacy_id",
ADD COLUMN     "pharmacy_id" UUID,
ADD CONSTRAINT "alerts_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "user_id",
ADD COLUMN     "user_id" UUID NOT NULL,
ADD CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "medications" DROP CONSTRAINT "medications_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "medications_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "pharmacies" DROP CONSTRAINT "pharmacies_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "owner_id",
ADD COLUMN     "owner_id" UUID NOT NULL,
ADD CONSTRAINT "pharmacies_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "searches" DROP CONSTRAINT "searches_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "user_id",
ADD COLUMN     "user_id" UUID,
DROP COLUMN "medication_id",
ADD COLUMN     "medication_id" UUID NOT NULL,
ADD CONSTRAINT "searches_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "stocks" DROP CONSTRAINT "stocks_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "pharmacy_id",
ADD COLUMN     "pharmacy_id" UUID NOT NULL,
DROP COLUMN "medication_id",
ADD COLUMN     "medication_id" UUID NOT NULL,
ADD CONSTRAINT "stocks_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "pharmacies_owner_id_key" ON "pharmacies"("owner_id");

-- CreateIndex
CREATE UNIQUE INDEX "stocks_pharmacy_id_medication_id_key" ON "stocks"("pharmacy_id", "medication_id");

-- AddForeignKey
ALTER TABLE "pharmacies" ADD CONSTRAINT "pharmacies_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_medication_id_fkey" FOREIGN KEY ("medication_id") REFERENCES "medications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "searches" ADD CONSTRAINT "searches_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "searches" ADD CONSTRAINT "searches_medication_id_fkey" FOREIGN KEY ("medication_id") REFERENCES "medications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_medication_id_fkey" FOREIGN KEY ("medication_id") REFERENCES "medications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_pharmacy_id_fkey" FOREIGN KEY ("pharmacy_id") REFERENCES "pharmacies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
