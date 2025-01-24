import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { CreateNutritionistDto } from './dto/create-nutritionist.dto';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { UpdateNutritionistDto } from './dto/update-nutritionist.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';

@Injectable()
export class ManagerService {
  constructor(private prisma: PrismaService) {}

  async createTrainer(data: CreateTrainerDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException('A user with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: 'TRAINER',
        trainer: {
          create: {
            specialtyId: data.specialty,
          },
        },
      },
    });

    return user;
  }

  async updateTrainer(trainerId: string, data: UpdateTrainerDto) {
    const trainer = await this.prisma.trainer.findUnique({
      where: { id: parseInt(trainerId) },
      include: { user: true }, // Include user to update the name if necessary
    });

    if (!trainer) {
      throw new NotFoundException(`Trainer with ID ${trainerId} not found.`);
    }

    const updatedData: any = {};

    // Update user name if provided
    if (data.name) {
      updatedData.user = { update: { name: data.name } };
    }

    // Validate and update specialty
    if (data.specialty) {
      const specialty = await this.prisma.specialty.findUnique({
        where: { id: data.specialty },
      });
      if (!specialty) {
        throw new BadRequestException('Specialty not found.');
      }
      updatedData.specialty = {
        connect: { id: data.specialty }, // Connect to the existing specialty
      };
    }

    return this.prisma.trainer.update({
      where: { id: parseInt(trainerId) },
      data: updatedData,
    });
  }

  async updateNutritionist(
    nutritionistId: string,
    data: UpdateNutritionistDto,
  ) {
    const nutritionist = await this.prisma.nutritionist.findUnique({
      where: { id: parseInt(nutritionistId) },
      include: { user: true }, // Include user to update the name if necessary
    });

    if (!nutritionist) {
      throw new NotFoundException(
        `Nutritionist with ID ${nutritionistId} not found.`,
      );
    }

    const updatedData: any = {};

    if (data.name) {
      updatedData.user = { update: { name: data.name } };
    }

    if (data.specialty) {
      // Ensure the specialty exists before updating
      const specialty = await this.prisma.specialty.findUnique({
        where: { id: data.specialty },
      });
      if (!specialty) {
        throw new BadRequestException('Specialty not found.');
      }
      // updatedData.specialtyId = data.specialty;
      updatedData.specialty = {
        connect: { id: data.specialty }, // Connect to the existing specialty
      };
    }

    return this.prisma.nutritionist.update({
      where: { id: parseInt(nutritionistId) },
      data: updatedData,
    });
  }

  async deleteTrainer(trainerId: string) {
    const trainer = await this.prisma.trainer.findUnique({
      where: { id: parseInt(trainerId) },
    });

    if (!trainer) {
      throw new NotFoundException(`Trainer with ID ${trainerId} not found.`);
    }

    return this.prisma.trainer.delete({ where: { id: parseInt(trainerId) } });
  }

  async createNutritionist(data: CreateNutritionistDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException('A user with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: 'NUTRITIONIST',
        nutritionist: {
          create: {
            specialtyId: data.specialty,
          },
        },
      },
    });

    return user;
  }

  // async updateNutritionist(
  //   nutritionistId: string,
  //   data: UpdateNutritionistDto,
  // ) {
  //   const nutritionist = await this.prisma.nutritionist.findUnique({
  //     where: { id: parseInt(nutritionistId) },
  //   });

  //   if (!nutritionist) {
  //     throw new NotFoundException(
  //       `Nutritionist with ID ${nutritionistId} not found.`,
  //     );
  //   }

  //   return this.prisma.nutritionist.update({
  //     where: { id: parseInt(nutritionistId) },
  //     data: {
  //       specialtyId: data.specialty,
  //       user: {
  //         update: {
  //           name: data.name,
  //         },
  //       },
  //     },
  //   });
  // }

  async deleteNutritionist(nutritionistId: string) {
    const nutritionist = await this.prisma.nutritionist.findUnique({
      where: { id: parseInt(nutritionistId) },
    });

    if (!nutritionist) {
      throw new NotFoundException(
        `Nutritionist with ID ${nutritionistId} not found.`,
      );
    }

    return this.prisma.nutritionist.delete({
      where: { id: parseInt(nutritionistId) },
    });
  }

  async createSubscriptionPlan(data: CreateSubscriptionPlanDto) {
    const startDate = new Date();
    let endDate: Date;

    switch (data.duration) {
      case 'MONTHLY':
        endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);
        break;

      case 'QUARTERLY':
        endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 3);
        break;

      case 'ANNUAL':
        endDate = new Date(startDate);
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;

      default:
        throw new BadRequestException('Invalid subscription duration.');
    }

    return this.prisma.subscription.create({
      data: {
        level: data.level,
        duration: data.duration,
        cost: data.cost,
      },
    });
  }

  async updateSubscriptionPlan(
    subscriptionId: string,
    data: UpdateSubscriptionPlanDto,
  ) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: parseInt(subscriptionId) },
    });

    if (!subscription) {
      throw new NotFoundException(
        `Subscription with ID ${subscriptionId} not found.`,
      );
    }

    return this.prisma.subscription.update({
      where: { id: parseInt(subscriptionId) },
      data: {
        level: data.level,
        duration: data.duration,
        cost: data.cost,
      },
    });
  }

  async deleteSubscriptionPlan(subscriptionId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: parseInt(subscriptionId) },
    });

    if (!subscription) {
      throw new NotFoundException(
        `Subscription with ID ${subscriptionId} not found.`,
      );
    }

    return this.prisma.subscription.delete({
      where: { id: parseInt(subscriptionId) },
    });
  }

  async getTrainerCustomerCount() {
    return this.prisma.trainer.findMany({
      include: {
        classes: {
          include: {
            customers: {
              include: {
                customer: {
                  select: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getNutritionistCustomerCount() {
    return this.prisma.nutritionist.findMany({
      include: {
        plans: {
          include: {
            enrolledCustomers: {
              select: {
                customer: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getUpcomingClasses() {
    const currentDate = new Date();
    return this.prisma.class.findMany({
      include: { trainer: true },
    });
  }

  async getEndingSubscriptions() {
    const currentDate = new Date();
    return this.prisma.subscription.findMany({
      include: { customers: true },
    });
  }

  async getTrainers() {
    return this.prisma.trainer.findMany({
      include: {
        user: true,
        classes: {
          include: {
            customers: {
              include: {
                customer: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getNutritionists() {
    return this.prisma.nutritionist.findMany({
      include: {
        user: true,
        plans: {
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
        },
      },
    });
  }

  async getSubscriptions() {
    return this.prisma.subscription.findMany({
      include: {
        customers: true,
      },
    });
  }

  async getCustomers() {
    return this.prisma.customer.findMany({
      include: {
        user: true,
        attendedClasses: true,
        enrolledPlans: true,
        subscriptions: true,
      },
    });
  }

  async detachExpiredSubscriptions(): Promise<{
    message: string;
    count: number;
  }> {
    const today = new Date();

    // Fetch all expired subscriptions
    const expiredSubscriptions =
      await this.prisma.customerSubscription.findMany({
        where: {
          endDate: {
            lt: today, // Find subscriptions that ended before today
          },
        },
      });

    // If no expired subscriptions found
    if (expiredSubscriptions.length === 0) {
      return {
        message: 'No expired subscriptions found.',
        count: 0,
      };
    }

    // Detach customers from expired subscriptions
    const deletionPromises = expiredSubscriptions.map((subscription) =>
      this.prisma.customerSubscription.delete({
        where: {
          id: subscription.id,
        },
      }),
    );

    // Execute all deletions
    await Promise.all(deletionPromises);

    return {
      message: 'Expired subscriptions detached successfully.',
      count: expiredSubscriptions.length,
    };
  }
  async detachCustomerExpiredSubscription(customerId: string) {
    const today = new Date();

    // Fetch all expired subscriptions
    const expiredSubscriptions =
      await this.prisma.customerSubscription.findMany({
        where: {
          customerId: parseInt(customerId),
          endDate: {
            lt: today, // Find subscriptions that ended before today
          },
        },
      });

    // If no expired subscriptions found
    if (expiredSubscriptions.length === 0) {
      return {
        message: 'No expired subscriptions found.',
        count: 0,
      };
    }

    // Detach customers from expired subscriptions
    const deletionPromises = expiredSubscriptions.map((subscription) =>
      this.prisma.customerSubscription.delete({
        where: {
          id: subscription.id,
        },
      }),
    );

    // Execute all deletions
    await Promise.all(deletionPromises);

    return {
      message: 'Expired subscription detached successfully.',
      count: expiredSubscriptions.length,
    };
  }

  async getExpiredSubscriptionsReport(): Promise<{
    message: string;
    count: number;
    details: Array<{
      subscriptionId: number;
      subscriptionLevel: string;
      customerId: number;
      customerName: string;
      customerEmail: string;
      endDate: Date;
    }>;
  }> {
    const today = new Date();

    // Fetch all expired subscriptions along with customer details
    const expiredSubscriptions =
      await this.prisma.customerSubscription.findMany({
        where: {
          endDate: {
            lt: today, // Find subscriptions that ended before today
          },
        },
        include: {
          customer: {
            include: {
              user: true, // Fetch user details for the customer
            },
          },
          subscription: true, // Include subscription details
        },
      });

    // If no expired subscriptions found
    if (expiredSubscriptions.length === 0) {
      return {
        message: 'No expired subscriptions found.',
        count: 0,
        details: [],
      };
    }

    // Prepare detailed report
    const reportDetails = expiredSubscriptions.map((subscription) => ({
      subscriptionId: subscription.subscription.id,
      subscriptionLevel: subscription.subscription.level,
      customerId: subscription.customer.id,
      customerName: subscription.customer.user.name,
      customerEmail: subscription.customer.user.email,
      endDate: subscription.endDate,
    }));

    return {
      message: 'Expired subscriptions report generated successfully.',
      count: expiredSubscriptions.length,
      details: reportDetails,
    };
  }

  async createSpecialty(name: string, target: 'TRAINER' | 'NUTRITIONIST') {
    const existingSpecialty = await this.prisma.specialty.findUnique({
      where: { name },
    });

    if (existingSpecialty) {
      throw new BadRequestException('Specialty with this name already exists.');
    }

    return this.prisma.specialty.create({
      data: { name, target },
    });
  }

  async getAllSpecialties() {
    return this.prisma.specialty.findMany();
  }

  async getTrainersSpecialties() {
    return this.prisma.trainer.findMany({
      include: {
        specialty: true,
        user: { select: { name: true, email: true } },
      },
    });
  }

  async getNutritionistsSpecialties() {
    return this.prisma.nutritionist.findMany({
      include: {
        specialty: true,
        user: { select: { name: true, email: true } },
      },
    });
  }
}
