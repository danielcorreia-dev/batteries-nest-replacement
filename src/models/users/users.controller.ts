import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/common/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOneById(+id);
  }

  @Get('/')
  async findAll() {
    return await this.userService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id/achievements')
  async findAchievements(@Param('id') id: string) {
    return await this.userService.findUserAchievements(+id);
  }
}
