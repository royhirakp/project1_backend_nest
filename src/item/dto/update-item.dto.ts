import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEmail,
  isEnum,
  IsOptional,
  IsEmpty,
} from 'class-validator';
import { User } from '../../auth/schemas/user.schema';

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly description: string;
  @IsOptional()
  @IsString()
  readonly author: string;
  @IsOptional()
  @IsNumber()
  readonly price: number;
  @IsEmpty({ message: 'use candt set it ' })
  readonly user: User;
}
