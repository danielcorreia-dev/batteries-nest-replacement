import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './common/auth/auth.module';
import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import { PrismaModule } from './database/prisma.module';
import { AchievementsModule } from './models/achievements/achievements.module';
import { CompanyModule } from './models/company/company.module';
import { DiscardModule } from './models/company/discard/discard.module';
import { UsersModule } from './models/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [appConfig, authConfig],
      isGlobal: true,
      expandVariables: true,
    }),
    EventEmitterModule.forRoot(),
    PrismaModule,
    AuthModule,
    UsersModule,
    CompanyModule,
    DiscardModule,
    AchievementsModule,
  ],
})
export class AppModule {}
