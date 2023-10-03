import { Module } from '@nestjs/common';
import { SseModule } from 'src/common/events/sse/sse.module';
import { SseService } from 'src/common/events/sse/sse.service';
import { PrismaService } from 'src/database/prisma.service';
import { DiscardController } from './discard.controller';
import { DiscardService } from './discard.service';

@Module({
  providers: [DiscardService, PrismaService, SseService],
  exports: [DiscardService],
  controllers: [DiscardController],
  imports: [SseModule],
})
export class DiscardModule {}
