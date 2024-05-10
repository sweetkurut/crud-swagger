/* eslint-disable prettier/prettier */
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRoleName } from './user-role.type';
import { UserRole } from './entities/user-role.entity';

@Injectable()
export class UserRoleService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
  ) {}

  onApplicationBootstrap() {
    this.createInitialRoles();
  }

  async createInitialRoles(): Promise<void> {
    const roleNames: UserRoleName[] = [
      UserRoleName.ADMIN,
      UserRoleName.USER,
    ];
    for (let i = 0; i < roleNames.length; i++) {
      const existingRole = await this.findRoleByRoleName(roleNames[i]);
      if (!existingRole) {
        await this.userRoleRepository.save({ role_name: roleNames[i] });
      }
    }
  }

  async createUserRole(roleName: UserRoleName): Promise<UserRole> {
    return await this.userRoleRepository.create({ role_name: roleName });
  }

  async findById(id: string): Promise<UserRole> {
    return await this.userRoleRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findAll(): Promise<UserRole[]> {
    return await this.userRoleRepository.find();
  }

  async findRoleByRoleName(roleName: UserRoleName): Promise<UserRole> {
    return await this.userRoleRepository.findOne({
      where: {
        role_name: roleName,
      },
    });
  }
}
