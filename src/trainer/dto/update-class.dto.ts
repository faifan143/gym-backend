import {
  IsString,
  IsOptional,
  IsInt,
  IsJSON,
  MaxLength,
} from 'class-validator';

export class UpdateClassDto {
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Class name should not exceed 255 characters.' })
  name?: string;

  @IsOptional()
  @IsJSON()
  schedule?: string;

  @IsOptional()
  @IsInt()
  maxCapacity?: number;
}
