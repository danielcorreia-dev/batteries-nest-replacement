import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/database/prisma.service';
import { prismaExclude } from 'src/utils/prisma-key-exclude';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async createCompany(createCompanyDto: CreateCompanyDto): Promise<any> {
    try {
      const data: Prisma.CompanyCreateInput = {
        ...createCompanyDto,
        password: await bcrypt.hash(createCompanyDto.password, 10),
      };

      const createdCompany = await this.prisma.company.create({
        data,
      });

      return {
        ...createdCompany,
        password: undefined,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new NotFoundException('Company already exists');
      }
    }
  }

  async findOneCompanyWithEmailOrUsername(companyInput: string) {
    try {
      return await this.prisma.company.findFirst({
        where: { OR: [{ email: companyInput }, { username: companyInput }] },
      });
    } catch (err) {
      if (err.code === 'P2025') {
        throw new NotFoundException('Company not found');
      }
    }
  }

  async getCompaniesByName(name?: string): Promise<any> {
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
      select: prismaExclude('Company', ['password']),
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
