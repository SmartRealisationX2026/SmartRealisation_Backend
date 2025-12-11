/*
  Warnings:

  - You are about to drop the column `latitude` on the `searches` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `searches` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "searches" DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "searchLocation" JSONB;

-- CreateIndex
CREATE INDEX "medications_name_idx" ON "medications"("name");

-- CreateIndex
CREATE INDEX "medications_category_idx" ON "medications"("category");

-- CreateIndex
CREATE INDEX "pharmacies_latitude_longitude_idx" ON "pharmacies"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "pharmacies_city_neighborhood_idx" ON "pharmacies"("city", "neighborhood");

-- CreateIndex
CREATE INDEX "stocks_quantity_idx" ON "stocks"("quantity");

-- CreateIndex
CREATE INDEX "stocks_price_fcfa_idx" ON "stocks"("price_fcfa");
