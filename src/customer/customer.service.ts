import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Ensures the customer exists and fetches their record.
   */
  private async getCustomer(userId: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId },
      include: { subscriptions: true },
    });

    if (!customer) {
      throw new NotFoundException(
        `Customer with user ID ${userId} does not exist.`,
      );
    }

    return customer;
  }

  private async validateSubscriptionLimits(customerId: number) {
    try {
      // Count the number of classes associated with the customer
      const customerClassesCount = await this.prisma.customerClass.count({
        where: { customerId },
      });

      // Count the number of nutrition plans associated with the customer
      const customerPlansCount = await this.prisma.customerNutritionPlan.count({
        where: { customerId },
      });

      // Retrieve the active subscription
      const customerSubscription =
        await this.prisma.customerSubscription.findFirst({
          where: {
            customerId,
            startDate: { lte: new Date() },
            endDate: { gte: new Date() },
          },
          include: { subscription: true },
        });

      // Throw an error if no active subscription is found
      if (!customerSubscription) {
        throw new BadRequestException(
          `Customer does not have an active subscription.`,
        );
      }

      const { level: subscriptionType } = customerSubscription.subscription;

      // Check subscription limits
      if (
        subscriptionType === 'BASIC' &&
        customerClassesCount + customerPlansCount >= 1
      ) {
        throw new BadRequestException(
          `Basic subscription allows only 1 activity (class or plan).`,
        );
      }

      if (
        subscriptionType === 'VIP' &&
        customerClassesCount + customerPlansCount >= 2
      ) {
        console.log(
          `Customer ${customerId} has ${customerClassesCount} classes and ${customerPlansCount} plans.`,
        );
        throw new BadRequestException(
          `VIP subscription allows only 2 activities. Currently enrolled in ${customerClassesCount} classes and ${customerPlansCount} plans.`,
        );
      }

      // Premium subscription has no restrictions
    } catch (error) {
      // Catch any errors and rethrow them as BadRequestException with a detailed message
      console.log(
        `Error validating subscription limits: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Processes a payment and creates a new subscription for the customer.
   */
  async makePayment(userId: number, subscriptionId: string) {
    const customer = await this.getCustomer(userId);

    const activeSubscription = customer.subscriptions.find(
      (sub) =>
        new Date(sub.startDate) <= new Date() &&
        new Date(sub.endDate) >= new Date(),
    );

    if (activeSubscription) {
      throw new BadRequestException(
        `Customer already has an active subscription ending on ${activeSubscription.endDate}.`,
      );
    }
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: parseInt(subscriptionId) },
    });

    if (!subscription) {
      throw new NotFoundException(
        `Subscription with ID ${subscriptionId} does not exist.`,
      );
    }

    // Create subscription relation for the customer
    await this.prisma.customerSubscription.create({
      data: {
        customerId: customer.id,
        subscriptionId: subscription.id,
        startDate: new Date(),
        endDate: new Date(
          new Date().setMonth(
            new Date().getMonth() +
              (subscription.duration === 'MONTHLY'
                ? 1
                : subscription.duration === 'QUARTERLY'
                  ? 3
                  : 12),
          ),
        ),
      },
    });

    return { message: 'Payment successful, subscription updated.' };
  }

  /**
   * Allows the customer to attend a class if they are subscribed.
   */
  async attendClass(customerId: number, classId: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { userId: customerId },
    });

    if (!customer) {
      throw new NotFoundException(
        `Customer with user ID ${customerId} does not exist.`,
      );
    }

    try {
      this.validateSubscriptionLimits(customer.id);
    } catch (err) {
      throw err;
    }
    const classEntity = await this.prisma.class.findUnique({
      where: { id: parseInt(classId) },
      include: { customers: true },
    });

    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${classId} does not exist.`);
    }

    if (classEntity.customers.length >= classEntity.maxCapacity) {
      throw new BadRequestException(
        `Class with ID ${classId} is already at full capacity.`,
      );
    }

    const alreadyEnrolled = classEntity.customers.some(
      (attendance) => attendance.customerId === customer.id,
    );

    if (alreadyEnrolled) {
      throw new BadRequestException(
        `Customer is already enrolled in the class.`,
      );
    }

    // Create attendance record
    await this.prisma.customerClass.create({
      data: {
        customerId: customer.id,
        classId: parseInt(classId),
      },
    });

    return { message: 'Successfully enrolled in the class.' };
  }

  /**
   * Allows the customer to enroll in a nutrition plan.
   */
  async enrollPlan(userId: number, planId: string) {
    const customer = await this.getCustomer(userId);

    try {
      this.validateSubscriptionLimits(customer.id);
    } catch (err) {
      throw err;
    }
    // Check if the nutrition plan exists
    const plan = await this.prisma.nutritionPlan.findUnique({
      where: { id: parseInt(planId) },
    });

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${planId} does not exist.`);
    }

    // Check if the customer is already enrolled in the plan
    const alreadyEnrolled = await this.prisma.customerNutritionPlan.findFirst({
      where: {
        customerId: customer.id,
        planId: parseInt(planId),
      },
    });

    if (alreadyEnrolled) {
      throw new BadRequestException(
        `Customer is already enrolled in the plan "${plan.title}".`,
      );
    }

    // Enroll the customer in the plan
    await this.prisma.customerNutritionPlan.create({
      data: {
        customerId: customer.id,
        planId: parseInt(planId),
        enrolledAt: new Date(),
      },
    });

    return { message: 'Successfully enrolled in the nutrition plan.' };
  }

  /**
   * Fetches all available classes.
   */
  async getClasses() {
    const classes = await this.prisma.class.findMany({
      include: { trainer: true },
    });
    return classes;
  }

  /**
   * Fetches all available nutrition plans.
   */
  async getPlans() {
    const plans = await this.prisma.nutritionPlan.findMany({
      include: {
        nutritionist: {
          include: {
            user: true,
          },
        },
      },
    });
    return plans;
  }

  /**
   * Fetches all classes the customer is currently enrolled in.
   */
  async getMyClasses(userId: number) {
    const customer = await this.getCustomer(userId);

    const classes = await this.prisma.customerClass.findMany({
      where: { customerId: customer.id },
      include: { class: true },
    });

    return classes.map((enrollment) => enrollment.class);
  }

  /**
   * Fetches all nutrition plans the customer is currently enrolled in.
   */
  async getMyPlans(userId: number) {
    const customer = await this.getCustomer(userId);

    const plans = await this.prisma.customerNutritionPlan.findMany({
      where: { customerId: customer.id },
      include: {
        nutritionPlan: {
          include: {
            nutritionist: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    return plans.map((enrollment) => enrollment.nutritionPlan);
  }

  /**
   * Fetches the customer's current active subscription.
   */
  async getMySubscription(userId: number) {
    const customer = await this.getCustomer(userId);
    if (!customer) {
      return {
        subscription: null,
        message: 'Customer not found.',
      };
    }
    const activeSubscription = await this.prisma.customerSubscription.findFirst(
      {
        where: {
          customerId: customer.id,
          startDate: { lte: new Date() },
          endDate: { gte: new Date() },
        },
        include: {
          subscription: true,
        },
        orderBy: {
          startDate: 'desc',
        },
      },
    );

    if (!activeSubscription) {
      return {
        subscription: null,
        message: 'You do not have an active subscription.',
      };
    }

    return {
      endDate: activeSubscription.endDate,
      subscription: activeSubscription.subscription,
      message: 'Active subscription found.',
    };
  }

  /**
   * Fetches all available subscriptions for the customer to view.
   */
  async getSubscriptions() {
    const subscriptions = await this.prisma.subscription.findMany();
    return subscriptions;
  }
}
