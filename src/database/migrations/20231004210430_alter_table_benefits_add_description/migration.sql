/*
  Warnings:

  - You are about to drop the column `username` on the `companies` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "companies_username_key";

-- AlterTable
ALTER TABLE "benefits" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "companies" DROP COLUMN "username";
