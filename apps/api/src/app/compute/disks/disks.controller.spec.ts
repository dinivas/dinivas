import { Test, TestingModule } from '@nestjs/testing';
import { DisksController } from './disks.controller';

describe('Disks Controller', () => {
  let controller: DisksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DisksController],
    }).compile();

    controller = module.get<DisksController>(DisksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
