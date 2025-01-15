import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  MinLength,
  MaxLength,
  IsDateString,
  Matches,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';

import { Type } from 'class-transformer';

class ScheduleItemDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)$/i, {
    message: 'Day must be a valid weekday (e.g., Monday, Tuesday)',
  })
  day: string; // Valid weekday

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Time must be in HH:mm format (e.g., 10:00, 14:30)',
  })
  time: string; // Valid time in HH:mm format
}

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  description: string;

  @IsNumber()
  @IsNotEmpty()
  capacity: number;

  @IsArray()
  @ArrayMinSize(1, {
    message: 'Schedule must include at least one day and time pair.',
  })
  @ValidateNested({ each: true })
  @Type(() => ScheduleItemDto)
  schedule: ScheduleItemDto[]; // Array of day-time pairs
}
