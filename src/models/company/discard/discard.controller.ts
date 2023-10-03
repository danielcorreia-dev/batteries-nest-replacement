import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Sse,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DiscardType } from '@prisma/client';
import { Observable, fromEvent, map } from 'rxjs';
import { NewDiscardEvent } from 'src/common/events/new.discard.event';
import { DiscardService } from './discard.service';
import { CreateDiscardDto } from './dto/create-discard.dto';

@Controller('company/:id/discard')
export class DiscardController {
  constructor(
    private readonly discardService: DiscardService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async create(
    @Param('id') id: string,
    @Body() createDiscardDto: CreateDiscardDto,
  ) {
    return this.discardService.create({
      companyId: +id,
      ...createDiscardDto,
    });
  }

  @Sse('sse')
  sse(): Observable<MessageEvent> {
    return fromEvent(this.eventEmitter, 'unlocked.achievement').pipe(
      map((data) => {
        return new MessageEvent('unlocked.achievement', {
          data: 'new achievement',
        });
      }),
    );
  }

  @Post('emit')
  emit() {
    this.eventEmitter.emit(
      'new.discard',
      new NewDiscardEvent(1, 1, DiscardType.BATTERY, 10),
    );
    return { result: 'ok' };
  }

  @Get()
  async findAll() {
    return this.discardService.findAll();
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.discardService.delete(+id);
  }
}
