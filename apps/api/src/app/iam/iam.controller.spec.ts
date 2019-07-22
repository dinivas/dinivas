import { Test, TestingModule } from '@nestjs/testing';
import { IamController } from './iam.controller';

describe('Iam Controller', () => {
  let controller: IamController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IamController],
    }).compile();

    controller = module.get<IamController>(IamController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
