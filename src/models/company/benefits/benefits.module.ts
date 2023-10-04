import { Module } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { UsersModule } from 'src/models/users/users.module';
import { BenefitController } from './benefits.controller';
import { BenefitService } from './benefits.service';

@Module({
  controllers: [BenefitController],
  providers: [BenefitService, PrismaService],
  imports: [UsersModule],
})
export class BenefitsModule {}
