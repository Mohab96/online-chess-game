/*
  Warnings:

  - You are about to drop the column `playerId` on the `Player` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_playerId_fkey";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "playerId",
ADD COLUMN     "friendId" INTEGER;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
