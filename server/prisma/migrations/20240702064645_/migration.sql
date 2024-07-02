/*
  Warnings:

  - A unique constraint covering the columns `[ip_address]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Player_ip_address_key" ON "Player"("ip_address");
