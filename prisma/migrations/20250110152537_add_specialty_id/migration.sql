/*
  Warnings:

  - You are about to drop the column `specialty` on the `nutritionist` table. All the data in the column will be lost.
  - You are about to drop the column `specialty` on the `trainer` table. All the data in the column will be lost.
  - Added the required column `specialtyId` to the `Nutritionist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `specialtyId` to the `Trainer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `nutritionist` DROP COLUMN `specialty`,
    ADD COLUMN `specialtyId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `trainer` DROP COLUMN `specialty`,
    ADD COLUMN `specialtyId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Specialty` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `target` ENUM('TRAINER', 'NUTRITIONIST') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Specialty_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Trainer` ADD CONSTRAINT `Trainer_specialtyId_fkey` FOREIGN KEY (`specialtyId`) REFERENCES `Specialty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nutritionist` ADD CONSTRAINT `Nutritionist_specialtyId_fkey` FOREIGN KEY (`specialtyId`) REFERENCES `Specialty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
