/*
  Warnings:

  - You are about to drop the column `logged_in` on the `Player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "logged_in",
ADD COLUMN     "online" BOOLEAN NOT NULL DEFAULT false;
