import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { DiscardController } from './discard.controller';
import { DiscardService } from './discard.service';

@Module({
  providers: [DiscardService, PrismaService],
  exports: [DiscardService],
  controllers: [DiscardController],
})
export class DiscardModule {}
