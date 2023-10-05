import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { UpdateBenefitDto } from './dto/update-benefit.dto';

@Injectable()
export class BenefitService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBenefitDto: CreateBenefitDto) {
    return this.prisma.benefit.create({
      data: {
        ...createBenefitDto,
      },
    });
  }

  async redeemBenefit(userId: number, benefitId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const benefit = await this.findOne(benefitId);
    if (user.points < benefit.points) {
      throw new Error('Insufficient points to redeem this benefit.');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { points: user.points - benefit.points },
    });

    return this.prisma.userRetrievedBenefits.create({
      data: {
        userId,
        benefitId,
      },
    });
  }

  async findAll(id: number) {
    return this.prisma.benefit.findMany({
      where: {
        companyId: id,
      },
      orderBy: {
        active: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const benefit = await this.prisma.benefit.findUnique({
      where: { id },
    });
    if (!benefit) {
      throw new NotFoundException('Benefit not found');
    }
    return benefit;
  }

  async toggleActive(id: number) {
    const benefit = await this.findOne(id);
    const updatedBenefit = await this.prisma.benefit.update({
      where: { id },
      data: { active: !benefit.active },
    });
    return updatedBenefit;
  }

  async update(id: number, updateBenefitDto: UpdateBenefitDto) {
    return this.prisma.benefit.update({
      where: {
        id,
      },
      data: updateBenefitDto,
    });
  }

  async delete(id: number) {
    const existingBenefit = await this.prisma.benefit.findUnique({
      where: { id: id },
    });

    if (!existingBenefit) {
      throw new NotFoundException('Benefit not found.');
    }

    return this.prisma.benefit.delete({
      where: { id: id },
    });
  }
}
