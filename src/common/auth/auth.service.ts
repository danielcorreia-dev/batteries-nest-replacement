import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/models/users/users.service';

const EXPIRE_TIME = 30 * 1000;
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService, // private companyService: CompanyService,
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

  // async validateCompany(username: string, password: string) {
  //   const company = await this.companyService.findCompanyWithEmail(username);

  //   if (company && (await bcrypt.compare(password, company.password))) {
  //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //     const { password, ...result } = company;
  //     return result;
  //   }

  //   return null;
  // }

  async login(user: User) {
    const payload = {
      username: user.username,
      sub: {
        name: user.name,
        email: user.email,
      },
    };

    return {
      user,
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
      expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
    };
  }
}
