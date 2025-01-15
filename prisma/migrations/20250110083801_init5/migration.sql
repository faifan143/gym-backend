/*
  Warnings:

  - You are about to drop the column `subscriptionId` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `nutritionplan` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the `attendance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `title` to the `NutritionPlan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `attendance` DROP FOREIGN KEY `Attendance_classId_fkey`;

-- DropForeignKey
ALTER TABLE `attendance` DROP FOREIGN KEY `Attendance_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `customer` DROP FOREIGN KEY `Customer_subscriptionId_fkey`;

-- DropForeignKey
ALTER TABLE `nutritionplan` DROP FOREIGN KEY `NutritionPlan_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `Payment_subscriptionId_fkey`;

-- AlterTable
ALTER TABLE `customer` DROP COLUMN `subscriptionId`;

-- AlterTable
ALTER TABLE `nutritionplan` DROP COLUMN `customerId`,
    ADD COLUMN `title` VARCHAR(191) NOT NULL,
    MODIFY `planDetails` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `subscription` DROP COLUMN `endDate`,
    DROP COLUMN `startDate`;

-- DropTable
DROP TABLE `attendance`;

-- DropTable
DROP TABLE `payment`;

-- CreateTable
CREATE TABLE `CustomerSubscription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `subscriptionId` INTEGER NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `CustomerSubscription_customerId_subscriptionId_key`(`customerId`, `subscriptionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerClass` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `classId` INTEGER NOT NULL,
    `joinedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `CustomerClass_customerId_classId_key`(`customerId`, `classId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomerNutritionPlan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `customerId` INTEGER NOT NULL,
    `planId` INTEGER NOT NULL,
    `enrolledAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `CustomerNutritionPlan_customerId_planId_key`(`customerId`, `planId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CustomerSubscription` ADD CONSTRAINT `CustomerSubscription_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerSubscription` ADD CONSTRAINT `CustomerSubscription_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `Subscription`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerClass` ADD CONSTRAINT `CustomerClass_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerClass` ADD CONSTRAINT `CustomerClass_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerNutritionPlan` ADD CONSTRAINT `CustomerNutritionPlan_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerNutritionPlan` ADD CONSTRAINT `CustomerNutritionPlan_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `NutritionPlan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
