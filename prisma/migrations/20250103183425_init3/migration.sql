/*
  Warnings:

  - You are about to drop the column `schedule` on the `class` table. All the data in the column will be lost.
  - Added the required column `day` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `class` DROP COLUMN `schedule`,
    ADD COLUMN `day` VARCHAR(191) NOT NULL,
    ADD COLUMN `time` VARCHAR(191) NOT NULL;
