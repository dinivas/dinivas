import { Test, TestingModule } from '@nestjs/testing';
import { FlavorsService } from './flavors.service';

describe('FlavorsService', () => {
  let service: FlavorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FlavorsService],
    }).compile();

    service = module.get<FlavorsService>(FlavorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
