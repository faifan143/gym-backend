import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ManagerController],
  providers: [ManagerService, PrismaService],
})
export class ManagerModule {}
