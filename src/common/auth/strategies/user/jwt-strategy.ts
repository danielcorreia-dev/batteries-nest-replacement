import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: `${process.env.AUTH_JWT_SECRET}`,
    });
  }

  async validate(payload: any) {
    return { user: payload.sub, username: payload.username };
  }

  async validadeCompany(payload) {
    return { company: payload.sub, email: payload.email };
  }
}
