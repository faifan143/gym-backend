/*
  Warnings:

  - You are about to drop the column `day` on the `class` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `class` table. All the data in the column will be lost.
  - Added the required column `schedule` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `class` DROP COLUMN `day`,
    DROP COLUMN `time`,
    ADD COLUMN `schedule` JSON NOT NULL;
