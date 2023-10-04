import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NewDiscardEvent } from 'src/common/events/new.discard.event';
import { PrismaService } from 'src/database/prisma.service';
import { CreateDiscardDto } from './dto/create-discard.dto';

@Injectable()
export class DiscardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createDiscardDto: CreateDiscardDto) {
    const { type, points, userId, companyId } = createDiscardDto;

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        totalPoints: {
          increment: points,
        },
        points: {
          increment: points,
        },
        discards: {
          increment: 1,
        },
      },
    });

    const discardEvent = new NewDiscardEvent(userId, companyId, type, points);
    this.eventEmitter.emit('new.discard', discardEvent);

    return this.prisma.discard.create({
      data: {
        type,
        points,
        date: new Date(),
        userId,
        companyId,
      },
    });
  }

  async findAll() {
    return this.prisma.discard.findMany();
  }

  async delete(id: number) {
    const existingDiscard = await this.prisma.discard.findUnique({
      where: { id: id },
    });

    if (!existingDiscard) {
      throw new NotFoundException('Discard not found.');
    }

    return this.prisma.discard.delete({
      where: { id: id },
    });
  }
}
