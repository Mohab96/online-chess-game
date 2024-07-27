-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_firstMessageId_fkey";

-- DropForeignKey
ALTER TABLE "Chat" DROP CONSTRAINT "Chat_lastMessageId_fkey";

-- AlterTable
ALTER TABLE "Chat" ALTER COLUMN "firstMessageId" DROP NOT NULL,
ALTER COLUMN "lastMessageId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_firstMessageId_fkey" FOREIGN KEY ("firstMessageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_lastMessageId_fkey" FOREIGN KEY ("lastMessageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
