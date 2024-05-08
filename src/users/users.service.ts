/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // проверка на наличие существующего юзера
    const isExist = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (isExist) throw new BadRequestException('User already exist');

    // создание нового
    const user = await this.userRepository.save({
      email: createUserDto.email,
      password: await argon2.hash(createUserDto.password),
    });

    const token = this.jwtService.sign({ email: createUserDto.email });

    return { user, token };
  }

  async findAll() {
    const user = await this.userRepository.find();
    return user;
  }

  async findOne(email: string) {
    const emailUser = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (!emailUser) throw new BadRequestException('User not found');

    return emailUser;
  }
}
