/* eslint-disable prettier/prettier */

import { IsArray, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { UserRole } from 'src/user-role/entities/user-role.entity';
import { UserRoleName } from 'src/user-role/user-role.type';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be more then 6 symbols' })
  password: string;

  @IsArray()
  roles: UserRoleName;
}
