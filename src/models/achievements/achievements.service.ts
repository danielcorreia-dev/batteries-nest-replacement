import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AchievementsService {
  constructor(private prismaService: PrismaService) {}

  create(createAchievementDto: CreateAchievementDto) {
    return this.prismaService.achievement.create({
      data: createAchievementDto,
    });
  }

  findAll() {
    return this.prismaService.achievement.findMany();
  }

  async findOne(id: number) {
    try {
      return await this.prismaService.achievement.findFirstOrThrow({
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
    return this.prismaService.achievement.update({
      where: {
        id,
      },
      data: updateAchievementDto,
    });
  }

  remove(id: number) {
    return this.prismaService.achievement.delete({
      where: {
        id,
      },
    });
  }
}
