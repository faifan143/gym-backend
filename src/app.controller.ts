import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/guards/auth.guard';
import { RoleGuard } from './auth/guards/role.guard';
import { Roles } from './auth/decorators/role.decorator';
import { Role } from '@prisma/client';

@Controller('users')
@UseGuards(AuthGuard, RoleGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Roles(Role.MANAGER)
  getUser(): Promise<any[]> {
    return this.appService.getAllUsers();
  }
}
