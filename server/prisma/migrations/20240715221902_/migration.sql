/*
  Warnings:

  - You are about to drop the column `created_at` on the `Move` table. All the data in the column will be lost.
  - You are about to drop the column `move_index` on the `Move` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Move" DROP COLUMN "created_at",
DROP COLUMN "move_index",
ADD COLUMN     "played_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
