import { Module } from '@nestjs/common';
import { NutritionistController } from './nutritionist.controller';
import { NutritionistService } from './nutritionist.service';
import { PrismaService } from 'src/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [NutritionistController],
  providers: [NutritionistService, PrismaService],
})
export class NutritionistModule {}
