/*
  Warnings:

  - A unique constraint covering the columns `[uid]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - The required column `uid` was added to the `Post` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `Comment` MODIFY `postId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Image` MODIFY `postId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Post` ADD COLUMN `uid` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Post_uid_key` ON `Post`(`uid`);
