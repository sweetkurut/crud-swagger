/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { UserRoleService } from 'src/user-role/user-role.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly userRoleService: UserRoleService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const isExist = await this.userRepository.findOne({
        where: {
          email: createUserDto.email,
        },
      });

      if (isExist) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }

      const userRole = await this.userRoleService.findRoleByRoleName(
        createUserDto.roles,
      );

      if (!userRole) {
        throw new HttpException(
          'User role does not exist',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const newUser = new User();
      newUser.email = createUserDto.email;
      newUser.password = await argon2.hash(createUserDto.password);
      newUser.roles = userRole;

      await this.userRepository.save(newUser);
      const token = this.jwtService.sign({ email: createUserDto.email });
      return { newUser, token };
    } catch (error) {
      throw new HttpException(
        error.message || 'Internal server error',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private isUserAdmin() {
    const admin = this.userRepository.find();
    return admin;
  }

  async getAdminProfile() {
    const admin = await this.userRepository.find();
    return admin;
  }

  async findAll() {
    const user = await this.userRepository.find({ relations: ['roles'] });
    return user;
  }

  async findOne(email: string) {
    const emailUser = await this.userRepository.findOne({
      where: {
        email,
      },
      relations: ['roles'],
    });

    if (!emailUser) throw new BadRequestException('User not found');

    return emailUser;
  }
}
