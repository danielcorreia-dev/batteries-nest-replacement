import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Company } from '@prisma/client';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  async createCompany(
    @Body() createCompanyDto: CreateCompanyDto,
  ): Promise<Company> {
    const company = await this.companyService.createCompany(createCompanyDto);
    return company;
  }

  @Get()
  async getCompaniesByName(@Query('name') name: string): Promise<Company[]> {
    return await this.companyService.getCompaniesByName(name);
  }

  @Patch(':id')
  async updateCompany(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    const updatedCompany = await this.companyService.updateCompany(
      +id,
      updateCompanyDto,
    );
    if (!updatedCompany) {
      throw new NotFoundException('Company not found.');
    }
    return { message: 'Company updated successfully', company: updatedCompany };
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.companyService.delete(+id);
  }
}
