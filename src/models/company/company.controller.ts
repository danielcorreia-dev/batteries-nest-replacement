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
import { CompanyService } from './company.service';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('search')
  async getCompaniesByName(@Query('name') name: string) {
    return await this.companyService.getCompaniesByName(name);
  }

  @Get()
  async findAll(): Promise<any[]> {
    return await this.companyService.findAllCompanies();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const company = await this.companyService.findOneCompanyById(+id);
    if (!company) {
      throw new NotFoundException('Company not found.');
    }
    return company;
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
  async delete(@Param('id') id: string) {
    await this.companyService.delete(+id);
  }

  @Post('discard')
  async createDiscard() {
    return await this.companyService.createDiscard();
  }
}
