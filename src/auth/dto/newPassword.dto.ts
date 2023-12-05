import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class NewPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;
}
