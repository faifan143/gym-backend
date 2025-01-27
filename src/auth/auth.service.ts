import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterCustomerDto } from './dto/register-customer.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async generateToken(user: any) {
    const payload = { id: user.id, email: user.email, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      ...payload,
      name: user.name,
      photo: user.photo,
    };
  }

  async handleLogin(credentials: LoginDto) {
    try {
      const user = await this.validateUser(
        credentials.email,
        credentials.password,
      );

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }
      console.log('user : ', user);

      if (user.role == 'CUSTOMER') {
        const allInfo = await this.prisma.customer.findFirst({
          where: { userId: user.id },
          include: {
            subscriptions: {
              include: {
                subscription: true,
              },
            },
            attendedClasses: {
              include: {
                class: true,
              },
            },
            enrolledPlans: {
              include: {
                nutritionPlan: true,
              },
            },
          },
        });

        const token = await this.generateToken(user);

        return {
          ...token,
          role: user.role,
          email: user.email,
          name: user.name,
          ...allInfo,
          photo: user.photo,
        };
      }

      return this.generateToken(user);
    } catch (error) {
      console.log('error generating token');
      throw new UnauthorizedException('الحساب أو كلمة المرور غير صحيحين');
    }
  }

  async registerUser(data: RegisterCustomerDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: 'CUSTOMER',
        customer: {
          create: {},
        },
      },
    });

    return user;
  }

  async updateUserName(userId: string, newName: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: parseInt(userId) },
      data: { name: newName },
    });
  }

  async updatePhoto(userId: string, photo: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id: parseInt(userId) },
      data: { photo },
    });
  }

  async updateUserPassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Incorrect old password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return this.prisma.user.update({
      where: { id: parseInt(userId) },
      data: { password: hashedPassword },
    });
  }
}
