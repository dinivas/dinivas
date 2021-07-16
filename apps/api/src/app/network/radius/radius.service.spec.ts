import { Test, TestingModule } from '@nestjs/testing';
import { RadiusService } from './radius.service';

describe('RadiusService', () => {
  let service: RadiusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RadiusService],
    }).compile();

    service = module.get<RadiusService>(RadiusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
