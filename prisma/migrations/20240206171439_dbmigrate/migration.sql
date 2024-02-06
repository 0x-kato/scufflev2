/*
  Warnings:

  - The primary key for the `tips` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `tips` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `tips` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `tips` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `tips` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount` to the `tips` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `tips` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiver_id` to the `tips` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender_id` to the `tips` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `tips` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tips" DROP CONSTRAINT "tips_userId_fkey";

-- AlterTable
ALTER TABLE "tips" DROP CONSTRAINT "tips_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "id",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "message" TEXT,
ADD COLUMN     "receiver_id" INTEGER NOT NULL,
ADD COLUMN     "sender_id" INTEGER NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "tip_id" SERIAL NOT NULL,
ADD COLUMN     "tip_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "tips_pkey" PRIMARY KEY ("tip_id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "firstName",
DROP COLUMN "id",
DROP COLUMN "lastName",
DROP COLUMN "updatedAt",
ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "registration_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "user_id" SERIAL NOT NULL,
ADD COLUMN     "username" TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("user_id");

-- CreateTable
CREATE TABLE "TipHistory" (
    "history_id" SERIAL NOT NULL,
    "tip_id" INTEGER NOT NULL,
    "event_type" TEXT NOT NULL,
    "event_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" TEXT,

    CONSTRAINT "TipHistory_pkey" PRIMARY KEY ("history_id")
);

-- CreateTable
CREATE TABLE "Currency" (
    "currency_id" SERIAL NOT NULL,
    "currency_code" TEXT NOT NULL,
    "currency_name" TEXT NOT NULL,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("currency_id")
);

-- CreateTable
CREATE TABLE "UserBalance" (
    "balance_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "currency_id" INTEGER NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBalance_pkey" PRIMARY KEY ("balance_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "tips" ADD CONSTRAINT "tips_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tips" ADD CONSTRAINT "tips_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TipHistory" ADD CONSTRAINT "TipHistory_tip_id_fkey" FOREIGN KEY ("tip_id") REFERENCES "tips"("tip_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBalance" ADD CONSTRAINT "UserBalance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBalance" ADD CONSTRAINT "UserBalance_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "Currency"("currency_id") ON DELETE RESTRICT ON UPDATE CASCADE;
