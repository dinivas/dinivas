import { Test, TestingModule } from '@nestjs/testing';
import { ConsulController } from './consul.controller';

describe('Consul Controller', () => {
  let controller: ConsulController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsulController],
    }).compile();

    controller = module.get<ConsulController>(ConsulController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
