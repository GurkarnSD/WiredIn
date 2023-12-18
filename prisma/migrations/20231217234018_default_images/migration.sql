-- AlterTable
ALTER TABLE `User` MODIFY `bannerPic` VARCHAR(191) NOT NULL DEFAULT 'default/Banner.jpg',
    MODIFY `profilePic` VARCHAR(191) NOT NULL DEFAULT 'default/Profile.png';
