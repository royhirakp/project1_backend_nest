import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEmail,
  isEnum,
  IsOptional,
  MinLength,
} from 'class-validator';

export class SingupDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'PLEASE GIVE CORRECT MAILID' })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;
}
