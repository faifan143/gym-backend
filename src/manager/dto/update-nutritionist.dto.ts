import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';
import { Specialty } from '@prisma/client';

export class UpdateNutritionistDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsNumber()
  specialty?: number;
}
