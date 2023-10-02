import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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

  async findOneById(id: number) {
    try {
      const query = await this.prismaService.user.findUniqueOrThrow({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          bio: true,
          points: true,
          createdAt: true,
          Discard: {
            select: {
              date: true,
              points: true,
              company: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          userAchievements: {
            select: {
              achievement: {
                select: {
                  id: true,
                  icon: true,
                  name: true,
                  description: true,
                },
              },
            },
          },
        },
      });

      const modifiedQuery = {
        ...query,
        discards: query.Discard.map((discard) => ({
          id: discard.company.id,
          name: discard.company.name,
          points: discard.points,
        })),
      };

      delete modifiedQuery.Discard;
      return modifiedQuery;
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
    }
  }

  async findOneUserWithEmailOrUsername(userInput: string) {
    try {
      return await this.prismaService.user.findFirst({
        where: {
          OR: [
            {
              email: {
                equals: userInput,
                mode: 'insensitive',
              },
            },
            {
              username: {
                equals: userInput,
              },
            },
          ],
        },
      });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
    }
  }

  async findUserAchievements(id: number) {
    try {
      return await this.prismaService.user
        .findUnique({
          where: {
            id,
          },
        })
        .userAchievements({
          select: {
            achievement: {
              select: {
                id: true,
                icon: true,
                name: true,
                description: true,
              },
            },
          },
        });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
    }
  }

  async getRanking() {
    return await this.prismaService.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        points: true,
        _count: {
          select: {
            Discard: true,
          },
        },
      },
      orderBy: {
        points: 'desc',
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      return await this.prismaService.user.update({
        where: {
          id,
        },
        data: updateUserDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
    }
  }

  async remove(id: number) {
    return await this.prismaService.user.delete({
      where: {
        id,
      },
    });
  }
}
