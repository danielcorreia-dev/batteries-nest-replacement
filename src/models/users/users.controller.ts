import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/common/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne() {
    return 'This action returns a user';
  }
}
