import { Injectable } from '@nestjs/common';
import { UsersService } from './models/users/users.service';
import { CompanyService } from './models/company/company.service';
import Fuse from 'fuse.js';

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
    if (!query) return { users: [], companies: [] };

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
      threshold: 0.3,
    };

    const fuse = new Fuse(allData.flat(), options);
    const fuzzyQuery = fuse.search(query);

    return fuzzyQuery;
  }
}
