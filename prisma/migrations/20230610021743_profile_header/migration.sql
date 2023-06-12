-- AlterTable
ALTER TABLE `User` ADD COLUMN `bannerPic` VARCHAR(191) NOT NULL DEFAULT 'defaultBanner.jpg',
    ADD COLUMN `github` VARCHAR(191) NULL,
    ADD COLUMN `profilePic` VARCHAR(191) NOT NULL DEFAULT 'defaultProfile.png';
