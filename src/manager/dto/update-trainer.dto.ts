import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTrainerDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  specialty?: number;
}
