import { Test, TestingModule } from '@nestjs/testing';
import { S3ManagerService } from './s3-manager.service';
import { ConfigModule } from '@nestjs/config';

describe('S3ManagerService', () => {
  let service: S3ManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [S3ManagerService],
    }).compile();

    service = module.get<S3ManagerService>(S3ManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should upload file', async () => {
    expect(service.uploadFile).toBeDefined();

    const uploadedFile = await service.uploadFile('test', 'test');
    expect(uploadedFile).toBeDefined();
    expect(uploadedFile).toHaveProperty('Key');
    expect(uploadedFile).toHaveProperty('Bucket');
    expect(uploadedFile).toHaveProperty('Location');

    const date = new Date();
    const yearAndMonth = `${date.getFullYear()}_${date.getMonth() + 1}`;

    expect(uploadedFile.Key).toEqual(`${yearAndMonth}/test`);
    expect(uploadedFile.Bucket).toEqual('kandia-01');
  });

  it('should return an exception when upload content is empty', async () => {
    expect(service.uploadFile).toBeDefined();

    await expect(service.uploadFile('test', '')).rejects.toThrow();
  });

  it('should return an exception when upload filename is empty', async () => {
    expect(service.uploadFile).toBeDefined();

    await expect(service.uploadFile('', 'test')).rejects.toThrow();
  });
});
