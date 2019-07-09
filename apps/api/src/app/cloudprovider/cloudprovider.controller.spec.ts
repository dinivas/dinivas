import { Test, TestingModule } from '@nestjs/testing';
import { CloudproviderController } from './cloudprovider.controller';

describe('Cloudprovider Controller', () => {
  let controller: CloudproviderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CloudproviderController],
    }).compile();

    controller = module.get<CloudproviderController>(CloudproviderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
