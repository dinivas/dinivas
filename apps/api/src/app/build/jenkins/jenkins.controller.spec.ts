import { Test, TestingModule } from '@nestjs/testing';
import { JenkinsController } from './jenkins.controller';

describe('Jenkins Controller', () => {
  let controller: JenkinsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JenkinsController],
    }).compile();

    controller = module.get<JenkinsController>(JenkinsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
