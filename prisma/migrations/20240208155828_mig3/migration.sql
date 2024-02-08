/*
  Warnings:

  - You are about to drop the column `registration_date` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `TipHistory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TipHistory" DROP CONSTRAINT "TipHistory_tip_id_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "registration_date",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "TipHistory";
