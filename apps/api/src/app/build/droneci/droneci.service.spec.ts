import { Test, TestingModule } from '@nestjs/testing';
import { DroneciService } from './droneci.service';

describe('DroneciService', () => {
  let service: DroneciService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DroneciService],
    }).compile();

    service = module.get<DroneciService>(DroneciService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
