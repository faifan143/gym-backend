/*
  Warnings:

  - You are about to alter the column `specialty` on the `nutritionist` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.
  - You are about to drop the column `type` on the `subscription` table. All the data in the column will be lost.
  - You are about to alter the column `specialty` on the `trainer` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.
  - A unique constraint covering the columns `[email]` on the table `Trainer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Customer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Nutritionist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Nutritionist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `NutritionPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Trainer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Trainer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Trainer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `attendance` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `class` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `customer` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `nutritionist` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `specialty` ENUM('STRENGTH_TRAINING', 'CARDIO', 'YOGA', 'CROSSFIT', 'HIIT', 'SPORTS_NUTRITION', 'WEIGHT_MANAGEMENT', 'CLINICAL_NUTRITION', 'HOLISTIC_NUTRITION') NOT NULL;

-- AlterTable
ALTER TABLE `nutritionplan` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `payment` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `subscription` DROP COLUMN `type`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `duration` ENUM('MONTHLY', 'QUARTERLY', 'ANNUAL') NOT NULL,
    ADD COLUMN `level` ENUM('BASIC', 'VIP', 'PREMIUM') NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `trainer` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `specialty` ENUM('STRENGTH_TRAINING', 'CARDIO', 'YOGA', 'CROSSFIT', 'HIIT', 'SPORTS_NUTRITION', 'WEIGHT_MANAGEMENT', 'CLINICAL_NUTRITION', 'HOLISTIC_NUTRITION') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Trainer_email_key` ON `Trainer`(`email`);
