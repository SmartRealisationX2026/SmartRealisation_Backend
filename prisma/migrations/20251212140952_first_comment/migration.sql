/*
  Warnings:

  - You are about to drop the column `searchLocation` on the `searches` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[owner_id]` on the table `pharmacies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `latitude` to the `searches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `searches` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "searches" DROP COLUMN "searchLocation",
ADD COLUMN     "latitude" DECIMAL(10,8) NOT NULL,
ADD COLUMN     "longitude" DECIMAL(11,8) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "pharmacies_owner_id_key" ON "pharmacies"("owner_id");

-- CreateIndex
CREATE INDEX "searches_latitude_longitude_idx" ON "searches"("latitude", "longitude");
