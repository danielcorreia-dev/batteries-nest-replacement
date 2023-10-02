import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/common/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('/ranking')
  async getRanking() {
    return await this.userService.getRanking();
  }

  @UseGuards(JwtGuard)
  @Get(':id/achievements')
  async getUserAchievements(@Param('id') id: string) {
    return await this.userService.findUserAchievements(+id);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.userService.findOneById(+id);
  }

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get(':id/achievements')
  async findAchievements(@Param('id') id: string) {
    return await this.userService.findUserAchievements(+id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(+id);
  }
}
