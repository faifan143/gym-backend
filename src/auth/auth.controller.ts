import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { User } from './decorators/user.decorator';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() credentials: LoginDto) {
    return await this.authService.handleLogin(credentials);
  }

  @Post('register')
  async registerUser(@Body() data: RegisterCustomerDto) {
    return this.authService.registerUser(data);
  }

  @Patch('update-name')
  @UseGuards(AuthGuard)
  async updateUserName(@Body('newName') newName: string, @User() user: any) {
    return this.authService.updateUserName(user.id, newName);
  }

  @Patch('update-password')
  @UseGuards(AuthGuard)
  async updateUserPassword(
    @User() user: any,
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.updateUserPassword(
      user.id,
      oldPassword,
      newPassword,
    );
  }
}
