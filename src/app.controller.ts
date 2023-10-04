import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('')
export class AppController {
  constructor(private appService: AppService) {}

  @Get('search')
  async search(@Query('name') name: string) {
    return await this.appService.search(name);
  }
}
