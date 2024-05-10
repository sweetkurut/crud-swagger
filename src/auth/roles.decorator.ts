/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';
import { UserRoleName } from 'src/user-role/user-role.type';

export const HasRoles = (...roles: UserRoleName[]) =>
  SetMetadata('roles', roles);
