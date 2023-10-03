import { Test, TestingModule } from '@nestjs/testing';
import { DiscardService } from './discard.service';

describe('DiscardService', () => {
  let service: DiscardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscardService],
    }).compile();

    service = module.get<DiscardService>(DiscardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
