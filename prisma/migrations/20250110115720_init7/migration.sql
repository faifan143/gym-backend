-- DropForeignKey
ALTER TABLE `class` DROP FOREIGN KEY `Class_trainerId_fkey`;

-- DropForeignKey
ALTER TABLE `customer` DROP FOREIGN KEY `Customer_userId_fkey`;

-- DropForeignKey
ALTER TABLE `customerclass` DROP FOREIGN KEY `CustomerClass_classId_fkey`;

-- DropForeignKey
ALTER TABLE `customerclass` DROP FOREIGN KEY `CustomerClass_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `customernutritionplan` DROP FOREIGN KEY `CustomerNutritionPlan_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `customernutritionplan` DROP FOREIGN KEY `CustomerNutritionPlan_planId_fkey`;

-- DropForeignKey
ALTER TABLE `customersubscription` DROP FOREIGN KEY `CustomerSubscription_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `customersubscription` DROP FOREIGN KEY `CustomerSubscription_subscriptionId_fkey`;

-- DropForeignKey
ALTER TABLE `nutritionist` DROP FOREIGN KEY `Nutritionist_userId_fkey`;

-- DropForeignKey
ALTER TABLE `nutritionplan` DROP FOREIGN KEY `NutritionPlan_nutritionistId_fkey`;

-- DropForeignKey
ALTER TABLE `trainer` DROP FOREIGN KEY `Trainer_userId_fkey`;

-- AddForeignKey
ALTER TABLE `Customer` ADD CONSTRAINT `Customer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trainer` ADD CONSTRAINT `Trainer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Nutritionist` ADD CONSTRAINT `Nutritionist_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerSubscription` ADD CONSTRAINT `CustomerSubscription_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerSubscription` ADD CONSTRAINT `CustomerSubscription_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `Subscription`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Class` ADD CONSTRAINT `Class_trainerId_fkey` FOREIGN KEY (`trainerId`) REFERENCES `Trainer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerClass` ADD CONSTRAINT `CustomerClass_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerClass` ADD CONSTRAINT `CustomerClass_classId_fkey` FOREIGN KEY (`classId`) REFERENCES `Class`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `NutritionPlan` ADD CONSTRAINT `NutritionPlan_nutritionistId_fkey` FOREIGN KEY (`nutritionistId`) REFERENCES `Nutritionist`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerNutritionPlan` ADD CONSTRAINT `CustomerNutritionPlan_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomerNutritionPlan` ADD CONSTRAINT `CustomerNutritionPlan_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `NutritionPlan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
