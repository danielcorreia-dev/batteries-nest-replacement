import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/database/prisma.module';
import { CompanyService } from 'src/models/company/company.service';
import { UsersService } from 'src/models/users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt-strategy';
import { LocalStrategy } from './strategies/local-strategy';
import { RefreshJwtStrategy } from './strategies/refreshToken.strategy';

@Module({
  providers: [
    AuthService,
    UsersService,
    CompanyService,
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
