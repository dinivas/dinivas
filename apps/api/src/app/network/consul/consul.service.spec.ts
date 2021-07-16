import { Test, TestingModule } from '@nestjs/testing';
import { ConsulService } from './consul.service';

describe('ConsulService', () => {
  let service: ConsulService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsulService],
    }).compile();

    service = module.get<ConsulService>(ConsulService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
