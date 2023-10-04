import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
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

  @Get()
  async findAll() {
    return this.discardService.findAll();
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.discardService.delete(+id);
  }
}
