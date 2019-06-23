import { Test, TestingModule } from '@nestjs/testing';
import { InfoController } from './info.controller';

describe('Info Controller', () => {
  let controller: InfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InfoController],
    }).compile();

    controller = module.get<InfoController>(InfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
