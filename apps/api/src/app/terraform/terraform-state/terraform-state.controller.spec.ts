import { Test, TestingModule } from '@nestjs/testing';
import { TerraformStateController } from './terraform-state.controller';

describe('TerraformState Controller', () => {
  let controller: TerraformStateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TerraformStateController],
    }).compile();

    controller = module.get<TerraformStateController>(TerraformStateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
