import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class OtpVarifactionDto {
  @IsNotEmpty()
  @IsString()
  readonly otp: string;

  @IsNotEmpty()
  @IsString()
  readonly id: string;
}
