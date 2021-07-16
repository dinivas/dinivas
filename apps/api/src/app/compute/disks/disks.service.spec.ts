import { Test, TestingModule } from '@nestjs/testing';
import { DisksService } from './disks.service';

describe('DisksService', () => {
  let service: DisksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DisksService],
    }).compile();

    service = module.get<DisksService>(DisksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
