-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_nextMessageId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_previousMessageId_fkey";

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "previousMessageId" DROP NOT NULL,
ALTER COLUMN "nextMessageId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_previousMessageId_fkey" FOREIGN KEY ("previousMessageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_nextMessageId_fkey" FOREIGN KEY ("nextMessageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
