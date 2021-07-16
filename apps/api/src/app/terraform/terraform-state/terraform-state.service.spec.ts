import { Test, TestingModule } from '@nestjs/testing';
import { TerraformStateService } from './terraform-state.service';

describe('TerraformStateService', () => {
  let service: TerraformStateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TerraformStateService],
    }).compile();

    service = module.get<TerraformStateService>(TerraformStateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
