import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { NutritionistService } from './nutritionist.service';
import { CreateNutritionPlanDto } from './dto/create-nutrition-plan.dto';
import { UpdateNutritionPlanDto } from './dto/update-nutrition-plan.dto';
import { User } from 'src/auth/decorators/user.decorator';
import { JsonPayload } from 'src/auth/dto/jwtpayload.type';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorators/role.decorator';

@Controller('nutritionist')
@UseGuards(AuthGuard, RoleGuard)
export class NutritionistController {
  constructor(private readonly nutritionistService: NutritionistService) {}

  /**
   * Create a new nutrition plan.
   */
  @Post('create-plan')
  @Roles(Role.NUTRITIONIST)
  async createNutritionPlan(
    @User() user: JsonPayload,
    @Body() createNutritionPlanDto: CreateNutritionPlanDto,
  ) {
    return this.nutritionistService.createNutritionPlan(
      user.id,
      createNutritionPlanDto,
    );
  }

  /**
   * Get all plans created by the nutritionist.
   */
  @Get('plans')
  @Roles(Role.NUTRITIONIST)
  async getAllPlans(@User() user: JsonPayload) {
    return this.nutritionistService.getAllPlans(user.id);
  }

  /**
   * Get all customers enrolled in a specific plan.
   */
  @Get('plan/:planId/customers')
  @Roles(Role.NUTRITIONIST)
  async getPlanCustomers(
    @User() user: JsonPayload,
    @Param('planId') planId: string,
  ) {
    return this.nutritionistService.getPlanCustomers(
      user.id.toString(),
      parseInt(planId),
    );
  }

  /**
   * Get a specific plan by its ID.
   */
  @Get('plan/:planId')
  @Roles(Role.NUTRITIONIST)
  async findOne(@User() user: JsonPayload, @Param('planId') planId: string) {
    return this.nutritionistService.getOnePlans(user.id.toString(), planId);
  }

  /**
   * Update an existing nutrition plan.
   */
  @Put('plan/:planId')
  @Roles(Role.NUTRITIONIST)
  async updateNutritionPlan(
    @User() user: JsonPayload,
    @Param('planId') planId: string,
    @Body() updateNutritionPlanDto: UpdateNutritionPlanDto,
  ) {
    return this.nutritionistService.updateNutritionPlan(
      user.id,
      planId,
      updateNutritionPlanDto,
    );
  }

  /**
   * Delete a specific nutrition plan.
   */
  @Delete('plan/:planId')
  @Roles(Role.NUTRITIONIST)
  async deletePlan(@User() user: JsonPayload, @Param('planId') planId: string) {
    return this.nutritionistService.deletePlan(user.id, planId);
  }

  /**
   * Remove a customer from a specific nutrition plan.
   */
  @Delete('plan/:planId/customer/:customerId')
  @Roles(Role.NUTRITIONIST)
  async removeCustomerFromPlan(
    @User() user: JsonPayload,
    @Param('planId') planId: string,
    @Param('customerId') customerId: string,
  ) {
    return this.nutritionistService.removeCustomerFromPlan(
      user.id,
      parseInt(planId),
      parseInt(customerId),
    );
  }
}
