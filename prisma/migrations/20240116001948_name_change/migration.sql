-- CreateTable
CREATE TABLE `NameChange` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `credsId` INTEGER NOT NULL,

    UNIQUE INDEX `NameChange_name_key`(`name`),
    INDEX `NameChange_credsId_idx`(`credsId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
