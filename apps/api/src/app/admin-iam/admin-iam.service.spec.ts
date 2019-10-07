import { Test, TestingModule } from '@nestjs/testing';
import { AdminIamService } from './admin-iam.service';

describe('IamService', () => {
  let service: AdminIamService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminIamService],
    }).compile();

    service = module.get<AdminIamService>(AdminIamService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
