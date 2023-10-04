import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Response } from 'express';
import { AchievementsService } from './achievements.service';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';

@Controller('achievements')
export class AchievementsController {
  constructor(
    private readonly achievementsService: AchievementsService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post()
  create(@Body() createAchievementDto: CreateAchievementDto) {
    return this.achievementsService.create(createAchievementDto);
  }

  @Get('sse')
  async getSSE(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const onUnlockedAchievement = (achievementInfo) => {
      res.write(`data: ${JSON.stringify(achievementInfo)}\n\n`);
    };

    this.eventEmitter.on('unlockedAchievement', onUnlockedAchievement);

    res.on('close', () => {
      this.eventEmitter.removeListener(
        'unlockedAchievement',
        onUnlockedAchievement,
      );
    });
  }

  @Get()
  findAll() {
    return this.achievementsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.achievementsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAchievementDto: UpdateAchievementDto,
  ) {
    return this.achievementsService.update(+id, updateAchievementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.achievementsService.remove(+id);
  }
}
