import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEmail,
  isEnum,
  IsOptional,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'PLEASE GIVE CORRECT MAILID' })
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;
}
