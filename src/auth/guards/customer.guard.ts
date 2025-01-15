import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assuming `user` is attached via an auth middleware

    if (user.role !== 'CUSTOMER') {
      throw new ForbiddenException('Only customers can access this resource');
    }

    const customer = await this.prisma.customer.findUnique({
      where: { userId: user.id },
    });

    if (!customer) {
      throw new BadRequestException(
        `customer with user id ${user.id} does not exist.`,
      );
    }

    // Check for active subscription
    const subscription = await this.prisma.customerSubscription.findFirst({
      where: {
        customerId: customer.id,
        startDate: { lte: new Date() }, // Subscription started
        endDate: { gte: new Date() }, // Subscription not expired
      },
    });

    if (!subscription) {
      throw new ForbiddenException('Customer must have an active subscription');
    }

    return true;
  }
}
