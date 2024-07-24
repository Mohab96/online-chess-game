/*
  Warnings:

  - You are about to drop the column `takebacks_enabled` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `total_time` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "takebacks_enabled",
DROP COLUMN "total_time";

-- DropEnum
DROP TYPE "GameStatus";
