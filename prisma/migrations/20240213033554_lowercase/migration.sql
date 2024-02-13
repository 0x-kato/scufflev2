/*
  Warnings:

  - You are about to drop the column `message` on the `tips` table. All the data in the column will be lost.
  - You are about to drop the column `hashedRt` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[lowercase_username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lowercase_email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lowercase_email` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lowercase_username` to the `users` table without a default value. This is not possible if the table is not empty.
  - Made the column `username` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "users_email_key";

-- DropIndex
DROP INDEX "users_username_key";

-- AlterTable
ALTER TABLE "tips" DROP COLUMN "message";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "hashedRt",
ADD COLUMN     "lowercase_email" TEXT NOT NULL,
ADD COLUMN     "lowercase_username" TEXT NOT NULL,
ALTER COLUMN "username" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_lowercase_username_key" ON "users"("lowercase_username");

-- CreateIndex
CREATE UNIQUE INDEX "users_lowercase_email_key" ON "users"("lowercase_email");
