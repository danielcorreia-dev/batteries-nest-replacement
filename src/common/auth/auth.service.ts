import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Company, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CompanyService } from 'src/models/company/company.service';
import { UsersService } from 'src/models/users/users.service';

const EXPIRE_TIME = 4 * 1000 * 60 * 60;
const REFRESH_EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000;
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private companyService: CompanyService,
  ) {}

  async validateUser(username: string, password: string) {
    const user =
      await this.userService.findOneUserWithEmailOrUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async loginUser(user: User) {
    const payload = {
      username: user.username,
      sub: {
        name: user.name,
        email: user.email,
      },
    };

    const typedUser = { ...user, type: 'user' };

    return {
      user: typedUser,
      backendTokens: {
        accessToken: await this.jwtService.signAsync(payload),
        refreshToken: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          secret: process.env.AUTH_JWT_REFRESH_SECRET,
        }),
        expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
      },
    };
  }

  async validateCompany(username: string, password: string) {
    const company = await this.companyService.findOneCompanyWithEmail(username);

    if (company && (await bcrypt.compare(password, company.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = company;
      return result;
    }

    return null;
  }

  async loginCompany(company: Company) {
    const payload = {
      username: company.email,
      sub: {
        name: company.name,
        email: company.email,
      },
    };

    const typedCompany = { ...company, type: 'company' };

    return {
      user: typedCompany,
      backendTokens: {
        accessToken: await this.jwtService.signAsync(payload),
        refreshToken: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          secret: process.env.AUTH_JWT_REFRESH_SECRET,
        }),
        expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
      },
    };
  }

  async refreshToken(user: User) {
    const payload = {
      username: user.username,
      sub: {
        name: user.name,
        email: user.email,
      },
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.AUTH_JWT_REFRESH_SECRET,
      }),
      expiresIn: new Date().setTime(new Date().getTime() + REFRESH_EXPIRE_TIME),
    };
  }
}
