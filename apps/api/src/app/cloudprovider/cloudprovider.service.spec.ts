import { Test, TestingModule } from '@nestjs/testing';
import { CloudproviderService } from './cloudprovider.service';

describe('CloudproviderService', () => {
  let service: CloudproviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudproviderService],
    }).compile();

    service = module.get<CloudproviderService>(CloudproviderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
