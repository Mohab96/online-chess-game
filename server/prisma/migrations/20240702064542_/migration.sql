/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Player_phone_key" ON "Player"("phone");
