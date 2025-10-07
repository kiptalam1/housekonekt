/*
  Warnings:

  - The `type` column on the `Property` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('BEDSITTER', 'STUDIO', 'ONE_BEDROOM', 'TWO_BEDROOM', 'THREE_BEDROOM', 'MAISONETTE', 'TOWNHOUSE', 'BUNGALOW', 'SERVICED_APARTMENT', 'VILLA');

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "type",
ADD COLUMN     "type" "PropertyType" NOT NULL DEFAULT 'BEDSITTER';
