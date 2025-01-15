import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers(): Promise<any[]> {
    try {
      const hash = await bcrypt.hash('testpassword', 10);
      console.log('Hash:', hash);

      return await this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  }
}
