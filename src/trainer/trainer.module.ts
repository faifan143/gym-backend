import { Module } from '@nestjs/common';
import { TrainerService } from './trainer.service';
import { TrainerController } from './trainer.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [AuthModule],
  exports: [TrainerService],
  providers: [TrainerService, PrismaService],
  controllers: [TrainerController],
})
export class TrainerModule {}
