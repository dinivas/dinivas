import { Test, TestingModule } from '@nestjs/testing';
import { GitlabController } from './gitlab.controller';

describe('Gitlab Controller', () => {
  let controller: GitlabController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GitlabController],
    }).compile();

    controller = module.get<GitlabController>(GitlabController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
