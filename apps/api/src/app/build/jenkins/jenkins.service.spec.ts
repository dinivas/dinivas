import { Test, TestingModule } from '@nestjs/testing';
import { JenkinsService } from './jenkins.service';

describe('JenkinsService', () => {
  let service: JenkinsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JenkinsService],
    }).compile();

    service = module.get<JenkinsService>(JenkinsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
