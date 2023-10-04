import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from 'src/models/users/users.service';
import { BenefitService } from './benefits.service';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { UpdateBenefitDto } from './dto/update-benefit.dto';

@Controller('company/:id/benefit')
export class BenefitController {
  constructor(
    private readonly benefitService: BenefitService,
    private readonly userService: UsersService,
  ) {}

  @Post()
  async create(
    @Param('id') id: string,
    @Body() createBenefitDto: CreateBenefitDto,
  ) {
    return this.benefitService.create({
      companyId: +id,
      ...createBenefitDto,
    });
  }

  @Post('redeem/:userId/:benefitId')
  async redeemBenefit(
    @Param('userId') userId: number,
    @Param('benefitId') benefitId: number,
  ) {
    return this.benefitService.redeemBenefit(+userId, +benefitId);
  }

  @Get()
  findAll() {
    return this.benefitService.findAll();
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
