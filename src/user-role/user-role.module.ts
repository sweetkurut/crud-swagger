/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { UserRoleService } from './user-role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from './entities/user-role.entity';
// import { UserRoleController } from './user-role.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserRole])],
  providers: [UserRoleService],
  exports: [UserRoleService],
})
export class UserRoleModule {}
