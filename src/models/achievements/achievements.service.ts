import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { NewDiscardEvent } from 'src/common/events/new.discard.event';
import { PrismaService } from 'src/database/prisma.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';

@Injectable()
export class AchievementsService {
  constructor(
    private prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  create(createAchievementDto: CreateAchievementDto) {
    return this.prisma.achievement.create({
      data: createAchievementDto,
    });
  }

  @OnEvent('new.discard')
  async checkAchievementUnlock(payload: NewDiscardEvent) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const unlockableAchievements = await this.prisma.achievement.findMany({
      where: {
        OR: [
          {
            requiredPoints: { gte: user.points },
          },
          {
            requiredDiscard: { gte: user.discards },
          },
        ],
      },
    });

    if (unlockableAchievements.length > 0) {
      for await (const achievement of unlockableAchievements) {
        this.prisma.userAchievements.create({
          data: {
            userId: user.id,
            achievementsId: achievement.id,
            date: new Date(),
          },
        });
        this.eventEmitter.emit('unlocked.achievement', {
          user: user.id,
          achievement: achievement.id,
        });
      }

      return unlockableAchievements;
    }

    return null;
  }

  findAll() {
    return this.prisma.achievement.findMany();
  }

  async findOne(id: number) {
    try {
      return await this.prisma.achievement.findFirstOrThrow({
        where: {
          id,
        },
      });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException('Achievemnt not found');
      }
    }
  }

  update(id: number, updateAchievementDto: UpdateAchievementDto) {
    return this.prisma.achievement.update({
      where: {
        id,
      },
      data: updateAchievementDto,
    });
  }

  remove(id: number) {
    return this.prisma.achievement.delete({
      where: {
        id,
      },
    });
  }
}
