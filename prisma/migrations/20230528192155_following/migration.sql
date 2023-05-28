-- CreateTable
CREATE TABLE `_Following` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_Following_AB_unique`(`A`, `B`),
    INDEX `_Following_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
