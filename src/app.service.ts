import { Injectable } from '@nestjs/common';
import Fuse from 'fuse.js';
import { CompanyService } from './models/company/company.service';
import { UsersService } from './models/users/users.service';

@Injectable()
export class AppService {
  constructor(
    private userService: UsersService,
    private companyService: CompanyService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async search(query?: string) {
    if (!query) return [];

    const users = await this.userService.getUsersByName(query);
    const companies = await this.companyService.getCompaniesByName(query);

    const formattedUsers = users.map((user) => ({
      ...user,
      type: 'user',
    }));

    const formattedCompanies = companies.map((company) => ({
      ...company,
      type: 'company',
    }));

    const allData = [formattedUsers, formattedCompanies];

    const options = {
      keys: ['name'],
      threshold: 0.4,
    };

    const fuse = new Fuse(allData.flat(), options);
    const fuzzyQuery = fuse.search(query);

    return fuzzyQuery;
  }
}
