import { Test, TestingModule } from '@nestjs/testing';
import { InstancesService } from './instances.service';

describe('InstancesService', () => {
  let service: InstancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstancesService],
    }).compile();

    service = module.get<InstancesService>(InstancesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
