import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsArray,
  MaxLength,
} from 'class-validator';

export class CreateNutritionPlanDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000, {
    message: 'Plan details should not exceed 1000 characters.',
  })
  planDetails: string;

  @IsOptional()
  @IsArray()
  customerIds?: number[];
}
