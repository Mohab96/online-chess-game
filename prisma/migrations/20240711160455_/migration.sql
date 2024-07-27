/*
  Warnings:

  - A unique constraint covering the columns `[lastMessageId]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lastMessageId` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "lastMessageId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Chat_lastMessageId_key" ON "Chat"("lastMessageId");

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_lastMessageId_fkey" FOREIGN KEY ("lastMessageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
