/*
  Warnings:

  - Added the required column `description` to the `achievements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `icon` to the `achievements` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "achievements" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "icon" TEXT NOT NULL;
