// manager/dtos/create-subscription-plan.dto.ts
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { SubscriptionDuration, SubscriptionLevel } from '@prisma/client';

export class CreateSubscriptionPlanDto {
  @IsNotEmpty()
  @IsEnum(SubscriptionLevel)
  level: SubscriptionLevel;

  @IsNotEmpty()
  @IsEnum(SubscriptionDuration)
  duration: SubscriptionDuration;

  @IsNotEmpty()
  @IsNumber()
  cost: number;
}
