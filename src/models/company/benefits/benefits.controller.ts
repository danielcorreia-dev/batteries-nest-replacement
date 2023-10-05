import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BenefitService } from './benefits.service';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { UpdateBenefitDto } from './dto/update-benefit.dto';
import { JwtGuard } from 'src/common/auth/guards/jwt-auth.guard';

@Controller('company/:companyId/benefits')
export class BenefitController {
  constructor(private readonly benefitService: BenefitService) {}

  @Post()
  @UseGuards(JwtGuard)
  async create(
    @Param('companyId') id: string,
    @Body() createBenefitDto: CreateBenefitDto,
  ) {
    return this.benefitService.create({
      companyId: +id,
      ...createBenefitDto,
    });
  }

  @Post('redeem/:userId/:benefitId')
  @UseGuards(JwtGuard)
  async redeemBenefit(
    @Param('userId') userId: number,
    @Param('benefitId') benefitId: number,
  ) {
    return this.benefitService.redeemBenefit(+userId, +benefitId);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(@Param('companyId') id: string) {
    return this.benefitService.findAll(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.benefitService.findOne(+id);
  }

  @Patch(':id/active')
  toggleActive(@Param('id') id: string) {
    return this.benefitService.toggleActive(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBenefitDto: UpdateBenefitDto) {
    return this.benefitService.update(+id, updateBenefitDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.benefitService.delete(+id);
  }
}
