import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEmail,
  isEnum,
  IsEmpty,
} from 'class-validator';
import { User } from '../../auth/schemas/user.schema';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;
  @IsNotEmpty()
  @IsString()
  readonly author: string;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsEmpty({ message: 'use candt set it ' })
  readonly user: User;
}
