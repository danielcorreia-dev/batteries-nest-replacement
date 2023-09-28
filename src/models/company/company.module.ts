import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { UsersModule } from '../users/users.module';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, PrismaService],
  imports: [UsersModule],
})
export class CompanyModule {}
