/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discards` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "companies" ADD COLUMN     "username" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "discards" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "companies_username_key" ON "companies"("username");
