import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/database/prisma.service';
import { prismaExclude } from 'src/utils/prisma-key-exclude';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const data: Prisma.UserCreateInput = {
        ...createUserDto,
        password: await bcrypt.hash(createUserDto.password, 10),
        points: 0,
        name: createUserDto.username,
      };

      const createdUser = await this.prismaService.user.create({
        data,
      });

      return {
        ...createdUser,
        password: undefined,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new NotFoundException('User already exists');
      }
    }
  }

  async findAll() {
    return await this.prismaService.user.findMany({
      select: prismaExclude('User', ['password']),
    });
  }

  async findOneById(id: number): Promise<User> {
    try {
      return await this.prismaService.user.findUniqueOrThrow({
        where: {
          id,
        },
      });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
    }
  }

  async findOneUserWithEmailOrUsername(userInput: string) {
    try {
      return await this.prismaService.user.findFirst({
        where: { OR: [{ email: userInput }, { username: userInput }] },
      });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
