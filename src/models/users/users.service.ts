import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
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

  async getUsersByName(name: string) {
    if (!name) return [];
    return await this.prismaService.user.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
      select: prismaExclude('User', ['password']),
    });
  }

  async findAll() {
    return await this.prismaService.user.findMany({
      select: prismaExclude('User', ['password']),
    });
  }

  async findProfile(id: number) {
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
          avatar: true,
          createdAt: true,
          Discard: {
            select: {
              date: true,
              type: true,
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

      const discards = await this.prismaService.discard.findMany({
        where: {
          date: {
            gte: new Date(new Date().setDate(new Date().getDate() - 30)),
            lt: new Date(),
          },
        },
        include: {
          user: {
            include: {
              userAchievements: true,
            },
          },
        },
      });

      const totalDiscards = discards.length;
      const totalPoints = discards.reduce(
        (sum, discard) => sum + discard.points,
        0,
      );
      const totalAchievements = discards.reduce(
        (sum, discard) => sum + discard.user.userAchievements.length,
        0,
      );

      const metrics = {
        totalDiscards,
        totalPoints,
        totalAchievements,
      };

      const modifiedQuery = {
        ...query,
        discards: query.Discard.map((discard) => ({
          id: discard.company.id,
          name: discard.company.name,
          points: discard.points,
        })),
        metrics,
      };

      delete modifiedQuery.Discard;
      return modifiedQuery;
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
    }
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
              type: true,
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
FROM
    users AS u
LEFT JOIN (
    SELECT
        user_id,
        COUNT(*) AS countDiscards
    FROM
        discards
    GROUP BY
        user_id
) AS c ON u.id = c.user_id
ORDER BY
COALESCE(CAST(c.countDiscards AS INTEGER), 0) DESC, u.points DESC;`;

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
      const userPassword = await this.prismaService.user.findUnique({
        where: {
          id,
        },
        select: {
          password: true,
        },
      });

      const { password, newPassword } = updateUserDto;

      if (password && newPassword) {
        const check = await bcrypt.compare(password, userPassword.password);

        if (!check) {
          return new UnprocessableEntityException('Password does not match');
        }

        delete updateUserDto.password;
        updateUserDto.password = await bcrypt.hash(
          updateUserDto.newPassword,
          10,
        );
        delete updateUserDto.newPassword;
      } else {
        delete updateUserDto.password;
        delete updateUserDto.newPassword;
      }

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

      throw error;
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
