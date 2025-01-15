/*
  Warnings:

  - You are about to drop the column `email` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `nutritionist` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `nutritionist` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `nutritionist` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `trainer` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `trainer` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `trainer` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `trainer` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Nutritionist` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Trainer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Nutritionist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Trainer` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Customer_email_key` ON `customer`;

-- DropIndex
DROP INDEX `Nutritionist_email_key` ON `nutritionist`;

-- DropIndex
DROP INDEX `Trainer_email_key` ON `trainer`;

-- AlterTable
ALTER TABLE `customer` DROP COLUMN `email`,
    DROP COLUMN `name`,
    DROP COLUMN `password`,
    DROP COLUMN `phone`,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `nutritionist` DROP COLUMN `email`,
    DROP COLUMN `name`,
    DROP COLUMN `password`,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `trainer` DROP COLUMN `email`,
    DROP COLUMN `name`,
    DROP COLUMN `password`,
    DROP COLUMN `phone`,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('CUSTOMER', 'TRAINER', 'NUTRITIONIST', 'MANAGER') NOT NULL,
    `phone` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Customer_userId_key` ON `Customer`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `Nutritionist_userId_key` ON `Nutritionist`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `Trainer_userId_key` ON `Trainer`(`userId`);

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trainer` ADD CONSTRAINT `Trainer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nutritionist` ADD CONSTRAINT `Nutritionist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
