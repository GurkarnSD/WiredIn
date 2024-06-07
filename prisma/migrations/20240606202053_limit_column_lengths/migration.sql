/*
  Warnings:

  - You are about to alter the column `title` on the `Experience` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `company` on the `Experience` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `name` on the `NameChange` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `title` on the `Project` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `displayName` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `title` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(200)`.
  - You are about to alter the column `github` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(39)`.

*/
-- DropIndex
DROP INDEX "NameChange_name_key";

-- AlterTable
ALTER TABLE "Experience" ALTER COLUMN "title" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "company" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "NameChange" ALTER COLUMN "name" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "title" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "displayName" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "title" SET DATA TYPE VARCHAR(200),
ALTER COLUMN "github" SET DATA TYPE VARCHAR(39);
