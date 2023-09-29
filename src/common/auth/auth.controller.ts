import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CompanyService } from 'src/models/company/company.service';
import { CreateCompanyDto } from 'src/models/company/dto/create-company.dto';
import { CreateUserDto } from 'src/models/users/dto/create-user.dto';
import { UsersService } from 'src/models/users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private companyService: CompanyService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login/company')
  async loginCompany(@Request() req) {
    return this.authService.loginCompany(req.company);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Post('register/company')
  async registerCompany(@Body() createCompanyDto: CreateCompanyDto) {
    return await this.companyService.createCompany(createCompanyDto);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user);
  }
}
