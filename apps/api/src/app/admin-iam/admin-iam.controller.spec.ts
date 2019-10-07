import { Test, TestingModule } from '@nestjs/testing';
import { AdminIamController } from './admin-iam.controller';

describe('Iam Controller', () => {
  let controller: AdminIamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminIamController],
    }).compile();

    controller = module.get<AdminIamController>(AdminIamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
