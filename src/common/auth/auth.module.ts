import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/models/users/users.service';
import { LocalStrategy } from './strategies/local-strategy';
import { PrismaModule } from 'src/database/prisma.module';
import { JwtStrategy } from './strategies/jwt-strategy';
import { RefreshJwtStrategy } from './strategies/refreshToken.strategy';

@Module({
  providers: [
    AuthService,
    UsersService,
    JwtStrategy,
    RefreshJwtStrategy,
    LocalStrategy,
  ],
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      secret: `${process.env.AUTH_JWT_SECRET}`,
      signOptions: { expiresIn: '5h' },
    }),
    PrismaModule,
  ],
})
export class AuthModule {}
