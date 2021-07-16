import { Test, TestingModule } from '@nestjs/testing';
import { InstancesController } from './instances.controller';

describe('Instances Controller', () => {
  let controller: InstancesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstancesController],
    }).compile();

    controller = module.get<InstancesController>(InstancesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
