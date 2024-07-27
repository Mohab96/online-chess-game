/*
  Warnings:

  - You are about to drop the column `firstMessageId` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `lastMessageId` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `belongsToChatId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `nextMessageId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `previousMessageId` on the `Message` table. All the data in the column will be lost.
  - Added the required column `chatId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `index` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_firstMessageId_fkey";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_lastMessageId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_belongsToChatId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_nextMessageId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_previousMessageId_fkey";

-- DropIndex
DROP INDEX "Chat_firstMessageId_key";

-- DropIndex
DROP INDEX "Chat_lastMessageId_key";

-- DropIndex
DROP INDEX "Message_nextMessageId_key";

-- DropIndex
DROP INDEX "Message_previousMessageId_key";

-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "firstMessageId",
DROP COLUMN "lastMessageId",
ADD COLUMN     "first_message_index" INTEGER NOT NULL DEFAULT -1,
ADD COLUMN     "last_message_index" INTEGER NOT NULL DEFAULT -1;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "belongsToChatId",
DROP COLUMN "nextMessageId",
DROP COLUMN "previousMessageId",
ADD COLUMN     "chatId" INTEGER NOT NULL,
ADD COLUMN     "index" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
