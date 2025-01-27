import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { ManagerModule } from './manager/manager.module';
import { AuthModule } from './auth/auth.module';
import { TrainerService } from './trainer/trainer.service';
import { TrainerModule } from './trainer/trainer.module';
import { TrainerController } from './trainer/trainer.controller';
import { NutritionistModule } from './nutritionist/nutritionist.module';
import { CustomerModule } from './customer/customer.module';
import { CloudinaryService } from './shared/cloudinary.service';

@Module({
  imports: [
    ManagerModule,
    AuthModule,
    TrainerModule,
    NutritionistModule,
    CustomerModule,
  ],
  controllers: [AppController, TrainerController],
  providers: [AppService, PrismaService, TrainerService, CloudinaryService],
  exports: [CloudinaryService],
})
export class AppModule {}
