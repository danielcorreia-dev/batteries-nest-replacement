import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email', passReqToCallback: true });
  }

  async validate(req: Request, username: string, password: string) {
    console.log(username);

    if (req.headers['user-type'] === 'company') {
      const company = await this.authService.validateCompany(
        username,
        password,
      );

      console.log('cheguei');

      if (!company) throw new UnauthorizedException();

      console.log(company);

      return company;
    }

    const user = await this.authService.validateUser(username, password);
    if (!user) throw new UnauthorizedException();

    return user;
  }
}
