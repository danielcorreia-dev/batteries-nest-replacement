import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DiscardService } from './discard.service';
import { CreateDiscardDto } from './dto/create-discard.dto';

@Controller('company/:companyId/discard')
export class DiscardController {
  constructor(
    private readonly discardService: DiscardService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post(':id')
  async create(
    @Param('companyId') companyId: string,
    @Param('id') userId: string,
    @Body() createDiscardDto: CreateDiscardDto,
  ) {
    return this.discardService.create(+companyId, +userId, {
      ...createDiscardDto,
    });
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
