/*
  Warnings:

  - You are about to drop the column `currency` on the `tips` table. All the data in the column will be lost.
  - You are about to drop the `Currency` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserBalance` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserBalance" DROP CONSTRAINT "UserBalance_currency_id_fkey";

-- DropForeignKey
ALTER TABLE "UserBalance" DROP CONSTRAINT "UserBalance_user_id_fkey";

-- AlterTable
ALTER TABLE "tips" DROP COLUMN "currency";

-- DropTable
DROP TABLE "Currency";

-- DropTable
DROP TABLE "UserBalance";

-- CreateTable
CREATE TABLE "balances" (
    "balance_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "balances_pkey" PRIMARY KEY ("balance_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "balances_user_id_key" ON "balances"("user_id");

-- AddForeignKey
ALTER TABLE "balances" ADD CONSTRAINT "balances_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
