import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/database/prisma.module';
import { PrismaService } from 'src/database/prisma.service';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { BenefitsModule } from './benefits/benefits.module';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, PrismaService],
  exports: [CompanyService],
  imports: [PrismaModule, BenefitsModule],
})
export class CompanyModule {}
