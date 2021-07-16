import { Test, TestingModule } from '@nestjs/testing';
import { DroneciController } from './droneci.controller';

describe('Droneci Controller', () => {
  let controller: DroneciController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DroneciController],
    }).compile();

    controller = module.get<DroneciController>(DroneciController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
