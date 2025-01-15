import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/role.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { JsonPayload } from 'src/auth/dto/jwtpayload.type';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { SubscriptionGuard } from 'src/auth/guards/customer.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { CustomerService } from './customer.service';

@Controller('customer')
@UseGuards(AuthGuard, RoleGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('subscribe/:subscriptionId')
  @Roles(Role.CUSTOMER)
  async makePayment(
    @User() customer: JsonPayload,
    @Param('subscriptionId') subscriptionId: string,
  ) {
    return this.customerService.makePayment(customer.id, subscriptionId);
  }

  @Post('attend-class/:classId')
  @Roles(Role.CUSTOMER)
  @UseGuards(SubscriptionGuard)
  async attendClass(
    @User() customer: JsonPayload,
    @Param('classId') classId: string,
  ) {
    return this.customerService.attendClass(customer.id, classId);
  }

  @Post('enroll-plan/:planId')
  @UseGuards(SubscriptionGuard)
  @Roles(Role.CUSTOMER)
  async enrollPLan(@User() user: JsonPayload, @Param('planId') planId: string) {
    return this.customerService.enrollPlan(user.id, planId);
  }

  @Get('all-classes')
  @Roles(Role.CUSTOMER)
  async getAllClasses() {
    return this.customerService.getClasses();
  }
  @Get('all-plans')
  @Roles(Role.CUSTOMER)
  async getAllPlans() {
    return this.customerService.getPlans();
  }
  @Get('all-subscriptions')
  @Roles(Role.CUSTOMER)
  async getAllSubscriptions() {
    return this.customerService.getSubscriptions();
  }
  @Get('my-classes')
  @Roles(Role.CUSTOMER)
  async getMyClasses(@User() user: JsonPayload) {
    return this.customerService.getMyClasses(user.id);
  }
  @Get('my-plans')
  @Roles(Role.CUSTOMER)
  async getMyPlans(@User() user: JsonPayload) {
    return this.customerService.getMyPlans(user.id);
  }
  @Get('my-subscription')
  @Roles(Role.CUSTOMER)
  async getMySubscription(@User() user: JsonPayload) {
    return this.customerService.getMySubscription(user.id);
  }
}
