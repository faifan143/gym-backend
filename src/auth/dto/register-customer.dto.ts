import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
