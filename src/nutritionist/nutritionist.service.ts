import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateNutritionPlanDto } from './dto/create-nutrition-plan.dto';
import { UpdateNutritionPlanDto } from './dto/update-nutrition-plan.dto';

@Injectable()
export class NutritionistService {
  constructor(private readonly prisma: PrismaService) {}

  async createNutritionPlan(
    nutritionistId: number,
    data: CreateNutritionPlanDto,
  ) {
    const nutritionist = await this.prisma.nutritionist.findUnique({
      where: { userId: nutritionistId },
    });

    if (!nutritionist) {
      throw new BadRequestException(
        `Nutritionist with user ID ${nutritionistId} does not exist.`,
      );
    }

    const nutritionPlan = await this.prisma.nutritionPlan.create({
      data: {
        title: data.title,
        planDetails: data.planDetails,
        nutritionistId: nutritionist.id,
      },
    });

    if (data.customerIds?.length) {
      const customers = await this.prisma.customer.findMany({
        where: { id: { in: data.customerIds } },
      });

      if (customers.length !== data.customerIds.length) {
        throw new BadRequestException('One or more customers do not exist.');
      }

      await Promise.all(
        data.customerIds.map((customerId) =>
          this.prisma.customerNutritionPlan.create({
            data: {
              customerId,
              planId: nutritionPlan.id,
            },
          }),
        ),
      );
    }

    return nutritionPlan;
  }

  async getAllPlans(nutritionistId: number) {
    const nutritionist = await this.prisma.nutritionist.findUnique({
      where: { userId: nutritionistId },
    });

    if (!nutritionist) {
      throw new BadRequestException(
        `nutritionist with user id ${nutritionistId} does not exist.`,
      );
    }
    return this.prisma.nutritionPlan.findMany({
      where: { nutritionistId: nutritionist.id },
      include: {
        enrolledCustomers: {
          include: {
            customer: {
              include: {
                subscriptions: true,
                user: true,
              },
            },
          },
        },
      },
    });
  }
  async getOnePlans(nutritionistId: string, planId: string) {
    const nutritionist = await this.prisma.nutritionist.findUnique({
      where: { userId: parseInt(nutritionistId) },
    });

    if (!nutritionist) {
      throw new BadRequestException(
        `nutritionist with user id ${nutritionistId} does not exist.`,
      );
    }

    return this.prisma.nutritionPlan.findFirst({
      where: { nutritionistId: nutritionist.id, id: parseInt(planId) },
      include: {
        enrolledCustomers: {
          include: {
            customer: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
  }

  async getPlanCustomers(nutritionistId: string, planId: number) {
    const nutritionist = await this.prisma.nutritionist.findUnique({
      where: { userId: parseInt(nutritionistId) },
    });

    if (!nutritionist) {
      throw new BadRequestException(
        `nutritionist with user id ${nutritionistId} does not exist.`,
      );
    }

    const plan = await this.prisma.nutritionPlan.findUnique({
      where: { nutritionistId: nutritionist.id, id: planId },
      include: {
        enrolledCustomers: {
          include: {
            customer: {
              include: {
                subscriptions: true,
                user: true,
              },
            },
          },
        },
      },
    });

    if (!plan) {
      throw new BadRequestException(`Plan with ID ${planId} does not exist.`);
    }

    return plan.enrolledCustomers.map((enrollment) => enrollment.customer);
  }

  async updateNutritionPlan(
    nutritionistId: number,
    planId: string,
    data: UpdateNutritionPlanDto,
  ) {
    const nutritionist = await this.prisma.nutritionist.findUnique({
      where: { userId: nutritionistId },
    });

    if (!nutritionist) {
      throw new BadRequestException(
        `nutritionist with user id ${nutritionistId} does not exist.`,
      );
    }

    const plan = await this.prisma.nutritionPlan.findUnique({
      where: { id: parseInt(planId) },
    });

    if (!plan || plan.nutritionistId !== nutritionist.id) {
      throw new ForbiddenException(`You do not have access to this plan.`);
    }

    return this.prisma.nutritionPlan.update({
      where: { id: parseInt(planId) },
      data,
    });
  }

  async deletePlan(nutritionistId: number, planId: string) {
    const nutritionist = await this.prisma.nutritionist.findUnique({
      where: { userId: nutritionistId },
    });

    if (!nutritionist) {
      throw new BadRequestException(
        `nutritionist with user id ${nutritionistId} does not exist.`,
      );
    }

    const plan = await this.prisma.nutritionPlan.findUnique({
      where: { id: parseInt(planId) },
    });

    if (!plan || plan.nutritionistId !== nutritionist.id) {
      throw new ForbiddenException(
        `You do not have access to this nutrition plan.`,
      );
    }

    return this.prisma.nutritionPlan.delete({
      where: { id: parseInt(planId) },
    });
  }

  async removeCustomerFromPlan(
    nutritionistId: number,
    planId: number,
    customerId: number,
  ) {
    // Ensure the nutritionist exists
    const nutritionist = await this.prisma.nutritionist.findUnique({
      where: { userId: nutritionistId },
    });

    if (!nutritionist) {
      throw new BadRequestException(
        `Nutritionist with user ID ${nutritionistId} does not exist.`,
      );
    }

    // Ensure the plan exists and belongs to the nutritionist
    const plan = await this.prisma.nutritionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan || plan.nutritionistId !== nutritionist.id) {
      throw new ForbiddenException(`You do not have access to this plan.`);
    }

    // Ensure the customer is enrolled in the plan
    const customerPlan = await this.prisma.customerNutritionPlan.findUnique({
      where: { customerId_planId: { customerId, planId } },
    });

    if (!customerPlan) {
      throw new BadRequestException(
        `Customer with ID ${customerId} is not enrolled in the plan.`,
      );
    }

    // Remove the customer from the plan
    return this.prisma.customerNutritionPlan.delete({
      where: { id: customerPlan.id },
    });
  }
}
