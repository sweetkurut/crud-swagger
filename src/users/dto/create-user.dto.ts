/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  id: number;

  @IsNotEmpty()
  email: string;

  // first_name: string;
  // last_name: string;
  password: string;
}
