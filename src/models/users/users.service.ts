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
        discards: 0,
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
      const userAchievements =
        await this.prismaService.userAchievements.findMany({
          where: {
            id,
          },
          select: {
            user: {
              select: {
                id: true,
              },
            },
            date: true,
          },
        });

      const allAchievements = await this.prismaService.achievement.findMany({
        select: {
          id: true,
          icon: true,
          name: true,
          description: true,
          requiredDiscard: true,
          requiredPoints: true,
        },
      });

      const userAchievementsIds = userAchievements.map(
        (userAchievement) => userAchievement.user.id,
      );

      const userAchievementsWithProgress = allAchievements.map(
        (achievement) => {
          const userHasAchievement = userAchievementsIds.includes(
            achievement.id,
          );

          const userAchievement = userAchievements.find(
            (ua) => ua.user.id === id && ua.user.id === achievement.id,
          );

          return {
            ...achievement,
            userHasAchievement,
            date: userAchievement?.date || null,
          };
        },
      );

      return userAchievementsWithProgress;
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
    }
  }

  async getRanking() {
    try {
      const query = await this.prismaService.$queryRaw`SELECT
          u.id,
          u.name,
          u.avatar,
          u.points,
          c.countDiscards
      from
          users as u
          left JOIN (
              select
                  user_id,
                  COUNT(*) as countDiscards
              from
                  discards
              group by
                  user_id
          ) as c on u.id = c.user_id
          ORDER BY c.countDiscards DESC, u.points DESC`;

      return JSON.parse(
        JSON.stringify(query, (key, value) =>
          typeof value === 'bigint' ? value.toString() : value,
        ),
      ).map((user: any) => {
        const obj = {
          ...user,
          discards: Number(user.countdiscards),
        };
        delete obj.countdiscards;
        return obj;
      });
    } catch (e) {
      console.log(e);
    }
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
    try {
      await this.prismaService.userAchievements.deleteMany({
        where: {
          id,
        },
      });

      await this.prismaService.discard.deleteMany({
        where: {
          id,
        },
      });

      return await this.prismaService.user.delete({
        where: {
          id,
        },
      });
    } catch (e) {
      if (e.code === 'P2025') throw new NotFoundException('User not found');
      throw e;
    }
  }
}
