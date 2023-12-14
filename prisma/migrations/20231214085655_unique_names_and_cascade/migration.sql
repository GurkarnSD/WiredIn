/*
  Warnings:

  - A unique constraint covering the columns `[displayName]` on the table `Credentials` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[displayName]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Credentials_displayName_key` ON `Credentials`(`displayName`);

-- CreateIndex
CREATE UNIQUE INDEX `User_displayName_key` ON `User`(`displayName`);
