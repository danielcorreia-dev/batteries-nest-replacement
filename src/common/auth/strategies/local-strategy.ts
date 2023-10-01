import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({ passReqToCallback: true });
  }

  async validate(req: Request, username: string, password: string) {
    if (!username || !password) throw new UnauthorizedException();

    if (req.headers['user-type'] === 'company') {
      const company = await this.authService.validateCompany(
        username,
        password,
      );
      if (!company) throw new UnauthorizedException();

      return company;
    }

    const user = await this.authService.validateUser(username, password);
    if (!user) throw new UnauthorizedException();

    return user;
  }
}
