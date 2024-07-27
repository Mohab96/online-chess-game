/*
  Warnings:

  - You are about to drop the column `created_at` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Game` table. All the data in the column will be lost.
  - The `turn` column on the `Game` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `friendId` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `ip_address` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `online` on the `Player` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[socket_id]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `player` on the `Move` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_friendId_fkey";

-- DropIndex
DROP INDEX "Player_ip_address_key";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "last_move_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "turn",
ADD COLUMN     "turn" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Move" DROP COLUMN "player",
ADD COLUMN     "player" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "friendId",
DROP COLUMN "ip_address",
DROP COLUMN "online",
ADD COLUMN     "socket_id" TEXT;

-- DropEnum
DROP TYPE "FirstOrSecondPlayer";

-- CreateIndex
CREATE UNIQUE INDEX "Player_socket_id_key" ON "Player"("socket_id");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_id_fkey" FOREIGN KEY ("id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
