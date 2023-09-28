import { Injectable, NotFoundException } from '@nestjs/common';
import { Company } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { UsersService } from '../users/users.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async createCompany(createCompanyDto: CreateCompanyDto): Promise<any> {
    const company = await this.prisma.company.create({
      data: {
        ...createCompanyDto,
      },
    });

    return company;
  }

  async getCompaniesByName(name?: string): Promise<Company[]> {
    let where = {};

    if (name) {
      const formattedName = name.replace(/\-+/g, ' ');
      where = {
        name: {
          contains: formattedName,
          mode: 'insensitive',
        },
      };
    }

    return this.prisma.company.findMany({
      where,
    });
  }

  async updateCompany(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<any> {
    const existingCompany = await this.prisma.company.findUnique({
      where: { id: id },
    });

    if (!existingCompany) {
      throw new NotFoundException('Company not found.');
    }

    const updatedCompany = await this.prisma.company.update({
      where: { id: id },
      data: updateCompanyDto,
    });

    return updatedCompany;
  }

  async delete(id: number): Promise<void> {
    const company = await this.prisma.company.findUnique({
      where: { id: id },
    });

    if (!company) {
      throw new NotFoundException('Company not found.');
    }

    await this.prisma.company.delete({ where: { id: id } });
  }
}
