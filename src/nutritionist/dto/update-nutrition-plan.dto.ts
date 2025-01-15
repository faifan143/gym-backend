  import {
    IsString,
    IsNotEmpty,
    IsOptional,
    IsDateString,
    MaxLength,
  } from 'class-validator';

  export class UpdateNutritionPlanDto {
    @IsOptional()
    @IsString()
    @MaxLength(1000, {
      message: 'Plan details should not exceed 1000 characters.',
    })
    planDetails?: string;

    @IsOptional()
    @IsString()
    title?: string;
  }
