/*
  Warnings:

  - You are about to drop the column `required` on the `achievements` table. All the data in the column will be lost.
  - Added the required column `requiredPoints` to the `achievements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "achievements" DROP COLUMN "required",
ADD COLUMN     "requiredPoints" INTEGER NOT NULL;
