import { Test, TestingModule } from '@nestjs/testing';
import { DiscardController } from './discard.controller';

describe('DiscardController', () => {
  let controller: DiscardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscardController],
    }).compile();

    controller = module.get<DiscardController>(DiscardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
