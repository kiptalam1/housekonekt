/*
  Warnings:

  - A unique constraint covering the columns `[title,location,ownerId]` on the table `Property` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Property_title_location_ownerId_key" ON "Property"("title", "location", "ownerId");
