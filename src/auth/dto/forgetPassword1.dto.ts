import { IsNotEmpty, IsString } from 'class-validator';

export class ForgetPassword1Dto {
  @IsNotEmpty()
  @IsString()
  readonly email: string;
}
