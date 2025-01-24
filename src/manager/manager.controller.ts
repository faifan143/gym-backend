import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ManagerService } from './manager.service';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { CreateNutritionistDto } from './dto/create-nutritionist.dto';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { UpdateNutritionistDto } from './dto/update-nutritionist.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';

@Controller('manager')
@UseGuards(AuthGuard, RoleGuard)
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Post('trainer')
  @Roles(Role.MANAGER)
  async createTrainer(@Body() data: CreateTrainerDto) {
    return this.managerService.createTrainer(data);
  }

  @Put('trainer/:trainerId')
  @Roles(Role.MANAGER)
  async updateTrainer(
    @Param('trainerId') trainerId: string,
    @Body() data: UpdateTrainerDto,
  ) {
    return this.managerService.updateTrainer(trainerId, data);
  }

  @Delete('trainer/:trainerId')
  @Roles(Role.MANAGER)
  async deleteTrainer(@Param('trainerId') trainerId: string) {
    return this.managerService.deleteTrainer(trainerId);
  }

  @Post('nutritionist')
  @Roles(Role.MANAGER)
  async createNutritionist(@Body() data: CreateNutritionistDto) {
    return this.managerService.createNutritionist(data);
  }

  @Put('nutritionist/:nutritionistId')
  @Roles(Role.MANAGER)
  async updateNutritionist(
    @Param('nutritionistId') nutritionistId: string,
    @Body() data: UpdateNutritionistDto,
  ) {
    return this.managerService.updateNutritionist(nutritionistId, data);
  }

  @Delete('nutritionist/:nutritionistId')
  @Roles(Role.MANAGER)
  async deleteNutritionist(@Param('nutritionistId') nutritionistId: string) {
    return this.managerService.deleteNutritionist(nutritionistId);
  }

  @Post('subscription')
  @Roles(Role.MANAGER)
  async createSubscriptionPlan(@Body() data: CreateSubscriptionPlanDto) {
    return this.managerService.createSubscriptionPlan(data);
  }

  @Put('subscription/:subscriptionId')
  @Roles(Role.MANAGER)
  async updateSubscriptionPlan(
    @Param('subscriptionId') subscriptionId: string,
    @Body() data: UpdateSubscriptionPlanDto,
  ) {
    return this.managerService.updateSubscriptionPlan(subscriptionId, data);
  }

  @Delete('subscription/:subscriptionId')
  @Roles(Role.MANAGER)
  async deleteSubscriptionPlan(
    @Param('subscriptionId') subscriptionId: string,
  ) {
    return this.managerService.deleteSubscriptionPlan(subscriptionId);
  }

  @Get('trainer-customers')
  @Roles(Role.MANAGER)
  async getTrainerCustomerCount() {
    return this.managerService.getTrainerCustomerCount();
  }

  @Get('nutritionist-customers')
  @Roles(Role.MANAGER)
  async getNutritionistCustomerCount() {
    return this.managerService.getNutritionistCustomerCount();
  }

  @Get('upcoming-classes')
  @Roles(Role.MANAGER)
  async getUpcomingClasses() {
    return this.managerService.getUpcomingClasses();
  }

  @Get('ending-subscriptions')
  @Roles(Role.MANAGER)
  async getEndingSubscriptions() {
    return this.managerService.getEndingSubscriptions();
  }

  // Get all trainers
  @Get('trainers')
  @Roles(Role.MANAGER)
  async getTrainers() {
    return this.managerService.getTrainers();
  }

  // Get all nutritionists
  @Get('nutritionists')
  @Roles(Role.MANAGER)
  async getNutritionists() {
    return this.managerService.getNutritionists();
  }

  // Get all subscriptions
  @Get('subscriptions')
  @Roles(Role.MANAGER)
  async getSubscriptions() {
    return this.managerService.getSubscriptions();
  }

  // Get all customers
  @Get('customers')
  @Roles(Role.MANAGER)
  async getCustomers() {
    return this.managerService.getCustomers();
  }

  @Delete('expired-subscriptions')
  @Roles(Role.MANAGER)
  async detachExpiredSubscriptions() {
    return this.managerService.detachExpiredSubscriptions();
  }

  @Delete('expired-subscriptions/:cusomerId')
  @Roles(Role.MANAGER)
  async detachCustomerExpiredSubscription(
    @Param('cusomerId') customerId: string,
  ) {
    return this.managerService.detachCustomerExpiredSubscription(customerId);
  }

  @Get('expired-subscriptions-report')
  @Roles(Role.MANAGER)
  async getExpiredSubscriptionsReport() {
    return this.managerService.getExpiredSubscriptionsReport();
  }

  @Post('specialty')
  @Roles(Role.MANAGER)
  async createSpecialty(
    @Body() data: { name: string; target: 'TRAINER' | 'NUTRITIONIST' },
  ) {
    return this.managerService.createSpecialty(data.name, data.target);
  }

  @Get('specialties')
  @Roles(Role.MANAGER)
  async getAllSpecialties() {
    return this.managerService.getAllSpecialties();
  }

  @Get('trainers-specialties')
  @Roles(Role.MANAGER)
  async getTrainersSpecialties() {
    return this.managerService.getTrainersSpecialties();
  }

  @Get('nutritionists-specialties')
  @Roles(Role.MANAGER)
  async getNutritionistsSpecialties() {
    return this.managerService.getNutritionistsSpecialties();
  }
}
