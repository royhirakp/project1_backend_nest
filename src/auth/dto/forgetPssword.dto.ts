import { IsNotEmpty, IsString } from 'class-validator';

export class ForgetPasswordDto {
  @IsNotEmpty()
  @IsString()
  readonly id: string;
}
