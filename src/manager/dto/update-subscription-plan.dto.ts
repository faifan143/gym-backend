import {
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsDateString,
} from 'class-validator';
import { SubscriptionLevel, SubscriptionDuration } from '@prisma/client';
import { Optional } from '@nestjs/common';

export class UpdateSubscriptionPlanDto {
  @IsEnum(SubscriptionLevel)
  @IsOptional()
  level?: SubscriptionLevel;

  @IsEnum(SubscriptionDuration)
  @IsOptional()
  duration?: SubscriptionDuration;

  @IsNumber()
  @Min(0)
  @Optional()
  cost?: number;

  @IsDateString()
  @Optional()
  startDate?: string;

  @IsDateString()
  @Optional()
  endDate?: string;
}
