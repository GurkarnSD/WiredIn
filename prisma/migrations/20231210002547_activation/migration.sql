-- AlterTable
ALTER TABLE `Credentials` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `ActivateToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(191) NOT NULL,
    `activatedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `credsId` INTEGER NOT NULL,

    UNIQUE INDEX `ActivateToken_token_key`(`token`),
    INDEX `ActivateToken_credsId_idx`(`credsId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
