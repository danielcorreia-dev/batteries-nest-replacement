import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/models/users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // @Post('register')
  // async register(@Body() createUserDto: CreateUserDto) {
  //   return await this.userService.create(createUserDto);
  // }
}
