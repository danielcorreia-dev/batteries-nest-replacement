import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/common/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOneById(+id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/')
  async findAll() {
    return await this.userService.findAll();
  }
}
