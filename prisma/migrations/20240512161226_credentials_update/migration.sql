/*
  Warnings:

  - You are about to drop the column `active` on the `Credentials` table. All the data in the column will be lost.
  - You are about to drop the column `displayName` on the `Credentials` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Credentials` table. All the data in the column will be lost.
  - You are about to drop the column `uid` on the `Credentials` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[credsId]` on the table `ActivateToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Credentials` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Credentials` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ActivateToken" DROP CONSTRAINT "ActivateToken_credsId_fkey";

-- DropForeignKey
ALTER TABLE "NameChange" DROP CONSTRAINT "NameChange_credsId_fkey";

-- DropForeignKey
ALTER TABLE "ResetToken" DROP CONSTRAINT "ResetToken_credsId_fkey";

-- DropIndex
DROP INDEX "Credentials_displayName_key";

-- DropIndex
DROP INDEX "Credentials_email_key";

-- DropIndex
DROP INDEX "Credentials_uid_key";

-- AlterTable
ALTER TABLE "ActivateToken" ALTER COLUMN "credsId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Credentials" DROP COLUMN "active",
DROP COLUMN "displayName",
DROP COLUMN "email",
DROP COLUMN "uid",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "NameChange" ALTER COLUMN "credsId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ResetToken" ALTER COLUMN "credsId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ActivateToken_credsId_key" ON "ActivateToken"("credsId");

-- CreateIndex
CREATE UNIQUE INDEX "Credentials_userId_key" ON "Credentials"("userId");

-- AddForeignKey
ALTER TABLE "Credentials" ADD CONSTRAINT "Credentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivateToken" ADD CONSTRAINT "ActivateToken_credsId_fkey" FOREIGN KEY ("credsId") REFERENCES "Credentials"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResetToken" ADD CONSTRAINT "ResetToken_credsId_fkey" FOREIGN KEY ("credsId") REFERENCES "Credentials"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NameChange" ADD CONSTRAINT "NameChange_credsId_fkey" FOREIGN KEY ("credsId") REFERENCES "Credentials"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
