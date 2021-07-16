import { Test, TestingModule } from '@nestjs/testing';
import { IamService } from './iam.service';

describe('IamService', () => {
  let service: IamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IamService],
    }).compile();

    service = module.get<IamService>(IamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
