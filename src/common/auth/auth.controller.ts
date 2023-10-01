import { CompanyService } from 'src/models/company/company.service';
import { CreateCompanyDto } from 'src/models/company/dto/create-company.dto';
import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
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
  @HttpCode(HttpStatus.OK)
  @Post('login/user')
  async login(@Request() req) {
    return this.authService.loginUser(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login/company')
  async loginCompany(@Request() req) {
    return this.authService.loginCompany(req.user);
  }

  @Post('register/user')
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
