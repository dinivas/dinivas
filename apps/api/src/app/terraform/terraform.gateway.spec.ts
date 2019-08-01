import { Test, TestingModule } from '@nestjs/testing';
import { TerraformGateway } from './terraform.gateway';

describe('TerraformGateway', () => {
  let gateway: TerraformGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TerraformGateway],
    }).compile();

    gateway = module.get<TerraformGateway>(TerraformGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
